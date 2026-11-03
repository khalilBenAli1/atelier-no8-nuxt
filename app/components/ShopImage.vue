<script setup lang="ts">
import { useRuntimeConfig } from '#imports';
const props = withDefaults(
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
      (props.src.includes('collection-hero') ? ' 1200w' : ' 1122w')
    "
    :sizes="sizes"
    :alt="alt"
    :width="src.includes('collection-hero') ? 1200 : 1122"
    :height="src.includes('collection-hero') ? 800 : 1402"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
  />
</template>
