<script setup lang="ts">
import { clearError } from '#app';
defineProps<{ error: { statusCode?: number } }>();
</script>
<template>
  <div class="error-page">
    <p class="eyebrow">ATELIER No.8 / {{ error.statusCode || 404 }}</p>
    <h1>A little<br /><em>off the path.</em></h1>
    <p>This piece of the Atelier is yet to be found.</p>
    <a
      class="button"
      href="/atelier-no8-nuxt/"
      @click.prevent="clearError({ redirect: '/' })"
      >Back to the Atelier →</a
    >
  </div>
</template>
