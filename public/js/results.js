document.addEventListener('DOMContentLoaded', function () {
  const chartColors = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#20c997'];
  const charts = JSON.parse(document.getElementById('resultsCharts').dataset.results);

  const buildOptions = function (isPieChart) {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: isPieChart } }
    };

    if (!isPieChart) {
      options.scales = { y: { beginAtZero: true, ticks: { precision: 0 } } };
    }

    return options;
  };

  charts.forEach(function (chart) {
    const isPieChart = chart.type === 'single-choice';

    new Chart(document.getElementById('chart-' + chart.id), {
      type: isPieChart ? 'pie' : 'bar',
      data: {
        labels: chart.labels,
        datasets: [{
          label: 'Responses',
          data: chart.counts,
          backgroundColor: chart.labels.map(function (label, index) {
            return chartColors[index % chartColors.length];
          })
        }]
      },
      options: buildOptions(isPieChart)
    });
  });
});
