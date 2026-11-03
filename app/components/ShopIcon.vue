<script setup lang="ts">
defineProps<{
  name: 'bag' | 'search' | 'close' | 'arrow' | 'menu' | 'plus' | 'minus';
}>();
</script>
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    aria-hidden="true"
  >
    <template v-if="name === 'bag'">
      <path d="M4 7h16v15H4z" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 7 7" />
    </template>
    <path v-else-if="name === 'close'" d="m5 5 14 14M19 5 5 19" />
    <path v-else-if="name === 'arrow'" d="M2 12h19m-6-6 6 6-6 6" />
    <path v-else-if="name === 'menu'" d="M3 8h18M3 16h18" />
    <path v-else-if="name === 'plus'" d="M4 12h16M12 4v16" />
    <path v-else d="M4 12h16" />
  </svg>
</template>
