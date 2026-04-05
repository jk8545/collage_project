from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db.models import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse
from app.agents.analysis_agent import analyze_product
from litellm import completion

app = FastAPI(title="Food Intelligence API", version="1.0.0")

import os

# Configure CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",  # Production Vercel apps
        os.getenv("FRONTEND_URL", "") # Custom explicit deployment URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sanity check environments on boot
@app.on_event("startup")
async def startup_event():
    from app.core.config import settings
    if not settings.GROQ_API_KEY:
        print("WARNING: GROQ_API_KEY is not set. Inference will fail in production.")
    if not settings.DATABASE_URL:
        print("WARNING: DATABASE_URL is not set. Analytics and history saving will fail.")

@app.get("/")
def read_root():
    return {"status": "Server is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        response = analyze_product(request.image_url, request.user_profile, request.metadata)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    from app.core.config import settings
    try:
        messages = [
            {
                "role": "system",
                "content": f"You are NutriDuck, a cute and friendly cyberpunk duck AI assistant. You help users understand their food product scans and also chat generally. If context is provided, use it to answer product-specific questions. Keep responses short, friendly, and add a duck pun or quack occasionally.\nContext: {req.context}"
            }
        ]
        messages.extend(req.history)
        messages.append({"role": "user", "content": req.message})

        response = completion(
            model="groq/meta-llama/llama-4-scout-17b-16e-instruct",
            messages=messages,
            temperature=0.7,
            api_key=settings.GROQ_API_KEY
        )
        reply = response.choices[0].message.content
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
