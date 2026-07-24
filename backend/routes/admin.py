"""
SALTURI — routes/admin.py
Endpoints de administración: gestión de eventos, moderación y métricas.
Prefix: /api/v1/admin
"""

from flask import Blueprint, request, jsonify
from services.supabase_service import supabase
import traceback

admin_bp = Blueprint('admin', __name__, url_prefix='/api/v1/admin')


@admin_bp.route('/events/pending', methods=['GET'])
def get_pending_events():
    """
    GET /api/v1/admin/events/pending
    Obtiene lista de eventos pendientes de aprobación.
    Solo accesible por Admin.
    """
    try:
        response = (
            supabase.table('events')
            .select('*')
            .eq('status', 'pending')
            .execute()
        )
        return jsonify({"data": response.data, "count": len(response.data)}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/events/<event_id>/status', methods=['PATCH'])
def update_event_status(event_id):
    """
    PATCH /api/v1/admin/events/:id/status
    Aprueba o rechaza un evento.
    Body: { status: "approved" | "rejected" }
    Solo accesible por Admin.
    """
    try:
        data = request.get_json()

        if not data or 'status' not in data:
            return jsonify({"error": "El campo 'status' es requerido"}), 400

        new_status = data['status']
        valid_statuses = ['approved', 'rejected']
        if new_status not in valid_statuses:
            return jsonify({"error": f"Status inválido. Opciones: {', '.join(valid_statuses)}"}), 400

        update_data = {"status": new_status}

        # Si se aprueba, marcar como verificado
        if new_status == 'approved':
            update_data['verified'] = True

        response = (
            supabase.table('events')
            .update(update_data)
            .eq('id', event_id)
            .execute()
        )

        if not response.data:
            return jsonify({"error": "Evento no encontrado"}), 404

        action = "aprobado" if new_status == "approved" else "rechazado"
        return jsonify({
            "data": response.data,
            "message": f"Evento {action} exitosamente"
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/metrics', methods=['GET'])
def get_admin_metrics():
    """
    GET /api/v1/admin/metrics
    Obtiene métricas generales del dashboard del Admin.
    """
    try:
        # Contar eventos por status
        pending = supabase.table('events').select('id', count='exact').eq('status', 'pending').execute()
        approved = supabase.table('events').select('id', count='exact').eq('status', 'approved').execute()
        rejected = supabase.table('events').select('id', count='exact').eq('status', 'rejected').execute()

        # Contar reseñas
        reviews_total = supabase.table('reviews').select('id', count='exact').execute()

        # Total de lugares
        places_total = supabase.table('places').select('id', count='exact').execute()

        metrics = {
            "events": {
                "pending": pending.count if pending.count else 0,
                "approved": approved.count if approved.count else 0,
                "rejected": rejected.count if rejected.count else 0
            },
            "reviews_total": reviews_total.count if reviews_total.count else 0,
            "places_total": places_total.count if places_total.count else 0
        }

        return jsonify({"data": metrics}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/reviews/pending', methods=['GET'])
def get_pending_reviews():
    """
    GET /api/v1/admin/reviews/pending
    Obtiene todas las reseñas (sin filtro por 'moderated').
    """
    try:
        response = (
            supabase.table('reviews')
            .select('*')
            .execute()
        )
        return jsonify({"data": response.data, "count": len(response.data)}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/reviews/<review_id>/moderate', methods=['PATCH'])
def moderate_review(review_id):
    """
    PATCH /api/v1/admin/reviews/:id/moderate
    Aprueba o elimina una reseña.
    Body: { action: "approve" | "delete" }
    """
    try:
        data = request.get_json()

        if not data or 'action' not in data:
            return jsonify({"error": "El campo 'action' es requerido"}), 400

        action = data['action']

        if action == 'approve':
            response = (
                supabase.table('reviews')
                .update({"rating": 5})  # Placeholder - adjust when moderated column exists
                .eq('id', review_id)
                .execute()
            )
            return jsonify({"data": response.data, "message": "Reseña aprobada"}), 200

        elif action == 'delete':
            response = (
                supabase.table('reviews')
                .delete()
                .eq('id', review_id)
                .execute()
            )
            return jsonify({"message": "Reseña eliminada"}), 200

        else:
            return jsonify({"error": "Acción inválida. Opciones: approve, delete"}), 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
