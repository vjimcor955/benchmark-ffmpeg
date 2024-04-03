<template>
  <div class="loading">
    <div class="loader">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
    <!-- <div class="loading__content">
      <p class="loading__content--message">Processing video...</p>
      <p class="loading__content--timer">{{ stopwatchTime }}</p>
      <p class="loading__content--timer">{{ processingSpeed }}</p>
    </div> -->
  </div>
</template>


<script>
  export default {
    name: 'Loader',
    data() {
      return {
        stopwatchInterval: null,
        stopwatchTime: null,
        processingSpeed: null,
      }
    },
    methods: {
      // -stats              print progress report during encoding (ffmpeg property)


      // method to create a revese timer using the propessing speed and the video duration

      // axios call to get the speed processing
    }
  }
</script>


<style lang="scss">
  .loading {
    height: 100px;
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15%;
    margin-bottom: 40px;

    .loader {
      --dim: 3rem;
      width: var(--dim);
      height: var(--dim);
      position: relative;
      animation: spin988 2s linear infinite;
    }

    .loader .circle {
      --color: #333;
      --dim: 1.2rem;
      width: var(--dim);
      height: var(--dim);
      background-color: var(--color);
      border-radius: 50%;
      position: absolute;
    }

    .loader .circle:nth-child(1) {
      top: 0;
      left: 0;
    }

    .loader .circle:nth-child(2) {
      top: 0;
      right: 0;
    }

    .loader .circle:nth-child(3) {
      bottom: 0;
      left: 0;
    }

    .loader .circle:nth-child(4) {
      bottom: 0;
      right: 0;
    }

    @keyframes spin988 {
      0% {
        transform: scale(1) rotate(0);
      }

      20%, 25% {
        transform: scale(1.3) rotate(90deg);
      }

      45%, 50% {
        transform: scale(1) rotate(180deg);
      }

      70%, 75% {
        transform: scale(1.3) rotate(270deg);
      }

      95%, 100% {
        transform: scale(1) rotate(360deg);
      }
    }

    &__content {
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
</style>