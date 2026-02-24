import json
from litellm import completion
from app.core.config import settings

def parse_image_to_json(base64_image: str) -> dict:
    """
    Uses meta-llama/llama-4-scout-17b-16e-instruct to extract and strictly structure facts from the image in a single pass.
    """
    prompt = """
    Analyze this food nutrition label.
    1. Extract Nutrition Facts per 100g or serving.
    2. Extract the full Ingredients list.
    3. Identify any Additives, E-numbers, or INS codes (e.g., E211, INS 330).
    4. You MUST return ONLY valid JSON matching this exact schema:
    {
      "protein_g": 0,
      "sugar_g": 0,
      "added_sugar_g": 0,
      "fat_g": 0,
      "sodium_mg": 0,
      "calories": 0,
      "ingredients": ["list", "of", "strings"],
      "additives": [{"code": "E-number or Name", "risk": "High/Medium/Low", "note": "Brief description"}],
      "marketing_mismatch": false,
      "hidden_sugars_found": false
    }
    """
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                }
            ]
        }
    ]
    try:
        response = completion(
            model="groq/meta-llama/llama-4-scout-17b-16e-instruct",
            messages=messages,
            temperature=0.1,
            response_format={"type": "json_object"},
            api_key=settings.GROQ_API_KEY
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Vision parsing error: {e}")
        return {}
