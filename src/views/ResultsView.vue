<template>
  <div class="results">
    <h1>RESULTS</h1>
    <div class="data">
      <div class="data__codec" v-for="(result) in results">
        {{ parseDataTable(result.quality_metrics.global) }}
        <p class="data__codec--title">{{ result.codec }}</p>
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
              <p class="data__codec--info__size--title">File size: </p>
              <p class="data__codec--info__size--size">undefined</p>
            </div>
          </div>
          <div class="charts">
            {{ parseChartData(result.quality_metrics) }}
            <GChart
              type="LineChart"
              :data="psnrData"
              :options="chartOptions"
            />
            <GChart
              type="LineChart"
              :data="ssimData"
              :options="chartOptions"
            />
            <GChart
              type="LineChart"
              :data="vmafData"
              :options="chartOptions"
            />
          </div>
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
      }
    },
    components: {
      GChart
    },
    methods: {
      parseDataTable(codecData) {
        this.tableData = []
        const psnr = codecData.psnr.mse_avg
        const ssim = codecData.ssim.ssim_avg
        const vmaf = codecData.vmaf.vmaf
        this.tableData.push(["PSNR", psnr.average, psnr.max, psnr.median, psnr.min, psnr.stdev])
        this.tableData.push(["SSIM", ssim.average, ssim.max, ssim.median, ssim.min, ssim.stdev])
        this.tableData.push(["VMAF", vmaf.average, vmaf.max, vmaf.median, vmaf.min, vmaf.stdev])
      },
      parseChartData(codecData) {
        this.psnrData = [
          ['Frame', 'PSNR']
        ]
        this.ssimData = [
          ['Frame', 'SSIM']
        ]
        this.vmafData =  [
          ['Frame', 'VMAF']
        ]

        const psnr = codecData.psnr
        const ssim = codecData.ssim
        const vmaf = codecData.vmaf

        for (let i = 0; i < psnr.length; i += 10) {
          this.psnrData.push([i, psnr[i].psnr_avg])
        }
        for (let i = 0; i < ssim.length; i += 10) {
          this.ssimData.push([i, ssim[i].ssim_avg])
        }
        for (let i = 0; i < vmaf.length; i += 10) {
          this.vmafData.push([i, vmaf[i].vmaf])
        }
      }
    },
  }
</script>


<style lang="scss">
  .results {
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    h1 {
      margin-top: 20px;
      font-size: 1.5rem;
      text-align: center;
      font-weight: bold;
    }

    .data {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80vw;
      height: fit-content;
      // border: 1px solid #000;
      gap: 20px;

      &__codec {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        border: 1px solid #000;


        &--title {
          font-size: 1.5rem;
          font-weight: bold;
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

          .charts {
            width: 100%;
          }
        }
      }
    }
  }

</style>
