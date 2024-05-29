<template>
  <div class="layout_root">
    <router-view @login="login"/>
  </div>
</template>

<script>
  export default {
    methods: {
      login() {
        this.$emit('login')
      }
    }
  }
</script>

<style scoped>
  .layout_root {
    min-height: calc(100vh - 120px);
    font-family: "Nunito";
  }
</style>