<template>
  <header class="header">
    <h3 class="header__title">FFmpeg Benchmark</h3>
    <nav class="header__navbar">
      <!-- public layout -->
      <RouterLink :to="{name: 'home'}" class="header__navbar link">Home</RouterLink>
      <!-- <RouterLink :to="{name: 'sign-in'}" class="header__navbar button">Sign in</RouterLink> -->
      <!-- private layout -->
      <!-- <RouterLink :to="{name: 'user'}" class="header__navbar link">User</RouterLink> -->
      <!-- <RouterLink :to="{name: 'convert-video'}" class="header__navbar link__button">Convert video</RouterLink> -->
      <!-- <button class="header__navbar link__button">Log out</button> -->

      <RouterLink :to="{name: 'player'}" class="header__navbar link__button">Sign in</RouterLink>
    </nav>
  </header>
</template>


<script>
  import { RouterLink } from 'vue-router'

  export default {
    
  }
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .header {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10rem;
    background-color: rgba($color: $secondary_color, $alpha: 1);
    color: #fff;
    @include box-gradient($secondary_color);

    &__title {
      font-size: 1.5rem;
      font-weight: bold;
    }

    &__navbar {
      display: flex;
      gap: 5rem;
      align-items: center;
    }

    @include link($color: #fff);
    @include link__button($color: #fff);
  }
</style>