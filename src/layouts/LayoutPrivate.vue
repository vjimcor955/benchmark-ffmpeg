<template>
  <div class="layout_private">
    <router-view />
  </div>
</template>

<script>
  import {useAuthStore} from '../stores/authStore.js'

  export default {
    name: 'LayoutPrivate',
    computed: {
      isLogged() {
        return useAuthStore().isLogged
      }
    },
    // If user is not logged cant access to layoutPrivate, redirect to login page
    created() {
      if (!this.isLogged) {
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped lang="scss">
  .layout_private {
    min-height: calc(100vh - 120px);
    font-family: "Nunito";
  }
</style>