"""
SALTURI — routes/moderate.py
Endpoint de moderación de contenido con IA (Gemini).
"""

from flask import Blueprint, request, jsonify
from services.gemini_service import moderate_content
import traceback

moderate_bp = Blueprint('moderate', __name__, url_prefix='/api/v1')


@moderate_bp.route('/moderate', methods=['POST'])
def moderate():
    """
    POST /api/v1/moderate
    Body: { "type": "review"|"event", "content": "texto" }
    Returns: { "approved": bool, "reason": "..." }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Body requerido"}), 400

        content_type = data.get('type')
        content = data.get('content')

        if not content_type or content_type not in ['review', 'event']:
            return jsonify({"error": "type debe ser 'review' o 'event'"}), 400

        if not content or len(content.strip()) < 2:
            return jsonify({"error": "content requerido (min 2 chars)"}), 400

        result = moderate_content(content_type, content)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
