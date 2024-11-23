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
            "ELENA LASCONI": "/static/images/elena_lasconi.png",
            "GEORGE SIMION": "/static/images/george_simion.png",
            "CALIN GEORGESCU": "/static/images/calin_georgescu.png",
            "MARCEL CIOLACU": "/static/images/marcel_ciolacu.png",
            "NICOLAE CIUCA": "/static/images/nicolae_ciuca.png",
            "ALTII": "/static/images/others.png"
        };

        // Prepare data for the chart
        let labels = Object.keys(results); // Candidate names
        let percentages = Object.values(results); // Vote percentages
        let images = labels.map(label => candidateImages[label] || "/static/images/default.jpg");

        // Sort data by percentages (descending order)
        const sortedData = labels
            .map((label, index) => ({ label, percentage: percentages[index], image: images[index] }))
            .sort((a, b) => b.percentage - a.percentage);

        labels = sortedData.map(item => item.label);
        percentages = sortedData.map(item => item.percentage);
        images = sortedData.map(item => item.image);

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
                    },
                    // Plugin to draw percentages on bars
                    afterDatasetsDraw: (chart) => {
                        const ctx = chart.ctx;
                        ctx.font = "bold 16px Arial";
                        ctx.fillStyle = "black";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";

                        chart.data.datasets[0].data.forEach((value, index) => {
                            const meta = chart.getDatasetMeta(0);
                            const bar = meta.data[index];
                            const x = bar.x;
                            const y = bar.y - 10; // Position above the bar
                            ctx.fillText(`${value}%`, x, y); // Draw percentage
                        });
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

        // Display candidate photos, names, and percentages below the chart
        const photoContainer = document.getElementById("candidatePhotos");
        photoContainer.innerHTML = ""; // Clear previous content
        sortedData.forEach((item) => {
            const photoDiv = document.createElement("div");
            photoDiv.classList.add("candidate");

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.label;

            const name = document.createElement("p");
            name.textContent = item.label;

            const percentage = document.createElement("p");
            percentage.textContent = `${item.percentage}%`;
            percentage.style.fontWeight = "bold"; // Make the percentage stand out

            photoDiv.appendChild(img);
            photoDiv.appendChild(name);
            photoDiv.appendChild(percentage);
            photoContainer.appendChild(photoDiv);
        });
    } catch (error) {
        console.error("Error fetching or displaying data:", error);
    }
});
