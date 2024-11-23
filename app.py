from flask import Flask, jsonify, send_from_directory
import os
from predict import get_ro_votes, get_foreign_votes, run_predictor

app = Flask(__name__)

@app.route('/')
def home():
    # Serve the index.html file from the static folder
    return send_from_directory('static', 'index.html')

@app.route('/api/predict', methods=['GET'])
def predict():
    try:
        # Fetch votes
        votes_ro = get_ro_votes()
        votes_foreign = get_foreign_votes()
        valid_votes_perc = 0.96

        # Get prediction results
        results = run_predictor(votes_ro * valid_votes_perc, votes_foreign * valid_votes_perc)

        response = {
            "message": "Prediction completed successfully",
            "votes_romania": votes_ro,
            "votes_foreign": votes_foreign,
            "valid_votes_percentage": valid_votes_perc,
            "results": results,  # Object returned from run_predictor
            "image_url": "/results.png"
        }

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/results.png', methods=['GET'])
def get_results_image():
    return app.send_static_file('results.png')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
