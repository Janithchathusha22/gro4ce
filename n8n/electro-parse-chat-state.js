// n8n Code node. Restore only server-scoped assistant memory, never user JSON.
const n = $('CONFIG - Supabase (EDIT ME)').first().json;
let raw = $input.first().json ?? {};
for (let i = 0; i < 4; i++) {
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw); continue; } catch { break; }
  }
  if (Array.isArray(raw)) { raw = raw[0] ?? {}; continue; }
  if (raw?.body !== undefined) { raw = raw.body; continue; }
  break;
}
if (!raw || typeof raw !== 'object') raw = {};

const stateFields = [
  'budget', 'preferences', 'hard_constraints', 'rejected_options',
  'selected_products', 'recommended_products', 'branch', 'stage',
  'pending_question', 'category', 'use_case', 'quantity', 'quote_number', 'language',
];
function readMemory(content) {
  let value = content;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || value.schema !== 'sales-memory-v1') return null;
  if (value.business_id !== n.business_id || value.session_key !== n.session_key
      || typeof value.reply !== 'string') return { invalid: true };
  const state = {};
  if (value.state && typeof value.state === 'object' && !Array.isArray(value.state)) {
    for (const key of stateFields) {
      if (Object.prototype.hasOwnProperty.call(value.state, key)) state[key] = value.state[key];
    }
  }
  return { reply: value.reply, state, success: ['ok', 'partial_validation'].includes(value.response_status) };
}

let conversation_state = {};
const history = [];
for (const item of Array.isArray(raw.history) ? raw.history : []) {
  if (!item || typeof item !== 'object') continue;
  const memory = item.role === 'assistant' ? readMemory(item.content) : null;
  if (memory?.invalid) continue;
  if (memory) {
    conversation_state = memory.state;
    history.push({ ...item, content: memory.reply });
  } else {
    history.push(item);
  }
}

const cached = readMemory(raw.previous_response);
const previous_response = cached?.invalid ? null
  : cached ? cached.reply : typeof raw.previous_response === 'string' ? raw.previous_response : null;
const ok = raw.ok === true;
const err = raw.message || raw.error?.message
  || (typeof raw.error === 'string' ? raw.error : null)
  || raw.details || raw.hint || (ok ? null : 'Supabase prepare-chat request failed');

return [{ json: {
  ...n,
  backend_prepare_ok: ok,
  backend_prepare_error: err,
  backend_http_code: raw.statusCode ?? raw.status ?? null,
  backend_error_code: raw.code ?? null,
  duplicate: ok && raw.duplicate === true,
  in_progress: ok && raw.in_progress === true,
  previous_response,
  previous_response_success: cached ? !cached.invalid && cached.success : null,
  customer_id: raw.customer_id ?? null,
  history,
  conversation_state,
  name: raw.customer?.name ?? n.name,
  phone: raw.customer?.phone ?? n.phone,
  email: raw.customer?.email ?? n.email,
  city: raw.customer?.city ?? n.city,
} }];
