from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "API de Explora Saltillo corriendo correctamente"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)