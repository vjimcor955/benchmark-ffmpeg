<template>
  <div class="codec">
    <form class="codec__form">
      <h1>Codecs Selector</h1>
      <p>Write the video codecs:</p>
      <div class="codec__form--fields">
        <div class="codec__form--fields--input">
          <label for="codec1">Codec 1:</label>
          <input v-model="codec1" type="text" id="codec1">
        </div>
        <div v-if="showCodec2" class="codec__form--fields--input">
          <label for="codec2">Codec 2:</label>
          <input v-model="codec2" type="text" id="codec2">
          <a @click="showCodec2 = !showCodec2" class="delete_field">X</a>
        </div>
        <div v-if="showCodec3" class="codec__form--fields--input">
          <label for="codec3">Codec 3:</label>
          <input v-model="codec3" type="text" id="codec3">
          <a @click="showCodec3 = !showCodec3" class="delete_field">X</a>
        </div>
      </div>
      <a v-if="!showCodec2" @click="showCodec2 = !showCodec2" class="add_codec">Add Codec</a>
      <a v-if="showCodec2 && !showCodec3" @click="showCodec3 = !showCodec3" class="add_codec">Add Codec</a>
      <input type="submit" value="Run codecs tests" @click="runCodecsTests" :disabled="buttonDisabled">
    </form>
    <div v-if="loading" class="loading">
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
    created() {
      this.loading = false
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

        // TODO: FIX LOOP

        // const allCodecs = [this.codec1, this.codec2, this.codec3]

        // allCodecs.forEach(codec => {
        //   console.log("FORM", codec)
        //   if (codec != '') {
        //     const videoInfo = this.codecTest(codec)
        //     // Wait for the response the assing it to the pinia store
        //     videoInfo.then((response) => {
        //       // Assign data to PiniaStore
        //       console.log(`Setting results for ${codec}`)
        //       useVideoStore().setResults(response)

        //       clearInterval(this.stopwatchInterval)
        //       this.stopwatchTime = 'Loading results...'

        //       setTimeout(() => {
        //         // reset stopwatch and loading
        //         this.loading = false

        //         // Redirect to results page
        //         this.$router.push({ name: 'results' })
        //       }, 2000)
        //     })
        //   } 
        // })



        const allCodecs = [this.codec1, this.codec2, this.codec3]

        const promises = allCodecs.map(codec => {
          if (codec != '') {
            return this.codecTest(codec).then((response) => {
              // Assign data to PiniaStore
              console.log(`SETTING ${codec}`)
              useVideoStore().setResults(response)
              console.log(`RESULTS ${codec}`, response)
            })
          } 
        })

        Promise.all(promises).then(() => {
          clearInterval(this.stopwatchInterval)
          this.stopwatchTime = 'Loading results...'

          setTimeout(() => {
            // reset stopwatch and loading
            this.loading = false

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
              'codec': codec
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
      }
    }
  }
</script>


<style lang="scss">
  .codec {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__form {
      display: flex;
      width: 50vw;
      padding: 50px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 40px;
      
      h1 {
        font-size: 1.5rem;
        text-align: center;
        font-weight: bold;
      }
      
      &--fields {
        width: 550px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
        
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
            background-color: #f0f0f0;
          }
        }
      }
      
      .add_codec {
        width: fit-content;
        cursor: pointer;
        text-decoration: underline;
        padding: 5px;
        border-radius: 5px;
        // border: #000 1px solid;
        
      }
      .add_codec:hover {
        background-color: #f0f0f0;
      }
      
      input[type="submit"] {
        font-size: 1.1em;
        padding: 10px;
        border: 1px solid #000;
        border-radius: 5px;
        cursor: pointer;
      }
    }

    .loading {
      height: 100px;
      width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15%;
      margin-bottom: 40px;

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
          font-size: 1.5em;
          font-weight: bold;
        }
      }

    }


  }
</style>