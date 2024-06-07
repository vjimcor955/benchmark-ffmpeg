<template>
  <div class="not-found">
    <div class="illustration">
      <div class="circle"></div>
      <div class="left eye"></div>
      <div class="right eye"></div>
      <div class="mouth"></div>
    </div>
    <h1>404</h1>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <router-link :to="{name: 'root-home'}" class="link">Go back home</router-link>
  </div>
</template>


<script>
export default {
  name: 'NotFound'
}
</script>


<style scoped lang="scss">
  @import "../assets/sass/main.scss";

  .not-found {
    min-height: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: $accent-color;
    gap: 30px;
  }

  .illustration {
    position: relative;
    width: 150px;
    height: 150px;
    margin-bottom: 20px;
    animation: shake 1s infinite;
  }

  .circle {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ffcccb;
    border-radius: 50%;
  }

  .eye {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #333;
    border-radius: 50%;
    top: 50px;
  }

  .eye.left {
    left: 35px;
  }

  .eye.right {
    right: 35px;
  }

  .mouth {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 10px solid #333;
    border-color: transparent transparent #333 transparent;
    border-radius: 50%;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }

  h1 {
    font-size: 6rem;
    margin: 0;
  }

  p {
    font-size: 24px;
    margin: 0px 0px 25px;
  }

  @include link($accent-color);
  
  .link {
    font-weight: bold;
    font-size: 2rem;
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(20px);
    }
    40% {
      transform: translateX(-20px);
    }
    60% {
      transform: translateX(20px);
    }
    80% {
      transform: translateX(-20px);
    }
  }

  @media (max-width: 768px) {
    .not-found {
      padding: 0px 20px;
    }

    h1 {
      font-size: 4rem;
    }

    p {
      font-size: 20px;
    }

    .link {
      font-size: 1.5rem;
    }
  }
</style>