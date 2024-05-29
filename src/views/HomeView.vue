<template>
  <div class="home">
    <div class="home__content">
      <h2 class="home__content--title">Welcome to FFmpeg Benchmark</h2>
      <p class="home__content--message">Run different FFmpeg commands simultaneously to obtain performance test results with the ability to compare the resulting videos in the same player.</p>
      <RouterLink :to="{name: 'login'}" class="primary_button">Sign up</RouterLink>
    </div>
    <img src="../assets/1920x1080.svg" alt="Imagen home">
</div>
</template>


<script>

</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .home {
    min-height: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5%;

    .home__content {
      height: 300px;
      width: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 45px;

      &--title {
        font-size: 2rem;
        font-weight: bolder;
      }

      &--message {
        font-size: 1.2rem;
      }

      @include primary_button($accent_color);
    } 

    img {
      width: auto;
      height: 300px;
    }
  }
</style>