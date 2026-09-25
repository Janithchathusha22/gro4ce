import {readFile, writeFile} from 'node:fs/promises';

const origin = 'https://gro4ce.vercel.app';
const prompts = {
  VITE_LANKA_ELECTRO_MART_WEBHOOK: 'What televisions are available under LKR 150000?',
  VITE_AI_ACADEMY_WEBHOOK: 'I am in Colombo and need an A/L Accounting tutor. What classes and fees are available?',
  VITE_CARLOOP_WEBHOOK: 'Find a fuel-efficient automatic car under LKR 8000000.',
  VITE_CEYLON_WEBHOOK: 'What is the price for 10 kg of Ceylon cinnamon?',
  VITE_LANKA_GLOW_WEBHOOK: 'What hair colouring services and prices are available in Colombo?',
  VITE_LANKA_LEGAL_WEBHOOK: 'I am in Colombo and need a lawyer for a property boundary dispute. Find suitable lawyers.',
  VITE_MERIDIAN_FINANCE_WEBHOOK: 'Calculate a flat-rate lease of LKR 1000000 at 15 percent annually for 24 months.',
  VITE_SENTINEL_INSURANCE_WEBHOOK: 'What does comprehensive motor insurance cover and exclude, and who handles claims?',
  VITE_TEEN_MASTER_OF_BUSINESS_WEBHOOK: 'What does the Teen Master of Business programme teach a 15-year-old student?',
  VITE_PERSONAL_BRANDING_WEBHOOK: 'How can Senela help with a leadership workshop for an organisation?',
};
const endpoints = (await readFile(new URL('../.env.example', import.meta.url), 'utf8'))
  .split(/\r?\n/).filter(line => line.startsWith('VITE_')).map(line => {
    const i = line.indexOf('=');
    return [line.slice(0,i),line.slice(i+1).trim()];
  });
const results = [];
// Limit simultaneous AI requests to avoid creating a rate-limit burst.
for (let i=0; i<endpoints.length; i+=3) {
  await Promise.all(endpoints.slice(i,i+3).map(async ([name,url]) => {
    const started = Date.now();
    const result = {name, url};
    try {
      const preflight = await fetch(url, {method: 'OPTIONS', headers: {
        Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type',
      }, signal: AbortSignal.timeout(30000)});
      const corsOrigin = preflight.headers.get('access-control-allow-origin');
      const methods = preflight.headers.get('access-control-allow-methods') || '';
      const headers = preflight.headers.get('access-control-allow-headers') || '';
      result.preflightStatus = preflight.status;
      result.preflightPassed = preflight.ok && [origin,'*'].includes(corsOrigin) && /POST|\*/i.test(methods) && /content-type|\*/i.test(headers);
      const sessionId = `gro4ce-check-${crypto.randomUUID()}`;
      const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', Origin: origin},
        body: JSON.stringify({channel: 'website', session_id: sessionId, message: prompts[name]}), signal: AbortSignal.timeout(120000)});
      result.status = response.status;
      const raw = await response.text();
      let data;
      try {data = JSON.parse(raw); if (Array.isArray(data)) data=data[0];} catch {throw new Error(`Non-JSON response: ${raw.slice(0,120)}`);}
      result.reply = typeof data === 'string' ? data : data?.reply ?? data?.output ?? data?.text ?? data?.message ?? data?.response ?? data?.answer;
      result.limited = data?.degraded === true || data?.service_status === 'limited';
      result.postCorsPassed = [origin,'*'].includes(response.headers.get('access-control-allow-origin'));
      result.passed = response.ok && data?.success !== false && typeof result.reply === 'string' && result.reply.trim().length>0 && result.preflightPassed && result.postCorsPassed;
      if (name === 'VITE_MERIDIAN_FINANCE_WEBHOOK') {
        result.calculatorPassed = /54,?166\.67/.test(result.reply || '');
        result.passed &&= result.calculatorPassed;
      }
    } catch (error) {result.error=error.message; result.passed=false;}
    result.seconds = Math.round((Date.now()-started)/10)/100;
    results.push(result);
    console.log(JSON.stringify(result));
  }));
}
await writeFile(new URL('../webhook-check-results.json', import.meta.url), JSON.stringify({checkedAt:new Date().toISOString(),origin,results},null,2)+'\n');
if (results.some(r=>!r.passed)) process.exitCode=1;
