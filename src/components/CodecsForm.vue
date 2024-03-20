<template>
  <div class="codecs">
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
        codec1: '',
        codec2: '',
        codec3: '',
        showCodec2: false,
        showCodec3: false,
      }
    },
    props: {
      video: {
        type: Object,
        required: true
      }
    },
    methods: {
      /**
       * Runs the tests for the written codecs.
       * @param {Event} e - The event object.
       * @returns {Promise<void>}
       */
      async runCodecsTests(e) {
        e.preventDefault()
        const allCodecs = [this.codec1, this.codec2, this.codec3]
        allCodecs.forEach(codec => {
          if (codec != '') {
            this.codecTest(codec)
          } 
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
          console.log(response.data)
        } catch (error) {
          console.error("ERROR: ", error)
        }
      }
    }
  }
</script>


<style lang="scss">
  .codec__form {
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
</style>