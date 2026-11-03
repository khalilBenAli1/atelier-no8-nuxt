import type { Product } from '../data/products';
export interface CatalogFilters {
  category: string;
  search: string;
  maxPrice: number;
  sort: 'recommended' | 'price-asc' | 'price-desc';
}
export function parseCatalogFilters(
  query: Record<string, unknown>,
): CatalogFilters {
  const text = (key: string) =>
    typeof query[key] === 'string' ? String(query[key]) : '';
  const category = text('category');
  const max = Number(text('max'));
  const sort = text('sort');
  return {
    category: ['Bags', 'Small leather'].includes(category) ? category : '',
    search: text('q').slice(0, 100),
    maxPrice:
      Number.isSafeInteger(max) && max >= 5000 && max <= 35000 ? max : 35000,
    sort: sort === 'price-asc' || sort === 'price-desc' ? sort : 'recommended',
  };
}
export function filterCatalog(
  products: readonly Product[],
  filters: CatalogFilters,
): Product[] {
  const list = products.filter(
    (p) =>
      (!filters.category || p.category === filters.category) &&
      p.price <= filters.maxPrice &&
      (!filters.search ||
        `${p.name} ${p.color} ${p.category}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())),
  );
  if (filters.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  return list;
}
