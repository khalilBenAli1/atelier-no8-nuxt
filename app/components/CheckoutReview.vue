<script setup lang="ts">
import type { CheckoutDetails } from '../../lib/checkout';
defineProps<{ details: CheckoutDetails }>();
const emit = defineEmits<{ edit: []; finish: [] }>();
</script>
<template>
  <div>
    <dl class="review-details">
      <div>
        <dt>Your details</dt>
        <dd>
          {{ details.name }}<br />{{ details.email
          }}<button class="plain-link" @click="emit('edit')">
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
        <dd>Illustrative standard delivery<br />No goods will be shipped.</dd>
      </div>
    </dl>
    <p class="simulation-note">
      Everything here is a demonstration. No address or payment-card information
      is required, and no message is sent.
    </p>
    <button class="button full" @click="emit('finish')">
      Complete demo order <ShopIcon name="arrow" />
    </button>
  </div>
</template>
