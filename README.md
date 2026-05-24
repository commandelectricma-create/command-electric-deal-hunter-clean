# Command Electric Deal Hunter

Private deep-deal dashboard for Command Electric.

## What is included
- Next.js app ready for Vercel
- Mobile dashboard for iPhone
- Deep-deal rules by category
- BUY NOW Score 1–100
- API route: `/api/deals`
- Email alert route: `/api/alert`
- Vercel Cron route: `/api/cron/check-deals`
- Fallback sample deals so the app works immediately
- Environment variable template for live data/API keys

## Deploy on Vercel
1. Create or open your Vercel account.
2. Upload/import this project.
3. Add Environment Variables from `.env.example`.
4. Deploy.
5. Open the Vercel URL on iPhone Safari.
6. Tap Share > Add to Home Screen.

## Environment variables
Required for email alerts:
- `ALERT_EMAIL=commandelectricma@gmail.com`
- `RESEND_API_KEY=`
- `RESEND_FROM=`

Optional live data providers:
- `SERPAPI_KEY=` for Home Depot data provider support
- `UNWRANGLE_API_KEY=` for Home Depot/Lowe's provider support
- `BIGBOX_API_KEY=` for big-box retail provider support
- `AMAZON_ACCESS_KEY=`, `AMAZON_SECRET_KEY=`, `AMAZON_PARTNER_TAG=` for Amazon integration if eligible

## Important
The app runs immediately with sample deals. Live prices require active API/provider keys. The connector files are already prepared in `lib/fetchers.ts`; once keys/provider endpoints are active, map provider JSON into the `Deal[]` format.

## Deal thresholds
- Tools: 35%+ off
- Batteries: 35%+ off
- Breakers: 25%+ off
- GFCI/AFCI: 25%+ off
- Wire/Cable: 20%+ off
- Connectors: 20%+ off
- Bath Fans: 30%+ off
- Ceiling Fans: 30%+ off
- Lighting: 30%+ off
- Supplies: 25%+ off
