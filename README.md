# NutriVision AI - Food Label Scanner

A full-stack AI-powered food label scanner application that analyzes product labels using computer vision and LLM technology, providing personalized health insights based on user dietary preferences.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**NutriVision AI** is a web application that helps users make informed dietary choices by:

- Scanning food product labels via camera or image upload
- Extracting nutritional information using OCR and vision LLM
- Detecting additives and analyzing health risks
- Providing personalized health scores based on user profiles
- Maintaining scan history with Supabase authentication

### User Profiles Supported

- General
- Diabetic
- Hypertension
- Vegan
- Keto

---

## 🛠 Tech Stack

### Backend

- **Framework**: FastAPI 0.110.0
- **Server**: Uvicorn 0.27.1
- **Database**: PostgreSQL (via Supabase)
- **ORM**: SQLAlchemy 2.0.28
- **LLM Integration**: Groq (Llama 4), LiteLLM, OpenAI
- **Vision Processing**: OpenCV
- **Authentication**: Supabase Auth

### Frontend

- **Framework**: Next.js 16.1.6
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, PostCSS
- **State Management**: React Context API
- **Database Client**: Supabase JS
- **Components**: Lucide React, Framer Motion, Recharts
- **Barcode**: ZXing Library

### Infrastructure

- **Auth & Database**: Supabase
- **Storage**: Supabase Storage (for food label images)
- **AI Models**: Groq (LLaMA 4), OpenAI GPT

---

## 📦 Prerequisites

### System Requirements

- **Node.js**: v18+ (for frontend)
- **Python**: 3.10+ (for backend)
- **Git**: For version control
- **npm**: v9+ or yarn (for frontend package management)
- **pip**: For Python package management

### Accounts & API Keys

