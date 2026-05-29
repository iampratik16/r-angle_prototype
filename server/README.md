# R Angle — Call Analysis API

Uploads a call recording to **Google Cloud Storage**, analyses it with **Vertex AI Gemini**, and returns a structured report (transcript, sentiment, emotion, pauses, tone shifts, intent, mood, scores, insights, recommendations, coaching script).

## Run

```bash
cd server
npm install
cp .env.example .env     # then fill in the values (see below)
# place your service-account key file as server/credentials.json
npm run dev              # http://localhost:8787
```

`GET /api/health` shows whether credentials are wired up.

## Endpoints
| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | config status |
| POST | `/api/analyze` | multipart upload (`audio`, plus `salesperson`, `customer`, `product`, `notes`) → full analysis |
| GET | `/api/analyses` | list past analyses |
| GET | `/api/analyses/:id` | one full analysis |

## Google Cloud setup (one-time)

> Uses your ₹1 L GCP credit (Vertex AI + Cloud Storage).

1. **Create / pick a project** at console.cloud.google.com and **link your billing credit** to it. Note the **Project ID**.
2. **Enable APIs** (APIs & Services → Enable): `Vertex AI API`, `Cloud Storage`.
3. **Create a bucket** (Cloud Storage → Buckets → Create), e.g. `rangle-call-recordings`, region `us-central1`. Put its name in `GCS_BUCKET`.
4. **Create a service account** (IAM & Admin → Service Accounts → Create):
   - Grant roles: **Vertex AI User** (`roles/aiplatform.user`) and **Storage Object Admin** (`roles/storage.objectAdmin`).
   - Create a **JSON key** → download it → save as `server/credentials.json`.
5. **Fill `server/.env`:**
   ```
   GCP_PROJECT_ID=<your project id>
   GCP_LOCATION=us-central1
   GCS_BUCKET=rangle-call-recordings
   GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
   GEMINI_MODEL=gemini-2.5-flash
   ```
6. `npm run dev`, then open the dashboard → **Call Analysis** and upload a recording.

The service-account key and `.env` are git-ignored — they are never committed.

> Note: Vertex AI authenticates with a **service-account JSON key**, not a plain "API key". The steps above produce that key.
