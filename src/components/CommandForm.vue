<template>
  <div class="command">
    <form class="command__form">
      <h2>Write the ffmpeg commands:</h2>
      <div class="command__form--fields">
        <div class="command__form--fields--input">
          <label for="command1">ffmpeg -i {{ inputVideo }}</label>
          <input v-model="command1" type="text" id="line">
        </div>
        <div v-if="showCommand2" class="command__form--fields--input">
          <label for="command2">ffmpeg -i {{ inputVideo }}</label>
          <input v-model="command2" type="text" id="line">
          <a @click="deleteField" id="command2" class="delete_field">X</a>
        </div>       
        <div v-if="showCommand3" class="command__form--fields--input">
          <label for="command3">ffmpeg -i {{ inputVideo }}</label>
          <input v-model="command3" type="text" id="line">
          <a @click="deleteField" id="command3" class="delete_field">X</a>
        </div>    
      </div>
      <a v-if="!showCommand2" @click="showCommand2 = !showCommand2" class="add_command link">Add Command</a>
      <a v-if="showCommand2 && !showCommand3" @click="showCommand3 = !showCommand3" class="add_command link">Add Command</a>
      <input type="submit" value="Run command test" @click="runCommandTest" :disabled="buttonDisabled" class="primary_button">
    </form>
    <div v-if="loading" class="command__loader">
      <Loader />
      <div class="command__loader--content">
        <p class="command__loader--content--message">Processing video...</p>
        <p class="command__loader--content--timer">{{ stopwatchTime }}</p>
      </div>
    </div>
  </div>
</template>


<script>
  import axios from 'axios'
  import { useVideoStore } from '../stores/videoStore.js'
  import Loader from '../components/Loader.vue';
  import { toast } from "vue3-toastify";


  export default {
    name: 'CommandsForm',
    data() {
      return {
        inputVideo: 'video_name',
        command1: '',
        command2: '',
        command3: '',
        showCommand2: false,
        showCommand3: false,
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
      this.command1 = '',
      this.command2 = '',
      this.command3 = '',
      this.handleVideoName()
    },
    props: {
      video: {
        type: null,
        required: true
      }
    },
    watch: {
      command1() {
        this.handleButton();
      },
      video() {
        this.inputVideo = this.video.name
        this.handleButton();
      },
    },
    methods: {
      /**
       * Runs the tests for the written commands.
       * @param {Event} e - The event object.
       * @returns {Promise<void>}
       */
      async runCommandTest(e) {
        e.preventDefault()

        // stopwatch since button is pressed
        const startTime = Date.now();
        this.stopwatchInterval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');
          const minutes = Math.floor((elapsedTime / 1000 / 60) % 60).toString().padStart(2, '0');
          const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24).toString().padStart(2, '0');
          this.stopwatchTime = `${hours}:${minutes}:${seconds}`;
        }, 1000);
        // 
        
        let hasInvalidCommand = false;

        const allCommand = [this.command1, this.command2, this.command3]
        const promises = allCommand.map(command => {
          if (command != '') {
            const commandTest = this.handleCommand(command)
            if (!commandTest[0]) {
              hasInvalidCommand = true
              // show toast with invalid characters
              this.showToast(`Invalid characters: ${commandTest[1]}`)
              return
            }
            return this.commandTest(command).then((response) => {
              // Assign data to PiniaStore
              useVideoStore().setResults(response)
            })
          } 
        })

        if (!hasInvalidCommand) {
          this.buttonDisabled = true
          this.loading = true

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
        }
      },
      /**
       * Executes the test by sending a video file and a command to the server.
       * @param {string} command - The command to be executed on the server.
       * @returns {Promise<void>} - A promise that resolves when the command test is completed.
       */
      async commandTest(command) {
        const commandSplit = command.split(' ')
        const outputName = commandSplit[commandSplit.length - 1]

        commandSplit.pop(outputName)
        command = commandSplit.join(' ')

        const formData = new FormData()
        formData.append('video', this.video)
        try {
          const response = await axios.post('http://localhost:3000/command', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'command': command,
              'input': this.video.name,
              'output': outputName
            }
          })
          return response.data
        } catch (error) {
          console.error("ERROR: ", error)
        }
      },
      handleButton() {
        if (this.command1 != '' && this.video != null) {
          this.buttonDisabled = false
        } else {
          this.buttonDisabled = true
        }
      },
      handleCommand(command) {
        const regexAmpersand = /&&/;
        const regexPipe = /\|\|/;
        const regexSemicolon = /;/;
        const regexSemicolonQuotes = /"[^"]*;[^"]*"/;
        const regexDollar = /\${[^{}]*}/;

        if (regexAmpersand.test(command)) {
          return [false, "&&"]
        }
        if (regexPipe.test(command)) {
          return [false, "||"]
        }
        if (regexSemicolon.test(command)) {
          if (regexSemicolonQuotes.test(command)) {
            return [true, ""]
          }
          return [false, ";"]
        }
        if (regexDollar.test(command)) {
          return [false, "${}"]
        }
        return [true, ""] 
      },
      showToast(message) {
        toast.error(message, {
          duration: 2000,
          position: "top-center"
        });
      },
      deleteField(e) {
        if (e.target.id === 'command2') {
          this.showCommand2 = false
          this.command2 = ''
        } else if (e.target.id === 'command3') {
          this.showCommand3 = false
          this.command3 = ''
        }
      },
      handleVideoName() {
        if (this.video != null) {
          this.inputVideo = this.video.name
        }
      }
    },
  }
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .command {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__form {
      display: flex;
      width: 60vw;
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
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
  
        &--input {
          width: 100%;
          display: flex;
          gap: 15px;
          align-items: center;
  
          input[type="text"] {
            width: 75%;
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

    &__loader {
      height: 100px;
      width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15%;
      margin-bottom: 40px;
  
      &--content {
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

  @media (max-width: 1200px) {
    .command {
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
    .command {
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