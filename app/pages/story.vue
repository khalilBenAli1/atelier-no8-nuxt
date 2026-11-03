<script setup lang="ts">
import { useHead } from '#imports';
useHead({ title: 'Our approach — Atelier No.8' });
</script>
<template>
  <section class="shell story-page">
    <p class="eyebrow">The Atelier approach</p>
    <h1>Fewer things.<br /><em>Better company.</em></h1>
    <div class="story-layout">
      <ShopImage
        src="/images/collection-hero.webp"
        alt="Three considered leather accessories in a quiet stone and linen setting"
        priority
      />
      <div>
        <h2>Objects for<br />the <em>everyday.</em></h2>
        <p>
          We imagined Atelier No.8 around a simple idea: the things you reach
          for every day deserve a little thought.
        </p>
        <p>
          A familiar curve. The warmth of a color. A bag that makes room for
          what matters. Eight pieces, with a quiet point of view.
        </p>
        <p>
          This is an original fictional brand and an interactive portfolio shop.
          Its product photography, inventory and prices are illustrative. No
          products are sold, and no orders, payments or messages are sent.
        </p>
        <NuxtLink class="text-link" to="/collection"
          >Find your companion <ShopIcon name="arrow"
        /></NuxtLink>
      </div>
    </div>
  </section>
</template>
