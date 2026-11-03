import { computed, ref } from 'vue';
import type { Product } from '../../data/products';
import { useCartStore } from '../stores/cart';
import { useBagDrawer } from './useBagDrawer';
export function useProductPurchase(product: Product) {
  const cart = useCartStore();
  const drawer = useBagDrawer();
  const selected = ref(
    product.variants.find((v) => v.stock > 0)?.id ??
      product.variants[0]?.id ??
      '',
  );
  const quantity = ref(1);
  const error = ref('');
  const variant = computed(() =>
    product.variants.find((v) => v.id === selected.value),
  );
  const inBag = computed(
    () =>
      cart.items.find(
        (i) => i.productId === product.id && i.variantId === selected.value,
      )?.quantity ?? 0,
  );
  const remaining = computed(() =>
    Math.max(0, (variant.value?.stock ?? 0) - inBag.value),
  );
  const add = () => {
    error.value = cart.add(product.id, selected.value, quantity.value);
    if (!error.value) drawer.show();
  };
  return { selected, quantity, error, variant, remaining, add };
}
