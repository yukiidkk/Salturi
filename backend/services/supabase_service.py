"""
SALTURI — services/supabase_service.py
Cliente de Supabase con httpx configurado para bypass SSL en desarrollo local.
"""

import os
import httpx
from supabase import create_client, Client
from config import Config


def get_supabase_client() -> Client:
    """
    Inicializa y retorna el cliente de Supabase.
    En desarrollo local, parchea httpx para deshabilitar verificación SSL.
    """
    url = Config.SUPABASE_URL
    key = Config.SUPABASE_KEY

    if not url or not key:
        raise ValueError(
            "Las credenciales de Supabase no están configuradas. "
            "Verifica SUPABASE_URL y SUPABASE_KEY en backend/.env"
        )

    flask_env = os.getenv('FLASK_ENV', 'production')

    if flask_env == 'development':
        # Parchear httpx para que TODOS los clientes creados usen verify=False
        _original_client_init = httpx.Client.__init__
        _original_async_client_init = httpx.AsyncClient.__init__

        def _patched_sync_init(self, *args, **kwargs):
            kwargs['verify'] = False
            _original_client_init(self, *args, **kwargs)

        def _patched_async_init(self, *args, **kwargs):
            kwargs['verify'] = False
            _original_async_client_init(self, *args, **kwargs)

        httpx.Client.__init__ = _patched_sync_init
        httpx.AsyncClient.__init__ = _patched_async_init

    return create_client(url, key)


# Instancia global del cliente (singleton)
supabase: Client = get_supabase_client()
