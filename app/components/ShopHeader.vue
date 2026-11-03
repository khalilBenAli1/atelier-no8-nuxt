<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from '#imports';
import { useCartStore } from '../stores/cart';
const cart = useCartStore();
const menu = ref(false);
const route = useRoute();
watch(
  () => route.fullPath,
  () => (menu.value = false),
);
const skip = () => document.getElementById('main')?.focus();
</script>
<template>
  <a class="skip-link" href="#main" @click.prevent="skip">Skip to content</a>
  <div class="announcement">CONSIDERED OBJECTS · EVERYDAY COMPANIONS</div>
  <header class="site-header shell">
    <NuxtLink class="wordmark" to="/" aria-label="Atelier No.8 home"
      >ATELIER <span>No.8</span></NuxtLink
    >
    <nav class="desktop-nav" aria-label="Main">
      <NuxtLink to="/collection">The collection</NuxtLink
      ><NuxtLink to="/collection?category=Bags">Bags</NuxtLink
      ><NuxtLink to="/collection?category=Small+leather">Small leather</NuxtLink
      ><NuxtLink to="/story">Our story</NuxtLink>
    </nav>
    <div class="header-actions">
      <NuxtLink
        class="icon-button search-link"
        to="/collection"
        aria-label="Search the collection"
        ><ShopIcon name="search" /></NuxtLink
      ><button
        class="bag-trigger icon-button"
        :aria-label="'Open your bag, ' + cart.totals.count + ' items'"
        @click="cart.open = true"
      >
        <ShopIcon name="bag" /><span>{{ cart.totals.count }}</span></button
      ><button
        class="icon-button mobile-menu"
        aria-label="Open menu"
        @click="menu = true"
      >
        <ShopIcon name="menu" />
      </button>
    </div>
  </header>
  <ShopDialog :open="menu" title="Menu" drawer @close="menu = false"
    ><nav class="mobile-links" aria-label="Mobile">
      <NuxtLink to="/collection">The collection</NuxtLink
      ><NuxtLink to="/collection?category=Bags">Bags</NuxtLink
      ><NuxtLink to="/collection?category=Small+leather">Small leather</NuxtLink
      ><NuxtLink to="/story">Our story</NuxtLink>
    </nav>
    <p class="quiet">Fewer things. Better company.</p></ShopDialog
  >
</template>
