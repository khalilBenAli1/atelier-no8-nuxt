<script setup lang="ts">
import { money } from '../../data/products';
import type { CartLine } from '../../lib/cart';
defineProps<{ line: CartLine }>();
const emit = defineEmits<{
  close: [];
  remove: [key: string];
  quantity: [key: string, quantity: number];
}>();
</script>
<template>
  <article class="cart-line">
    <NuxtLink
      :to="'/products/' + line.product.slug"
      tabindex="-1"
      aria-hidden="true"
      @click="emit('close')"
      ><ShopImage
        :src="line.product.image"
        :alt="line.product.name"
        sizes="140px"
    /></NuxtLink>
    <div>
      <NuxtLink :to="'/products/' + line.product.slug" @click="emit('close')"
        ><h3>{{ line.product.name }}</h3></NuxtLink
      >
      <p class="quiet">{{ line.product.color }} / {{ line.variant.name }}</p>
      <p>{{ money(line.lineTotal) }}</p>
      <QuantityControl
        :model-value="line.quantity"
        :max="line.variant.stock"
        :label="line.product.name + ' ' + line.variant.name"
        @update:model-value="emit('quantity', line.key, $event)"
      />
      <button
        class="plain-link remove-item"
        :aria-label="'Remove ' + line.product.name + ' ' + line.variant.name"
        @click="emit('remove', line.key)"
      >
        Remove
      </button>
    </div>
  </article>
</template>
