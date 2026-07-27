"""
SALTURI — services/cloudinary_service.py
Servicio de optimización de imágenes con Cloudinary.
Aplica transformaciones automáticas: webp, resize, quality auto.
"""

import cloudinary
import cloudinary.uploader
from config import Config


def init_cloudinary():
    """Inicializa Cloudinary con credenciales del .env"""
    cloudinary.config(
        cloud_name=Config.CLOUDINARY_CLOUD_NAME,
        api_key=Config.CLOUDINARY_API_KEY,
        api_secret=Config.CLOUDINARY_API_SECRET,
        secure=True
    )


def upload_and_optimize(image_url_or_file, folder="salturismo/events"):
    """
    Sube una imagen a Cloudinary con transformaciones automáticas.
    Acepta una URL remota o un archivo local.
    
    Transformaciones aplicadas:
    - Formato automático (webp cuando el navegador lo soporta)
    - Calidad automática (compresión inteligente)
    - Resize máximo 1000px de ancho
    - Crop 'limit' (no agranda imágenes pequeñas)
    
    Returns:
        str: URL optimizada de Cloudinary, o la URL original si falla.
    """
    if not Config.CLOUDINARY_CLOUD_NAME:
        # Cloudinary no configurado — devolver URL original
        return image_url_or_file

    try:
        init_cloudinary()

        result = cloudinary.uploader.upload(
            image_url_or_file,
            folder=folder,
            transformation=[
                {
                    "width": 1000,
                    "crop": "limit",
                    "fetch_format": "auto",
                    "quality": "auto"
                }
            ],
            resource_type="image"
        )

        return result.get("secure_url", image_url_or_file)

    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return image_url_or_file


def get_optimized_url(public_id_or_url, width=800):
    """
    Genera una URL de Cloudinary con transformaciones on-the-fly.
    Útil para imágenes ya subidas que necesitan servirse optimizadas.
    
    Args:
        public_id_or_url: Public ID de Cloudinary o URL completa
        width: Ancho máximo en px (default 800)
    
    Returns:
        str: URL con transformaciones aplicadas
    """
    if not Config.CLOUDINARY_CLOUD_NAME:
        return public_id_or_url

    try:
        init_cloudinary()
        
        url = cloudinary.utils.cloudinary_url(
            public_id_or_url,
            transformation=[
                {
                    "width": width,
                    "crop": "limit",
                    "fetch_format": "auto",
                    "quality": "auto"
                }
            ]
        )
        return url[0] if url else public_id_or_url

    except Exception as e:
        print(f"Cloudinary URL generation error: {e}")
        return public_id_or_url
