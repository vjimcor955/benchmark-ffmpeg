<template>
  <footer class="footer">
    <h3 class="footer__signature"><span>FFmpeg Benchmark</span> developed by Víctor Jiménez Corada</h3>
    <div class="footer__socials">
      <div class="footer__socials--github">
        <img src="../assets/github_icon.svg" alt="Github icon" class="socials__github--img">
        <a class="socials__github link" href="https://github.com/vjimcor955" target=”_blank”>GitHub</a>
      </div>
      <div class="footer__socials--github">
        <img src="../assets/github_icon.svg" alt="Github icon" class="socials__github--img">
        <a class="socials__github link" href="https://github.com/vjimcor955/benchmark_ffmpeg-video_processor.git" target=”_blank”>Needed repo to make the app work!</a>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'Footer'
  }
</script>

<style lang="scss">
  @import "../assets/sass/main.scss";

  .footer {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    padding: 0px 10rem;
    background-color: $accent_color;
    color: #fff;

    &__signature {
      font-size: 1.1rem;

      span {
        font-family: Orbitron;
        font-weight: bold;
      }
    }

    &__socials {
      display: flex;
      gap: 50px;

      &--github {
        display: flex;
        gap: 1rem;
        align-items: center;

        img {
          width: 24px;
          height: 24px;
        }

        @include link($color: #fff)
      }
    }
  }

  @media (max-width: 1100px) {
    .footer {
      height: auto;
      flex-direction: column;
      gap: 20px;
      padding: 2rem;

      &__signature {
        font-size: 1rem;
        text-align: center;
      }

      &__socials {
        gap: 2rem;
        justify-content: center;

        &--github {
          gap: 0.5rem;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .footer {
      &__socials {
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        align-content: center;

        &--github {
          gap: 0.5rem;
        }
      }
    }
  }
</style>