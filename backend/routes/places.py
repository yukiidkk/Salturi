"""
SALTURI — routes/places.py
Endpoints para lugares turísticos y puntos de interés.
Prefix: /api/v1/places
"""

from flask import Blueprint, request, jsonify
from services.supabase_service import supabase
import traceback

places_bp = Blueprint('places', __name__, url_prefix='/api/v1/places')


@places_bp.route('', methods=['GET'])
def get_places():
    """
    GET /api/v1/places
    Obtiene lista de lugares turísticos con filtros opcionales.
    Query params:
        - category: str (museo, cafeteria, restaurante, naturaleza, emergencia)
        - q: str (búsqueda por nombre)
    """
    try:
        category = request.args.get('category')
        search_query = request.args.get('q')

        query = supabase.table('places').select('*')

        if category:
            query = query.eq('category', category)

        if search_query:
            query = query.ilike('name', f'%{search_query}%')

        response = query.order('name', desc=False).execute()
        return jsonify({"data": response.data, "count": len(response.data)}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@places_bp.route('/<place_id>', methods=['GET'])
def get_place_by_id(place_id):
    """
    GET /api/v1/places/:id
    Obtiene detalle de un lugar con sus reseñas.
    """
    try:
        # Obtener lugar
        place_response = supabase.table('places').select('*').eq('id', place_id).single().execute()
        place_data = place_response.data

        # Obtener reseñas asociadas
        reviews_response = (
            supabase.table('reviews')
            .select('*')
            .eq('place_id', place_id)
            .order('created_at', desc=True)
            .execute()
        )

        # Calcular calificación promedio
        reviews = reviews_response.data
        avg_rating = 0
        if reviews:
            avg_rating = round(sum(r['rating'] for r in reviews) / len(reviews), 1)

        place_data['reviews'] = reviews
        place_data['avg_rating'] = avg_rating
        place_data['review_count'] = len(reviews)

        return jsonify({"data": place_data}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 404
