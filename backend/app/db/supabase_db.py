from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment variables.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

try:
    supabase_client = get_supabase_client()
except Exception:
    supabase_client = None
