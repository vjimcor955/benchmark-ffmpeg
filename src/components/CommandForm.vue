<template>
  <div class="command">
    <h1>FFmpeg command</h1>
    <form class="command__form">
      <div class="command__form--field">
        <label for="line">Write the ffmpeg command:</label>
        <div class="command__form--field--input">
          ffmpeg -i <input v-model="line" type="text" id="line">
        </div>
      </div>
      <input type="submit" value="Run command test" @click="runTests">
    </form>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    name: 'CodecsForm',
    data() {
      return {
        line: '',
      }
    },
    // recieves video prompt from HomeView
    props: {
      video: {
        type: Object,
        required: true
      }
    },
    methods: {
      async runTests(e) {
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
          const response = await axios.post('http://localhost:3000/upload', formData, {
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
    font-size: 1.5rem;
    text-align: center;
  }

  .command__form {
    display: flex;
    width: 500px;
    flex-direction: column;
    justify-content: center;
    // align-items: flex-start;
    align-items: center;
    width: 80vw;
    gap: 40px;

    &--field {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;
      text-align: center;

      label {
        font-size: 1.1em;
        margin-bottom: 10px;
      }

      &--input {
        display: flex;
        gap: 15px;
        align-items: center;
        justify-content: center;

        input[type="text"] {
          width: 75%;
          font-size: 1.1em;
          padding: 10px;
          border: 1px solid #000;
          border-radius: 5px;
        }
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