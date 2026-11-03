import { computed } from 'vue';
import { useRoute, useRouter } from '#imports';
import { products } from '../../data/products';
import { parseCatalogFilters, filterCatalog } from '../../lib/catalog';
import type { NavigationFailure } from 'vue-router';
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
  let pending: Promise<NavigationFailure | void> = Promise.resolve();
  const navigate = (operation: () => Promise<NavigationFailure | void>) => {
    const request = pending.then(operation);
    // Keep later actions usable after a rejected navigation; callers still receive the original rejection.
    pending = request.catch(() => undefined);
    return request;
  };
  const change = (key: string, value: string) =>
    navigate(() => {
      const next = { ...router.currentRoute.value.query };
      if (!value) delete next[key];
      else next[key] = value;
      return router.replace({ query: next });
    });
  const reset = () => navigate(() => router.replace('/collection'));
  return { category, query, sort, maxPrice, matching, change, reset };
}
