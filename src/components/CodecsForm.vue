<template>
  <div class="codec">
    <form class="codec__form">
      <h2>Write the video codecs:</h2>
      <div class="codec__form--fields">
        <div class="codec__form--fields--input">
          <label for="codec1">Codec 1:</label>
          <input v-model="codec1" type="text" id="codec1">
        </div>
        <div v-if="showCodec2" class="codec__form--fields--input">
          <label for="codec2">Codec 2:</label>
          <input v-model="codec2" type="text" id="codec2">
          <a @click="deleteField" id="codec2" class="delete_field">X</a>
        </div>
        <div v-if="showCodec3" class="codec__form--fields--input">
          <label for="codec3">Codec 3:</label>
          <input v-model="codec3" type="text" id="codec3">
          <a @click="deleteField" id="codec3" class="delete_field">X</a>
        </div>
      </div>
      <a v-if="!showCodec2" @click="showCodec2 = !showCodec2" class="add_codec link">Add Codec</a>
      <a v-if="showCodec2 && !showCodec3" @click="showCodec3 = !showCodec3" class="add_codec link">Add Codec</a>
      <input type="submit" value="Run codecs tests" @click="runCodecsTests" :disabled="buttonDisabled" class="primary_button">
    </form>
    <div v-if="loading" class="loading">
      <Loader />
      <div class="loading__content">
        <p class="loading__content--message">Processing video...</p>
        <p class="loading__content--timer">{{ stopwatchTime }}</p>
      </div>
    </div>
  </div>
</template>


