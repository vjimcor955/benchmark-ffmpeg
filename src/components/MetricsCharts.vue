<template>
  <div class="data_charts">
    <div class="data_charts__metric">
      <p class="data_charts__metric--title">VMAF per frame - Higher scores suggest better overall perceived quality</p>
      <GChart class="data_charts__metric--chart"
        type="LineChart"
        :data="vmafData"
        :options="chartOptions"
      />
    </div>
    <a @click="showMoreCharts = !showMoreCharts" class="show_charts">{{ showMoreCharts ? "Hide charts" : "Show more charts" }}</a>
    <div v-if="showMoreCharts" class="more_charts">
      <div class="data_charts__metric">
        <p class="data_charts__metric--title">SSIM per frame - Higher values indicate better structural similarity between images</p>
        <GChart class="data_charts__metric--chart"
          type="LineChart"
          :data="ssimData"
          :options="chartOptions"
        />
      </div>
      <div class="data_charts__metric">
        <p class="data_charts__metric--title">PNSR per frame - Higher values imply better quality</p>
        <GChart class="data_charts__metric--chart"
          type="LineChart"
          :data="psnrData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>


<script>
  import { GChart } from 'vue-google-charts'

  export default {
    name: 'MetricsCharts',
    data() {
      return {
        chartOptions: {
          chart: {
            title: 'FFmpeg Quality Metrics',
            subtitle: 'Metrics',
          }
        },
        showMoreCharts: false,
        psnrData: [],
        ssimData: [],
        vmafData: [],
      }
    },
    components: {
      GChart
    },
    props: {
      codecData: {
        type: Object,
        required: true
      }
    },
    created() {
      this.parseChartData(this.codecData)
    },
    watch: {
      codecData() {
        this.parseChartData(this.codecData)
      }
    },
    methods: {
      /**
       * Parses the data and pushes it into the charts.
       * @param {Object} codecData - Data to be parsed.
       */
      parseChartData(data) {   
        this.psnrData = []
        this.ssimData = []
        this.vmafData = []
        
        const psnrHeader = ['Frame']
        const ssimHeader = ['Frame']
        const vmafHeader = ['Frame']

        psnrHeader.push(data.codec)
        ssimHeader.push(data.codec)
        vmafHeader.push(data.codec)

        this.psnrData.push(psnrHeader)
        this.ssimData.push(ssimHeader)
        this.vmafData.push(vmafHeader)

        const framesLength = data.quality_metrics.psnr.length
        for (let i = 0; i < framesLength; i += 10) {
          const psnrRow = [i]
          const ssimRow = [i]
          const vmafRow = [i]

          const psnr = data.quality_metrics.psnr
          const ssim = data.quality_metrics.ssim
          const vmaf = data.quality_metrics.vmaf

          psnrRow.push(psnr[i].psnr_avg)
          ssimRow.push(ssim[i].ssim_avg)
          vmafRow.push(vmaf[i].vmaf)

          this.psnrData.push(psnrRow)
          this.ssimData.push(ssimRow)
          this.vmafData.push(vmafRow)
        }
      },
    }
  }
</script>


<style lang="scss">
  .data_charts, .more_charts {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 60px;

    &__metric {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;

      &--title {
        font-size: 1.1em;
        font-weight: bold;
      }

      &--chart {
        width: 100%;
      }
    }

    .show_charts {
      width: fit-content;
      cursor: pointer;
      text-decoration: underline;
      padding: 15px;
      border-radius: 5px;
      
    }
    .show_charts:hover {
      background-color: #f0f0f0;
    }
  }
</style>