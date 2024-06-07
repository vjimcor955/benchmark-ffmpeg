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
          <input id="field" v-model="user.name" type="text" >
        </div>
        <div class="user__info--data__field">
          <p id="label">User:</p>
          <input id="field" v-model="user.user" type="text">
        </div>
        <div class="user__info--data__field">
          <p id="label">Email:</p>
          <input id="field" v-model="user.email" type="text">
        </div>
      </div>
    </div>
    <button class="primary_button" @click="handleUserInfo">Modify user data</button>
  </div>
</template>

<script>
  import { useAuthStore } from '../stores/authStore.js';
  import axios from 'axios';
  import { toast } from "vue3-toastify";

  export default {
    name: 'UserView',
    data() {
      return {
        user: {
          id: useAuthStore().user.id,
          name: useAuthStore().user.name,
          user: useAuthStore().user.user,
          email: useAuthStore().user.email
        }
      }
    },
    methods: {
      // Update user info
      handleUserInfo() {
        const updatedUser = {
          name: this.user.name,
          user: this.user.user,
          email: this.user.email
        }
        try {
          const response = axios.put(`http://localhost:3000/api/user/${this.user.id}`, updatedUser, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${useAuthStore().user.token}`,
            }
          })
          useAuthStore().user.name = this.user.name;
          useAuthStore().user.user = this.user.user;
          useAuthStore().user.email = this.user.email;
          toast.success("User data successfully modified!", {
            autoClose: 1500,
            position: "top-center"
          });          
        return response.data
        } catch (error) {
          console.error(error);
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
          font-size: 1rem;
          border: 2px solid $accent-color;
          border-radius: 10px;
          padding: 0.5rem;
          width: 50%;
        }
      }
    }
  }

  .title {
    font-size: 1.9rem;
    font-weight: bold;
    font-family: Orbitron;
  }

  @include primary_button($accent-color);
}

@media (max-width: 1200px) {
  .user {
    gap: 2rem;

    &__info {
      width: 75%;
      gap: 2rem;
      flex-direction: column;
      padding: 50px 0px;

      &--img {
        width: 100%;
        padding-left: 0px;

        img {
          height: 10rem;
        }
      }
      
      &--data {
        width: 100%;
        align-items: center;
      }

      &--data {
        gap: 2rem;
      }
    }

    .title {
      font-size: 1.5rem;
    }
  }
}

@media (max-width: 480px) {
  .user {
    gap: 1.5rem;

    &__info {
      padding: 20px;

      &--img {
        width: 100%;  
        padding-left: 0px;

        img {
          height: 7rem;
        }
      }

      &--data {
        gap: 1.5rem;

        &__field {
          gap: 1rem;

          #label {
            font-size: 1rem;
          }

          #field {
            font-size: 0.9rem;
          }
        }
      }
    }

    .title {
      font-size: 1.5rem;
    }
  }
}
</style>
