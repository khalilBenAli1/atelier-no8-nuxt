import {
  readCart,
  writeCart,
  type CartStorage,
} from '../../adapters/cartStorage';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  addToCart,
  cartLines,
  cartTotals,
  changeQuantity,
  itemKey,
  type CartItem,
} from '../../lib/cart';
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const ready = ref(false);
  let storage: CartStorage | null = null;
  const lines = computed(() => cartLines(items.value));
  const totals = computed(() => cartTotals(items.value));
  const save = () => {
    if (ready.value) writeCart(storage, items.value);
  };
  function hydrate(adapter: CartStorage | null) {
    if (ready.value) return;
    storage = adapter;
    items.value = readCart(storage);
    ready.value = true;
  }
  function add(productId: string, variantId: string, quantity: number) {
    const result = addToCart(items.value, productId, variantId, quantity);
    if (result.error) return result.error;
    items.value = result.items;
    save();
    return '';
  }
  function update(key: string, quantity: number) {
    items.value = changeQuantity(items.value, key, quantity);
    save();
  }
  function remove(key: string) {
    items.value = items.value.filter((item) => itemKey(item) !== key);
    save();
  }
  function clear() {
    items.value = [];
    save();
  }
  return {
    items,
    ready,
    lines,
    totals,
    hydrate,
    add,
    update,
    remove,
    clear,
  };
});
