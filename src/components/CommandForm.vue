<template>
  <div class="command">
    <form class="command__form">
      <h1>FFmpeg commands</h1>
      <p>Write the ffmpeg commands:</p>
      <div class="command__form--fields">
        <div class="command__form--fields--input">
          <label for="command1">ffmpeg -i {{ inputVideo }}</label>
          <input v-model="command1" type="text" id="line">
        </div>
        <div v-if="showCommand2" class="command__form--fields--input">
          <label for="command2">ffmpeg -i {{ inputVideo }}</label>
          <input v-model="command2" type="text" id="line">
          <a @click="showCommand2 = !showCommand2" class="delete_field">X</a>
        </div>       
        <div v-if="showCommand3" class="command__form--fields--input">
          <label for="command3">ffmpeg -i {{ inputVideo }}</label>
          <input v-model="command3" type="text" id="line">
          <a @click="showCommand3 = !showCommand3" class="delete_field">X</a>
        </div>    
      </div>
      <a v-if="!showCommand2" @click="showCommand2 = !showCommand2" class="add_command">Add Command</a>
      <a v-if="showCommand2 && !showCommand3" @click="showCommand3 = !showCommand3" class="add_command">Add Command</a>
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
          if (command != '') {
            this.commandTest(command)
          }
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
  .command__form {
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
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;

      &--input {
        width: 100%;
        display: flex;
        gap: 15px;
        align-items: center;

        input[type="text"] {
          width: 80%;
          font-size: 1.05em;
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

    input[type="submit"] {
      font-size: 1.1em;
      padding: 10px;
      border: 1px solid #000;
      border-radius: 5px;
      cursor: pointer;
    }
  }
</style>