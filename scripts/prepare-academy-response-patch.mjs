import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import vm from 'node:vm';

const [promptBuilderPath] = process.argv.slice(2);
if (!promptBuilderPath) throw new Error('Pass the updated Build System Prompt code file');

const root = new URL('../', import.meta.url);
const workflow = JSON.parse(await readFile(new URL('n8n/AL-Academy-Chat-Agent-fixed.json', root), 'utf8'));
const promptBuilder = (await readFile(promptBuilderPath, 'utf8')).replace(/^\uFEFF/, '').trim();
const formatter = await readFile(new URL('n8n/academy-plain-text-reply.js', root), 'utf8');
const revision = 'academy-adviser-2026-10-07-v2';
const sourceMessage = "I'm looking For gampaha English clasS";

const evaluate = (code, globals) => new vm.Script(`(function () {\n${code}\n})()`)
  .runInNewContext(globals, { timeout: 1000 });

const code = [
  'const items = (() => {',
  promptBuilder,
  '})();',
  `for (const item of items) item.json.academy_prompt_revision = ${JSON.stringify(revision)};`,
  'return items;',
].join('\n');

const result = evaluate(code, {
  $: (name) => {
    const data = {
      'Find or Create Student': { id: 'mock-student', name: 'Stored Name' },
      'Detect Language': { message_text: sourceMessage, name: 'Current Name', channel: 'website' },
    }[name];
    if (!data) throw new Error(`Unexpected node access: ${name}`);
    return { first: () => ({ json: data }) };
  },
});
assert.equal(result.length, 1);
assert.equal(result[0].json.message_text, sourceMessage);
assert.equal(result[0].json.academy_prompt_revision, revision);
assert.ok(result[0].json.systemPrompt.includes('DIGITAL CLASS AND ADMISSIONS ADVISER'));
assert.ok(result[0].json.systemPrompt.includes('Never output asterisks'));
assert.ok(result[0].json.systemPrompt.includes('Current Name'));
assert.ok(!result[0].json.systemPrompt.includes('Present maximum 3 options'));

const samples = [
  ['1. **Mr. Janaka Gunawardena**\n   - Fee: LKR 5,350\n   - Time: 6:00 PM - 8:00 PM\n   - Tutor code: ALT-001',
    '1. Mr. Janaka Gunawardena\nFee: LKR 5,350\nTime: 6:00 PM - 8:00 PM\nTutor code: ALT-001'],
  ['<p>Demo fee: <b>LKR 2,200</b>.</p><br />ඔබට පහසුද?', 'Demo fee: LKR 2,200.\n\nඔබට පහසුද?'],
  ['## Class details\n• **English Literature**\n[Details](https://example.test/classes)',
    'Class details\nEnglish Literature\nDetails (https://example.test/classes)'],
];
for (const [input, expected] of samples) {
  const formatted = evaluate(formatter, { $input: { first: () => ({ json: { output: input, untouched: 42 } }) } });
  assert.equal(formatted[0].json.reply, expected);
  assert.equal(formatted[0].json.output, expected);
  assert.equal(formatted[0].json.untouched, 42);
}
assert.throws(() => evaluate(formatter, { $input: { first: () => ({ json: { output: {} } }) } }));

const find = (name) => {
  const node = workflow.nodes.find((item) => item.name === name);
  if (!node) throw new Error(`Missing node: ${name}`);
  return node;
};

find('Build System Prompt').parameters.jsCode = code;
find('Academy Support Agent').parameters.text = '={{ $json.message_text }}';
find('Academy Support Agent').parameters.options.systemMessage = '={{ $json.systemPrompt }}';

const insert = (agentName, formatterName) => {
  const agent = find(agentName);
  const downstream = workflow.connections[agentName]?.main;
  assert.ok(downstream?.[0]?.length, `Missing output connection: ${agentName}`);
  workflow.nodes.push({
    id: randomUUID(), name: formatterName, type: 'n8n-nodes-base.code', typeVersion: 2,
    parameters: { jsCode: formatter }, position: [agent.position[0] + 200, agent.position[1] + 160],
  });
  workflow.connections[agentName].main = [[{ node: formatterName, type: 'main', index: 0 }]];
  workflow.connections[formatterName] = { main: downstream };
};

insert('Academy Support Agent', 'Prepare Academy Reply');
insert('Academy General Support', 'Prepare Academy Limited Reply');
find('Respond AI Reply').parameters.responseBody =
  '={{ { success: true, reply: $("Prepare Academy Reply").first().json.reply } }}';
// Save AI Response and the limited-support response already read $json.output.
assert.ok(find('Save AI Response').parameters.jsonBody.includes('message: $json.output'));
assert.ok(find('Respond Academy Limited Support').parameters.responseBody.includes('reply: $json.output'));
assert.equal(workflow.connections['Prepare Academy Reply'].main[0][0].node, 'Save AI Response');
assert.equal(workflow.connections['Prepare Academy Limited Reply'].main[0][0].node, 'Respond Academy Limited Support');

const names = new Set(workflow.nodes.map((node) => node.name));
assert.equal(names.size, workflow.nodes.length);
for (const [source, outputs] of Object.entries(workflow.connections)) {
  assert.ok(names.has(source), `Unknown source: ${source}`);
  for (const groups of Object.values(outputs)) for (const group of groups) {
    for (const edge of group) assert.ok(names.has(edge.node), `Unknown target: ${edge.node}`);
  }
}

const serialized = `${JSON.stringify(workflow, null, 2)}\n`;
assert.ok(!/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(serialized));
assert.ok(!/"credentials"\s*:/.test(serialized));
assert.ok(!/\bBearer\s+(?!REPLACE_WITH_)[^\s"'\\]+/i.test(serialized));
const output = new URL('n8n/AL-Academy-Chat-Agent-output-fix.json', root);
await writeFile(output, serialized, 'utf8');
console.log(JSON.stringify({ output: output.pathname, revision, nodeCount: workflow.nodes.length,
  promptBuilderValidated: true, formatSamplesPassed: samples.length,
  mainAndFallbackResponsesUseFormattedOutput: true, credentials: 'placeholders only' }));
