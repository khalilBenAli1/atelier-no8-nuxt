<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { money } from '../../data/products';
const cart = useCartStore();
defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const notice = ref('');
const remove = (key: string) => {
  cart.remove(key);
  notice.value = 'Item removed from your bag.';
};
const clear = () => {
  cart.clear();
  notice.value = 'Your bag has been cleared.';
};
</script>
<template>
  <ShopDialog :open="open" title="Your bag" drawer @close="emit('close')"
    ><div class="cart-content">
      <h2>Your bag</h2>
      <p class="eyebrow cart-count">
        {{ cart.totals.count }} {{ cart.totals.count === 1 ? 'item' : 'items' }}
      </p>
      <template v-if="cart.lines.length"
        ><div class="cart-items">
          <BagLine
            v-for="line in cart.lines"
            :key="line.key"
            :line="line"
            @close="emit('close')"
            @remove="remove"
            @quantity="cart.update"
          />
        </div>
        <button class="plain-link continue-link" @click="emit('close')">
          Continue exploring
        </button>
        <div class="cart-bottom">
          <div class="total-row">
            <span>Subtotal</span><span>{{ money(cart.totals.subtotal) }}</span>
          </div>
          <p class="quiet">
            Sample delivery is free from €250; otherwise €12.<br />All prices
            are illustrative. No payment is taken.
          </p>
          <NuxtLink class="button full" to="/checkout" @click="emit('close')"
            >Continue to demo checkout <ShopIcon name="arrow" /></NuxtLink
          ><button class="plain-link clear-bag" @click="clear">
            Clear bag
          </button>
        </div></template
      >
      <div v-else class="cart-empty">
        <ShopIcon name="bag" />
        <h3>A little room<br />for something lovely.</h3>
        <p class="quiet">Your everyday companion is waiting to be found.</p>
        <NuxtLink class="button" to="/collection" @click="emit('close')"
          >Explore the collection <ShopIcon name="arrow"
        /></NuxtLink>
      </div>
      <p class="sr-only" role="status">{{ notice }}</p>
    </div></ShopDialog
  >
</template>
