<script setup lang="ts">
import { useRoute, createError, useHead } from '#imports';
import { findProduct, money } from '../../../data/products';
const route = useRoute();
const product = findProduct(String(route.params.slug));
if (!product)
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
useHead({ title: `${product.name} — Atelier No.8` });
</script>
<template>
  <main>
    <NuxtLink to="/">Atelier No.8</NuxtLink>
    <h1>{{ product?.name }}</h1>
    <p>{{ product?.description }}</p>
    <p>{{ money(product?.price ?? 0) }}</p>
  </main>
</template>
