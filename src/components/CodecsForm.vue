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
      <!-- <Loader /> -->
      <div class="loader">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
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

        // TODO: Implement backwards counter using speed processing in the Loader component
        // stopwatch since button is pressed
        const startTime = Date.now();
        this.stopwatchInterval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');
          const minutes = Math.floor((elapsedTime / 1000 / 60) % 60).toString().padStart(2, '0');
          const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24).toString().padStart(2, '0');
          this.stopwatchTime = `${hours}:${minutes}:${seconds}`;
        }, 1000);

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
          // TODO: remove timer when implementing backward timer in Loader component
          clearInterval(this.stopwatchInterval)
          // 

          this.stopwatchTime = 'Loading results...'
          setTimeout(() => {
            // Redirect to results page
            this.$router.push({ name: 'results' })
          }, 2000)
        })
      },
      /**
       * Sends a POST request to test a codec with the provided video file.
       * @param {string} codec - The codec to test.
       * @returns {Promise<void>} - A promise that resolves when the request is completed.
       */
      async codecTest(codec) {
        const formData = new FormData()
        formData.append('video', this.video)
        try {
          const response = await axios.post('http://localhost:3000/codecs', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'codec': codec,
              'input': this.video.name
            }
          })
          return response.data
        } catch (error) {
          console.error("ERROR: ", error)
        }
      },
      handleButton() {
        if (this.codec1 != '' && this.video != null) {
          this.buttonDisabled = false
        } else {
          this.buttonDisabled = true
        }
      },
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

    .loading {
      width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15%;
      
      .loader {
        --dim: 3rem;
        width: var(--dim);
        height: var(--dim);
        position: relative;
        animation: spin988 2s linear infinite;
      }

      .loader .circle {
        --color: #333;
        --dim: 1.2rem;
        width: var(--dim);
        height: var(--dim);
        background-color: var(--color);
        border-radius: 50%;
        position: absolute;
      }

      .loader .circle:nth-child(1) {
        top: 0;
        left: 0;
      }

      .loader .circle:nth-child(2) {
        top: 0;
        right: 0;
      }

      .loader .circle:nth-child(3) {
        bottom: 0;
        left: 0;
      }

      .loader .circle:nth-child(4) {
        bottom: 0;
        right: 0;
      }

      @keyframes spin988 {
        0% {
          transform: scale(1) rotate(0);
        }

        20%, 25% {
          transform: scale(1.3) rotate(90deg);
        }

        45%, 50% {
          transform: scale(1) rotate(180deg);
        }

        70%, 75% {
          transform: scale(1.3) rotate(270deg);
        }

        95%, 100% {
          transform: scale(1) rotate(360deg);
        }
      }

      &__content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;

        &--message {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 1.2em;
        }

        &--timer {
          font-size: 1.4em;
          font-weight: bold;
        }
      }
    }
  }
</style>