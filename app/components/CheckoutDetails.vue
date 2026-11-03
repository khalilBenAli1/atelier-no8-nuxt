<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import {
  countries,
  type CheckoutDetails,
  type CheckoutErrors,
} from '../../lib/checkout';
const details = defineModel<CheckoutDetails>({ required: true });
const props = defineProps<{ errors: CheckoutErrors }>();
const emit = defineEmits<{ review: []; clearErrors: [] }>();
const form = ref<HTMLFormElement | null>(null);
watch(
  () => props.errors,
  async () => {
    await nextTick();
    form.value
      ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
      ?.focus();
  },
);
</script>
<template>
  <form ref="form" novalidate @submit.prevent="emit('review')">
    <p class="quiet">
      Use sample details. They stay in this tab and are never transmitted or
      saved.
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
        emit('clearErrors');
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
      /><span v-if="errors.email" id="email-error" class="field-error">{{
        errors.email
      }}</span></label
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
      ><span v-if="errors.country" id="country-error" class="field-error">{{
        errors.country
      }}</span></label
    ><label class="consent-field"
      ><input
        v-model="details.consent"
        type="checkbox"
        :aria-invalid="!!errors.consent"
        :aria-describedby="errors.consent ? 'consent-error' : undefined"
      /><span
        >I understand this is a simulated order. No purchase or payment will be
        made.</span
      ></label
    >
    <p v-if="errors.consent" id="consent-error" class="field-error">
      {{ errors.consent }}
    </p>
    <button type="submit" class="button full">
      Review demo order <ShopIcon name="arrow" />
    </button>
  </form>
</template>
