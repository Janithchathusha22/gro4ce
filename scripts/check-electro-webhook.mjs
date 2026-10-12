import { writeFile } from 'node:fs/promises';
import { createWebhookRequest } from '../src/chatProfile.js';

// Two non-transactional inquiries using the website's actual request builder.
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

for (const [name, message] of [
  ['greeting', 'Hello. What can you help me with?'],
  ['washing-machine', 'I need a washing machine for a family of five under LKR 180,000. What would you recommend, and why?'],
]) {
  const probe = { name, message, sessionId: `electro-diagnostic-${crypto.randomUUID()}` };
  const request = createWebhookRequest({ lankaElectroMart: endpoint }, 'lankaElectroMart', {
    message, sessionId: probe.sessionId,
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
    const reply = typeof data === 'string' ? data
      : data?.reply ?? data?.output ?? data?.text ?? data?.message ?? data?.response ?? data?.answer;
    if (typeof reply === 'string') probe.reply = reply;
    probe.passed = response.ok && probe.corsPassed && data?.success !== false
      && typeof reply === 'string' && reply.trim().length > 0;
  } catch (error) {
    probe.error = error.message;
    probe.passed = false;
  }
  probe.elapsedMs = Date.now() - started;
  report.probes.push(probe);
  console.log(JSON.stringify(probe));
}

report.passed = report.preflight.passed && report.probes.every((probe) => probe.passed);
await writeFile(new URL('../n8n/electro-webhook-diagnostics.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
if (!report.passed) process.exitCode = 1;
