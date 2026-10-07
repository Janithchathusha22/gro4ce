import { readFile, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import vm from 'node:vm';
import { createWebhookRequest } from '../src/chatProfile.js';

const root = new URL('../', import.meta.url);
const siteUrl = 'https://agent-demo22.vercel.app/';
const expectedEndpoint = 'https://vmi3604779.contaboserver.net/webhook/academy/chat';
const workflowId = 'UEByE4JhMv4G1Tx6';
const report = { checkedAt: new Date().toISOString(), siteUrl };
const fetchText = async (url, timeout = 20000, options = {}) => {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
  return { status: response.status, body: await response.text() };
};

const initial = await Promise.allSettled([
  fetchText(siteUrl),
  fetchText(`https://vmi3604779.contaboserver.net/rest/workflows/${workflowId}`),
  readFile(new URL('n8n/AL-Academy-Chat-Agent-output-fix.json', root), 'utf8'),
]);
const [site, admin, workflowFile] = initial;
report.workflowAdminAccess = admin.status === 'fulfilled'
  ? { status: admin.value.status, authenticatedRequest: false }
  : { error: String(admin.reason) };

if (workflowFile.status === 'fulfilled') {
  const workflow = JSON.parse(workflowFile.value);
  const find = (name) => workflow.nodes.find((item) => item.name === name);
  const input = 'I found some Math tutors.\n1. **Mr. Example**\n- Fee: LKR 3,000';
  const output = new vm.Script(`(function () { ${find('Prepare Academy Reply').parameters.jsCode} })()`)
    .runInNewContext({ $input: { first: () => ({ json: { output: input } }) } }, { timeout: 1000 });
  report.repositoryWorkflow = {
    workflowId: workflow.id,
    formatterPresent: Boolean(find('Prepare Academy Reply')),
    formatterRemovesAsterisks: !output[0].json.reply.includes('*'),
    formatterDoesNotRewriteAdviserWording: output[0].json.reply.startsWith('I found'),
    responseExpression: find('Respond AI Reply').parameters.responseBody,
    mainAgentNext: workflow.connections['Academy Support Agent'].main[0][0].node,
    model: find('OpenAI Chat Model').parameters.model.value,
  };
}

if (site.status !== 'fulfilled') {
  report.siteError = String(site.reason);
} else {
  report.siteStatus = site.value.status;
  const scripts = [...site.value.body.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)]
    .map((match) => new URL(match[1], siteUrl));
  report.assets = [];
  for (const url of scripts) {
    const asset = await fetchText(url);
    const digest = createHash('sha256').update(asset.body).digest('hex');
    let localDigest = null;
    try {
      const local = await readFile(new URL(`dist${url.pathname}`, root));
      localDigest = createHash('sha256').update(local).digest('hex');
    } catch { /* An absent build file is recorded as null. */ }
    const academy = asset.body.match(/(?:["']?aiAcademy["']?)\s*:\s*["'](https?:[^"']+)["']/);
    report.assets.push({ url: url.href, status: asset.status, sha256: digest,
      localDistSha256: localDigest, identicalToLocalDist: localDigest === null ? null : localDigest === digest,
      academyEndpoint: academy?.[1] ?? null,
      containsOldReplyIntroduction: /I (?:have )?found some (?:Math|English|General English) tutors/i.test(asset.body),
      containsOutputFixNode: asset.body.includes('Prepare Academy Reply'),
    });
  }

  const endpoint = report.assets.find((asset) => asset.academyEndpoint)?.academyEndpoint;
  if (!endpoint) {
    report.probeSkipped = 'The deployed Academy endpoint could not be extracted; no guessed endpoint was called.';
  } else if (endpoint !== expectedEndpoint) {
    report.probeSkipped = 'The deployed endpoint differs from the expected Academy endpoint; investigate that mapping first.';
  } else {
    const sessionId = `academy-investigation-${randomUUID()}`;
    const message = "I'm looking for Kurunegala mathes class";
    const request = createWebhookRequest({ aiAcademy: endpoint }, 'aiAcademy', {
      message, sessionId, profile: { name: 'Test Student', email: 'academy-audit@example.invalid' }, updateConsent: false,
    });
    report.probe = { sessionId, message, requestContract: 'The current website createWebhookRequest helper', endpoint };
    try {
      const started = Date.now();
      const response = await fetchText(request.url, 65000, {
        ...request.options, headers: { ...request.options.headers, Origin: new URL(siteUrl).origin },
      });
      report.probe.status = response.status;
      report.probe.seconds = (Date.now() - started) / 1000;
      const parsed = JSON.parse(response.body);
      const data = Array.isArray(parsed) ? parsed[0] : parsed;
      // Record only the public customer reply, not complete backend or error payloads.
      const reply = typeof data === 'string' ? data : data?.reply ?? data?.output ?? data?.text;
      if (typeof reply === 'string') {
        report.probe.reply = reply;
        report.probe.hasAsterisks = reply.includes('*');
        report.probe.hasSearchIntroduction = /\bI (?:have )?found\b/i.test(reply);
        report.probe.hasThreeOptionCatalogue = /top\s+3|(?:^|\n)\s*3\./i.test(reply);
        report.probe.hasDemoDisclosure = /\bdemo\b|\bfictional\b|\bsynthetic\b/i.test(reply);
      }
    } catch (error) {
      report.probe.error = String(error);
    }
  }
}

await writeFile(new URL('academy-investigation-results.json', root), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
