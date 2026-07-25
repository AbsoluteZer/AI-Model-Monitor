# AI Model Monitor 🤖⚡

A real-time AI model monitoring and benchmarking platform tracking frontier models (including Claude Opus 5, Claude Fable 5, Gemini 2.5 Pro, GPT-4.5, DeepSeek R1, Grok 3, and Llama 3.3).

---

## 🌟 Overview

AI Model Monitor tracks, synthesizes, and visualizes benchmark performance, pricing, latency, context windows, and release history across leading AI models and research labs.

### Key Capabilities
- **Live Model Leaderboard**: Rank models by overall intelligence, coding (SWE-bench, HumanEval), math (MATH-500), reasoning (MMLU-Pro, GPQA), speed, and cost efficiency.
- **Custom Weighting Engine**: Interactively adjust scoring weights to compute personalized ranks tailored to your engineering requirements.
- **Interactive Model Comparison**: Compare up to 4 models side-by-side across radar charts and detailed technical metrics.
- **Automated Gemini 3.6 Flash Crawler**: Continuous scheduled background crawler powered by Google's `@google/genai` SDK that queries current frontier model announcements and benchmark leaderboards.
- **Resilient Multi-Tiered Storage**: Netlify Blobs persistent store backed by local memory caches and client-side `localStorage` caching.

---

## 🏗 Architecture & Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons.
- **Serverless & Netlify Functions**:
  - `get-data`: Endpoint (`GET /api/data`) serving current model snapshot.
  - `trigger-crawler`: Endpoint (`POST /api/trigger`) for manual admin refreshes.
  - `scheduled-crawler`: Netlify Scheduled Function (`cron: "0 */3 * * *"`) for automated 3-hour intelligence updates.
  - `save-weights`: Endpoint (`POST /api/weights`) for storing custom scoring weight preferences.
- **AI Integration**: `@google/genai` (`gemini-3.6-flash`) server-side synthesis.
- **Persistence Layer**: Netlify Blobs (`@netlify/blobs`) with automatic memory and `initialData.ts` fallback.

---

## 🔑 Environment Variables

The application requires `GEMINI_API_KEY` configured on the server/Netlify environment:

```env
# .env.example
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: `GEMINI_API_KEY` is kept strictly server-side inside Netlify Functions / Express backend routes to prevent client bundle exposure.

---

## 🚀 Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The local application will start on `http://localhost:3000`.

3. **Linting & Compilation**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🛠 Deployment Configuration

The app is pre-configured for static publishing and serverless deployment via `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/data"
  to = "/.netlify/functions/get-data"
  status = 200

[[redirects]]
  from = "/api/trigger"
  to = "/.netlify/functions/trigger-crawler"
  status = 200

[[redirects]]
  from = "/api/weights"
  to = "/.netlify/functions/save-weights"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
