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
    <a @click="showMoreCharts = !showMoreCharts" class="link">{{ showMoreCharts ? "Hide charts" : "Show more charts" }}</a>
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
    methods: {
      /**
       * Parses the data and pushes it into the charts.
       * @param {Object} codecData - Data to be parsed.
       */
      parseChartData(data) {               
        const psnrHeader = ['Frame']
        const ssimHeader = ['Frame']
        const vmafHeader = ['Frame']

        data.forEach(codec => {
          psnrHeader.push(codec.codec)
          ssimHeader.push(codec.codec)
          vmafHeader.push(codec.codec)          
        });

        this.psnrData.push(psnrHeader)
        this.ssimData.push(ssimHeader)
        this.vmafData.push(vmafHeader)

        const framesLength = data[0].quality_metrics.psnr.length
        for (let i = 0; i < framesLength; i += 10) {
          const psnrRow = [i]
          const ssimRow = [i]
          const vmafRow = [i]

          data.forEach(codec => {
            const psnr = codec.quality_metrics.psnr
            const ssim = codec.quality_metrics.ssim
            const vmaf = codec.quality_metrics.vmaf

            psnrRow.push(psnr[i].psnr_avg)
            ssimRow.push(ssim[i].ssim_avg)
            vmafRow.push(vmaf[i].vmaf)
          })

          this.psnrData.push(psnrRow)
          this.ssimData.push(ssimRow)
          this.vmafData.push(vmafRow)
        }
      },
    }
  }
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

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
      gap: 25px;

      &--title {
        font-size: 1.1em;
        font-weight: bold;
      }

      &--chart {
        width: 100%;
      }
    }

    @include link(#000);
  }
</style>