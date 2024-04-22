<template>
  <div class="videoPlayer">
    <div class="videoPlayer__selects">
      <select v-model="leftVideo" name="leftVideo" id="leftVideo">
        <option value="placeholder" selected>Left video</option>
        <option v-for="video in videosList" :key="video" :value="video">{{ video }}</option>
      </select>
      <button @click="handleVideoPlayerUrl">Refresh player</button>
      <select v-model="rightVideo" name="rightVideo" id="rightVideo">
        <option value="placeholder" selected>Right video</option>
        <option v-for="video in videosList" :key="video" :value="video">{{ video }}</option>
      </select>
    </div>
    <div class="videoPlayer__div">
      <iframe ref="videoPlayerFrame" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'VideoPlayer',
    data() {
      return {
        videosList: [],
        leftVideo: 'placeholder',
        rightVideo: 'placeholder'
      }
    },
    mounted() {
      this.loadVideoPlayer('https://vivictorg.github.io/vivict/');
      this.fillVideosList();
    },
    props: {
      results: {
        type: List,
        required: true
      }
    },
    methods: {
      handleVideoPlayerUrl() {
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
      fillVideosList() {
        console.log("fillVideosList")
        // Recicibir los videos en el promp y añadirlos a la lista de videos para sacarlos por los selects (controlar tambien que no se repitan en los selects)
        results.forEach(video => {
          this.videosList.push(video.filename);
        });
      }
    }
  };
</script>


<style lang="scss">
  .videoPlayer {
    
    &__selects {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin: 50px auto;

      select {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f0f0f0;
        cursor: pointer;
      }
    }

    &__div {
      width: 100%;
      height: 100vh;
    }
  }
</style>