"""
SALTURI — routes/reviews.py
Endpoints para reseñas y calificaciones de lugares.
Prefix: /api/v1/reviews
"""

from flask import Blueprint, request, jsonify
from services.supabase_service import supabase
import traceback

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/v1/reviews')


@reviews_bp.route('', methods=['GET'])
def get_reviews():
    """
    GET /api/v1/reviews
    Obtiene todas las reseñas con filtros opcionales.
    Query params:
        - place_id: str (filtrar por lugar)
        - user_id: str (filtrar por usuario)
    """
    try:
        place_id = request.args.get('place_id')
        user_id = request.args.get('user_id')

        # Select limpio sin filtrar por columna 'moderated' que puede no existir
        query = supabase.table('reviews').select('*')

        if place_id:
            query = query.eq('place_id', place_id)

        if user_id:
            query = query.eq('user_id', user_id)

        response = query.order('created_at', desc=True).execute()
        return jsonify({"data": response.data, "count": len(response.data)}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@reviews_bp.route('', methods=['POST'])
def create_review():
    """
    POST /api/v1/reviews
    Crea una nueva reseña (requiere usuario autenticado).
    Body: { place_id, user_id, rating (1-5), comment }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "El body de la solicitud es requerido"}), 400

        required_fields = ['place_id', 'user_id', 'rating', 'comment']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Campos requeridos faltantes: {', '.join(missing)}"}), 400

        # Validar rating entre 1 y 5
        rating = data['rating']
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({"error": "La calificación debe ser un número entero entre 1 y 5"}), 400

        # Validar que el comentario no esté vacío
        comment = data['comment'].strip()
        if len(comment) < 3:
            return jsonify({"error": "El comentario debe tener al menos 3 caracteres"}), 400

        review_data = {
            "place_id": data['place_id'],
            "user_id": data['user_id'],
            "rating": rating,
            "comment": comment,
        }

        response = supabase.table('reviews').insert(review_data).execute()
        return jsonify({
            "data": response.data,
            "message": "Reseña enviada correctamente"
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
