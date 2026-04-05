from app.services.vision_service import process_image
from app.services.llm_parser_service import parse_image_to_json
from app.services.fuzzy_match_service import match_additives
from app.services.personalization_service import generate_personalization, calculate_health_score
from app.db.models import AnalyzeResponse, Additive
from app.db.supabase_db import supabase_client
from typing import Dict

def analyze_product(image_url: str, user_profile: str, metadata: Dict = None) -> AnalyzeResponse:
    # 1. Vision Preprocessing
    confidence, base64_image = process_image(image_url)
    
    # 2. Extract and structure facts via Vision LLM (Single Pass)
    structured = parse_image_to_json(base64_image)
    
    # 3. Fuzzy Match Additives
    final_additives = match_additives(structured.get('additives', []))
    structured['additives'] = final_additives
    
    # 4. Personalization and Scoring
    insight = generate_personalization(structured, user_profile)
    health_score = calculate_health_score(structured, user_profile)
    
    # 6. Save to Supabase (Moved to Frontend to capture Barcode Merges securely)
    # The frontend now natively pushes the completed JSON cluster directly.
    # Assemble response
    additives_list = [Additive(code=a.get('code',''), risk=a.get('risk',''), note=a.get('note','')) for a in final_additives]
    
    nutrition_data = {
        "protein_g": structured.get('protein_g', 0),
        "sugar_g": structured.get('sugar_g', 0),
        "added_sugar_g": structured.get('added_sugar_g', 0),
        "fat_g": structured.get('fat_g', 0),
        "sodium_mg": structured.get('sodium_mg', 0),
        "calories": structured.get('calories', 0)
    }

    return AnalyzeResponse(
        status="success",
        health_score=health_score,
        personalized_insight=insight,
        nutrition_data=nutrition_data,
        ingredients=structured.get('ingredients', []),
        detected_additives=additives_list,
        confidence_score=confidence
    )
