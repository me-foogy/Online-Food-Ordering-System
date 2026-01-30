<template>
  <div class="w-[99%] mx-auto mt-10">
      <h1 class="text-md lg:text-2xl font-bold mb-6">Sales And Customer Chart</h1>
      <canvas ref="myChart"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import Chart from 'chart.js/auto'
  import type { Chart as ChartType } from 'chart.js/auto'

  const myChart = ref<HTMLCanvasElement | null>(null)
  let chartInstance: ChartType | null = null

  // 24-hour labels
  const hourlyLabels = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  )

  const props = defineProps<{
    hourlyRevenue: Array<number>
    hourlyCustomers: Array<number>
  }>();
  

  onMounted(() => {
    if (!myChart.value) return

    chartInstance = new Chart(myChart.value, {
      type: 'line',
      data: {
        labels: hourlyLabels,
        datasets: [
          {
            label: 'Revenue (Rs)',
            data: props.hourlyRevenue,
            borderColor: '#3b82f6',
            backgroundColor: '#93c5fd',
            yAxisID: 'yRevenue',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Customers',
            data: props.hourlyCustomers,
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
  watch([() => props.hourlyRevenue, () => props.hourlyCustomers], (
    [newRevenue, newCustomers]) => {
    if (chartInstance &&  chartInstance.data.datasets[0] && chartInstance.data.datasets[1]) {
      chartInstance.data.datasets[0].data = newRevenue
      chartInstance.data.datasets[1].data = newCustomers
      chartInstance.update()
    }
  }, { deep: true })
</script>
