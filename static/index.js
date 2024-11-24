document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://prezidentiale-turul1-2024.onrender.com/api/predict";

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract results from the JSON response
    const resultsTotal = data.results;
    const resultsDiaspora = data.results_diaspora;
    const resultsRomania = data.results_romania;
    const votesForeign = data.votes_foreign;
    const votesRomania = data.votes_romania;

    // Filter candidates with at least 1% in the total results
    const filterResults = (results) =>
      Object.entries(results)
        .filter(([_, value]) => value >= 1)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const filteredResultsTotal = filterResults(resultsTotal);

    // Calculate percentages for raw vote counts
    const calculatePercentages = (results, totalVotes) =>
      Object.entries(results).reduce(
        (obj, [key, value]) => ({
          ...obj,
          [key]: ((value / totalVotes) * 100).toFixed(2), // Calculate percentage
        }),
        {}
      );

    const filteredResultsDiaspora = calculatePercentages(
      resultsDiaspora,
      votesForeign
    );
    const filteredResultsRomania = calculatePercentages(
      resultsRomania,
      votesRomania
    );

    // Map candidate names to their respective images
    const candidateImages = {
      "ALEXANDRA PACURARU": "/static/images/alexandra_pacuraru.png",
      "ANA BIRCHALL": "/static/images/ana_birchall.png",
      "CALIN GEORGESCU": "/static/images/calin_georgescu.png",
      "CRISTIAN DIACONESCU": "/static/images/cristian_diaconescu.png",
      "CRISTIAN TERHES": "/static/images/cristian_terhes.png",
      "ELENA LASCONI": "/static/images/elena_lasconi.png",
      "GEORGE SIMION": "/static/images/george_simion.png",
      "KELEMEN HUNOR": "/static/images/kelemen_hunor.png",
      "LUDOVIC ORBAN": "/static/images/ludovic_orban.png",
      "MARCEL CIOLACU": "/static/images/marcel_ciolacu.png",
      "MIRCEA GEOANA": "/static/images/mircea_geoana.png",
      "NICOLAE CIUCA": "/static/images/nicolae_ciuca.png",
      "SEBASTIAN CONTANTIN POPESCU": "/static/images/sebastian_popescu.png",
      "SILVIU PREDOIU": "/static/images/silviu_predoiu.png",
    };

    // Chart data preparation
    let currentResults = filteredResultsTotal;

    const prepareChartData = (results) => {
      const sortedData = Object.entries(results)
        .map(([label, value]) => ({
          label,
          percentage: value,
          image: candidateImages[label] || "/static/images/default.jpg",
        }))
        .sort((a, b) => b.percentage - a.percentage);

      return {
        labels: sortedData.map((item) => item.label),
        percentages: sortedData.map((item) => item.percentage),
        images: sortedData.map((item) => item.image),
      };
    };

    // Render the chart
    const renderChart = (chartData) => {
      const ctx = document.getElementById("chartCanvas").getContext("2d");
      if (window.myChart) {
        window.myChart.destroy();
      }

      window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Vote Percentage",
              data: chartData.percentages,
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(201, 203, 207, 0.6)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(201, 203, 207, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
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
                const y = bar.y - 10;
                ctx.fillText(`${value}%`, x, y);
              });
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Percentage (%)",
              },
            },
          },
        },
      });

      renderCandidatePhotos(
        chartData.labels,
        chartData.images,
        chartData.percentages
      );
    };

    // Render candidate photos below the chart
    const renderCandidatePhotos = (labels, images, percentages) => {
      const photoContainer = document.getElementById("candidatePhotos");
      photoContainer.innerHTML = ""; // Clear previous content
      labels.forEach((label, index) => {
        const photoDiv = document.createElement("div");
        photoDiv.classList.add("candidate");

        const img = document.createElement("img");
        img.src = images[index];
        img.alt = label;

        const name = document.createElement("p");
        name.textContent = label;

        const percentage = document.createElement("p");
        percentage.textContent = `${percentages[index]}%`;
        percentage.style.fontWeight = "bold";

        photoDiv.appendChild(img);
        photoDiv.appendChild(name);
        photoDiv.appendChild(percentage);
        photoContainer.appendChild(photoDiv);
      });
    };

    // Render the initial chart
    const initialChartData = prepareChartData(currentResults);
    renderChart(initialChartData);

    // Badge toggle logic
    const badges = document.querySelectorAll(".badge");
    badges.forEach((badge) => {
      badge.addEventListener("click", (e) => {
        const type = e.target.dataset.type;

        badges.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        if (type === "romania") {
          currentResults = filterResults(filteredResultsRomania);
        } else if (type === "diaspora") {
          currentResults = filterResults(filteredResultsDiaspora);
        } else {
          currentResults = filteredResultsTotal;
        }

        const updatedChartData = prepareChartData(currentResults);
        renderChart(updatedChartData);
      });
    });
  } catch (error) {
    console.error("Error fetching or displaying data:", error);
  }
});
