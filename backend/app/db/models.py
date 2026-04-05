from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class Additive(BaseModel):
    code: str
    risk: str
    note: str

class AnalyzeRequest(BaseModel):
    image_url: str
    user_profile: Optional[str] = "General"
    metadata: Optional[Dict] = {}

class AnalyzeResponse(BaseModel):
    status: str
    health_score: int
    personalized_insight: str
    nutrition_data: Dict
    ingredients: List[str]
    detected_additives: List[Additive]
    confidence_score: float

class NutritionData(BaseModel):
    protein_g: float = 0.0
    sugar_g: float = 0.0
    added_sugar_g: float = 0.0
    fat_g: float = 0.0
    sodium_mg: float = 0.0
    calories: float = 0.0

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
