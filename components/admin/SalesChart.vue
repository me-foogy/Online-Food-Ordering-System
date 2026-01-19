<template>
  <div class="w-[99%] mx-auto mt-10">
      <h1 class="text-md lg:text-2xl font-bold mb-6">Sales And Customer Chart</h1>
      <canvas ref="myChart"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Chart from 'chart.js/auto'

  const myChart = ref<HTMLCanvasElement | null>(null)

  // 24-hour labels
  const hourlyLabels = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  )

  // Example data
  const hourlyRevenue = [
    0, 500, 200, 800, 1200, 1500, 1800, 2000, 2200, 2500,
    2800, 3000, 3200, 3500, 3700, 4000, 4200, 4500, 4800, 5000,
    5200, 5500, 5700, 6000
  ]

  const hourlyCustomers = [
    0, 1, 0, 2, 3, 5, 4, 6, 5, 7,
    8, 6, 5, 7, 8, 9, 10, 8, 7, 9,
    10, 11, 9, 12
  ]

  onMounted(() => {
    if (!myChart.value) return

    new Chart(myChart.value, {
      type: 'line',
      data: {
        labels: hourlyLabels,
        datasets: [
          {
            label: 'Revenue (Rs)',
            data: hourlyRevenue,
            borderColor: '#3b82f6',
            backgroundColor: '#93c5fd',
            yAxisID: 'yRevenue',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Customers',
            data: hourlyCustomers,
            borderColor: '#10b981',
            backgroundColor: '#6ee7b7',
            yAxisID: 'yCustomers',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          yRevenue: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Revenue (Rs)' }
          },
          yCustomers: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: 'Customers' },
            grid: { drawOnChartArea: false } // prevent overlapping
          },
          x: { title: { display: true, text: 'Hour of Day' } }
        }
      }
    })
  })
</script>
