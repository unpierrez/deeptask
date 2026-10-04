<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 28,
  },
);
</script>

<template>
  <span class="dt-brand">
    <span
      class="dt-brand__mark"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <!-- Same layered glyph as public/favicon.svg, drawn in currentColor -->
      <svg
        :width="Math.round(size * 0.6)"
        :height="Math.round(size * 0.6)"
        viewBox="6 6 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path d="M9 13.5 L20 8 L31 13.5 L20 19 Z" fill="currentColor" />
        <path
          d="M9 20 L20 25.5 L31 20"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity=".55"
        />
        <path
          d="M9 26.5 L20 32 L31 26.5"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity=".28"
        />
      </svg>
    </span>
    <span class="dt-brand__name"
      >deeptask<span class="dt-brand__cursor">_</span></span
    >
  </span>
</template>

<style scoped lang="scss">
.dt-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    color: var(--text);
  }

  &__name {
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  &__cursor {
    color: var(--accent);
  }
}
</style>
