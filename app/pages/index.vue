<script setup lang="ts">
import { useHead } from '#imports';
import { products } from '../../data/products';
useHead({ title: 'Atelier No.8 — Considered objects, everyday companions' });
</script>
<template>
  <section class="campaign-opening shell">
    <div class="campaign-heading">
      <p class="eyebrow">Collection No.01 / The everyday edit</p>
      <h1>Good company.&nbsp;<br /><em>Every day.</em></h1>
      <p>
        Quiet forms. Thoughtful details.<br />A considered place in your
        everyday.
      </p>
    </div>
    <div class="campaign-edit">
      <ProductCard
        v-for="(product, index) in products.slice(0, 3)"
        :key="product.id"
        :product="product"
        :index="index"
      />
    </div>
    <div class="campaign-footer">
      <span class="eyebrow">Three shapes. Your point of view.</span
      ><NuxtLink class="text-link" to="/collection"
        >Discover all eight pieces <ShopIcon name="arrow"
      /></NuxtLink>
    </div>
  </section>
  <section class="section shell">
    <div class="section-heading">
      <div>
        <p class="eyebrow">The little things, considered</p>
        <h2>Close to hand.<br /><em>Easy to keep.</em></h2>
      </div>
      <div>
        <p>
          A familiar fold. A place for the essentials. Small companions, with
          nothing more than they need.
        </p>
        <NuxtLink class="text-link" to="/collection?category=Small+leather"
          >Explore small leather <ShopIcon name="arrow"
        /></NuxtLink>
      </div>
    </div>
    <div class="product-grid">
      <ProductCard
        v-for="(product, index) in products.slice(4, 8)"
        :key="product.id"
        :product="product"
        :index="index + 4"
      />
    </div>
  </section>
  <section class="atelier-statement">
    <div class="shell">
      <span class="atelier-number">No.8</span>
      <p class="eyebrow">The Atelier approach</p>
      <h2>A little less.<br /><em>A little better.</em></h2>
      <p>
        Not an occasion. A companion.<br />Objects imagined around the way you
        move.
      </p>
      <NuxtLink class="text-link" to="/story"
        >Considered, by design <ShopIcon name="arrow"
      /></NuxtLink>
    </div>
  </section>
</template>
