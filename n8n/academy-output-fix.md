# Academy reply formatting patch

The supplied updated prompt-builder code was executed locally with mock student
and language nodes. It preserves the customer's message, uses the current profile
name, and generates the new adviser prompt. This verifies the supplied code; it
does not verify which prompt the hosted production agent actually received.

A fresh live session on 2026-10-07 still returned `I have found...`, three tutor
records, and Markdown asterisks for the Gampaha English enquiry. It described
physical classes as available in Gampaha while listing other branch towns. The
next online class enquiry returned HTTP 500. Its underlying server error was not
available, so no cause is assigned to that failure here.

## Apply to the existing workflow

This route avoids replacing or reconnecting existing business credentials.

1. Put the updated JavaScript in the **Build System Prompt Code node**. Do not
   paste JavaScript into the agent's System Message field.
2. Keep the agent's User Message expression as `{{ $json.message_text }}` and
   System Message expression as `{{ $json.systemPrompt }}`. In a production
   execution, inspect the actual resolved text, not just the expression.
3. Add a Code node named **Prepare Academy Reply**, set to **Run Once for All
   Items**, with the contents of `academy-plain-text-reply.js`.
4. Connect:
   `Academy Support Agent -> Prepare Academy Reply -> Save AI Response -> Respond AI Reply`.
5. Set **Respond AI Reply**'s JSON response expression to:

   ```js
   {{ { success: true, reply: $("Prepare Academy Reply").first().json.reply } }}
   ```

   Do not continue referencing `Academy Support Agent.output`, which bypasses the
   formatter. The existing Save AI Response body reads `$json.output`, so it now
   saves the formatted message from its input as well.
6. On the fallback path, add **Prepare Academy Limited Reply** with the same code
   before **Respond Academy Limited Support**. That response already uses
   `$json.output`.
7. Publish the edited workflow using the instance's production workflow controls
   and check a fresh production session. If the n8n version uses activation
   controls instead of publishing, use those controls for the edited workflow.

The formatter removes asterisks, backticks, headings, HTML and decorative bullet
prefixes. It preserves names, fees, tutor codes, timetable ranges and linked URLs.
It cannot validate tutor records, correct branch claims, make the agent obey its
adviser tone, or repair the HTTP 500 failure. LangChain's own chat memory can still
contain the agent's original text; the formatter cleans the webhook reply and
the separate Save AI Response record.

## Optional complete workflow copy

`AL-Academy-Chat-Agent-output-fix.json` combines the supplied updated prompt
builder with both formatting nodes and the corrected response mapping. It is
based on the previously sanitized export, not a new export from the hosted
workflow. It retains that copy's `gpt-4.1-mini` model setting and contains
credential placeholders. If importing this complete copy, configure the OpenAI,
Postgres and Supabase credentials before running it. Review any newer changes
in the hosted workflow before replacing its configuration.

Its prompt builder returns the diagnostic field
`academy_prompt_revision: academy-adviser-2026-10-07-v2`. This stays inside the
workflow and is not added to the webhook response. Seeing that field in a new
production execution confirms that this builder ran.

## Validation

The preparation script checks the executed prompt builder, exact user message,
current profile name, both response routes, connection targets and credential
placeholders. Formatting samples verify Sinhala text, tutor names, fees,
time ranges, tutor codes, HTML breaks and links. Non-text agent responses are
rejected instead of being converted into misleading text.

Generate and validate the copy with:

```powershell
node scripts/prepare-academy-response-patch.mjs <updated-prompt-builder-file>
```

No hosted n8n workflow or Vercel deployment was changed by this preparation.
