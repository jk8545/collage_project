export async function fetchByBarcode(barcode: string) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
            headers: {
                "User-Agent": "NutriVision/1.0"
            }
        });
        const data = await response.json();
        
        if (data.status !== 1 || !data.product) {
            return null;
        }

        const p = data.product;
        
        return {
            product_name: p.product_name || "Unknown Product",
            nutriments: p.nutriments || {},
            allergens_tags: p.allergens_tags || [],
            additives_tags: p.additives_tags || [],
            nova_group: p.nova_group || null,
            nutrition_grades: p.nutrition_grades || "unknown",
            ingredients_text: p.ingredients_text || ""
        };
    } catch (e) {
        console.error("Open Food Facts fetch error:", e);
        return null;
    }
}

export function formatOffToNutrivision(offData: any, userProfile: string) {
    // 1. Convert nutrition grades to health_score (0-100)
    let healthScore = 50; 
    const grade = (offData.nutrition_grades || "").toLowerCase();
    if (grade === "a") healthScore = 90;
    else if (grade === "b") healthScore = 75;
    else if (grade === "c") healthScore = 55;
    else if (grade === "d") healthScore = 35;
    else if (grade === "e") healthScore = 15;

    // 2. Parse Additives (e.g. en:e330 -> E330)
    const detected_additives = (offData.additives_tags || []).map((tag: string) => {
        const codeMatch = tag.match(/en:(e\d+[a-z]?)/i);
        const code = codeMatch ? codeMatch[1].toUpperCase() : tag;
        return {
            code,
            risk: "Moderate", 
            note: "Detected via Open Food Facts database"
        };
    });

    // 3. Extracted Ingredients
    let ingredients: string[] = [];
    if (offData.ingredients_text) {
        ingredients = offData.ingredients_text.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    // 4. Personalized Insight logic based on user profile and allergens/nutritional data
    let insight = "Product matches your health profile well.";
    const allergensStr = offData.allergens_tags.join(" ").toLowerCase();
    
    if (userProfile === 'Vegan' && (allergensStr.includes('milk') || allergensStr.includes('egg'))) {
        insight = "High Risk: Contains animal-derived allergens (milk/egg) conflicting with Vegan profile.";
        healthScore = Math.max(0, healthScore - 30);
    } else if (userProfile === 'Diabetic' && offData.nutriments?.sugars_100g > 15) {
        insight = "High Risk: Elevated sugar levels (over 15g/100g) detected. Not recommended for Diabetics.";
        healthScore = Math.max(0, healthScore - 20);
    } else if (userProfile === 'Hypertension' && (offData.nutriments?.sodium_100g || 0) > 0.4) {
        insight = "High Risk: High sodium levels detected. Exercise caution with Hypertension.";
        healthScore = Math.max(0, healthScore - 20);
    }

    // 5. Build nutrition_data structure matching RadarChart expectations
    const sodiumMg = (offData.nutriments?.sodium_100g || (offData.nutriments?.salt_100g || 0) / 2.5) * 1000;

    return {
        status: "success",
        health_score: healthScore,
        personalized_insight: insight,
        confidence_score: 1.0, // Barcode is a definitive match
        nutrition_data: {
            protein_g: offData.nutriments?.proteins_100g || 0,
            sugar_g: offData.nutriments?.sugars_100g || 0,
            fat_g: offData.nutriments?.fat_100g || 0,
            added_sugar_g: 0,
            sodium_mg: sodiumMg,
            calories: offData.nutriments?.energy_kcal_100g || offData.nutriments?.energy_100g || 0
        },
        ingredients: ingredients,
        detected_additives: detected_additives,
        // Also persist raw OFF properties to UI if needed
        product_name: offData.product_name
    };
}
