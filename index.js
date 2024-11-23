// Datele primite
const data = {
    labels: ['ELENA LASCONI', 'GEORGE SIMION', 'CALIN GEORGESCU', 'MARCEL CIOLACU', 'NICOLAE CIUCA', 'ALTII'],
    datasets: [{
        label: 'Procentaj (%)',
        data: [31.32, 22.86, 14.79, 11.44, 6.29, 13.3],
        backgroundColor: [
            'rgba(75, 192, 192, 0.6)', // Culoare pentru fiecare bară
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(201, 203, 207, 0.6)'
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(201, 203, 207, 1)'
        ],
        borderWidth: 1
    }]
};

// Configurarea graficului
const config = {
    type: 'bar', // Tipul graficului
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y}%`;
                    }
                }
            },
            // Adăugăm valori direct pe bare
            datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (value) => `${value}%`
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Procentaj (%)'
                },
                ticks: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    },
    plugins: [ChartDataLabels] // Plugin pentru afișarea datelor pe bare
};

// Adăugăm scriptul pentru datalabels (necesar pentru text pe bare)
const scriptDatalabels = document.createElement('script');
scriptDatalabels.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels';
scriptDatalabels.onload = () => {
    const ctx = document.getElementById('voteChart').getContext('2d');
    new Chart(ctx, config);
};
document.body.appendChild(scriptDatalabels);
