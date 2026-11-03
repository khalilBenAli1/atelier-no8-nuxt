import { defineNuxtPlugin } from '#app';
import { useCartStore } from '../stores/cart';
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    let storage: Storage | null;
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
    useCartStore(nuxtApp.$pinia).hydrate(storage);
  });
});
