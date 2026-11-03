import { describe, it, expect } from 'vitest';
import { products } from '../data/products';
import { parseCatalogFilters, filterCatalog } from '../lib/catalog';
describe('catalog rules', () => {
  it('bounds external URL values and preserves valid filters', () => {
    expect(
      parseCatalogFilters({
        category: ['Bags'],
        q: 'a'.repeat(110),
        max: 'Infinity',
        sort: 'unknown',
      }),
    ).toEqual({
      category: '',
      search: 'a'.repeat(100),
      maxPrice: 35000,
      sort: 'recommended',
    });
    expect(
      parseCatalogFilters({
        category: 'Small leather',
        max: '10000',
        sort: 'price-asc',
      }).maxPrice,
    ).toBe(10000);
  });
  it('combines category, search, budget and stable sorting without mutating fixtures', () => {
    const before = products.map((p) => p.id);
    const filters = parseCatalogFilters({
      category: 'Small leather',
      q: 'ivory',
      max: '10000',
      sort: 'price-desc',
    });
    expect(filterCatalog(products, filters).map((p) => p.id)).toEqual([
      'loop-pouch',
    ]);
    expect(products.map((p) => p.id)).toEqual(before);
    expect(
      filterCatalog(products, parseCatalogFilters({ q: 'no matching object' })),
    ).toEqual([]);
  });
});
