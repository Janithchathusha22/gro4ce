# Production workflow repairs — 2026-09-25

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
