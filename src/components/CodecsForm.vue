<template>
  <div class="codecs">
    <h1>Codecs Selector</h1>
    <form class="codecs__form">
      <div class="codecs__form--field">
        <label for="codec1">Write a video codec:</label>
        <input v-model="codec1" type="text" id="codec1">
      </div>
      <div class="codecs__form--field">
        <label for="codec2">Write a video a codec:</label>
        <input v-model="codec2" type="text" id="codec2">
      </div>
      <div class="codecs__form--field">
        <label for="codec3">Write a video a codec:</label>
        <input v-model="codec3" type="text" id="codec3">
      </div>
      <input type="submit" value="Run codecs tests" @click="runCodecsTests">
    </form>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    name: 'CodecsForm',
    data() {
      return {
        codec1: 'libx264',
        codec2: 'libx265',
        codec3: 'libvpx-vp9',
      }
    },
    props: {
      video: {
        type: Object,
        required: true
      }
    },
    methods: {
      async runCodecsTests(e) {
        e.preventDefault()
        const allCodecs = [this.codec1, this.codec2, this.codec3]
        allCodecs.forEach(codec => {
          this.uploadVideo(codec)
        })
      },

      async uploadVideo(codec) {
        const formData = new FormData()
        formData.append('video', this.video)
        try {
          const response = await axios.post('http://localhost:3000/codecs', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'codec': codec
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
  h1 {
    margin: 40px;
    font-size: 1.2rem;
    text-align: center;
    font-weight: bold;
  }

  .codecs__form {
    display: flex;
    width: 500px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80vw;
    gap: 40px;

    &--field {
      width: 350px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      label {
        font-size: 1.1em;
        margin-bottom: 10px;
      }

      input[type="text"] {
        font-size: 1.1em;
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
</style>