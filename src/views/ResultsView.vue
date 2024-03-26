<template>
  <div class="results">
    <!-- navbar to choose codec -->
    <div class="results__navbar">
      <a @click="codecSelector" class="results__navbar--codec selected">Codec 1</a>
      <a v-if="codecs >= 2" @click="codecSelector" class="results__navbar--codec">Codec 2</a>
      <a v-if="codecs == 3" @click="codecSelector" class="results__navbar--codec">Codec 3</a>
    </div>
    <!-- Table with general info about a codec process -->
    <div class="data">
      <div class="data__codec">
        {{ parseDataTable(results[codecSelected].quality_metrics.global) }}
        <p class="data__codec--title">{{ results[codecSelected].codec }}</p>
        <div class="data__codec--info">
          <div class="data__codec--info__table">
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Average</th>
                  <th>Max</th>
                  <th>Median</th>
                  <th>Min</th>
                  <th>Stdev</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(metric, index) in tableData">
                  <td>{{ metric[0] }}</td>
                  <td>{{ metric[1] }}</td>
                  <td>{{ metric[2] }}</td>
                  <td>{{ metric[3] }}</td>
                  <td>{{ metric[4] }}</td>
                  <td>{{ metric[5] }}</td>
                </tr>
              </tbody>
            </table>
            <div class="data__codec--info__size">
              <p class="data__codec--info__size--title">File size:</p>
              <p class="data__codec--info__size--size">{{ results[codecSelected].size }} MB</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Charts with all the codecs quality metrics -->
      <div class="data__charts">
        <div v-if="dataLoaded" class="data__charts--chart">
          <p class="data__charts--chart__title">VMAF - Higher scores suggest better overall perceived quality</p>
          <GChart
            type="LineChart"
            :data="vmafData"
            :options="chartOptions"
          />
        </div>
        <div v-if="dataLoaded" class="data__charts--chart">
          <p class="data__charts--chart__title">SSIM - Higher values indicate better structural similarity between images</p>
          <GChart
            type="LineChart"
            :data="ssimData"
            :options="chartOptions"
          />
        </div>
        <div v-if="dataLoaded" class="data__charts--chart">
          <p class="data__charts--chart__title">PNSR - Higher values imply better quality</p>
          <GChart
            type="LineChart"
            :data="psnrData"
            :options="chartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import useVideoStore from '../stores/videoStore.js'
  import { GChart } from 'vue-google-charts'

  export default {
    name: 'ResultsView',
    data() {
      return {
        results: useVideoStore().getResults(),
        tableData: [],
        psnrData: [],
        ssimData: [], 
        vmafData: [],
        chartOptions: {
          chart: {
            title: 'FFmpeg Quality Metrics',
            subtitle: 'Metrics',
          }
        },
        dataLoaded: false,
        codecs: 0,
        codecSelected: 0,
      }
    },
    components: {
      GChart
    },
    created() {
      this.displayNavBar()
      this.parseChartData()
      console.log("RESULTS", this.results)
    },
    methods: {
      /**
       * Parses the data and pushes it into the table.
       * @param {Object} codecData - Data to be parsed.
       */
      parseDataTable(codecData) {
        this.tableData = []

        const psnr = codecData.psnr.mse_avg
        const ssim = codecData.ssim.ssim_avg
        const vmaf = codecData.vmaf.vmaf

        this.tableData.push(["PSNR", psnr.average, psnr.max, psnr.median, psnr.min, psnr.stdev])
        this.tableData.push(["SSIM", ssim.average, ssim.max, ssim.median, ssim.min, ssim.stdev])
        this.tableData.push(["VMAF", vmaf.average, vmaf.max, vmaf.median, vmaf.min, vmaf.stdev])
      },
      /**
       * Parses the data and pushes it into the charts.
       * @param {Object} codecData - Data to be parsed.
       */
      parseChartData() {       
        const psnrHeader = ['Frame']
        const ssimHeader = ['Frame']
        const vmafHeader = ['Frame']

        this.results.forEach(codec => {
          psnrHeader.push(codec.codec)
          ssimHeader.push(codec.codec)
          vmafHeader.push(codec.codec)
        });

        this.psnrData.push(psnrHeader)
        this.ssimData.push(ssimHeader)
        this.vmafData.push(vmafHeader)

        const framesLength = this.results[0].quality_metrics.psnr.length
        for (let i = 0; i < framesLength; i += 10) {
          const psnrRow = [i]
          const ssimRow = [i]
          const vmafRow = [i]

          this.results.forEach(codec => {
            const psnr = codec.quality_metrics.psnr
            const ssim = codec.quality_metrics.ssim
            const vmaf = codec.quality_metrics.vmaf
            psnrRow.push(psnr[i].psnr_avg)
            ssimRow.push(ssim[i].ssim_avg)
            vmafRow.push(vmaf[i].vmaf)
          });

          this.psnrData.push(psnrRow)
          this.ssimData.push(ssimRow)
          this.vmafData.push(vmafRow)
        }

        this.dataLoaded = true
      },
      /**
       * Displays the navigation bar buttons.
       * Increments the 'codecs' count for each codec in the 'results' array.
       */
      displayNavBar() {
        this.results.forEach(codec => {
          this.codecs++
        })
      },

      /**
       * Handles the selection of a codec.
       * @param {Event} e - The event object representing the click event.
       */
      codecSelector(e) {
        // Link is disabled after being clicked
        if (e.target.classList.contains('selected')) {
          return;
        }
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
          e.target.parentNode.children[i].classList.remove('selected');
        }
        e.target.classList.add('selected');
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
          if (e.target.parentNode.children[i].classList.contains('selected')) {
            this.codecSelected = i
          }
        }
      },
    },
  }
</script>


<style lang="scss">
  .results {
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 20px;

    &__navbar {
      display: flex;
      flex-direction: row;
      gap: 20px;

      a {
        font-size: 1.1em;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        border: #000 1px solid;
      }
      a:hover {
        background-color: #f0f0f0;
      }
      a.selected {
        text-decoration: underline;
      }
    }

    .data {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80vw;
      height: fit-content;
      gap: 20px;
      box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);

      &__codec {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        &--title {
          font-size: 1.5rem;
          font-weight: bolder;
          padding: 15px;
        }

        &--info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          &__table {
            width: 80%;
            display: flex;
            gap: 5%;
            text-align: center;

            table {
              width: 65%;
              border-collapse: collapse;

              th {
                align-items: center;
                border: 1px solid #000;
                padding: 10px;
                font-weight: bold;
              }

              td {
                align-items: center;
                border: 1px solid #000;
                padding: 10px;
              }
            }

          }

          &__size {
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 30px;

            &--title {
              font-weight: bold;
              font-size: 1.2em;
            }

            &--size {
              font-weight: bold;
              font-size: 1.5em;
            }
          }
        }
      }

      &__charts {
        width: 100%;
        align-items: center;

        &--chart {
          width: 100%;
          text-align: center;

          &__title {
            font-size: 1.1em;
            font-weight: bold;
          }
        }
      }
    }
  }

</style>
