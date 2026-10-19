import { writeFile } from 'node:fs/promises';
import { createWebhookRequest } from '../src/chatProfile.js';

// Non-transactional inquiries and a duplicate retry using the website's builder.
// These live calls can remain in the demo's conversation history.
const endpoint = 'https://vmi3604779.contaboserver.net/webhook/lanka-electro-mart/chat';
const origin = 'https://agent-demo22.vercel.app';
const report = { checkedAt: new Date().toISOString(), endpoint, origin, probes: [] };
const allowsOrigin = (response) => [origin, '*'].includes(response.headers.get('access-control-allow-origin'));

try {
  const response = await fetch(endpoint, {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
    signal: AbortSignal.timeout(20000),
  });
  report.preflight = {
    status: response.status,
    passed: response.ok && allowsOrigin(response)
      && /POST|\*/i.test(response.headers.get('access-control-allow-methods') || '')
      && /content-type|\*/i.test(response.headers.get('access-control-allow-headers') || ''),
  };
} catch (error) {
  report.preflight = { passed: false, error: error.message };
}

async function checkReply(name, message, { sessionId, requestId, expectedReply } = {}) {
  const probe = { name, message, sessionId: sessionId || `electro-diagnostic-${crypto.randomUUID()}` };
  const request = createWebhookRequest({ lankaElectroMart: endpoint }, 'lankaElectroMart', {
    message, sessionId: probe.sessionId, requestId,
    profile: { name: 'Connection test', email: 'electro-audit@example.invalid' },
    updateConsent: false,
  });
  probe.requestId = JSON.parse(request.options.body).request_id;
  const started = Date.now();
  try {
    const response = await fetch(request.url, {
      ...request.options,
      headers: { ...request.options.headers, Origin: origin },
      signal: AbortSignal.timeout(120000),
    });
    probe.status = response.status;
    probe.corsPassed = allowsOrigin(response);
    const payload = await response.json();
    const data = Array.isArray(payload) ? payload[0] : payload;
    // Keep public reply fields only; never persist full backend error payloads.
    probe.success = data?.success;
    probe.intent = data?.intent;
    probe.duplicate = data?.duplicate === true;
    const reply = typeof data === 'string' ? data
      : data?.reply ?? data?.output ?? data?.text ?? data?.message ?? data?.response ?? data?.answer;
    if (typeof reply === 'string') probe.reply = reply;
    probe.hasUnverifiedAmounts = /amount not verified/i.test(reply || '');
    probe.hasPrivateEnvelope = /sales-memory-v1|"session_key"\s*:/.test(reply || '');
    probe.passed = response.ok && probe.corsPassed && data?.success !== false
      && typeof reply === 'string' && reply.trim().length > 0
      && !probe.hasUnverifiedAmounts && !probe.hasPrivateEnvelope;
    if (expectedReply !== undefined) {
      probe.cachedReplyMatches = probe.duplicate && reply === expectedReply;
      probe.passed &&= probe.cachedReplyMatches;
    }
  } catch (error) {
    probe.error = error.message;
    probe.passed = false;
  }
  probe.elapsedMs = Date.now() - started;
  report.probes.push(probe);
  console.log(JSON.stringify(probe));
  return probe;
}

await checkReply('greeting', 'Hello. What can you help me with?');
const recommendation = await checkReply('washing-machine',
  'I need a washing machine for a family of five under LKR 180,000. What would you recommend, and why?');
if (recommendation.passed) {
  const message = 'Would a 9kg model fit the budget I gave you?';
  const followup = await checkReply('previous-budget-followup', message, { sessionId: recommendation.sessionId });
  if (followup.passed) {
    await checkReply('duplicate-followup', message, {
      sessionId: followup.sessionId, requestId: followup.requestId, expectedReply: followup.reply,
    });
  }
}

report.passed = report.preflight.passed && report.probes.every((probe) => probe.passed);
await writeFile(new URL('../n8n/electro-webhook-diagnostics.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
if (!report.passed) process.exitCode = 1;
