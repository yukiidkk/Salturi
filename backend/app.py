import ssl
import os

# Deshabilitar verificación SSL para desarrollo local en Windows
os.environ['PYTHONHTTPSVERIFY'] = '0'
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

"""
SALTURI — app.py
Punto de entrada de la API RESTful (Flask).
Registra todos los Blueprints de rutas.
"""

from flask import Flask, jsonify
from flask_cors import CORS

from routes.events import events_bp
from routes.places import places_bp
from routes.reviews import reviews_bp
from routes.admin import admin_bp
from routes.moderate import moderate_bp

app = Flask(__name__)
CORS(app)

# ============================================
# REGISTRO DE BLUEPRINTS
# ============================================
app.register_blueprint(events_bp)
app.register_blueprint(places_bp)
app.register_blueprint(reviews_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(moderate_bp)


# ============================================
# HEALTH CHECK
# ============================================
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Endpoint de verificación de estado de la API."""
    return jsonify({
        "status": "ok",
        "message": "API SALTURI corriendo correctamente",
        "version": "1.0.0",
        "endpoints": {
            "events": "/api/v1/events",
            "places": "/api/v1/places",
            "reviews": "/api/v1/reviews",
            "admin": "/api/v1/admin"
        }
    }), 200


# ============================================
# MANEJO DE ERRORES GLOBAL
# ============================================
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint no encontrado"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Error interno del servidor"}), 500


# ============================================
# EJECUTAR
# ============================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
