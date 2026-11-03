import { inject, provide, type InjectionKey, type Ref } from 'vue';
interface BagDrawer {
  show: () => void;
}
const key: InjectionKey<BagDrawer> = Symbol('bag-drawer');
export function provideBagDrawer(open: Ref<boolean>) {
  provide(key, {
    show: () => {
      open.value = true;
    },
  });
}
export function useBagDrawer(): BagDrawer {
  const drawer = inject(key);
  if (!drawer) throw new Error('Bag drawer provider is missing.');
  return drawer;
}
