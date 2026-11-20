export const FREE_SHIPPING_THRESHOLD = 399;
export const SHIPPING_FEE = 24.9;
export const PIX_DISCOUNT = 0.05;

export type CartLine = { slug: string; size: string; qty: number; price: number };

export type PaymentMethod = "pix" | "cartao";

export function subtotalOf(lines: CartLine[]) {
  return round(lines.reduce((sum, l) => sum + l.price * l.qty, 0));
}

export function shippingFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function totalsFor(lines: CartLine[], method: PaymentMethod = "cartao") {
  const subtotal = subtotalOf(lines);
  const shipping = shippingFor(subtotal);
  const discount = method === "pix" ? round(subtotal * PIX_DISCOUNT) : 0;
  const total = round(subtotal + shipping - discount);
  return { subtotal, shipping, discount, total };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
