# Academy production investigation — 2026-10-07

The current GitHub code, production Vercel deployment, deployed browser bundle,
and a fresh direct request to the deployed Academy endpoint were inspected.

## Verified findings

| Layer | Observed evidence | Result |
| --- | --- | --- |
| GitHub main | `943b6939057e66ff4dd60c58215f4faecc6a80ef` | The latest patch files are committed. |
| Vercel production | `dpl_AftwWsKQ55BstiWCvBTwmMQF9L7G`, project `agent-demo` | Ready; build log identifies branch `main`, commit `943b693`. |
| Public alias | `https://agent-demo22.vercel.app/` | HTTP 200; alias points to that production deployment. |
| Browser bundle | `/assets/index-D_O8hVdk.js` | Actual Academy endpoint is `https://vmi3604779.contaboserver.net/webhook/academy/chat`. |
| Reply display | `src/Gro4ceHero.jsx` reads `reply` and renders `message.text` in a paragraph | The frontend displays the received text literally. It does not create the tutor introduction. |
| Fresh webhook probe | Unique session; the website's actual `createWebhookRequest` helper; Kurunegala Maths enquiry | HTTP 200; response itself contains `I have found...`, `top 3`, and `**` around tutor names. |
| Committed workflow patch | `Prepare Academy Reply` removes all asterisks; Respond references its `reply` | Executing the formatter locally confirms asterisks are removed. It does not rewrite business claims or adviser wording. |
| Hosted workflow administration | Unauthenticated GET of `/rest/workflows/UEByE4JhMv4G1Tx6` | HTTP 401; the hosted nodes, execution input and published configuration could not be inspected. |

The deployment was created at 15:40:26 Asia/Colombo. The fresh investigation
started at 15:49:52 Asia/Colombo. The complete public probe result and session
identifier are in `../academy-investigation-results.json`.

## Located fault and remaining uncertainty

The production webhook's reply is not passing through the formatter and response
mapping in the committed workflow patch. A response using that formatter's
`reply` cannot retain asterisks. This identifies the fault at the hosted n8n
response route, independently of whether the language model follows the prompt.

This does not prove which hosted node is wrong. An older active/published version,
a different workflow using the webhook path, or a response that bypasses the
formatter can explain the observations. The current runtime model and resolved
System Message are unknown; they must not be inferred from the reply alone.

Commits `b01fd68` and `943b693` add workflow JSON, documentation and helper scripts.
They do not change the website source. `package.json` builds the website with
`vite build`; no `.github` deployment workflow or application step publishes the
JSON to the n8n server. Both Vercel commit statuses are successful. Pushing these
files therefore redeploys the website without applying their contents to the
independent n8n service.

## Next concrete check

Open the production n8n execution whose Normalize Input contains this identifier:

`academy-investigation-6c7b4e01-a373-40d3-8816-694b91f03447`

Inspect that execution's workflow ID/version, Build System Prompt output,
resolved Academy Support Agent System Message, and final response route.
`Prepare Academy Reply` must run, and Respond AI Reply must read that node's
`reply` rather than Academy Support Agent's original `output`. The committed
builder supplies `academy_prompt_revision: academy-adviser-2026-10-07-v2`.

If the new builder is present but the tone is wrong, inspect the actual prompt
and tool inputs in that execution rather than adding further prompt text. If the
formatter is absent or bypassed, apply the existing patch to the live workflow's
response route and publish using that instance's production controls.

GitHub connector access gives repository access, not authenticated n8n editor
access. No live n8n configuration or website source was changed during this
investigation. Raw public replies were recorded; credential material and private
backend error bodies were not read or stored.
