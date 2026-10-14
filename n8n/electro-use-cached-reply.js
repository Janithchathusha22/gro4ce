// Parse Chat State has already removed the private memory envelope.
const s = $input.first().json;
const inProgress = s.in_progress === true && !s.previous_response;
const singlish = /\b(mage|mata|ekak|one|denna|kiyada|gannam)\b/i.test(s.message ?? '');
const reply = s.previous_response || (inProgress
  ? (singlish ? 'Oyage kalin illima thawama process wenawa. Poddak indala balanna.'
    : 'Your earlier request is still processing. Please check again shortly.')
  : (singlish ? 'Kalin pilithura laba ganna bari una. Nawatha message ekak ewanna.'
    : 'The earlier reply could not be retrieved. Please send a new message.'));
return [{ json: {
  success: !inProgress && Boolean(s.previous_response) && s.previous_response_success !== false,
  trigger_type: s.trigger_type,
  session_id: s.session_id,
  request_id: s.request_id,
  intent: inProgress ? 'request_in_progress' : s.previous_response ? 'duplicate' : 'response_error',
  duplicate: true,
  in_progress: inProgress,
  reply,
  output: reply,
} }];
