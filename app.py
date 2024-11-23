from flask import Flask, jsonify
from flask_cors import CORS  # Importă Flask-CORS
from script import get_ro_votes, get_foreign_votes, run_predictor
import os

app = Flask(__name__)
CORS(app)  # Activează CORS pentru toate rutele

@app.route('/api/predict', methods=['GET'])
def predict():
    try:
        votes_ro = get_ro_votes()
        votes_foreign = get_foreign_votes()
        valid_votes_perc = 0.96
        run_predictor(votes_ro * valid_votes_perc, votes_foreign * valid_votes_perc)

        response = {
            "message": "Prediction completed successfully",
            "votes_romania": votes_ro,
            "votes_foreign": votes_foreign,
            "valid_votes_percentage": valid_votes_perc,
            "image_url": "/results.png"
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/results.png', methods=['GET'])
def get_results_image():
    return app.send_static_file('results.png')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
