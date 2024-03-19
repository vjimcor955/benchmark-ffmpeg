<template>
  <div class="home">
    <h1>Codecs Selector</h1>
    <form class="codecs_form">
      <div class="codecs_form--field">
        <label for="video">Select a video:</label>
        <input type="file" id="video" accept="video/*" @change="handleFileChange">
      </div>
      <div class="codecs_form--field">
        <label for="codec1">Select a codec:</label>
        <input v-model="codec1" type="text" id="codec1">
      </div>
      <div class="codecs_form--field">
        <label for="codec2">Select a codec:</label>
        <input v-model="codec2" type="text" id="codec2">
      </div>
      <div class="codecs_form--field">
        <label for="codec3">Select a codec:</label>
        <input v-model="codec3" type="text" id="codec3">
      </div>
      <input type="submit" value="Run tests" @click="runTests">
    </form>
    <div class="test_buttons">
      <input type="submit" value="Server connection" @click="serverTest">
      <input type="submit" value="Upload Video" @click="uploadVideo">
    </div>
  </div>
</template>


<script>
  import axios from 'axios';
  
  export default {
    name: 'HomeView',
    data() {
      return {
        ffmpeg: null,
        ffmpegLoaded: false,
        video: null,
        codec1: 'libx264',
        codec2: 'libx265',
        codec3: 'libvpx-vp9',
      }
    },
    methods: {
      /**
       * Handles the change event when a file is selected.
       * @param {Event} e - The change event object.
       */
      handleFileChange(e) {
        this.video = e.target.files[0]
      },

      /**
       * Sends a GET request to the server and logs the response data.
       * @returns {Promise<void>} - A promise that resolves when the request is complete.
       */
      async serverTest() {
        const response = await axios.get('http://localhost:3000/');
        console.log(response.data);
      },

      /**
       * Runs tests to convert videos using specified codecs.
       * @param {Event} e - The event object.
       * @returns {Promise<void>} - A promise that resolves when the tests are completed.
       */
      async runTests(e) {
        e.preventDefault()
        const allCodecs = [this.codec1, this.codec2, this.codec3]
        // allCodecs.forEach(codec => {
        //   this.uploadVideo(codec)
        // })
      },

      /**
       * Uploads the selected video to the Express server.
       * @returns {Promise<void>} - A promise that resolves when the video is uploaded.
       */
      async uploadVideo() {
        const formData = new FormData()
        formData.append('video', this.video)
        try {
          const response = await axios.post('http://localhost:3000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          console.log(response.data)
        } catch (error) {
          console.error("ERROR: ", error)
        }
      },
    }
  }
</script>


<style lang="scss">
  .home {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: calc(100vh - 80px);

    h1 {
      margin: 50px;
      font-size: 2rem;
    }

    .codecs_form {
      display: flex;
      width: 500px;
      flex-direction: column;
      justify-content: center;
      // align-items: flex-start;
      align-items: center;
      width: 80vw;
      gap: 40px;

      .codecs_form--field {
        width: 350px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        label {
          font-weight: bold;
          margin-bottom: 10px;
        }

        input[type="file"] {
          padding: 10px;
          cursor: pointer;
        }

        input[type="text"] {
          padding: 10px;
          border: 1px solid #000;
          border-radius: 5px;
        }

      }

      input[type="submit"] {
        font-size: 1.1em;
        padding: 10px;
        border: 1px solid #000;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    
    .test_buttons {
      display: flex;
      gap: 20px;
      margin-top: 20px;

      input[type="submit"] {
        font-size: 1.1em;
        padding: 10px;
        border: 1px solid #000;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
  
</style>