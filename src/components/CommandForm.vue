<template>
  <div class="command">
    <h1>FFmpeg commands</h1>
    <form class="command__form">
      <div class="command__form--field">
        <label for="line">Write the ffmpeg commands:</label>
        <div class="command__form--field--input">
          <p>ffmpeg -i {{ inputVideo }}</p>
          <input v-model="command1" type="text" id="line">
        </div>

        <div v-if="showCommand2" class="command__form--field--input">
          <p>ffmpeg -i {{ inputVideo }}</p>
          <input v-model="command2" type="text" id="line">
          <a @click="showCommand2 = !showCommand2">X</a>
        </div>
        <a v-if="!showCommand2" @click="showCommand2 = !showCommand2" class="add_command">Add Command</a>

        <div v-if="showCommand3" class="command__form--field--input">
          <p>ffmpeg -i {{ inputVideo }}</p>
          <input v-model="command3" type="text" id="line">
          <a @click="showCommand3 = !showCommand3">X</a>
        </div>
        <a v-if="showCommand2 && !showCommand3" @click="showCommand3 = !showCommand3" class="add_command">Add Command</a>

      </div>
      <input type="submit" value="Run command test" @click="runCommandTest">
    </form>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    name: 'CodecsForm',
    data() {
      return {
        inputVideo: this.video.name,
        command1: '',
        command2: '',
        command3: '',
        showCommand2: false,
        showCommand3: false,
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
       * Runs the tests for the written commands.
       * @param {Event} e - The event object.
       * @returns {Promise<void>}
       */
      async runCommandTest(e) {
        e.preventDefault()
        const allCommand = [this.command1, this.command2, this.command3]
        allCommand.forEach(command => {
          this.commandTest(command)
        })
      },

      /**
       * Executes the test by sending a video file and a command to the server.
       * @param {string} command - The command to be executed on the server.
       * @returns {Promise<void>} - A promise that resolves when the command test is completed.
       */
      async commandTest(command) {
        const formData = new FormData()
        formData.append('video', this.video)
        try {
          const response = await axios.post('http://localhost:3000/command', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'command': command
            }
          })
          console.log(response.data)
        } catch (error) {
          console.error("ERROR: ", error)
        }
      },
    },
    watch: {
      video: function() {
        this.inputVideo = this.video.name
      }
    }
  }
</script>


<style lang="scss">
  h1 {
    margin: 40px;
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
  }

  .command__form {
    display: flex;
    width: 500px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80vw;
    gap: 40px;

    &--field {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 25px;
      align-items: center;

      label {
        font-size: 1.1em;
        margin-bottom: 10px;
      }

      &--input {
        width: 75%;
        display: flex;
        gap: 15px;
        align-items: center;
        justify-content: center;

        input[type="text"] {
          width: 85%;
          font-size: 1.1em;
          padding: 10px;
          border: 1px solid #000;
          border-radius: 5px;
        }
      }

      .add_command {
        width: fit-content;
        cursor: pointer;
        text-decoration: underline;
        padding: 10px;
        border-radius: 5px;
      }
      .add_command:hover {
        background-color: #f0f0f0;
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