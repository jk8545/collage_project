export async function fetchByBarcode(barcode: string) {
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,nutriments,allergens_tags,additives_tags,nova_group,nutrition_grades,ingredients_text,quantity,brands`,
            {
                headers: {
                    'User-Agent': 'NutriVision/1.0'
                }
            }
        );
        const data = await response.json();
        
        if (data.status !== 1 || !data.product) {
            return null;
        }

        const p = data.product;
        const n = p.nutriments || {};

        return {
            product_name: p.product_name,
            brand: p.brands,
            quantity: p.quantity,
            nutri_grade: p.nutrition_grades,
            nova_group: p.nova_group,
            allergens: p.allergens_tags || [],
            additives: p.additives_tags || [],
            nutriments: {
                energy_kcal: n.energy_kcal_100g || n.energy_100g,
                fat: n.fat_100g,
                saturated_fat: n['saturated-fat_100g'],
                carbohydrates: n.carbohydrates_100g,
                sugars: n.sugars_100g,
                fiber: n.fiber_100g,
                protein: n.proteins_100g,
                salt: n.salt_100g
            },
            ingredients_text: p.ingredients_text,
            source: "barcode"
        };
    } catch (e) {
        return null; // Never throw
    }
}
