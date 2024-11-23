@app.route('/api/predict', methods=['GET'])
def predict():
    try:
        # Fetch votes
        votes_ro = get_ro_votes()
        votes_foreign = get_foreign_votes()
        valid_votes_perc = 0.96

        # Get prediction results
        results = run_predictor(votes_ro * valid_votes_perc, votes_foreign * valid_votes_perc)

        # Prepare JSON response
        response = {
            "message": "Prediction completed successfully",
            "votes_romania": votes_ro,
            "votes_foreign": votes_foreign,
            "valid_votes_percentage": valid_votes_perc,
            "results": results,
            "image_url": "/results.png"
        }

        return jsonify(response), 200
    except Exception as e:
        # Return error in JSON format
        return jsonify({"error": str(e)}), 500
