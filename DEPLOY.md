# Production Deployment Guide (Split-Hosting)

This project is configured for **Split-Hosting**, achieving the best performance and cost by leveraging Vercel's edge network for the Next.js React frontend, and Render's persistent Linux instances for the Python FastAPI + OpenCV backend.

## 1. Prerequisites and GitHub
1. You must have a **GitHub** account.
2. Initialize this entire folder (`collage_project`) as a Git repository and push it to GitHub. Ensure you include a standard `.gitignore` so your `.env` files are **not** pushed.

---

## 2. Deploying the Backend (Render)
Render excels at long-running Python applications and heavy libraries like OpenCV.

1. Go to [Render.com](https://render.com) and sign in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. **Configuration Settings**:
   - **Name**: `food-intelligence-backend`
   - **Root Directory**: `backend` (CRITICAL: Tell Render your python code lives inside the backend folder).
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   Scroll down to Environment variables and add:
   - `GROQ_API_KEY`: Your Groq token
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `DATABASE_URL`: Your Supabase direct connection string
   - `FRONTEND_URL`: (Leave blank for now. Once we deploy to Vercel, come back and paste the Vercel URL here for CORS).
6. Click **Create Web Service**. Wait 5-10 minutes for it to build. Once it's live, copy the `.onrender.com` URL.

---

## 3. Deploying the Frontend (Vercel)
Vercel is the creator of Next.js and hosts it flawlessly at the edge.

1. Go to [Vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** -> **Project**.
3. Connect your GitHub repository.
4. **Configuration Settings**:
   - **Project Name**: `nutrivision-app`
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" and change it to `frontend` so Vercel knows where the Next.js app is.
5. **Environment Variables**:
   Open the dropdown and paste:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_API_URL`: Paste your Render backend URL here! (e.g. `https://food-intelligence-backend.onrender.com`)
6. Click **Deploy**.

---

## 4. Final Connections
Now that both sides are live on the internet:
1. Copy your new `.vercel.app` frontend URL.
2. Go back to your **Render Web Service Settings**.
3. Under Environment Variables, update the `FRONTEND_URL` to be your Vercel domain.
4. Your application is now securely connected in the cloud!
