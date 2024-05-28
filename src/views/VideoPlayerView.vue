<template>
  <div class="videoPlayer">
    <div class="videoPlayer__navbar">
      <RouterLink :to="{name: 'results'}" class="videoPlayer__navbar--router_link secondary_button">Return to Results</RouterLink>
      <select v-model="leftVideo" name="leftVideo" id="leftVideo" class="navbar-select">
        <option value="placeholder" selected>Left video</option>
        <option v-for="video in videosList" :key="video" :value="video.filename">{{ video.filename }}</option>
      </select>
      <button @click="handleVideoPlayerUrl" class="primary_button">Refresh player</button>
      <select v-model="rightVideo" name="rightVideo" id="rightVideo" class="navbar-select">
        <option value="placeholder" selected>Right video</option>
        <option v-for="video in videosList" :key="video" :value="video.filename">{{ video.filename }}</option>
      </select>
    </div>
    <div class="videoPlayer__div">
      <iframe ref="videoPlayerFrame" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>


<script>
  import useVideoStore from '../stores/videoStore.js'

  export default {
    name: 'VideoPlayer',
    data() {
      return {
        videosList: useVideoStore().resultsList,
        leftVideo: 'placeholder',
        rightVideo: 'placeholder'
      }
    },
    mounted() {
      this.loadVideoPlayer('https://vivictorg.github.io/vivict/');
      // this.fillVideosList();
      console.log(this.videosList)
    },
    methods: {
      handleVideoPlayerUrl() {
        console.log('----- LEFT', this.leftVideo, 'RIGHT', this.rightVideo)
        const playerUrl = `https://vivictorg.github.io/vivict/?leftVideoUrl=http://localhost:3000/${this.leftVideo}&rightVideoUrl=http://localhost:3000/${this.rightVideo}`;
        if (this.leftVideo === 'placeholder' || this.rightVideo === 'placeholder') {
          this.loadVideoPlayer('https://vivictorg.github.io/vivict/');
        } else {
          this.loadVideoPlayer(playerUrl);
        }
      },
      loadVideoPlayer(url) {
        // Set the source of the iframe to the player URL
        this.$refs.videoPlayerFrame.src = url;  
      },
      // fillVideosList() {
      //   console.log("fillVideosList")
      //   // Recicibir los videos en el promp y añadirlos a la lista de videos para sacarlos por los selects (controlar tambien que no se repitan en los selects)
      //   results.forEach(video => {
      //     this.videosList.push(video.filename);
      //   });
      // }
    }
  };
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .videoPlayer {
    min-height: calc(100vh - 80px);

    &__navbar {
      display: flex;
      flex-direction: row;
      gap: 20px;
      width: 70vw;
      justify-content: center;
      margin: 50px auto;

      &--router_link {
        position: absolute;
        left: 15vw;
      }

      @include primary_button($accent_color); 
      @include secondary_button($accent_color, 100%); 
    }

    &__div {
      width: 100%;
      height: 100vh;
    }
  }
</style>