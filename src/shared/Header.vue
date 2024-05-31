<template>
  <header class="header">
    <h3 class="header__title">FFmpeg Benchmark</h3>
    <nav class="header__navbar">
      <!-- public layout -->
      <RouterLink :to="{name: 'root-home'}" class="link">Home</RouterLink>

      <!-- private layout -->
      <RouterLink :to="{name: 'private-user'}" class="link" v-if="isLogged">User</RouterLink>
      <RouterLink :to="{name: 'convert-video'}" class="link__button" v-if="isLogged">Convert video</RouterLink>

      <!-- Sign in / Log out buttons -->
      <div class="header__nabvar--login">
        <RouterLink :to="{name: 'login'}" class="link__button" v-if="!isLogged">Sign in</RouterLink>
        <button v-else class="link__button" @click="handleLogout">Log out</button>
      </div>
    </nav>
  </header>
</template>


<script>
  import { RouterLink } from 'vue-router'
  import {useAuthStore} from '../stores/authStore.js'
  import { toast } from "vue3-toastify";

  export default {
    computed: {
      isLogged() {
        return useAuthStore().isLogged
      }
    },
    methods: {
      handleLogout() {
        toast.info("Logging out...", {
          timeout: 2000,
          position: "top-center",   
        });
        setTimeout(() => {
          useAuthStore().logOut()
          this.$router.push({name: "root-home"});
        }, 2000);
      }
    }
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
      font-size: 1.7rem;
      font-weight: bold;
      font-family: Orbitron;
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