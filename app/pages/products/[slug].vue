<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useHead, createError } from '#imports';
import { findProduct, money, products } from '../../../data/products';
import { useCartStore } from '../../stores/cart';
const route = useRoute();
const product = findProduct(String(route.params.slug));
if (!product)
  throw createError({
    statusCode: 404,
    statusMessage: 'This piece is yet to be found',
  });
const cart = useCartStore();
const selected = ref(
  product.variants.find((v) => v.stock > 0)?.id ??
    product.variants[0]?.id ??
    '',
);
const quantity = ref(1);
const error = ref('');
const gallery = ref(false);
const detail = ref(false);
const variant = computed(() =>
  product.variants.find((v) => v.id === selected.value),
);
const inBag = computed(
  () =>
    cart.items.find(
      (i) => i.productId === product.id && i.variantId === selected.value,
    )?.quantity ?? 0,
);
const remaining = computed(() =>
  Math.max(0, (variant.value?.stock ?? 0) - inBag.value),
);
const add = () => {
  error.value = cart.add(product.id, selected.value, quantity.value);
};
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
          /><span class="image-zoom"
            >View photograph <ShopIcon name="plus"
          /></span>
        </button>
      </div>
      <div class="product-info">
        <p class="eyebrow">{{ product.label || 'The everyday collection' }}</p>
        <h1>{{ product.name }}</h1>
        <p class="product-price">{{ money(product.price) }}</p>
        <p class="product-description">{{ product.description }}</p>
        <div class="color-choice">
          <span class="eyebrow">Colour / {{ product.color }}</span
          ><span
            class="color-swatch"
            :style="{ background: product.colorHex }"
          />
        </div>
        <fieldset class="size-choice">
          <legend class="eyebrow">Size / {{ variant?.name }}</legend>
          <label
            v-for="v in product.variants"
            :key="v.id"
            :class="{ selected: selected === v.id }"
            ><input
              v-model="selected"
              type="radio"
              name="size"
              :value="v.id"
              @change="
                quantity = 1;
                error = '';
              "
            />{{ v.name }}<span v-if="!v.stock"> · Sold out</span></label
          >
        </fieldset>
        <p class="size-note">
          {{
            selected === 'small' ? 'Compact proportion' : 'Everyday proportion'
          }}
          · Photography shows the Regular silhouette.
        </p>
        <div class="purchase-row">
          <div class="quantity-control product-quantity">
            <button
              aria-label="Decrease quantity"
              :disabled="quantity <= 1"
              @click="quantity--"
            >
              −</button
            ><output aria-label="Selected quantity">{{ quantity }}</output
            ><button
              aria-label="Increase quantity"
              :disabled="quantity >= remaining"
              @click="quantity++"
            >
              +
            </button>
          </div>
          <button class="button add-button" :disabled="!remaining" @click="add">
            {{
              !variant?.stock
                ? 'Currently unavailable'
                : !remaining
                  ? 'All available pieces in bag'
                  : 'Add to bag'
            }}<ShopIcon name="arrow" />
          </button>
        </div>
        <p v-if="error" class="field-error" role="alert">{{ error }}</p>
        <p class="delivery-note">Sample delivery, complimentary from €250.</p>
        <details>
          <summary>Product details <ShopIcon name="plus" /></summary>
          <p>
            {{ product.material }}. Two illustrative sizes: Small (compact) and
            Regular (everyday). This is original product artwork, not a
            manufactured item.
          </p>
        </details>
        <details>
          <summary>Delivery & returns <ShopIcon name="plus" /></summary>
          <p>
            This is a portfolio shop. No goods are sold, shipped or returned.
            The demo uses an illustrative €12 delivery fee below €250, with no
            extra tax added.
          </p>
        </details>
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
