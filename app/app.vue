<script setup lang="ts">
import { ref } from 'vue';
import { provideBagDrawer } from './composables/useBagDrawer';
const drawerOpen = ref(false);
provideBagDrawer(drawerOpen);
</script>
<template>
  <NuxtRouteAnnouncer /><ShopHeader />
  <main id="main" tabindex="-1"><NuxtPage /></main>
  <ShopFooter /><CartDrawer :open="drawerOpen" @close="drawerOpen = false" />
</template>
