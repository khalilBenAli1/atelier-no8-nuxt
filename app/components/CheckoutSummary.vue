<script setup lang="ts">
import { money } from '../../data/products';
import type { CartLine } from '../../lib/cart';
import type { cartTotals } from '../../lib/cart';
defineProps<{ lines: CartLine[]; totals: ReturnType<typeof cartTotals> }>();
const emit = defineEmits<{ editBag: [] }>();
</script>
<template>
  <aside class="checkout-summary">
    <h2>Your considered edit</h2>
    <article v-for="line in lines" :key="line.key" class="summary-line">
      <ShopImage
        :src="line.product.image"
        :alt="line.product.name"
        sizes="100px"
      />
      <div>
        <h3>{{ line.product.name }}</h3>
        <p class="quiet">
          {{ line.product.color }} / {{ line.variant.name }} ×
          {{ line.quantity }}
        </p>
        <p>{{ money(line.lineTotal) }}</p>
      </div>
    </article>
    <dl class="summary-totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ money(totals.subtotal) }}</dd>
      </div>
      <div>
        <dt>Sample delivery</dt>
        <dd>
          {{ totals.shipping ? money(totals.shipping) : 'Complimentary' }}
        </dd>
      </div>
      <div class="total-row">
        <dt>Sample total</dt>
        <dd>{{ money(totals.total) }}</dd>
      </div>
    </dl>
    <p class="sample-note">
      Illustrative prices include sample tax. No additional tax is charged.
      Delivery: €12 below €250; otherwise complimentary.
    </p>
    <button class="plain-link" @click="emit('editBag')">Edit your bag</button>
  </aside>
</template>
