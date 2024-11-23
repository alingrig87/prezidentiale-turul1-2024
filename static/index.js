document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://prezidentiale-turul1-2024.onrender.com/api/predict";

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract candidate results from the JSON response
        const results = data.results;

        // Map candidate names to their respective images
        const candidateImages = {
            "ELENA LASCONI": "/static/images/elena_lasconi.jpg",
            "GEORGE SIMION": "/static/images/george_simion.jpg",
            "CALIN GEORGESCU": "/static/images/calin_georgescu.jpg",
            "MARCEL CIOLACU": "/static/images/marcel_ciolacu.jpg",
            "NICOLAE CIUCA": "/static/images/nicolae_ciuca.jpg",
            "ALTII": "/static/images/others.jpg"
        };

        // Prepare data for the chart
        const labels = Object.keys(results); // Candidate names
        const percentages = Object.values(results); // Vote percentages
        const images = labels.map(label => candidateImages[label] || "/static/images/default.jpg");

        // Create the Chart.js bar chart
        const ctx = document.getElementById("chartCanvas").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels, // Candidate names
                datasets: [
                    {
                        label: "Vote Percentage",
                        data: percentages, // Percentages
                        backgroundColor: [
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(201, 203, 207, 0.6)"
                        ],
                        borderColor: [
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 99, 132, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(201, 203, 207, 1)"
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Percentage (%)"
                        }
                    }
                }
            }
        });

        // Display candidate photos below the chart
        const photoContainer = document.getElementById("candidatePhotos");
        labels.forEach((label, index) => {
            const photoDiv = document.createElement("div");
            photoDiv.classList.add("candidate");

            const img = document.createElement("img");
            img.src = images[index];
            img.alt = label;

            const name = document.createElement("p");
            name.textContent = `${label}: ${percentages[index]}%`;

            photoDiv.appendChild(img);
            photoDiv.appendChild(name);
            photoContainer.appendChild(photoDiv);
        });
    } catch (error) {
        console.error("Error fetching or displaying data:", error);
    }
});
