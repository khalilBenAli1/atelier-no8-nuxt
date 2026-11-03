<script setup lang="ts">
import { products } from '../../data/products';
</script>
<template>
  <main>
    <p>ATELIER No.8</p>
    <h1>Considered objects.<br />Everyday companions.</h1>
    <p>An original accessories collection, made to be explored.</p>
    <ul>
      <li v-for="product in products" :key="product.id">
        <NuxtLink :to="`/products/${product.slug}`">{{
          product.name
        }}</NuxtLink>
      </li>
    </ul>
  </main>
</template>
