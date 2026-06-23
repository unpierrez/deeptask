<script setup lang="ts">
import AuthLayout from '../components/ui/AuthLayout/AuthLayout.vue'
</script>

<template>
  <AuthLayout>
    <router-view v-slot="{ Component }">
      <transition name="auth-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AuthLayout>
</template>

<style scoped>
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.15s ease;
}
.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
}
</style>
