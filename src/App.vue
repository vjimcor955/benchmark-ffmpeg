<template>
  <main>
    <Header />
    <RouterView />
  </main>
</template>


<script>
  import { RouterView } from 'vue-router';
  import Header from './components/Header.vue';
  
  export default {
    components: {
      Header
    }
  }
</script>


<style scoped>

</style>
