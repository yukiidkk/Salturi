"""
SALTURI — routes/events.py
Endpoints para gestión de eventos culturales y sociales.
Prefix: /api/v1/events
"""

from flask import Blueprint, request, jsonify
from services.supabase_service import supabase
from services.cloudinary_service import upload_and_optimize
import traceback

events_bp = Blueprint('events', __name__, url_prefix='/api/v1/events')


@events_bp.route('', methods=['GET'])
def get_events():
    """
    GET /api/v1/events
    Obtiene lista de eventos con filtros opcionales.
    Query params:
        - category: str (musica, gastronomia, cultura, naturaleza)
        - q: str (búsqueda por título)
        - status: str (filtrar por status, sin default para traer todos)
    """
    try:
        category = request.args.get('category')
        search_query = request.args.get('q')
        status = request.args.get('status')

        query = supabase.table('events').select('*')

        # Filtrar por status solo si se proporciona explícitamente
        if status:
            query = query.eq('status', status)

        if category:
            query = query.eq('category', category)

        if search_query:
            query = query.ilike('title', f'%{search_query}%')

        # Ordenar por created_at si existe, sin asumir columna 'date'
        response = query.order('created_at', desc=True).execute()
        return jsonify({"data": response.data, "count": len(response.data)}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@events_bp.route('/<event_id>', methods=['GET'])
def get_event_by_id(event_id):
    """
    GET /api/v1/events/:id
    Obtiene detalle de un evento específico.
    """
    try:
        response = supabase.table('events').select('*').eq('id', event_id).single().execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 404


@events_bp.route('', methods=['POST'])
def create_event():
    """
    POST /api/v1/events
    Crea un nuevo evento (requiere autenticación como Organizer).
    El evento se crea con status 'pending' para moderación.
    Body: { title, description, category, location, image_url, organizer_id }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "El body de la solicitud es requerido"}), 400

        required_fields = ['title', 'description', 'category', 'organizer_id']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Campos requeridos faltantes: {', '.join(missing)}"}), 400

        # Construir datos del evento con campos que existan en la tabla
        event_data = {
            "title": data['title'],
            "description": data['description'],
            "category": data['category'],
            "organizer_id": data['organizer_id'],
            "status": "pending",
        }

        # Campos opcionales — solo incluir si se proporcionan
        if 'location' in data:
            event_data['location'] = data['location']
        if 'image_url' in data and data['image_url']:
            # Optimizar imagen con Cloudinary (webp, resize 1000px, quality auto)
            event_data['image_url'] = upload_and_optimize(data['image_url'])

        response = supabase.table('events').insert(event_data).execute()
        return jsonify({"data": response.data, "message": "Evento creado, pendiente de aprobación"}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
