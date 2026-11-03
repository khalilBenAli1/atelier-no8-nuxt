export interface Variant {
  id: string;
  name: string;
  dimensions: string;
  stock: number;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'Bags' | 'Small leather';
  color: string;
  colorHex: string;
  price: number;
  description: string;
  material: string;
  image: string;
  variants: Variant[];
  label?: string;
}
const sizes = (small: number, regular: number): Variant[] => [
  {
    id: 'small',
    name: 'Small',
    dimensions: 'Compact proportion',
    stock: small,
  },
  {
    id: 'regular',
    name: 'Regular',
    dimensions: 'Everyday proportion',
    stock: regular,
  },
];
export const products: Product[] = [
  {
    id: 'form-shoulder',
    slug: 'form-shoulder',
    name: 'The Form Shoulder',
    category: 'Bags',
    color: 'Ivory',
    colorHex: '#d6c8ac',
    price: 28000,
    description:
      'A softly structured silhouette, made to move through your day. Curved lines, a comfortable shoulder strap, and just the right amount of room.',
    material:
      'Illustrative grained leather · cotton lining · brushed brass hardware',
    image: '/images/form-shoulder.webp',
    variants: sizes(4, 6),
    label: 'The everyday collection',
  },
  {
    id: 'daily-tote',
    slug: 'daily-tote',
    name: 'The Daily Tote',
    category: 'Bags',
    color: 'Caramel',
    colorHex: '#ad744c',
    price: 34000,
    description:
      'For the long way home. An open, generous tote with clean lines and slender handles that sit easily on the shoulder.',
    material: 'Illustrative smooth leather · cotton lining · reinforced base',
    image: '/images/daily-tote.webp',
    variants: sizes(3, 5),
    label: 'Room for the everyday',
  },
  {
    id: 'arc-mini',
    slug: 'arc-mini',
    name: 'The Arc Mini',
    category: 'Bags',
    color: 'Espresso',
    colorHex: '#43352c',
    price: 24000,
    description:
      'A little structure. A little softness. A compact top-handle companion for the things you reach for most.',
    material: 'Illustrative smooth leather · suede-effect lining · brass clasp',
    image: '/images/arc-mini.webp',
    variants: sizes(5, 2),
    label: 'Small, considered',
  },
  {
    id: 'fold-clutch',
    slug: 'fold-clutch',
    name: 'The Fold Clutch',
    category: 'Bags',
    color: 'Mocha',
    colorHex: '#806858',
    price: 18000,
    description:
      'An easy fold and a quiet silhouette. A tactile clutch for evenings that become mornings.',
    material: 'Illustrative supple leather · hidden magnetic closure',
    image: '/images/fold-clutch.webp',
    variants: sizes(4, 0),
  },
  {
    id: 'soft-crossbody',
    slug: 'soft-crossbody',
    name: 'The Soft Crossbody',
    category: 'Bags',
    color: 'Chestnut',
    colorHex: '#7e4d35',
    price: 22000,
    description:
      'Hands free, mind elsewhere. Rounded edges and an adjustable strap, designed around a day on the move.',
    material: 'Illustrative grained leather · cotton lining · adjustable strap',
    image: '/images/soft-crossbody.webp',
    variants: sizes(5, 4),
  },
  {
    id: 'line-wallet',
    slug: 'line-wallet',
    name: 'The Line Wallet',
    category: 'Small leather',
    color: 'Espresso',
    colorHex: '#43352c',
    price: 9000,
    description:
      'Less to carry. More to keep. A slim folded wallet with neat card slots and a thoughtful place for the essentials.',
    material: 'Illustrative smooth leather · stitched edge · card slots',
    image: '/images/line-wallet.webp',
    variants: sizes(8, 6),
  },
  {
    id: 'loop-pouch',
    slug: 'loop-pouch',
    name: 'The Loop Pouch',
    category: 'Small leather',
    color: 'Ivory',
    colorHex: '#d6c8ac',
    price: 7500,
    description:
      'The small things, together. A soft zip pouch with a removable wrist loop, ready to slip into a bag or go alone.',
    material: 'Illustrative grained leather · cotton lining · brass zip',
    image: '/images/loop-pouch.webp',
    variants: sizes(8, 3),
  },
  {
    id: 'travel-case',
    slug: 'travel-case',
    name: 'The Travel Case',
    category: 'Small leather',
    color: 'Tan',
    colorHex: '#b08661',
    price: 14000,
    description:
      'A place for the little rituals. A compact travel case with a simple zip and an easy carrying loop.',
    material: 'Illustrative smooth leather · wipeable lining · brass zip',
    image: '/images/travel-case.webp',
    variants: sizes(0, 0),
    label: 'Currently unavailable',
  },
];
export const findProduct = (id: string): Product | undefined =>
  products.find((p) => p.id === id);
export const money = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
