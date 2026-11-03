<script setup lang="ts">
import { useRuntimeConfig } from '#imports';
withDefaults(
  defineProps<{
    src: string;
    alt: string;
    priority?: boolean;
    sizes?: string;
  }>(),
  { priority: false, sizes: '(max-width: 700px) 100vw, 50vw' },
);
const base = useRuntimeConfig().app.baseURL;
const asset = (path: string) => base + path.replace(/^\//, '');
</script>
<template>
  <img
    :src="asset(src)"
    :srcset="
      asset(src.replace('.webp', '-small.webp')) +
      ' 600w, ' +
      asset(src) +
      ' 1200w'
    "
    :sizes="sizes"
    :alt="alt"
    width="1200"
    height="1500"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
  />
</template>
