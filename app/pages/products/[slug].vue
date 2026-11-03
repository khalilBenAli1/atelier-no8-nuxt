<script setup lang="ts">
import { useRoute, useHead, createError, definePageMeta } from '#imports';
import { findProduct, money, products } from '../../../data/products';
definePageMeta({ key: (route) => route.path });
const route = useRoute();
const product = findProduct(String(route.params.slug));
if (!product)
  throw createError({
    statusCode: 404,
    statusMessage: 'This piece is yet to be found',
  });
useHead({
  title: product.name + ' — Atelier No.8',
  meta: [{ name: 'description', content: product.description }],
});
</script>
<template>
  <section class="shell product-page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <NuxtLink to="/collection">The collection</NuxtLink><span>/</span
      ><span>{{ product.name }}</span>
    </nav>
    <div class="product-layout">
      <ProductGallery :product="product" />
      <div class="product-info">
        <p class="eyebrow">{{ product.label || 'The everyday collection' }}</p>
        <h1>{{ product.name }}</h1>
        <p class="product-price">{{ money(product.price) }}</p>
        <p class="product-description">{{ product.description }}</p>
        <ProductPurchase :product="product" />
      </div>
    </div>
  </section>
  <section class="section shell related-products">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Good company</p>
        <h2>A little more<br /><em>to consider.</em></h2>
      </div>
      <NuxtLink class="text-link" to="/collection"
        >View the collection <ShopIcon name="arrow"
      /></NuxtLink>
    </div>
    <div class="product-grid">
      <ProductCard
        v-for="(other, index) in products
          .filter((p) => p.id !== product.id)
          .slice(0, 4)"
        :key="other.id"
        :product="other"
        :index="index"
      />
    </div>
  </section>
</template>
