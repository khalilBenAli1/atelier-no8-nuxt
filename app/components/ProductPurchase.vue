<script setup lang="ts">
import type { Product } from '../../data/products';
import { useProductPurchase } from '../composables/useProductPurchase';
const props = defineProps<{ product: Product }>();
const { selected, quantity, error, variant, remaining, add } =
  useProductPurchase(props.product);
</script>
<template>
  <div class="color-choice">
    <span class="eyebrow">Colour / {{ product.color }}</span
    ><span class="color-swatch" :style="{ background: product.colorHex }" />
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
    {{ selected === 'small' ? 'Compact proportion' : 'Everyday proportion' }}
    · Photography shows the Regular silhouette.
  </p>
  <div class="purchase-row">
    <QuantityControl
      v-model="quantity"
      :max="remaining"
      label="quantity"
      class="product-quantity"
    />
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
      Regular (everyday). This is original product artwork, not a manufactured
      item.
    </p>
  </details>
  <details>
    <summary>Delivery & returns <ShopIcon name="plus" /></summary>
    <p>
      This is a portfolio shop. No goods are sold, shipped or returned. The demo
      uses an illustrative €12 delivery fee below €250, with no extra tax added.
    </p>
  </details>
</template>
