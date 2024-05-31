<template>
  <div class="loginView">
    <div class="form">
      <LoginForm v-if="!register"/>
      <RegisterForm v-else @registered="handleRegistered"/>
      <a @click="register = !register" class="link">{{ !register ? 'Register' : 'Login' }}</a>
    </div>
  </div> 
</template>


<script>
  import LoginForm from '../components/LoginForm.vue'
  import RegisterForm from '../components/RegisterForm.vue'

  export default {
    data() {
      return {
        register: false
      }
    },
    components: {
      LoginForm,
      RegisterForm
    },
    methods: {
      handleRegistered(value) {
        this.register = value;
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../assets/sass/main.scss";

  .loginView {
    min-height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
    
    .form {
      min-height: 500px;
      width: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 25px;
      padding: 25px 50px;
      border-radius: 15px;
      background-color: $components_color;
      @include box-shadow($details_color);

      @include link($accent_color);
    }
  }
</style>