<script>
  import axios from 'axios'
  import { useVideoStore } from '../stores/videoStore.js'
  import { useAuthStore } from '../stores/authStore.js'
  import Loader from '../components/Loader.vue';

  export default {
    name: 'CodecsForm',
    data() {
      return {
        codec1: '',
        codec2: '',
        codec3: '',
        showCodec2: false,
        showCodec3: false,
        buttonDisabled: true,
        loading: false,
        stopwatchInterval: null,
        stopwatchTime: '00:00:00',
        resultVideo: {
          sourceVideoPath: '',
          outputName: '',
        }
      }
    },
    components: {
      Loader
    },
    created() {
      this.loading = false,
      useVideoStore().resetResults(),
      this.codec1 = '',
      this.codec2 = '',
      this.codec3 = ''
    },
    props: {
      video: {
        type: null,
        required: true
      }
    },
    watch: {
      codec1() {
        this.handleButton();
      },
      video() {
        this.handleButton();
      },
    },
    methods: {
      /**
       * Runs the tests for the written codecs.
       * @param {Event} e - The event object.
       * @returns {Promise<void>}
       */
      async runCodecsTests(e) {
        e.preventDefault()
        this.buttonDisabled = true
        this.loading = true

        // stopwatch since button is pressed
        const startTime = Date.now();
        this.stopwatchInterval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');
          const minutes = Math.floor((elapsedTime / 1000 / 60) % 60).toString().padStart(2, '0');
          const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24).toString().padStart(2, '0');
          this.stopwatchTime = `${hours}:${minutes}:${seconds}`;
        }, 1000);

        // Upload video
        await this.uploadVideo()

        const allCodecs = [this.codec1, this.codec2, this.codec3]
        const promises = allCodecs.map(codec => {
          if (codec != '') {
            return this.codecTest(codec).then((response) => {
              // Assign data to PiniaStore
              useVideoStore().setResults(response)
            })
          } 
        })

        Promise.all(promises).then(() => {
          clearInterval(this.stopwatchInterval)
          this.stopwatchTime = 'Loading results...'
          setTimeout(() => {
            // Redirect to results page
            this.$router.push({ name: 'results', params: { upload: true } })
          }, 2000)
        })
      },
      /**
       * Sends a POST request to upload the video file to the server.
       * @returns {Promise<void>} - A promise that resolves when the request is completed.
       */
      async uploadVideo() {
        const uploadVideo = {
          video: this.video,
          name: this.video.name,
          size: this.video.size,
          type: this.video.type,
          user_id: useAuthStore().user.id
        }
        try {
          const response = await axios.post('https://ffmpeg-benckmark-api-646aff7ac349.herokuapp.com/api/upload/video', uploadVideo, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${useAuthStore().user.token}`
            }
          })
          useVideoStore().setVideoId(response.data.id)
          return response.data
        } catch (error) {
          console.error("ERROR: ", error)
        }
      },
      /**
       * Handles the codec tests.
       * @param {string} codec - The codec to test.
       * @returns {Promise<Object>} - A promise that resolves with the metrics of the codec test.
       */
      async codecTest(codec) {
        const resultVideo = await this.ffmpegCommand(codec)
        const metrics = await this.getMetrics(resultVideo)
        console.log(`--- METRICS (${codec}): `, metrics)
        return metrics
      },
      /**
       * Sends a POST request to the server to run the ffmpeg command.
       * @param {string} codec - The codec to test.
       * @returns {Promise<Object>} - A promise that resolves with the result video.
       */
      async ffmpegCommand(codec) {
        const processVideo = new FormData()
        processVideo.append('video', this.video)
        try {
          const response = await axios.post('http://localhost:3030/codecs', processVideo, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${useAuthStore().user.token}`,
              'codec': codec,
              'input': this.video.name
            }
          })
          const resultVideo = {
            sourceVideoPath: response.data.sourceVideoPath,
            outputName: response.data.outputName,
            codec: codec
          }
          return resultVideo
        } catch (error) {
          console.error("ERROR: ", error)
        }
      },
      /**
       * Sends a POST request to the server to get the metrics of the result video.
       * @param {Object} resultVideo - The result video object.
       * @returns {Promise<Object>} - A promise that resolves with the metrics of the result video.
       */
      async getMetrics(resultVideo) {
        try {
          const response = await axios.post('http://localhost:3030/metrics', resultVideo, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${useAuthStore().user.token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error("ERROR: ", error);
        }
      },
      /**
       * Handles the button state.
       */
      handleButton() {
        if (this.codec1 != '' && this.video != null) {
          this.buttonDisabled = false
        } else {
          this.buttonDisabled = true
        }
      },
      /**
       * Deletes a codec field.
       * @param {Event} e - The event object.
       */
      deleteField(e) {
        if (e.target.id === 'codec2') {
          this.showCodec2 = false
          this.codec2 = ''
        } else if (e.target.id === 'codec3') {
          this.showCodec3 = false
          this.codec3 = ''
        }
      }
    }
  }
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .codec {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__form {
      display: flex;
      width: 40vw;
      padding: 50px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 40px;
      
      h2 {
        font-size: 1.2rem;
        text-align: center;
        font-weight: bold;
      }
      
      &--fields {
        width: 550px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        
        &--input {
          width: 100%;
          display: flex;
          gap: 15px;
          align-items: center;
        
          label {
            font-size: 1.1em;
          }
          
          input[type="text"] {
            width: 70%;
            font-size: 1.1em;
            padding: 10px;
            border: 1px solid #000;
            border-radius: 5px;
          }
          
          .delete_field {
            cursor: pointer;
            padding: 10px;
            border-radius: 50%;
          }
          .delete_field:hover {
            font-weight: 900;
          }
        }
      }

      @include link(#000);
      @include primary-button($accent_color);
    }
  }

  @media (max-width: 768px) {
    .codec {
      &__form {
        width: 100%;
        padding: 20px;
        gap: 30px;

        &--fields {
          width: 95%;
          gap: 15px;

          &--input {
            gap: 10px;

            label {
              font-size: 1rem;
            }

            input[type="text"] {
              width: 80%;
              font-size: 1rem;
              padding: 8px;
            }
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .codec {
      &__form {
        width: 100%;
        padding: 15px;
        gap: 20px;

        &--fields {
          width: 95%;
          gap: 10px;

          &--input {
            gap: 8px;

            label {
              font-size: 0.9rem;
            }

            input[type="text"] {
              width: 80%;
              font-size: 0.9rem;
              padding: 6px;
            }
          }
        }
      }
    }
  }
</style>