<script setup lang="ts">
import { money, type Product } from '../../data/products';
defineProps<{ product: Product; index?: number }>();
</script>
<template>
  <article class="product-card">
    <NuxtLink
      :to="'/products/' + product.slug"
      class="product-picture"
      tabindex="-1"
      aria-hidden="true"
      ><ShopImage
        :src="product.image"
        :alt="product.name + ' in ' + product.color"
        sizes="(max-width: 600px) 50vw, 25vw" /><span class="product-number">{{
        String((index ?? 0) + 1).padStart(2, '0')
      }}</span
      ><span
        v-if="product.variants.every((v) => v.stock === 0)"
        class="stock-label"
        >Currently unavailable</span
      ><span class="picture-arrow"><ShopIcon name="arrow" /></span
    ></NuxtLink>
    <div class="product-meta">
      <NuxtLink :to="'/products/' + product.slug"
        ><h3>{{ product.name }}</h3></NuxtLink
      ><span>{{ money(product.price) }}</span>
    </div>
    <p class="product-color">
      <span :style="{ background: product.colorHex }" />{{ product.color }}
    </p>
  </article>
</template>
