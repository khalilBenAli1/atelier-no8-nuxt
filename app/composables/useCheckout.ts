import { computed, ref } from 'vue';
import { useCartStore } from '../stores/cart';
import {
  validateCheckout,
  type CheckoutDetails,
  type CheckoutErrors,
} from '../../lib/checkout';
import type { CartLine } from '../../lib/cart';
export interface OrderConfirmation {
  reference: string;
  name: string;
  lines: CartLine[];
  total: number;
  count: number;
}
const emptyDetails = (): CheckoutDetails => ({
  name: '',
  email: '',
  country: '',
  consent: false,
});
export function useCheckout() {
  const cart = useCartStore();
  const step = ref(0);
  const details = ref<CheckoutDetails>(emptyDetails());
  const errors = ref<CheckoutErrors>({});
  const confirmation = ref<OrderConfirmation | null>(null);
  const hasItems = computed(() => cart.items.length > 0);
  function review() {
    errors.value = validateCheckout(details.value);
    if (!Object.keys(errors.value).length && hasItems.value) step.value = 1;
  }
  function finish() {
    if (!hasItems.value) return;
    if (Object.keys(validateCheckout(details.value)).length) {
      step.value = 0;
      return;
    }
    confirmation.value = {
      reference: 'A8-' + crypto.randomUUID().slice(0, 6).toUpperCase(),
      name: details.value.name.trim(),
      lines: cart.lines.map((line) => ({
        ...line,
        product: { ...line.product },
        variant: { ...line.variant },
      })),
      total: cart.totals.total,
      count: cart.totals.count,
    };
    cart.clear();
    details.value = emptyDetails();
  }
  return {
    cart,
    step,
    details,
    errors,
    confirmation,
    hasItems,
    review,
    finish,
  };
}
