<template>
  <div class="login">
    <h1>LOGIN</h1>
    <button @click="handleLogin">Login</button>
</div>
</template>


<script>
  import {useAuthStore} from '../stores/authStore.js'

  export default {
    name: 'LoginView',
    methods: {
      handleLogin() {
        setTimeout(() => {
          useAuthStore().isLogged = true;
          this.$router.push({name: "root-home"});
        }, 1000);      }
    }
  }
</script>


<style lang="scss">
  .login {
    min-height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
  }
</style>