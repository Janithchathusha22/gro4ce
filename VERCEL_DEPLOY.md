# Vercel deployment

1. Import the GitHub repository into Vercel.
2. Keep the detected framework as **Vite**.
3. Add these Production and Preview environment variables in Vercel:
   - `VITE_LANKA_ELECTRO_MART_WEBHOOK`
   - `VITE_AI_ACADEMY_WEBHOOK`
   - `VITE_CARLOOP_WEBHOOK`
   - `VITE_CEYLON_WEBHOOK`
   - `VITE_LANKA_GLOW_WEBHOOK`
   - `VITE_LANKA_LEGAL_WEBHOOK`
   - `VITE_MERIDIAN_FINANCE_WEBHOOK`
   - `VITE_SENTINEL_INSURANCE_WEBHOOK`
   - `VITE_TEEN_MASTER_OF_BUSINESS_WEBHOOK`
   - `VITE_PERSONAL_BRANDING_WEBHOOK`
4. Set each variable to its public **HTTPS** n8n production webhook URL. The current production URLs are listed in `.env.example` and are also used as application defaults.
5. Deploy.

After deployment, verify every chatbot from the browser. Each webhook must accept the
JSON fields `channel`, `session_id`, and `message`, return JSON containing a supported
reply field, and allow the deployed Vercel origin through CORS.

Run `node scripts/check-webhooks.mjs` for a live non-transactional check of all ten
agents. See `n8n/README.md` for the production workflow repairs and outage behavior.
