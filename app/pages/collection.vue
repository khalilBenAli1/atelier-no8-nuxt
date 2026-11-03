<script setup lang="ts">
import { products } from '../../data/products';
</script>
<template>
  <main>
    <NuxtLink to="/">Atelier No.8</NuxtLink>
    <h1>The collection</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        <NuxtLink :to="`/products/${product.slug}`">{{
          product.name
        }}</NuxtLink>
      </li>
    </ul>
  </main>
</template>
