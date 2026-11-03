<script setup lang="ts">
import { useHead } from '#imports';
import { products } from '../../data/products';
useHead({ title: 'Atelier No.8 — Considered objects, everyday companions' });
</script>
<template>
  <section class="home-hero shell">
    <div class="hero-copy">
      <p class="eyebrow">The everyday collection · 2026</p>
      <h1>Things you’ll<br /><em>reach for.</em></h1>
      <p>Quiet forms. Thoughtful details.<br />Companions for the everyday.</p>
      <NuxtLink class="text-link" to="/collection"
        >Discover the collection <ShopIcon name="arrow" /></NuxtLink
      ><span class="hero-footnote">A little less. A little better.</span>
    </div>
    <div class="hero-art">
      <ShopImage
        src="/images/collection-hero.webp"
        alt="Three unbranded bags in caramel, espresso and ivory on pale stone plinths"
        priority
        sizes="(max-width: 700px) 100vw, 65vw"
      /><span class="image-label">Objects, considered.</span>
    </div>
  </section>
  <section class="section shell">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Made for the way you move</p>
        <h2>Everyday,<br /><em>beautifully.</em></h2>
      </div>
      <div>
        <p>
          A soft shoulder, a familiar fold, a place for the little things. Find
          the piece that feels like you.
        </p>
        <NuxtLink class="text-link" to="/collection"
          >Explore all eight pieces <ShopIcon name="arrow"
        /></NuxtLink>
      </div>
    </div>
    <div class="product-grid">
      <ProductCard
        v-for="(product, index) in products.slice(0, 4)"
        :key="product.id"
        :product="product"
        :index="index"
      />
    </div>
  </section>
  <section class="editorial-feature">
    <ShopImage
      src="/images/form-shoulder.webp"
      alt="The Form Shoulder in ivory, with natural leather grain and a quiet curved silhouette"
    />
    <div>
      <p class="eyebrow">Form follows the everyday</p>
      <h2>Soft structure.<br /><em>Lasting company.</em></h2>
      <p>
        Not an occasion. A companion. Explore shapes that make room for your
        day, with nothing more than they need.
      </p>
      <NuxtLink class="text-link" to="/products/form-shoulder"
        >Meet The Form Shoulder <ShopIcon name="arrow"
      /></NuxtLink>
    </div>
  </section>
  <section class="story-invitation shell">
    <p class="eyebrow">The Atelier approach</p>
    <h2>Considered objects.<br /><em>Uncomplicated days.</em></h2>
    <NuxtLink class="text-link" to="/story"
      >A little about us <ShopIcon name="arrow"
    /></NuxtLink>
  </section>
</template>
