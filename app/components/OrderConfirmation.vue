<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { money } from '../../data/products';
import type { OrderConfirmation } from '../composables/useCheckout';
defineProps<{ confirmation: OrderConfirmation }>();
const heading = ref<HTMLHeadingElement | null>(null);
onMounted(() => heading.value?.focus());
</script>
<template>
  <div class="order-confirmation">
    <span class="confirmation-mark">✓</span>
    <p class="eyebrow">A little considered company</p>
    <h1 ref="heading" tabindex="-1">Imagine it’s<br /><em>on its way.</em></h1>
    <p>
      Thank you, {{ confirmation.name.split(' ')[0] }}. You’ve completed your
      Atelier experience.
    </p>
    <div class="confirmation-ticket">
      <p class="eyebrow">Demo reference / {{ confirmation.reference }}</p>
      <div
        v-for="line in confirmation.lines"
        :key="line.key"
        class="ticket-line"
      >
        <span
          >{{ line.product.name }} / {{ line.variant.name }} ×
          {{ line.quantity }}</span
        ><span>{{ money(line.lineTotal) }}</span>
      </div>
      <div class="total-row">
        <span>Sample total</span><span>{{ money(confirmation.total) }}</span>
      </div>
      <p class="sample-note">
        No order was placed, no payment was taken, and no email was sent. Your
        contact details were not saved.
      </p>
    </div>
    <NuxtLink class="button" to="/collection"
      >Continue exploring <ShopIcon name="arrow"
    /></NuxtLink>
  </div>
</template>
