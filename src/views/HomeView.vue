<template>
  <div class="home">
    <div class="video_field">
      <label for="video">Select a video:</label>
      <input type="file" id="video" accept="video/*" @change="handleFileChange">
    </div>

    <CodecsForm :video="video" v-if="codecs"/>
    <CommandForm :video="video" v-if="!codecs"/>
    <a @click="codecs = !codecs" class="form_selector">{{ !codecs ? 'Codecs selector' : 'FFmpeg command' }}</a>

    <div class="test_buttons">
      <input type="submit" value="Server connection" @click="serverTest">
    </div>
  </div>
</template>


<script>
  import axios from 'axios';
  import CodecsForm from '../components/CodecsForm.vue';
  import CommandForm from '../components/CommandForm.vue';
  
  export default {
    name: 'HomeView',
    data() {
      return {
        codecs: true,
        video: {},
      }
    },
    components: {
      CodecsForm,
      CommandForm
    },
    methods: {
      handleFileChange(e) {
        this.video = e.target.files[0]
      },

      async serverTest() {
        const response = await axios.get('http://localhost:3000/')
        console.log(response.data)
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
    gap: 25px;

    .video_field {
      width: 425px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;

      label {
        width: 100%;
        font-size: 1.1em;
        font-weight: bold;
      }

      input[type="file"] {
        width: 100%;
        font-size: 1.1em;
        padding: 10px;
        cursor: pointer;
      }
    }

    .form_selector {
      font-size: 1.1em;
      cursor: pointer;
      text-decoration: underline;
      font-weight: bold;
      padding: 10px;
      border-radius: 5px;
    }
    .form_selector:hover {
      background-color: #f0f0f0;
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