<template>
  <div class="user">
    <h2 class="title">User info</h2>
    <div class="user__info">
      <div class="user__info--img">
        <img src="../assets/user_icon.svg" alt="User icon">
      </div>
      <div class="user__info--data">
        <div class="user__info--data__field">
          <p id="label">Name:</p>
          <p id="field">{{ user.name }}</p>
        </div>
        <div class="user__info--data__field">
          <p id="label">User:</p>
          <p id="field">{{ user.user }}</p>
        </div>
        <div class="user__info--data__field">
          <p id="label">Email:</p>
          <p id="field">{{ user.email }}</p>
        </div>
      </div>
    </div>
</div>
</template>


<script>
  import { useAuthStore } from '../stores/authStore.js';

  export default {
    data() {
      return {
        user: {
          name: useAuthStore().user.name,
          user: useAuthStore().user.user,
          email: useAuthStore().user.email
        }
      }
    }
  }
</script>


<style lang="scss">
  @import "../assets/sass/main.scss";

  .user {
    min-height: inherit;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    justify-content: center;
    align-items: center;

    &__info {
      width: 50%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      border: 3px solid $accent-color;
      padding: 1rem;
      border-radius: 15px;
      padding: 100px 0px;

      &--img {
        width: 50%;
        text-align: center;
        padding-left: 5%;
      }

      &--data {
        width: 50%;
        display: flex;
        flex-direction: column;
        gap: 5rem;

        &__field {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 3rem;

          #label {
            font-size: 1.3rem;
            font-weight: bold;
            font-family: Orbitron;
          }

          #field {
            font-size: 1.2rem;

          }
        }
      }
    }

    .title {
        font-size: 1.9rem;
        font-weight: bold;
        font-family: Orbitron;
      }
  }
</style>