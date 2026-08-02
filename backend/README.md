# NutriDelight Smart CCTV Analytics - Backend

Module 2 provides the Node.js + Express backend for the project.

## Tech Stack

- Node.js
- Express
- CORS
- dotenv

## Folder Structure

- `server.js` - application entry point
- `app.js` - Express app configuration
- `config/` - environment configuration
- `controllers/` - request handlers
- `routes/` - API route definitions
- `middleware/` - 404 and error handling

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Review or update `.env`:

   ```bash
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=*
   AI_STREAM_URL=http://127.0.0.1:5001/video-feed
   OWNER_EMAIL=owner@nutridelight.com
   ```

   Notes:

- `CORS_ORIGIN` supports `*` or comma-separated origins for production (example: `https://shop.example.com,https://owner.example.com`).
- `OWNER_EMAIL` restricts owner portal access to a single Supabase-authenticated account.
- `AI_STREAM_URL` is the internal AI engine MJPEG URL proxied by backend owner endpoint.

3. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### Health Check

- `GET /api/health`

Response:

```json
{
  "status": "Backend Running"
}
```

### Detection Ingest

- `POST /api/detections`

Example payload:

```json
{
  "people": 5,
  "cars": 2,
  "motorcycles": 3,
  "buses": 0,
  "trucks": 1,
  "camera": "Shop Camera",
  "timestamp": "2026-07-01T18:30:00"
}
```

The backend currently logs the payload to the console and returns a confirmation response. No database connection is configured yet.

### Owner Remote Stream

- `GET /api/owner/live-stream`

Authentication:

- Requires Supabase access token in `Authorization: Bearer <token>` or `access_token` query parameter.
- If `OWNER_EMAIL` is set, only that authenticated account can access this stream.
