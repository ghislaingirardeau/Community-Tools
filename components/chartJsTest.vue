<template>
  <div>
    <h1>Vue charts</h1>
    <v-btn @click="collectionSummary">collectionSummary</v-btn>
    <test-chart />
    <!-- LINE CHART IMPORT AND CREATE BY THE PLUGINS FILES -->
    <line-chart
      :chart-data="chartData"
      :chart-options="chartOptions"
      :width="600"
      :height="500"
    />
    {{ loadProgress }}
    <bar-chart
      :chart-data="barChartData"
      :chart-options="barChartOptions"
      :width="600"
      :height="600"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      allLoans: {},
      chartData: {
        /* labels: ['January', 'February', 'March'], */
        /* datasets: [
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
        ], */
        datasets: [
          // IF RENDER MULTIPLE DATAS
          {
            label: 'Line 1',
            data: {
              January: 35,
              February: 20,
              March: 17,
              april: 30,
              may: 20,
            },
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            hoverBackgroundColor: 'red',
          },
          {
            label: 'Line 2',
            data: {
              January: 15,
              February: 22,
              March: 13,
              april: 27,
              may: 10,
            },
            fill: true,
            borderColor: 'rgb(145, 22, 122)',
            hoverBackgroundColor: 'red',
          },
        ],
      },
      chartOptions: {
        responsive: false,
        legend: {
          display: false,
        },
        onHover: () => {
          // OR onClick OF THE CHART
          console.log('hover the charts')
        },
        // ADD ANIMATION AND TRANSITION
        animations: {
          tension: {
            duration: 3000,
            easing: 'linear',
            from: 0,
            to: 0.5,
            /* loop: true, */
          },
        },
        elements: {
          // CONFIG CSS OF THE LINE
          point: {
            pointStyle: 'triangle',
          },
        },
        scales: {
          x: {
            grid: {
              // Include a dollar sign in the ticks
              borderWidth: 2,
              borderColor: 'white',
            },
            ticks: {
              color: 'white',
            },
          },
          y: {
            grid: {
              // Include a dollar sign in the ticks
              borderWidth: 2,
              borderColor: 'white',
            },
            ticks: {
              color: 'white',
            },
          },
        },

        plugins: {
          // CONFIG LEGEND & EVENT
          title: {
            display: true,
            text: 'my chart',
            color: 'rgb(15, 199, 132)',
            font: {
              size: 24,
            },
          },
          legend: {
            position: 'right',
            display: true,
            labels: {
              color: 'rgb(15, 199, 132)',
            },
            onClick: this.newLegendClickHandler,
          },
          // CONFIG THE TOOLTIP DISPLAY
          tooltip: {
            backgroundColor: 'white',
            titleColor: 'black',
            boxPadding: 10,
            bodyColor: 'black',
            callbacks: {
              labelColor: (context) => {
                return {
                  backgroundColor: context.dataset.borderColor, // RETURN THE SAME COLOR BOX AS THE LINE COLOR
                }
              },
              label: (context) => {
                return 'Datas : ' + context.formattedValue
              },
            },
          },
        },
      },
      barChartData: {
        /* labels: ['January', 'February', 'March'], */
        datasets: [
          {
            label: 'Data collected / village',
            data: {
              'ភូមិក្រេះ-Gres': 0,
              'ភូមិតាង៉ាច-Tangaech': 0,
              'ភូមិកងកុយ-Koy': 0,
              'ភូមិកាន់ឈើង-Kancheung': 0,
              'ភូមិ២-Pii': 0,
              'ភូមិល្អក់-La Ak': 0,
              'ភូមិកាម៉ែន-Kamen': 0,
              'ភូមិសិកស្រែ-Sek Sraay': 0,
              'ភូមិហឺយ-Tahoeuy': 0,
              'ភូមិម៉ឺនថាំង-Meunthang': 0,
              'តាំងម្លូ-Tang Malou': 0,
              'តាំងលោម-Tang Laum': 0,
              Koy: 0,
            },
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 4,
          },
        ], // DATA SET WITH OBJECTS => BUT NOT POSSIBLE TO DYNAMICLY CHANGE/RENDER
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: true,
        },
        layout: {
          // LAYOUT TO ADJUST THE SCREEN
          padding: 40,
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: 'black',
            boxPadding: 10,
            bodyColor: 'black',
            callbacks: {
              labelColor: (context) => {
                return {
                  backgroundColor: context.dataset.borderColor, // RETURN THE SAME COLOR BOX AS THE LINE COLOR
                }
              },
              label: (context) => {
                return 'Datas : ' + context.formattedValue
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
          },
          y: {
            ticks: {
              color: 'white',
            },
          },
        },
      },
      loadProgress: 0,
    }
  },
  computed: {
    ...mapState(['villagesList']),
  },
  methods: {
    // FUNCTION FOR THE LEGEND ONCLICK EVENT
    newLegendClickHandler(e, legendItem, legend) {
      console.log(e, legendItem, legend)
      const index = legendItem.datasetIndex
      const ci = legend.chart
      if (ci.isDatasetVisible(index)) {
        ci.hide(index)
        legendItem.hidden = true
      } else {
        ci.show(index)
        legendItem.hidden = false
      }
    },
    async collectionSummary() {
      let count = 0
      const numberVillage = this.villagesList.length
      for (const index of this.villagesList) {
        count++
        const messageRef = this.$fire.firestore.collection(index)
        try {
          const messageDoc = await messageRef
            .where('shareAgreement', '==', true)
            .get()
          index === 'Koy'
            ? (this.allLoans.testKoy = messageDoc.docs.length)
            : (this.allLoans[index] = messageDoc.docs.length)
          this.loadProgress = ((count / numberVillage) * 100)
            .toFixed(2)
            .toString()
            .concat('%')
        } catch (error) {
          console.log(error)
        }
      }
      this.barChartData.datasets[0].data = this.allLoans
      console.log(this.barChartData)
    },
  },
}
</script>

<style lang="scss" scoped></style>
