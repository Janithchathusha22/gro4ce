# Production workflow repairs — 2026-09-25

## Lanka Electro Mart website prompt — 2026-10-03

`lanka-electro-mart-system-prompt.txt` contains the supplied v1.0 Lanka Electro Mart
system prompt plus the Gro4ce website-channel addendum. This repository does not
contain a Lanka Electro Mart n8n workflow export, and no authenticated n8n editor
access was available for this change. Paste the full file into the correct Lanka
Electro Mart AI Agent system-prompt field, save it, activate the workflow, and run
the acceptance checks before treating it as deployed.

The website now sends these fields only to the selected service webhook:
`channel`, `session_id`, `message`, `visitor_name`, `visitor_email`, and
`update_consent`. Map them explicitly in n8n and keep memory, lead storage, and
tools scoped to the Lanka Electro Mart business identity. The public webhook must
not accept a client-provided business ID as authority to select another business.

Production stock and restock claims still require verified connections:

- Current approved product records for SKU, details, and prices.
- A branch-level `check_availability` tool; catalogue branch names and aggregate
  quantities are not sufficient.
- A real `upsert_lead` (or mapped equivalent) storing SKU, preferred branch/town,
  email, consent, and consent evidence.
- An active stock-change trigger and email-sending workflow before promising or
  confirming stock-update email delivery.
- A real `handoff_to_human` tool before offering to ask the team, with success
  checked before claiming the request was passed on.

Keep OpenAI and email-provider credentials in n8n Credentials or protected
server-side environment variables. Never expose them through React, `VITE_`
variables, GitHub, webhook responses, or browser storage.

The live n8n workflows were updated through the authenticated editor API. Existing
workflow IDs and public webhook URLs were preserved; no secrets were added to this
repository. Encrypted pre-change snapshots are retained in the operator's Windows
temporary directory (`gro4ce-*-before*.xml`).

- **Legal** (`TBzXRt8LwLY33i8z`): replaced client/conversation queries targeting the
  wrong shared Postgres database with requests to its existing Legal Supabase
  project. A lookup preserves existing client fields when omitted on later turns.
  Isolated its chat-memory table and removed conflicting prompt instructions.
  `legal-system-prompt.js` contains the new prompt-builder node body.
- **Academy** (`UEByE4JhMv4G1Tx6`): applied equivalent student/conversation database
  routing and isolated chat memory. A database availability check provides clearly
  marked limited general support during an outage, without inventing tutor data or
  confirming enrollment/payment. The Supabase project was initially unresolvable;
  it recovered during testing. Live tutor matching then passed, with the matching
  tool confirmed in execution logs.
- **Finance** (`YUgvHESocf6TzAF9`): fixed the calculator's inability to parse JSON
  tool arguments. `loan-calculator.js` is the new tool body. It validates inputs,
  supports flat/reducing-balance estimates and returns exact numeric amounts.
  The agent must use those results rather than guessing when parsing fails.
- **CarLoop, Ceylon and Legal**: use `gpt-4.1-mini` with temperature 0.2; added
  instructions to respect budget, supplied quantity and actual branch locations.
- **Insurance**: the active corrected workflow (`Zon6jOBaSc9iTdYT`) already handled
  the website payload successfully. Its policy and claims lookups passed.

Run `node scripts/check-webhooks.mjs` to send one non-transactional inquiry to each
agent and check POST responses, JSON replies, browser CORS and OPTIONS preflights.
This uses live model calls and writes `webhook-check-results.json`. A successful
HTTP check does not establish exhaustive business correctness. Check `limited`
as well as `passed`; `limited: true` means the Academy database is unavailable.

Tests do not create purchases, appointments or enrollments. Diagnostic chat turns
may remain in the services' conversation histories.
