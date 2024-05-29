<template>
  <div class="home">
    <h1>USER</h1>
</div>
</template>


<script>

</script>


<style lang="scss">
  .home {
    min-height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    // gap: 5%;

    .home__content {
      height: 350px;
      width: 450px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: left;
      gap:50px;

      &--title {
        margin-top: 50px;
        font-size: 2rem;
        font-weight: bolder;
      }

      &--message {
        font-size: 1.1rem;
      }

    } 

    img {
      width: 600px;
      height: 400px;
    }
  }
</style>