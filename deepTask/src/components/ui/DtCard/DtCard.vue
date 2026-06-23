<template>
  <div class="dt-card">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.dt-card {
  width: 100%;
  max-width: var(--dt-card-width, 420px);
}
</style>
