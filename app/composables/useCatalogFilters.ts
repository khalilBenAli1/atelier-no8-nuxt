import { computed } from 'vue';
import { useRoute, useRouter } from '#imports';
import { products } from '../../data/products';
import { parseCatalogFilters, filterCatalog } from '../../lib/catalog';
export function useCatalogFilters() {
  const route = useRoute();
  const router = useRouter();
  const filters = computed(() => parseCatalogFilters(route.query));
  const category = computed(() => filters.value.category);
  const query = computed(() => filters.value.search);
  const sort = computed(() =>
    filters.value.sort === 'recommended' ? '' : filters.value.sort,
  );
  const maxPrice = computed(() => filters.value.maxPrice);
  const matching = computed(() => filterCatalog(products, filters.value));
  const change = (key: string, value: string) => {
    const next = { ...route.query };
    if (!value) delete next[key];
    else next[key] = value;
    void router.replace({ query: next });
  };
  const reset = () => router.replace('/collection');
  return { category, query, sort, maxPrice, matching, change, reset };
}
