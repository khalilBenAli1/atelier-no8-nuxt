<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useHead } from '#imports';
import { useCartStore } from '../stores/cart';
import { money } from '../../data/products';
import {
  validateCheckout,
  countries,
  type CheckoutDetails,
  type CheckoutErrors,
} from '../../lib/checkout';
import type { CartLine } from '../../lib/cart';
const cart = useCartStore();
const step = ref(0);
const heading = ref<HTMLHeadingElement | null>(null);
const form = ref<HTMLFormElement | null>(null);
const details = ref<CheckoutDetails>({
  name: '',
  email: '',
  country: '',
  consent: false,
});
const errors = ref<CheckoutErrors>({});
const confirmation = ref<{
  reference: string;
  name: string;
  lines: CartLine[];
  total: number;
  count: number;
} | null>(null);
const hasItems = computed(() => cart.items.length > 0);
watch(step, async () => {
  await nextTick();
  heading.value?.focus();
});
const review = async () => {
  errors.value = validateCheckout(details.value);
  if (Object.keys(errors.value).length) {
    await nextTick();
    form.value
      ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
      ?.focus();
    return;
  }
  if (hasItems.value) step.value = 1;
};
const finish = () => {
  if (!hasItems.value) return;
  if (Object.keys(validateCheckout(details.value)).length) {
    step.value = 0;
    return;
  }
  confirmation.value = {
    reference: 'A8-' + crypto.randomUUID().slice(0, 6).toUpperCase(),
    name: details.value.name.trim(),
    lines: cart.lines.map((line) => ({ ...line })),
    total: cart.totals.total,
    count: cart.totals.count,
  };
  cart.clear();
  details.value = { name: '', email: '', country: '', consent: false };
  void nextTick(() => heading.value?.focus());
};
useHead({ title: 'Your demo checkout — Atelier No.8' });
</script>
<template>
  <section class="shell checkout-page">
    <template v-if="confirmation"
      ><div class="order-confirmation">
        <span class="confirmation-mark">✓</span>
        <p class="eyebrow">A little considered company</p>
        <h1 ref="heading" tabindex="-1">
          Imagine it’s<br /><em>on its way.</em>
        </h1>
        <p>
          Thank you, {{ confirmation.name.split(' ')[0] }}. You’ve completed
          your Atelier experience.
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
            <span>Sample total</span
            ><span>{{ money(confirmation.total) }}</span>
          </div>
          <p class="sample-note">
            No order was placed, no payment was taken, and no email was sent.
            Your contact details were not saved.
          </p>
        </div>
        <NuxtLink class="button" to="/collection"
          >Continue exploring <ShopIcon name="arrow"
        /></NuxtLink></div></template
    ><template v-else-if="!hasItems"
      ><div class="empty-state">
        <p class="eyebrow">Your everyday starts here</p>
        <h1>A little room<br /><em>for something lovely.</em></h1>
        <p>Your bag is empty. Find a piece to begin your demo checkout.</p>
        <NuxtLink class="button" to="/collection"
          >Explore the collection <ShopIcon name="arrow"
        /></NuxtLink></div></template
    ><template v-else
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
          <form
            v-if="step === 0"
            ref="form"
            novalidate
            @submit.prevent="review"
          >
            <p class="quiet">
              Use sample details. They stay in this tab and are never
              transmitted or saved.
            </p>
            <button
              type="button"
              class="plain-link sample-details"
              @click="
                details = {
                  name: 'Alex Morgan',
                  email: 'alex@example.com',
                  country: 'France',
                  consent: false,
                };
                errors = {};
              "
            >
              Use sample details</button
            ><label
              ><span id="checkout-name-label">Your name</span
              ><input
                v-model="details.name"
                aria-labelledby="checkout-name-label"
                autocomplete="off"
                maxlength="100"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : undefined"
              /><span v-if="errors.name" id="name-error" class="field-error">{{
                errors.name
              }}</span></label
            ><label
              ><span id="checkout-email-label">Email address</span
              ><input
                v-model="details.email"
                aria-labelledby="checkout-email-label"
                type="email"
                autocomplete="off"
                maxlength="254"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'email-error' : undefined"
              /><span
                v-if="errors.email"
                id="email-error"
                class="field-error"
                >{{ errors.email }}</span
              ></label
            ><label
              ><span id="checkout-country-label">Demo destination</span
              ><select
                v-model="details.country"
                aria-labelledby="checkout-country-label"
                :aria-invalid="!!errors.country"
                :aria-describedby="errors.country ? 'country-error' : undefined"
              >
                <option value="">Choose a destination</option>
                <option v-for="country in countries" :key="country">
                  {{ country }}
                </option></select
              ><span
                v-if="errors.country"
                id="country-error"
                class="field-error"
                >{{ errors.country }}</span
              ></label
            ><label class="consent-field"
              ><input
                v-model="details.consent"
                type="checkbox"
                :aria-invalid="!!errors.consent"
                :aria-describedby="errors.consent ? 'consent-error' : undefined"
              /><span
                >I understand this is a simulated order. No purchase or payment
                will be made.</span
              ></label
            >
            <p v-if="errors.consent" id="consent-error" class="field-error">
              {{ errors.consent }}
            </p>
            <button type="submit" class="button full">
              Review demo order <ShopIcon name="arrow" />
            </button>
          </form>
          <div v-else>
            <dl class="review-details">
              <div>
                <dt>Your details</dt>
                <dd>
                  {{ details.name }}<br />{{ details.email
                  }}<button class="plain-link" @click="step = 0">
                    Edit details
                  </button>
                </dd>
              </div>
              <div>
                <dt>Demo destination</dt>
                <dd>{{ details.country }}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>
                  Illustrative standard delivery<br />No goods will be shipped.
                </dd>
              </div>
            </dl>
            <p class="simulation-note">
              Everything here is a demonstration. No address or payment-card
              information is required, and no message is sent.
            </p>
            <button class="button full" @click="finish">
              Complete demo order <ShopIcon name="arrow" />
            </button>
          </div>
        </div>
        <aside class="checkout-summary">
          <h2>Your considered edit</h2>
          <article
            v-for="line in cart.lines"
            :key="line.key"
            class="summary-line"
          >
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
              <dd>{{ money(cart.totals.subtotal) }}</dd>
            </div>
            <div>
              <dt>Sample delivery</dt>
              <dd>
                {{
                  cart.totals.shipping
                    ? money(cart.totals.shipping)
                    : 'Complimentary'
                }}
              </dd>
            </div>
            <div class="total-row">
              <dt>Sample total</dt>
              <dd>{{ money(cart.totals.total) }}</dd>
            </div>
          </dl>
          <p class="sample-note">
            Illustrative prices include sample tax. No additional tax is
            charged. Delivery: €12 below €250; otherwise complimentary.
          </p>
          <button class="plain-link" @click="cart.open = true">
            Edit your bag
          </button>
        </aside>
      </div></template
    >
  </section>
</template>
