<template>
  <div class="home">
    <div class="video_field">
      <label for="video">Select a video:</label>
      <input type="file" id="video" accept="video/*" @change="handleFileChange">
    </div>
    <div class="form_navbar">
      <a @click="formSelector" class="form_selector--codecs selected" :disabled="true">Codecs selector</a>
      <a @click="formSelector" class="form_selector--command" :disabled="true">FFmpeg command</a>
    </div>
    <div class="selected_form">
      <CodecsForm :video="video" v-if="codecs"/>
      <CommandForm :video="video" v-if="!codecs"/>
    </div>
  </div>
</template>


<script>
  import CodecsForm from '../components/CodecsForm.vue';
  import CommandForm from '../components/CommandForm.vue';
  
  export default {
    name: 'HomeView',
    data() {
      return {
        codecs: true,
        video: null, //
      }
    },
    components: {
      CodecsForm,
      CommandForm
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
       * Toggles the visibility of the forms and updates the navbar buttons.
       * 
       * @param {Event} e - The event object triggered by the form selector.
       */
      formSelector(e) {
        // Link is disabled after being clicked
        if (e.target.classList.contains('selected')) {
          return;
        }
        this.codecs = !this.codecs;
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
          e.target.parentNode.children[i].classList.remove('selected');
        }
        e.target.classList.add('selected');
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
    gap: 40px;

    .video_field {
      width: 450px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 50px;

      label {
        width: 100%;
        font-size: 1.1em;
        font-weight: bold;
      }

      input[type="file"] {
        width: 100%;
        font-size: 1.1em;
        cursor: pointer;
      }
    }

    .form_navbar {
      display: flex;
      flex-direction: row;
      gap: 20px;

      a {
        font-size: 1.1em;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        border: #000 1px solid;
      }
      a:hover {
        background-color: #f0f0f0;
      }
      a.selected {
        text-decoration: underline;
      }
    }

    .selected_form {
      box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
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