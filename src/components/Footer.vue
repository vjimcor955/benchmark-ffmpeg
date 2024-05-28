<template>
  <footer class="footer">
    <h3 class="footer__signature">FFmpeg Benchmark developed by Víctor Jiménez Corada</h3>
    <div class="footer__socials">
      <div class="footer__socials--github">
        <img src="../assets/github_icon.svg" alt="Github icon" class="socials__github--img">
        <a class="socials__github link" href="https://github.com/vjimcor955" target=”_blank”>GitHub</a>
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
    gap: 10%;
    padding: 0px 10rem;
    // background-color: $accent_color;
    background-color: #39544b;
    color: #fff;

    &__signature {
      font-size: 1.1rem;
    }

    &__socials {
      display: flex;
      gap: 5rem;

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
</style>