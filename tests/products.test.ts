import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
describe('product fixture integrity', () => {
  it('provides unique static routes and bounded integer inventory', () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    expect(products.length).toBeGreaterThanOrEqual(8);
    for (const product of products) {
      expect(Number.isSafeInteger(product.price) && product.price > 0).toBe(
        true,
      );
      expect(new Set(product.variants.map((v) => v.id)).size).toBe(
        product.variants.length,
      );
      for (const variant of product.variants)
        expect(Number.isSafeInteger(variant.stock) && variant.stock >= 0).toBe(
          true,
        );
    }
  });
});
