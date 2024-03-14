<template>
  <header>
    <h3>FFmpeg Benchmark</h3>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <!-- <RouterLink to="/about">Results</RouterLink> -->
    </nav>
  </header>
</template>


<script>
  import { RouterLink } from 'vue-router'

  export default {
    
  }
</script>


<style lang="scss">
  header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10rem;
    background-color: #f4f4f4;

    nav {
      display: flex;
      gap: 5rem;
    }
  }

</style>