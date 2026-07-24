from supabase import create_client, Client
from config import Config

def get_supabase_client() -> Client:
    url = Config.SUPABASE_URL
    key = Config.SUPABASE_KEY
    if not url or not key:
        raise ValueError("Las credenciales de Supabase no están configuradas en el archivo .env")
    return create_client(url, key)

supabase = get_supabase_client()