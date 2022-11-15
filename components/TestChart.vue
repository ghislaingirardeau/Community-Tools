<template>
  <div>
    <Bar
      ref="bar"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
    <!-- DYNAMIC UPDATE DATAS -->
    <div v-for="(value, index) in chartData.datasets[0].data" :key="index">
      <v-slider
        v-model="chartData.datasets[0].data[index]"
        :label="chartData.labels[index]"
        max="100"
        min="0"
        step="5"
      ></v-slider>
    </div>

    <div>
      <Doughnut
        :chart-options="chartOptionsDo"
        :width="300"
        :height="300"
        :chart-data="chartDataDo"
      />
      <!-- DYNAMIC UPDATE DATAS -->
      <div v-for="(item, i) in chartDataDo.datasets[0].data" :key="i">
        <v-slider
          v-model="chartDataDo.datasets[0].data[i]"
          :label="chartDataDo.labels[i]"
          max="300"
          min="0"
          step="30"
        ></v-slider>
      </div>
    </div>
  </div>
</template>

<script>
// BAR AND DOUGHNUT COMPONENT IMPORT AND CREATE INSIDE THE PAGE
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
)

export default {
  components: { Bar, Doughnut },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 200,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March'],
        datasets: [
          {
            label: 'Rain month',
            data: [40, 20, 12],
            backgroundColor: [
              // if want to define one color / each bar
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 4,
          },
        ], // DATA SET WITH OBJECTS => BUT NOT POSSIBLE TO DYNAMICLY CHANGE/RENDER
      },
      chartOptions: {
        responsive: true,
        legend: {
          display: true,
        },
        onClick: (event, clickedElements) => {
          const { dataIndex, raw } = clickedElements[0].element.$context
          const barLabel = event.chart.data.labels[dataIndex]
          console.log(raw, barLabel)
        },
        layout: {
          // LAYOUT TO ADJUST THE SCREEN
          padding: 40,
        },
      },

      chartDataDo: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      chartOptionsDo: {
        responsive: false,
        elements: {
          arc: {
            // DEFINE ARC CONFIG CSS
            borderColor: 'blue',
          },
        },
      },
    }
  },
  methods: {
    updateAmount($event) {
      // to access to the instance and update the charts this.$refs.bar.updateChart()
      console.log(this.$refs.bar)
    },
  },
}
</script>

<style lang="scss" scoped></style>
