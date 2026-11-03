import { normalizeCart, type CartItem } from '../lib/cart';
export const CART_KEY = 'atelier-no8:bag:v1';
export interface CartStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export function readCart(storage: CartStorage | null): CartItem[] {
  try {
    const raw = storage?.getItem(CART_KEY);
    return raw && raw.length <= 16384 ? normalizeCart(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}
export function writeCart(
  storage: CartStorage | null,
  items: readonly CartItem[],
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(
      CART_KEY,
      JSON.stringify({
        version: 1,
        items: normalizeCart({ version: 1, items }),
      }),
    );
    return true;
  } catch {
    return false;
  }
}
