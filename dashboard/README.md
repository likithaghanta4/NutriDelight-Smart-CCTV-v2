# NutriDelight Smart CCTV Analytics - Dashboard

This frontend provides two access modes:

- Shop Dashboard (existing, no authentication)
- Owner Portal (new, Supabase-authenticated)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_AI_STREAM_BASE_URL=http://127.0.0.1:5001
VITE_OWNER_EMAIL=owner@nutridelight.com
VITE_SUPABASE_URL=https://coirvhmbifzpliypiblw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Notes:

- Shop dashboard live stream uses `VITE_AI_STREAM_BASE_URL/video-feed`.
- Owner portal stream uses secure backend proxy endpoint at `/api/owner/live-stream`.
- Keep `VITE_OWNER_EMAIL` aligned with backend `OWNER_EMAIL`.

3. Start development server:

```bash
npm run dev
```

## Routes

- `/` Shop Dashboard (public/local)
- `/visitor-analytics`
- `/vehicle-analytics`
- `/settings`
- `/owner/login` Owner authentication
- `/owner` Owner remote dashboard (protected)
