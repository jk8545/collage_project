def generate_personalization(structured_data: dict, user_profile: str) -> str:
    """
    Rules:
    If profile == 'Hypertension' AND sodium_mg > 400 -> CRITICAL_WARNING
    If front label implies 'Zero Sugar' but sugar > 0.5 -> MARKETING_MISMATCH
    If ingredient contains 'Maltodextrin' -> Hidden Sugar warning
    """
    warnings = []
    sodium = structured_data.get('sodium_mg', 0)
    sugar = structured_data.get('sugar_g', 0)
    
    if user_profile == 'Hypertension' and sodium > 400:
        warnings.append("CRITICAL_WARNING: High sodium content detected for Hypertension profile.")
        
    if user_profile == 'Diabetic' and sugar > 5:
        warnings.append("WARNING: High sugar content for Diabetic profile.")
        
    if structured_data.get('marketing_mismatch'):
        warnings.append("MARKETING_MISMATCH: Product claims may be misleading regarding sugar content.")
        
    if structured_data.get('hidden_sugars_found'):
        warnings.append("Hidden sugars (like Maltodextrin) found in ingredients.")
        
    if not warnings:
        return "Product matches your health profile well."
        
    return " | ".join(warnings)

def calculate_health_score(structured_data: dict, user_profile: str) -> int:
    score = 100
    if structured_data.get('sugar_g', 0) > 10:
        score -= 15
    if structured_data.get('sodium_mg', 0) > 400:
        score -= 20
        
    for addy in structured_data.get('additives', []):
        if addy.get('risk', '').lower() in ['high', 'danger']:
            score -= 10
            
    if user_profile == 'Hypertension' and structured_data.get('sodium_mg', 0) > 400:
        score -= 15
        
    return max(0, min(100, score))
