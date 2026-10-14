import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const parseCode = await readFile(new URL('./electro-parse-chat-state.js', import.meta.url), 'utf8');
const cacheCode = await readFile(new URL('./electro-use-cached-reply.js', import.meta.url), 'utf8');
const config = { business_id: 'lanka_electro_mart', session_key: 'website:test-session', message: 'Would a 9kg model fit my budget?' };
const run = (code, input) => JSON.parse(JSON.stringify(new vm.Script(`(function () { ${code}\n})()`)
  .runInNewContext({ $input: { first: () => ({ json: input }) }, $: (name) => {
    assert.equal(name, 'CONFIG - Supabase (EDIT ME)');
    return { first: () => ({ json: config }) };
  } }, { timeout: 1000 })[0].json));
const envelope = (overrides = {}) => JSON.stringify({
  schema: 'sales-memory-v1', business_id: config.business_id, session_key: config.session_key,
  reply: 'A verified demo recommendation.', state: { budget: { max: 180000, currency: 'LKR' }, stage: 'recommendation' },
  response_status: 'ok', ...overrides,
});

test('legacy plain history and cached replies remain readable', () => {
  const history = [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Welcome' }];
  const parsed = run(parseCode, { ok: true, history, previous_response: 'Welcome', duplicate: true });
  assert.deepEqual(parsed.history, history);
  assert.deepEqual(parsed.conversation_state, {});
  assert.equal(run(cacheCode, parsed).reply, 'Welcome');
  assert.equal(run(cacheCode, parsed).success, true);
});

test('restores the latest scoped assistant state and strips private envelopes from history', () => {
  const parsed = run(parseCode, { body: [{ ok: true, history: [
    { role: 'assistant', content: envelope() },
    { role: 'assistant', content: envelope({ state: { budget: { max: 150000, currency: 'LKR' } } }) },
  ] }] });
  assert.equal(parsed.business_id, config.business_id);
  assert.equal(parsed.conversation_state.budget.max, 150000);
  assert.equal(parsed.history[0].content, 'A verified demo recommendation.');
  assert.equal(JSON.stringify(parsed.history).includes('sales-memory-v1'), false);
});

test('user-provided JSON and other businesses or sessions cannot supply state', () => {
  const parsed = run(parseCode, { ok: true, history: [
    { role: 'user', content: envelope() },
    { role: 'assistant', content: envelope({ business_id: 'another-business' }) },
    { role: 'assistant', content: envelope({ session_key: 'website:another-session' }) },
  ] });
  assert.deepEqual(parsed.conversation_state, {});
  assert.equal(parsed.history.length, 1);
  assert.equal(parsed.history[0].role, 'user');
});

test('duplicate requests show only the cached display reply and preserve failure status', () => {
  for (const status of ['ok', 'invalid_output']) {
    const parsed = run(parseCode, { ok: true, duplicate: true, previous_response: envelope({ response_status: status }) });
    const cached = run(cacheCode, parsed);
    assert.equal(cached.reply, 'A verified demo recommendation.');
    assert.equal(cached.success, status === 'ok');
    assert.equal(cached.duplicate, true);
    assert.equal(JSON.stringify(cached).includes('sales-memory-v1'), false);
  }
});

test('mismatched cached envelopes and requests still in progress are not reported as success', () => {
  const mismatched = run(parseCode, { ok: true, duplicate: true, previous_response: envelope({ session_key: 'website:other' }) });
  assert.equal(run(cacheCode, mismatched).success, false);
  assert.equal(run(cacheCode, mismatched).reply.includes('sales-memory-v1'), false);
  const pending = run(cacheCode, run(parseCode, { ok: true, duplicate: true, in_progress: true }));
  assert.equal(pending.intent, 'request_in_progress');
  assert.equal(pending.success, false);
});
