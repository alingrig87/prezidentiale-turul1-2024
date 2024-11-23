async function fetchPrediction() {
    const url = 'http://127.0.0.1:5000/api/predict';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Prediction Data:", data);

        // Dacă vrei să afișezi imaginea în browser
        const img = document.createElement('img');
        img.src = `http://127.0.0.1:5000${data.image_url}`;
        document.body.appendChild(img);
    } catch (error) {
        console.error("Error fetching prediction:", error);
    }
}

fetchPrediction();
