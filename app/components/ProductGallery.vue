<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '../../data/products';
defineProps<{ product: Product }>();
const gallery = ref(false);
const detail = ref(false);
</script>
<template>
  <div class="product-gallery">
    <div class="gallery-thumbs">
      <button
        :class="{ selected: !detail }"
        aria-label="Show full product"
        :aria-pressed="!detail"
        @click="detail = false"
      >
        <ShopImage
          :src="product.image"
          :alt="product.name + ', full view'"
          sizes="100px"
        /></button
      ><button
        class="detail-thumb"
        :class="{ selected: detail }"
        aria-label="Show material detail"
        :aria-pressed="detail"
        @click="detail = true"
      >
        <ShopImage
          :src="product.image"
          :alt="product.name + ', cropped material detail'"
          sizes="100px"
        />
      </button>
    </div>
    <button
      class="product-main-image"
      :class="{ 'detail-view': detail }"
      aria-label="Open product photograph"
      @click="gallery = true"
    >
      <ShopImage
        :src="product.image"
        :alt="
          product.name +
          ' in ' +
          product.color +
          (detail ? ', cropped material detail' : '')
        "
        priority
        sizes="(max-width: 700px) 100vw, 54vw"
      /><span class="image-zoom">View photograph <ShopIcon name="plus" /></span>
    </button>
  </div>
  <ShopDialog
    :open="gallery"
    title="Product photograph"
    @close="gallery = false"
    ><div class="lightbox">
      <ShopImage
        :src="product.image"
        :alt="product.name + ' in ' + product.color + ', enlarged photograph'"
        priority
        sizes="80vw"
      />
      <p>{{ product.name }} / {{ product.color }} · Regular silhouette</p>
    </div></ShopDialog
  >
</template>
