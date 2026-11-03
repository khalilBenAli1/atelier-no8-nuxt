<script setup lang="ts">
import { useHead } from '#imports';
import { money } from '../../data/products';
import { useCatalogFilters } from '../composables/useCatalogFilters';
const { category, query, sort, maxPrice, matching, change, reset } =
  useCatalogFilters();
const value = (event: Event) => (event.target as HTMLInputElement).value;
useHead({ title: 'The collection — Atelier No.8' });
</script>
<template>
  <section class="shell collection-page">
    <div class="collection-heading">
      <div>
        <p class="eyebrow">Eight pieces. One considered collection.</p>
        <h1>Your kind<br />of <em>everyday.</em></h1>
      </div>
      <p>
        For the long way home, the things you keep close, and everything in
        between.
      </p>
    </div>
    <div class="collection-filters">
      <div class="category-tabs" aria-label="Product categories">
        <button
          :class="{ active: !category }"
          :aria-pressed="!category"
          @click="change('category', '')"
        >
          All pieces</button
        ><button
          v-for="cat in ['Bags', 'Small leather']"
          :key="cat"
          :class="{ active: category === cat }"
          :aria-pressed="category === cat"
          @click="change('category', cat)"
        >
          {{ cat }}
        </button>
      </div>
      <label class="collection-search"
        ><ShopIcon name="search" /><input
          aria-label="Search products"
          type="search"
          placeholder="Find your piece"
          :value="query"
          maxlength="100"
          @input="change('q', value($event))"
      /></label>
    </div>
    <div class="collection-tools">
      <p role="status">
        {{ matching.length }} {{ matching.length === 1 ? 'piece' : 'pieces' }}
      </p>
      <label class="budget-filter"
        >Up to {{ money(maxPrice)
        }}<input
          aria-label="Maximum price"
          type="range"
          min="5000"
          max="35000"
          step="1000"
          :value="maxPrice"
          @input="change('max', value($event))" /></label
      ><button class="plain-link" @click="reset()">Reset filters</button
      ><label class="sort-select"
        >Sort
        <select
          aria-label="Sort products"
          :value="sort"
          @change="change('sort', value($event))"
        >
          <option value="">Our edit</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select></label
      >
    </div>
    <div v-if="matching.length" class="product-grid collection-grid">
      <ProductCard
        v-for="(product, index) in matching"
        :key="product.id"
        :product="product"
        :index="index"
      />
    </div>
    <div v-else class="empty-state">
      <p class="eyebrow">A little room to reconsider</p>
      <h2>Another way<br /><em>to find your piece.</em></h2>
      <p>Try a different search, category or budget.</p>
      <button class="button" @click="reset()">
        Explore all pieces <ShopIcon name="arrow" />
      </button>
    </div>
    <p class="sample-note">
      An original fictional collection. Prices and stock are illustrative.
    </p>
  </section>
</template>
