<script setup lang="ts">
import logoImg from '../../../assets/logo.png'

withDefaults(defineProps<{
  height?: number
}>(), {
  height: 32,
})
</script>

<template>
  <img :src="logoImg" :height="height" alt="DeepTask" class="dt-logo" />
</template>

<style scoped lang="scss">
.dt-logo {
  display: block;
  width: auto;
  object-fit: contain;
}
</style>
