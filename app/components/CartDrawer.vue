<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { money } from '../../data/products';
const cart = useCartStore();
</script>
<template>
  <ShopDialog
    :open="cart.open"
    title="Your bag"
    drawer
    @close="cart.open = false"
    ><div class="cart-content">
      <h2>Your bag</h2>
      <p class="eyebrow cart-count">
        {{ cart.totals.count }} {{ cart.totals.count === 1 ? 'item' : 'items' }}
      </p>
      <template v-if="cart.lines.length"
        ><div class="cart-items">
          <article v-for="line in cart.lines" :key="line.key" class="cart-line">
            <NuxtLink
              :to="'/products/' + line.product.slug"
              tabindex="-1"
              aria-hidden="true"
              @click="cart.open = false"
              ><ShopImage
                :src="line.product.image"
                :alt="line.product.name"
                sizes="140px"
            /></NuxtLink>
            <div>
              <NuxtLink
                :to="'/products/' + line.product.slug"
                @click="cart.open = false"
                ><h3>{{ line.product.name }}</h3></NuxtLink
              >
              <p class="quiet">
                {{ line.product.color }} / {{ line.variant.name }}
              </p>
              <p>{{ money(line.lineTotal) }}</p>
              <div class="quantity-control">
                <button
                  :aria-label="
                    'Decrease ' + line.product.name + ' ' + line.variant.name
                  "
                  :disabled="line.quantity <= 1"
                  @click="cart.update(line.key, line.quantity - 1)"
                >
                  −</button
                ><output
                  :aria-label="
                    'Quantity of ' + line.product.name + ' ' + line.variant.name
                  "
                  >{{ line.quantity }}</output
                ><button
                  :aria-label="
                    'Increase ' + line.product.name + ' ' + line.variant.name
                  "
                  :disabled="line.quantity >= line.variant.stock"
                  @click="cart.update(line.key, line.quantity + 1)"
                >
                  +
                </button>
              </div>
              <button
                class="plain-link remove-item"
                :aria-label="
                  'Remove ' + line.product.name + ' ' + line.variant.name
                "
                @click="cart.remove(line.key)"
              >
                Remove
              </button>
            </div>
          </article>
        </div>
        <button class="plain-link continue-link" @click="cart.open = false">
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
          <NuxtLink
            class="button full"
            to="/checkout"
            @click="cart.open = false"
            >Continue to demo checkout <ShopIcon name="arrow" /></NuxtLink
          ><button class="plain-link clear-bag" @click="cart.clear()">
            Clear bag
          </button>
        </div></template
      >
      <div v-else class="cart-empty">
        <ShopIcon name="bag" />
        <h3>A little room<br />for something lovely.</h3>
        <p class="quiet">Your everyday companion is waiting to be found.</p>
        <NuxtLink class="button" to="/collection" @click="cart.open = false"
          >Explore the collection <ShopIcon name="arrow"
        /></NuxtLink>
      </div>
      <p class="sr-only" role="status">{{ cart.notice }}</p>
    </div></ShopDialog
  >
</template>
