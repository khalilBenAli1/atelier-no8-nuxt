import { describe, expect, it } from 'vitest';
import {
  addToCart,
  cartTotals,
  changeQuantity,
  normalizeCart,
  readCart,
  writeCart,
} from '../lib/cart';
describe('bag rules', () => {
  it('merges a product/size and preserves a separate size', () => {
    const first = addToCart([], 'form-shoulder', 'small', 1).items;
    const second = addToCart(first, 'form-shoulder', 'small', 1).items;
    const third = addToCart(second, 'form-shoulder', 'regular', 1).items;
    expect(third).toEqual([
      { productId: 'form-shoulder', variantId: 'small', quantity: 2 },
      { productId: 'form-shoulder', variantId: 'regular', quantity: 1 },
    ]);
    expect(first[0]?.quantity).toBe(1);
  });
  it('rejects sold-out sizes, unknown products, fractional and excessive quantities', () => {
    for (const [id, size, quantity] of [
      ['travel-case', 'small', 1],
      ['form-shoulder', 'small', 5],
      ['missing', 'small', 1],
      ['form-shoulder', 'small', 1.2],
    ] as const)
      expect(addToCart([], id, size, quantity).error).not.toBe('');
    const items = addToCart([], 'form-shoulder', 'small', 4).items;
    expect(addToCart(items, 'form-shoulder', 'small', 1).items).toEqual(items);
    expect(changeQuantity(items, 'form-shoulder:small', 0)).toEqual(items);
    expect(changeQuantity(items, 'form-shoulder:small', 5)).toEqual(items);
  });
  it('uses exact cents and applies the sample shipping threshold', () => {
    expect(cartTotals([])).toEqual({
      subtotal: 0,
      shipping: 0,
      total: 0,
      count: 0,
    });
    expect(
      cartTotals([
        { productId: 'line-wallet', variantId: 'small', quantity: 2 },
      ]),
    ).toEqual({ subtotal: 18000, shipping: 1200, total: 19200, count: 2 });
    expect(
      cartTotals([
        { productId: 'form-shoulder', variantId: 'small', quantity: 1 },
      ]),
    ).toEqual({ subtotal: 28000, shipping: 0, total: 28000, count: 1 });
  });
  it('recovers versioned data with stock clamping, duplicate merge and field allowlisting', () => {
    const data = {
      version: 1,
      email: 'never-save@example.com',
      items: [
        {
          productId: 'form-shoulder',
          variantId: 'small',
          quantity: 3,
          email: 'private',
        },
        { productId: 'form-shoulder', variantId: 'small', quantity: 3 },
        { productId: 'travel-case', variantId: 'small', quantity: 1 },
        { productId: 'unknown', variantId: 'small', quantity: 1 },
      ],
    };
    expect(normalizeCart(data)).toEqual([
      { productId: 'form-shoulder', variantId: 'small', quantity: 4 },
    ]);
    expect(normalizeCart({ ...data, version: 2 })).toEqual([]);
    expect(
      normalizeCart({
        version: 1,
        items: Array.from({ length: 33 }, () => data.items[0]),
      }),
    ).toEqual([]);
  });
  it('handles malformed, oversized and denied storage without crashing', () => {
    for (const raw of ['{oops', 'x'.repeat(16385)])
      expect(
        readCart({
          getItem: () => raw,
          setItem: () => {},
          removeItem: () => {},
        }),
      ).toEqual([]);
    const denied = {
      getItem: () => {
        throw Error('blocked');
      },
      setItem: () => {
        throw Error('blocked');
      },
      removeItem: () => {},
    };
    expect(readCart(denied)).toEqual([]);
    expect(writeCart(denied, [])).toBe(false);
    let saved = '';
    const adapter = {
      getItem: () => saved,
      setItem: (_key: string, value: string) => {
        saved = value;
      },
      removeItem: () => {},
    };
    const items = addToCart([], 'loop-pouch', 'small', 2).items;
    expect(writeCart(adapter, items)).toBe(true);
    expect(readCart(adapter)).toEqual(items);
  });
});
