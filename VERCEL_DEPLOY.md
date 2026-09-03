# Vercel deployment

1. Import the GitHub repository into Vercel.
2. Keep the detected framework as **Vite**.
3. Add these Production and Preview environment variables in Vercel:
   - `VITE_CARLOOP_WEBHOOK`
   - `VITE_CEYLON_WEBHOOK`
   - `VITE_PERSONAL_BRANDING_WEBHOOK`
4. Set each variable to its public **HTTPS** n8n production webhook URL.
5. Deploy.

The local `http://localhost:5678` webhooks are used automatically only while running
the Vite development server. A Vercel deployment cannot reach an n8n instance that
is available only on your computer's localhost.
