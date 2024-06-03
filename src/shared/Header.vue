<template>
  <header class="header">
    <h3 class="header__title">FFmpeg Benchmark</h3>
    <nav class="header__navbar" :class="{ 'header__navbar--mobile': isMobileMenuOpen }">
      <!-- public layout -->
      <RouterLink :to="{name: 'root-home'}" class="link">Home</RouterLink>

      <!-- private layout -->
      <RouterLink :to="{name: 'private-user'}" class="link" v-if="isLogged">User</RouterLink>
      <RouterLink :to="{name: 'convert-video'}" class="link__button" v-if="isLogged">Convert video</RouterLink>

      <!-- Sign in / Log out buttons -->
      <div class="header__navbar--login">
        <RouterLink :to="{name: 'login'}" class="link__button" v-if="!isLogged">Sign in</RouterLink>
        <button v-else class="link__button" @click="handleLogout">Log out</button>
      </div>
    </nav>
    <button class="header__menu-toggle" @click="toggleMobileMenu">
      ☰
    </button>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      isMobileMenuOpen: false
    };
  },
  computed: {
    isLogged() {
      return useAuthStore().isLogged;
    }
  },
  methods: {
    handleLogout() {
      toast.info("Logging out...", {
        timeout: 2000,
        position: "top-center",
      });
      setTimeout(() => {
        useAuthStore().logOut();
        this.$router.push({ name: "root-home" });
      }, 2000);
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }
};
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
    font-size: 1.6rem;
    font-weight: bold;
    font-family: Orbitron;
  }

  &__navbar {
    display: flex;
    gap: 5rem;
    align-items: center;

    &--mobile {
      display: none;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 70px;
      left: 0;
      width: 100%;
      background-color: rgba($color: $secondary_color, $alpha: 1);
      padding: 1.5rem 0;
      gap: 1.5rem;
      @include box-gradient($secondary_color);

      &.header__navbar--mobile {
        display: flex;
      }
    }

    &--login {
      display: flex;
      gap: 1rem;
    }
  }

  &__menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 2rem;
    color: #fff;
    cursor: pointer;

    @media (max-width: 768px) {
      display: block;
    }
  }

  @include link($color: #fff);
  @include link__button($color: #fff);
}

@media (max-width: 768px) {
  .header {
    padding: 0px 1rem;
    flex-wrap: wrap;

    &__title {
      font-size: 1.5rem;
    }

    &__navbar {
      display: none;
    }

    &__navbar--mobile {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
}
</style>
