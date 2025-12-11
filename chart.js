// chart.js (Dedicated Chart.js Module)

let moodRadarChart = null;

/**
 * Renders the Mood Composition Radar Chart based on recent logs.
 * @param {Array} logs - The full array of logs.
 */
export function renderMoodChart(logs) {
  // This logic is now purely focused on preparing and drawing the chart.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentLogs = logs.filter(
    (log) => new Date(log.timestamp) > thirtyDaysAgo,
  );

  const moodCounts = recentLogs.reduce((acc, log) => {
    acc[log.moodState] = (acc[log.moodState] || 0) + 1;
    return acc;
  }, {});

  const dataPoints = [
    moodCounts['UP'] || 0,
    moodCounts['MIXED'] || 0,
    moodCounts['DOWN'] || 0,
  ];

  const totalLogs = recentLogs.length;
  const dataPercentages = dataPoints.map((count) =>
    totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0,
  );

  const data = {
    labels: [
      'UP (High Energy)',
      'MIXED (Chaotic/Irritable)',
      'DOWN (Low Energy)',
    ],
    datasets: [
      {
        label: `Mood Composition (Last ${totalLogs} Logs)`,
        data: dataPercentages,
        backgroundColor: 'rgba(63, 81, 181, 0.4)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(63, 81, 181, 1)',
        pointBorderColor: '#fff',
      },
    ],
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            callback: function (value) {
              return value + '%';
            },
          },
          pointLabels: {
            font: { size: 14 },
          },
        },
      },
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Mood Composition (%)' },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += `${context.formattedValue}% (${
                dataPoints[context.dataIndex]
              } logs)`;
              return label;
            },
          },
        },
      },
    },
  };

  const ctx = document.getElementById('mood-chart');

  if (moodRadarChart) {
    moodRadarChart.destroy();
  }
  moodRadarChart = new Chart(ctx, config);
}
