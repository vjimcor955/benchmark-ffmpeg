<template>
  <div class="results">
    <!-- navbar to choose codec -->
    <div class="results__header">
      <div class="navbar">
        <a @click="codecSelector" class="navbar__button selected">Codec 1</a>
        <a v-if="codecs >= 2" @click="codecSelector" class="navbar__button">Codec 2</a>
        <a v-if="codecs == 3" @click="codecSelector" class="navbar__button">Codec 3</a>
      </div>
      <RouterLink :to="{name: 'video-player'}" class="results__header--router_link secondary_button" v-if="showButton">Compare videos</RouterLink>
    </div>
    <!-- info about the codec -->
    <div class="data_codec">
      <h1 class="data_codec__title"> Codec: {{ results[codecSelected].codec }} | Video: {{ results[codecSelected].filename }}</h1>
      <!-- Table with general info about a codec process -->
      <div class="data_codec__info">
        <GeneralTable :codecData="results[codecSelected]" class="data_codec__info--table"/>
        <div class="data_codec__info--size">
          <p class="data_codec__info--size__title">File size:</p>
          <p class="data_codec__info--size__number">{{ results[codecSelected].size }} MB</p>
        </div>
      </div>
      <!-- Charts with all the codecs quality metrics -->
      <div class="data_codec__charts">
        <MetricsCharts :codecData="results"/>
      </div>
    </div>
  </div>
</template>


<script>
  import GeneralTable from '../components/GeneralTable.vue'
  import MetricsCharts from '../components/MetricsCharts.vue'
  import axios from 'axios'
  import { useVideoStore } from '../stores/videoStore.js'
  import { useAuthStore } from '../stores/authStore.js'

  export default {
    name: 'ResultsView',
    data() {
      return {
        results: useVideoStore().resultsList,
        codecs: 0,
        codecSelected: 0,
        showButton: false
      }
    },
    components: {
      GeneralTable,
      MetricsCharts
    },
    props: {
      upload: {
        type: String,
        default: false
      }
    },
    created() {
      this.displayNavBar()
      this.handleButton()
      this.handleUploadResults(this.upload)
    },
    methods: {
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
       * Displays the 'Compare videos' button if there are more than one codec.
       */
      handleButton() {
        if (this.codecs > 1) {
          this.showButton = true
        }
      },
      /**
       * Handles the upload of the results to the API.
       * @param {String} upload - The upload status.
       */
      handleUploadResults(upload) {
        if (upload === 'true') {
          this.uploadResults(this.results)
        }
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
      /**
       * Uploads the results to the API.
       * @param {Array} results - The results to be uploaded.
       * @returns {Array} - The responses from the API.
       */
      async uploadResults(results) {
        const promises = results.map(result => {
          const resultVideo = {
            name: result.filename,
            size: result.size,
            codec: result.codec,
            videoId: useVideoStore().videoId
          }
          return axios.post('https://ffmpeg-benckmark-api-646aff7ac349.herokuapp.com/api/result/video', resultVideo, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${useAuthStore().user.token}`
            }
          }).then(response => response.data)
            .catch(error => console.error("ERROR: ", error))
        })
        const responses = await Promise.all(promises)
        return responses
      }
    },
  }
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .results {
    min-height: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 40px;
    margin: 50px;
    
    &__header {
      width: 70vw;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      &--router_link {
        position: absolute;
        right: 15vw;
      }

      @include secondary_button($accent_color, -100%); 
    }
    
    .data_codec {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 65vw;
      height: fit-content;
      gap: 50px;
      padding: 50px;
      background-color: $components_color;
      box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
      
      &__title {
        font-size: 1.7rem;
        font-weight: bolder;
      }
      
      &__info {
        width: 80%;
        display: flex;
        align-items: center;
        
        &--table {
          width: 65%;
        }
        
        &--size {
          width: 35%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          
          &__title {
            font-weight: bold;
            font-size: 1.2em;
          }
          
          &__number {
            font-weight: bold;
            font-size: 1.4em;
          }
        }
      }

      &__charts {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;        
      }
    }
  }

  @media (max-width: 1400px) {
    .results {
      
      &__header {
        width: 90vw;
        flex-direction: column;
        gap: 20px;

        &--router_link {
          position: relative;
          right: auto;
        }
      }
    }
  }

  @media (max-width: 1200px) {
    .results {
      margin: 20px;

      .data_codec {
        width: 90vw;
        padding: 20px;
        gap: 30px;

        &__title {
          font-size: 1.4rem;
        }

        &__info {
          flex-direction: column;
          width: 100%;
          gap: 25px;

          &--table, &--size {
            width: 100%;
          }

          &--size {
            gap: 20px;
          }
        }

        &__charts {
          width: 100%;
          text-align: center;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .results {
    margin: 50px 20px;

      &__header {
        width: 100%;
        flex-direction: column;
        gap: 20px;

        &--router_link {
          position: relative;
          right: auto;
        }
      }

      .data_codec {
        width: 100%;
        padding: 10px;
        gap: 20px;

        &__title {
          font-size: 1.2rem;
        }

        &__info {
          flex-direction: column;
          width: 75%;

          &--table, &--size {
            width: 100%;
          }
        }

        &__charts {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
</style>
