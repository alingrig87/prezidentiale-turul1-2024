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

      // Destroy the previous chart instance if it exists
      if (window.myChart) {
        window.myChart.destroy();
      }

      // Map candidate names to their specific background and border colors
      const candidateColors = {
        "ELENA LASCONI": {
          background: "rgba(0, 100, 255, 0.8)", // Blue
          border: "rgba(255, 0, 0, 0.8)", // Red border
        },
        "CALIN GEORGESCU": {
          background: "rgba(0, 0, 0, 0.4)", // White
          border: "rgba(0, 0, 0, 1)", // Black border
        },
        "MARCEL CIOLACU": {
          background: "rgba(255, 0, 0, 0.3)", // Red
          border: "rgba(255, 0, 0, 1)", // Red border
        },
        "NICOLAE CIUCA": {
          background: "rgba(255, 255, 0, 0.7)", // Yellow
          border: "rgba(0, 0, 255, 0.8)", // Blue border
        },
        "GEORGE SIMION": {
          background: "rgba(0, 0, 0, 0.8)", // Black
          border: "rgba(255, 215, 0, 0.8)", // Gold border
        },
        "MIRCEA GEOANA": {
          background: "rgba(135, 206, 250, 0.7)", // Light Blue
          border: "rgba(135, 206, 250, 1)", // Light Blue  border
        },
        "ANA BIRCHALL": {
          background: "rgba(255, 99, 132, 0.8)", // Pink
          border: "rgba(255, 69, 0, 1)", // Orange Red border
        },
        "CRISTIAN DIACONESCU": {
          background: "rgba(75, 192, 192, 0.8)", // Teal
          border: "rgba(0, 128, 128, 1)", // Dark Teal border
        },
        "CRISTIAN TERHES": {
          background: "rgba(153, 102, 255, 0.8)", // Purple
          border: "rgba(128, 0, 128, 1)", // Dark Purple border
        },
        "KELEMEN HUNOR": {
          background: "rgba(34, 139, 34, 0.8)", // Forest Green
          border: "rgba(0, 100, 0, 1)", // Dark Green border
        },
        "LUDOVIC ORBAN": {
          background: "rgba(255, 140, 0, 0.8)", // Dark Orange
          border: "rgba(255, 69, 0, 1)", // Orange Red border
        },
        "ALEXANDRA PACURARU": {
          background: "rgba(240, 128, 128, 0.8)", // Light Coral
          border: "rgba(255, 99, 71, 1)", // Tomato border
        },
        "SEBASTIAN CONTANTIN POPESCU": {
          background: "rgba(220, 20, 60, 0.8)", // Crimson
          border: "rgba(139, 0, 0, 1)", // Dark Red border
        },
        "SILVIU PREDOIU": {
          background: "rgba(47, 79, 79, 0.8)", // Dark Slate Gray
          border: "rgba(0, 0, 0, 1)", // Black border
        },
      };

      // Default colors for unspecified candidates
      const defaultColors = {
        background: "rgba(201, 203, 207, 0.6)", // Gray background
        border: "rgba(201, 203, 207, 1)", // Gray border
      };

      // Assign background and border colors dynamically
      const barColors = chartData.labels.map(
        (label) =>
          candidateColors[label]?.background || defaultColors.background
      );
      const borderColors = chartData.labels.map(
        (label) => candidateColors[label]?.border || defaultColors.border
      );

      // Calculate bar and image size dynamically
      const calculateBarThickness = () => {
        const chartWidth = ctx.canvas.parentElement.offsetWidth; // Parent container's width
        const barThickness = chartWidth / chartData.labels.length; // Dynamic bar size
        return Math.min(barThickness, 50); // Cap the bar size at 50px max
      };

      const barThickness = calculateBarThickness();

      // Create the Chart.js bar chart
      window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels, // Candidate names
          datasets: [
            {
              label: "Vote Percentage",
              data: chartData.percentages, // Candidate percentages
              backgroundColor: barColors, // Fill colors
              borderColor: borderColors, // Border colors
              borderWidth: 4, // Bar border width
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false, // Hide legend
            },
            afterDatasetsDraw: (chart) => {
              const ctx = chart.ctx;
              ctx.font = "bold 16px Arial"; // Font style for percentages
              ctx.fillStyle = "black"; // Text color
              ctx.textAlign = "center"; // Center-align text
              ctx.textBaseline = "middle"; // Vertically align text in the middle

              // Draw percentage on top of each bar
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
              beginAtZero: true, // Start y-axis at 0
              title: {
                display: true, // Show y-axis title
                text: "Percentage (%)", // Title text
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

        const nameContainer = document.createElement("div");
        nameContainer.style.display = "flex";
        nameContainer.style.flexDirection = "column";
        nameContainer.style.alignItems = "center";

        const [firstName, lastName] = label.split(" "); // Split name into first and last
        const firstNameEl = document.createElement("p");
        firstNameEl.textContent = firstName;
        firstNameEl.style.margin = "0";

        const lastNameEl = document.createElement("p");
        lastNameEl.textContent = lastName;
        lastNameEl.style.margin = "0";

        nameContainer.appendChild(firstNameEl);
        nameContainer.appendChild(lastNameEl);

        const percentage = document.createElement("p");
        percentage.textContent = `${percentages[index]}%`;
        percentage.style.fontWeight = "bold";

        photoDiv.appendChild(img);
        photoDiv.appendChild(nameContainer);
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
