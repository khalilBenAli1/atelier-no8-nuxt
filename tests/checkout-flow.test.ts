import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCheckout } from '../app/composables/useCheckout';
import { useCartStore } from '../app/stores/cart';
beforeEach(() => setActivePinia(createPinia()));
describe('checkout transitions', () => {
  it('isolates bag state between separate application instances', () => {
    const first = useCartStore(createPinia());
    const second = useCartStore(createPinia());
    first.add('line-wallet', 'small', 1);
    expect(first.totals.count).toBe(1);
    expect(second.totals.count).toBe(0);
  });
  it('rejects empty bags and invalid details before review or confirmation', () => {
    const flow = useCheckout();
    flow.finish();
    expect(flow.confirmation.value).toBeNull();
    flow.cart.add('form-shoulder', 'small', 1);
    flow.review();
    expect(flow.step.value).toBe(0);
    expect(Object.keys(flow.errors.value)).toHaveLength(4);
  });
  it('freezes a confirmed edit while clearing the bag and contact state', () => {
    const flow = useCheckout();
    flow.cart.add('form-shoulder', 'small', 2);
    flow.details.value = {
      name: 'Alex Morgan',
      email: 'alex@example.com',
      country: 'France',
      consent: true,
    };
    flow.review();
    expect(flow.step.value).toBe(1);
    flow.finish();
    expect(flow.cart.totals.count).toBe(0);
    expect(flow.details.value.email).toBe('');
    expect(flow.confirmation.value?.total).toBe(56000);
    flow.cart.add('line-wallet', 'regular', 1);
    flow.cart.clear();
    expect(flow.confirmation.value?.total).toBe(56000);
    expect(flow.confirmation.value?.lines[0]?.quantity).toBe(2);
  });
});
