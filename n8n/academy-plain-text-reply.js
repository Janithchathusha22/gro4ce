// n8n Code node, Run Once for All Items. Place after the Academy Agent.
// Only remove display markup. Do not rewrite claims, fees, places or names.
const item = $input.first();
const data = item.json;
const raw = data.output ?? data.reply;
if (typeof raw !== 'string' || !raw.trim()) {
  throw new Error('Academy agent did not return a text response');
}

const reply = raw
  .replace(/```[^\r\n]*\r?\n?/g, '')
  .replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, '\n')
  .replace(/<\/?[a-z][^>]*>/gi, '')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)')
  .replace(/[*`]/g, '')
  .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
  .replace(/^[ \t]*[-\u2022\u25cf\u25aa][ \t]+/gm, '')
  .replace(/[ \t]+$/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

return [{ ...item, json: { ...data, output: reply, reply } }];
