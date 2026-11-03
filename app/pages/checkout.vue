<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useHead } from '#imports';
import { useCheckout } from '../composables/useCheckout';
import { useBagDrawer } from '../composables/useBagDrawer';
const { cart, step, details, errors, confirmation, hasItems, review, finish } =
  useCheckout();
const drawer = useBagDrawer();
const heading = ref<HTMLHeadingElement | null>(null);
watch(step, async () => {
  await nextTick();
  heading.value?.focus();
});
useHead({ title: 'Your demo checkout — Atelier No.8' });
</script>
<template>
  <section class="shell checkout-page">
    <OrderConfirmation v-if="confirmation" :confirmation="confirmation" />
    <div v-else-if="!hasItems" class="empty-state">
      <p class="eyebrow">Your everyday starts here</p>
      <h1>A little room<br /><em>for something lovely.</em></h1>
      <p>Your bag is empty. Find a piece to begin your demo checkout.</p>
      <NuxtLink class="button" to="/collection"
        >Explore the collection <ShopIcon name="arrow"
      /></NuxtLink>
    </div>
    <template v-else
      ><NuxtLink class="back-link" to="/collection"
        >← Continue exploring</NuxtLink
      >
      <div class="checkout-heading">
        <p class="eyebrow">A thoughtful next step</p>
        <h1>Your next<br /><em>everyday.</em></h1>
        <p>
          This is a simulated checkout. No purchase, delivery or payment will be
          made.
        </p>
      </div>
      <div class="checkout-grid">
        <div class="checkout-panel">
          <ol class="checkout-steps">
            <li :class="{ active: step === 0 }">
              <button
                :aria-current="step === 0 ? 'step' : undefined"
                @click="step = 0"
              >
                01 / Your details
              </button>
            </li>
            <li :class="{ active: step === 1 }">
              <span :aria-current="step === 1 ? 'step' : undefined"
                >02 / Review</span
              >
            </li>
          </ol>
          <h2 ref="heading" tabindex="-1">
            {{ step === 0 ? 'A few little details.' : 'One last look.' }}
          </h2>
          <CheckoutDetails
            v-if="step === 0"
            v-model="details"
            :errors="errors"
            @review="review"
            @clear-errors="errors = {}"
          /><CheckoutReview
            v-else
            :details="details"
            @edit="step = 0"
            @finish="finish"
          />
        </div>
        <CheckoutSummary
          :lines="cart.lines"
          :totals="cart.totals"
          @edit-bag="drawer.show"
        /></div
    ></template>
  </section>
</template>
