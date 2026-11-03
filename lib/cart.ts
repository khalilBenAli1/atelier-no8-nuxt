import { findProduct, type Product, type Variant } from '../data/products';
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
export interface CartLine extends CartItem {
  key: string;
  product: Product;
  variant: Variant;
  lineTotal: number;
}
export const itemKey = (item: Pick<CartItem, 'productId' | 'variantId'>) =>
  `${item.productId}:${item.variantId}`;
export function cartLines(items: readonly CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = findProduct(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return product && variant
      ? [
          {
            ...item,
            key: itemKey(item),
            product,
            variant,
            lineTotal: product.price * item.quantity,
          },
        ]
      : [];
  });
}
export function cartTotals(items: readonly CartItem[]) {
  const subtotal = cartLines(items).reduce(
    (sum, line) => sum + line.lineTotal,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 25000 ? 0 : 1200;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function normalizeCart(value: unknown): CartItem[] {
  if (
    !record(value) ||
    value.version !== 1 ||
    !Array.isArray(value.items) ||
    value.items.length > 32
  )
    return [];
  const items: CartItem[] = [];
  for (const raw of value.items) {
    if (
      !record(raw) ||
      typeof raw.productId !== 'string' ||
      typeof raw.variantId !== 'string' ||
      typeof raw.quantity !== 'number' ||
      !Number.isSafeInteger(raw.quantity) ||
      raw.quantity < 1
    )
      continue;
    const product = findProduct(raw.productId);
    const variant = product?.variants.find((v) => v.id === raw.variantId);
    if (!product || !variant || !variant.stock) continue;
    const existing = items.find(
      (item) => item.productId === product.id && item.variantId === variant.id,
    );
    if (existing)
      existing.quantity = Math.min(
        existing.quantity + raw.quantity,
        variant.stock,
      );
    else
      items.push({
        productId: product.id,
        variantId: variant.id,
        quantity: Math.min(raw.quantity, variant.stock),
      });
  }
  return items;
}
export function addToCart(
  items: readonly CartItem[],
  productId: string,
  variantId: string,
  quantity: number,
): { items: CartItem[]; error: string } {
  const product = findProduct(productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  const current =
    items.find(
      (item) => item.productId === productId && item.variantId === variantId,
    )?.quantity ?? 0;
  if (!product || !variant || !Number.isSafeInteger(quantity) || quantity < 1)
    return {
      items: [...items],
      error: 'Choose a valid product, size and quantity.',
    };
  if (quantity + current > variant.stock)
    return {
      items: [...items],
      error: variant.stock
        ? 'You’ve reached the available quantity for this size.'
        : 'This size is currently unavailable.',
    };
  return {
    items: current
      ? items.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : { ...item },
        )
      : [...items, { productId, variantId, quantity }],
    error: '',
  };
}
export function changeQuantity(
  items: readonly CartItem[],
  key: string,
  quantity: number,
): CartItem[] {
  return items.map((item) => {
    if (itemKey(item) !== key) return { ...item };
    const stock =
      findProduct(item.productId)?.variants.find((v) => v.id === item.variantId)
        ?.stock ?? 0;
    return {
      ...item,
      quantity:
        Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= stock
          ? quantity
          : item.quantity,
    };
  });
}
