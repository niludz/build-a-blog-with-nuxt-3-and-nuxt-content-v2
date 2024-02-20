<script setup>

</script>

<template>
  <section class="hero  is-medium is-bold gradient">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-1">
          <slot />
        </h1>
        <slot name="subtitle" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-body {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 400px;
}

.gradient {


  /* 背景渐变色 */
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  /* 背景尺寸  */
  background-size: 400% 400%;
  /* 循环动画  */
  animation: gradientBG 18s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
