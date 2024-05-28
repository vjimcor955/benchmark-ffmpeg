<template>
  <div class="home">
    <div class="video_field">
      <label class="custum-file-upload" for="video">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clip-rule="evenodd" fill-rule="evenodd"></path> </g></svg>
        </div>
        <div class="text">
          <!-- <span>Click to upload a video</span> -->
          <span>{{ this.videoName }}</span>
        </div>
        <input type="file" id="video" accept="video/*" @change="handleFileChange">
      </label>
    </div>
    <div class="navbar">
      <a @click="formSelector" class="navbar__button selected">Codecs selector</a>
      <a @click="formSelector" class="navbar__button">FFmpeg command</a>
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
        videoName: "Click to upload a video"
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
        this.videoName = this.video.name
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
  @import "../assets/sass/main.scss";

  .home {
    min-height: calc(100vh - 220px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 40px;
    margin: 50px;

    .video_field {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 15px;

      .custum-file-upload {
        height: 20px;
        width: 300px;
        display: flex;
        flex-direction: row;
        align-items: space-between;
        gap: 20px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border: 2px solid #cacaca;
        background-color: rgba(255, 255, 255, 1);
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0px 48px 35px -48px rgba(0,0,0,0.1);
      }

      .custum-file-upload:hover {
        border: 2px dashed #cacaca;
      }

      .custum-file-upload .icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .custum-file-upload .icon svg {
        height: 40px;
        fill: rgba(75, 85, 99, 1);
      }

      .custum-file-upload .text {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .custum-file-upload .text span {
        font-weight: 400;
        color: rgba(75, 85, 99, 1);
      }

      .custum-file-upload input {
        display: none;
      }
    }

    .selected_form {
      background-color: $components_color;
      @include box-shadow($details_color);
    } 
  }
  
</style>