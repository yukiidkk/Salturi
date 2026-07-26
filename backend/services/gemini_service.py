"""
SALTURI — services/gemini_service.py
Moderación de contenido usando la API REST de Gemini directamente con requests.
Evita el SDK google-generativeai que usa gRPC y falla con SSL en Windows.
"""

import json
import requests
import urllib3
from config import Config

# Suprimir warnings de SSL en desarrollo
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

MODERATION_PROMPT = """Eres un moderador de contenido para SalTurismo, una plataforma turística de Saltillo, México.
Analiza el texto y determina si es apropiado para publicación.

RECHAZA si contiene: lenguaje ofensivo, spam, acoso, contenido sexual, odio, amenazas, información falsa o contenido irrelevante al turismo.
APRUEBA si es: opiniones respetuosas, descripciones de eventos/lugares, preguntas constructivas.

Responde SOLO con JSON válido sin markdown: {"approved": true/false, "reason": "explicación breve en español"}"""


def moderate_content(content_type, text_content):
    """
    Modera texto usando la API REST de Gemini.
    Retorna { approved: bool, reason: str }
    """
    if not Config.GEMINI_API_KEY or Config.GEMINI_API_KEY == 'tu_api_key_aqui':
        return {"approved": True, "reason": "Moderación desactivada (API key no configurada)"}

    if not text_content or len(text_content.strip()) < 2:
        return {"approved": False, "reason": "Contenido vacío o muy corto"}

    try:
        url = f"{GEMINI_API_URL}?key={Config.GEMINI_API_KEY}"

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"{MODERATION_PROMPT}\n\nTipo: {content_type}\nTexto a analizar:\n{text_content}\n\nJSON:"
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 150
            }
        }

        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            verify=False,
            timeout=15
        )

        if response.status_code != 200:
            print(f"Gemini API error {response.status_code}: {response.text[:200]}")
            return {"approved": True, "reason": "Servicio de moderación no disponible"}

        data = response.json()

        # Extraer texto de la respuesta de Gemini
        candidates = data.get("candidates", [])
        if not candidates:
            return {"approved": True, "reason": "Sin respuesta de moderación"}

        result_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()

        # Limpiar posible markdown
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

        result = json.loads(result_text)
        return {
            "approved": bool(result.get("approved", True)),
            "reason": result.get("reason", "Sin razón especificada")
        }

    except json.JSONDecodeError:
        return {"approved": True, "reason": "No se pudo parsear respuesta de moderación"}
    except requests.exceptions.Timeout:
        return {"approved": True, "reason": "Timeout en servicio de moderación"}
    except Exception as e:
        print(f"Error moderación Gemini REST: {e}")
        return {"approved": True, "reason": "Error en servicio de moderación"}