- **Supabase Account**: [https://supabase.com](https://supabase.com)
  - Project URL
  - Anon Key
  - Database credentials
- **Groq API Key**: [https://console.groq.com](https://console.groq.com)
- **OpenAI API Key** (optional): [https://platform.openai.com](https://platform.openai.com)

---

## 📁 Project Structure

```
collage_project/
├── backend/                           # FastAPI server
│   ├── app/
│   │   ├── main.py                   # FastAPI application entry point
│   │   ├── agents/
│   │   │   └── analysis_agent.py     # Product analysis orchestrator
│   │   ├── core/
│   │   │   └── config.py             # Configuration & environment settings
│   │   ├── db/
│   │   │   ├── models.py             # Pydantic request/response models
│   │   │   ├── supabase_db.py        # Supabase client initialization
│   │   │   └── schemas.py            # Database schemas
│   │   └── services/
│   │       ├── vision_service.py     # Image preprocessing & OCR
│   │       ├── llm_parser_service.py # LLM-based JSON extraction
│   │       ├── fuzzy_match_service.py # Additive matching
│   │       └── personalization_service.py # Health scoring
│   ├── .env                          # Backend environment variables
│   ├── .python-version               # Python version specification
│   ├── requirements.txt              # Python dependencies
│   └── venv/                         # Virtual environment (generated)
│
├── frontend/                          # Next.js React app
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout with auth provider
│   │   │   ├── page.tsx              # Scanner page (main)
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Auth page (login/signup)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Result display & visualization
│   │   │   └── history/
│   │   │       └── page.tsx          # Scan history view
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx      # Auth context & Supabase setup
│   │   │   ├── UploadZone.tsx        # File upload UI
│   │   │   ├── DuckChatbot.tsx       # AI assistant component
│   │   │   ├── HealthGauge.tsx       # Health score visualization
│   │   │   ├── RadarChart.tsx        # Nutrition radar chart
│   │   │   └── AdditiveCard.tsx      # Additive display card
│   │   └── lib/
│   │       ├── api-config.ts         # API URL configuration
│   │       ├── barcodeReader.ts      # Barcode scanning logic
│   │       ├── openfoodfacts.ts      # OpenFoodFacts API integration
│   │       └── supabaseClient.ts     # Supabase client
│   ├── .env.local                    # Frontend environment variables
│   ├── package.json                  # Node dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── next.config.ts                # Next.js configuration
│   └── tailwind.config.mjs           # Tailwind CSS config
│
├── DEPLOY.md                         # Deployment instructions
└── README.md                         # This file
```

---

## 🚀 Setup Instructions

### Backend Setup

#### 1. Navigate to backend directory

```bash
cd backend
```

#### 2. Create Python virtual environment

```bash
python -m venv venv
```

#### 3. Activate virtual environment

**On Windows (PowerShell):**

```powershell
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**

```bash
source venv/bin/activate
```

#### 4. Install dependencies

```bash
pip install -r requirements.txt
```

#### 5. Create `.env` file

```bash
cp .env.example .env  # if template exists, otherwise create manually
```

Edit `.env` with your credentials:

```env
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://user:password@db.your-project.supabase.co:5432/postgres
FRONTEND_URL=http://localhost:3000
```

#### 6. Verify backend installation

```bash
python -m py_compile app/main.py app/agents/analysis_agent.py app/core/config.py
```

---

### Frontend Setup

#### 1. Navigate to frontend directory

```bash
cd frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create `.env.local` file

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 4. Verify frontend setup

```bash
npm run build
```

Should complete without TypeScript errors.

---

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)

| Variable            | Description                   | Example                               |
| ------------------- | ----------------------------- | ------------------------------------- |
| `GROQ_API_KEY`      | Groq API key for LLaMA models | `gsk_xxxxx...`                        |
| `SUPABASE_URL`      | Supabase project URL          | `https://abc123.supabase.co`          |
| `SUPABASE_ANON_KEY` | Supabase anonymous key        | `sb_publishable_xxxxx...`             |
| `DATABASE_URL`      | PostgreSQL connection string  | `postgresql://user:pass@host:5432/db` |
| `FRONTEND_URL`      | Frontend origin for CORS      | `http://localhost:3000`               |

### Frontend Configuration (`frontend/.env.local`)

| Variable                        | Description                   | Example                      |
| ------------------------------- | ----------------------------- | ---------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL (public) | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public)    | `sb_publishable_xxxxx...`    |
| `NEXT_PUBLIC_API_URL`           | Backend API URL               | `http://localhost:8000`      |

### Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy:
   - Project URL → `SUPABASE_URL`
   - Anon/public key → `SUPABASE_ANON_KEY`
4. Set up auth:
   - Enable email/password authentication
   - Configure redirect URLs (add `http://localhost:3000/auth/callback`)
5. Create storage bucket:
   - Create bucket named `food-labels`
   - Set to public
6. Create database tables:
   - `scan_history` table with columns: `id`, `user_id`, `image_url`, `nutrition_json`, `additives_json`, `health_score`, `created_at`

---

## 🏃 Running the Project

### Option 1: Run Both Servers in Separate Terminals

#### Terminal 1 - Backend (FastAPI)

```bash
cd backend
source venv/bin/activate    # macOS/Linux
# or: .\venv\Scripts\Activate.ps1  # Windows

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Output should show:

```
Uvicorn running on http://0.0.0.0:8000
```

#### Terminal 2 - Frontend (Next.js)

```bash
cd frontend
npm run dev
```

Output should show:

```
▲ Next.js 16.1.6 (Turbopack)
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Option 2: Production Build

#### Build Frontend

```bash
cd frontend
npm run build
npm start
```

#### Run Backend with Gunicorn (Production)

```bash
cd backend
source venv/bin/activate
gunicorn app.main:app -w 4 -b 0.0.0.0:8000
```

---

## 🔌 API Endpoints

### Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-production-domain.com`

### Endpoints

#### 1. Health Check

```http
GET /
```

Response:

```json
{
  "status": "Server is running"
}
```

#### 2. Analyze Food Label

```http
POST /analyze
Content-Type: application/json

{
  "image_url": "https://example.com/label.jpg",
  "user_profile": "General",
  "metadata": {
    "device": "Web",
    "user_id": "user-123"
  }
}
```

Response:

```json
{
  "status": "success",
  "health_score": 75,
  "personalized_insight": "Good choice for your profile!",
  "nutrition_data": {
    "protein_g": 10.5,
    "sugar_g": 2.1,
    "fat_g": 5.2,
    "sodium_mg": 250,
    "calories": 150
  },
  "ingredients": ["Water", "Sugar", "Salt"],
  "detected_additives": [
    {
      "code": "E100",
      "risk": "Low",
      "note": "Curcumin (natural coloring)"
    }
  ],
  "confidence_score": 0.92
}
```

#### 3. Chat with NutriDuck

```http
POST /chat
Content-Type: application/json

{
  "message": "Is this product vegan?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! I'm NutriDuck..."}
  ],
  "context": {
    "product_name": "Granola Bar",
    "health_score": 75
  }
}
```

Response:

```json
{
  "reply": "Yes! This granola bar is vegan-friendly... Quack! 🦆"
}
```

---

## ✨ Features

### Implemented

- ✅ User authentication (Email/Password via Supabase)
- ✅ Food label image upload
- ✅ OCR-based nutrition extraction
- ✅ Barcode scanning integration
- ✅ Additive detection & risk assessment
- ✅ Personalized health scoring
- ✅ Health gauge visualization
- ✅ Nutrition radar chart
- ✅ Scan history storage
- ✅ AI chatbot (NutriDuck)
- ✅ FSSAI compliance checks
- ✅ Multi-profile support

### API Integrations

- Groq LLaMA 4 for ingredient parsing
- OpenAI GPT for personalization
- OpenFoodFacts for barcode data
- ZXing for barcode reading

---

## 🐛 Troubleshooting

### Backend Issues

#### Issue: `ModuleNotFoundError: No module named 'app'`

**Solution**: Ensure you're running uvicorn from the `backend/` directory and the virtual environment is activated.

#### Issue: `GROQ_API_KEY is not set`

**Solution**: Add `GROQ_API_KEY` to `backend/.env` file and restart uvicorn.

#### Issue: Connection refused on port 8000

**Solution**: The port may be in use. Try:

```bash
uvicorn app.main:app --port 8001
```

Then update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

#### Issue: Supabase connection fails

**Solution**:

1. Verify credentials in `backend/.env`
2. Check network connectivity: `ping hxcgjmhbmxftqlksszxt.supabase.co`
3. Ensure DATABASE_URL is correctly formatted

### Frontend Issues

#### Issue: `NEXT_PUBLIC_SUPABASE_URL not defined`

**Solution**: Create `frontend/.env.local` with valid Supabase credentials.

#### Issue: `Failed to fetch` error in browser

**Solution**:

1. Check if backend is running: `curl http://localhost:8000`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL
3. Check browser console (F12) for detailed error

#### Issue: Auth state not persisting

**Solution**:

1. Clear browser storage: `localStorage.clear()`
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check Supabase auth configuration in console

#### Issue: Next.js root warning

**Solution**: If you see "Next.js inferred your workspace root", either:

- Open `frontend/` as a separate folder in VS Code, or
- Add to `frontend/next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: "./",
    },
  },
};
```

### Network Issues

#### Issue: `The remote name could not be resolved`

**Solution**:

1. Check internet connection: `ping 8.8.8.8`
2. Test DNS: `nslookup hxcgjmhbmxftqlksszxt.supabase.co`
3. Disable corporate proxy/VPN if applicable

#### Issue: CORS errors in browser

**Solution**: Ensure `FRONTEND_URL` in `backend/.env` matches your frontend origin:

```env
FRONTEND_URL=http://localhost:3000  # for local dev
```

---

## 📝 Common Commands

### Backend

```bash
# Start development server
uvicorn app.main:app --reload

# Run without reload
uvicorn app.main:app

# Check Python syntax
python -m py_compile app/main.py

# Install new dependency
pip install package-name
pip freeze > requirements.txt

# Deactivate virtual env
deactivate
```

### Frontend

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production build
npm start

# Run linter
npm run lint

# Install new dependency
npm install package-name
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [React 19 Docs](https://react.dev)

---

## 📄 License

[Add your license here]

---

## 👨‍💻 Support

For issues or questions, please refer to `DEPLOY.md` for production deployment guidance or contact the development team.

---

**Last Updated**: May 4, 2026
