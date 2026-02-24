from app.db.supabase_db import supabase_client

def match_additives(extracted_additives: list) -> list:
    """
    Uses pg_trgm in DB via supabase_client RPC to fuzzy match additive names.
    Fallback: Return exactly what LLM found.
    """
    if not supabase_client:
        return extracted_additives
        
    matched = []
    for addy in extracted_additives:
        try:
            # Assuming an RPC `match_additive` exists in Supabase that uses similarity()
            # If RPC doesn't exist, we rely on the LLM's classification for the prototype.
            name_to_match = addy.get('code', addy.get('note', ''))
            res = supabase_client.rpc('match_additive', {'search_term': name_to_match}).execute()
            if res.data and len(res.data) > 0:
                best_match = res.data[0]
                matched.append({
                    'code': best_match.get('code', addy.get('code', 'Unknown')),
                    'risk': best_match.get('risk', addy.get('risk', 'Unknown')),
                    'note': best_match.get('note', addy.get('note', ''))
                })
            else:
                matched.append(addy)
        except Exception as e:
            print(f"Fuzzy match error: {e}")
            matched.append(addy)
    return matched
