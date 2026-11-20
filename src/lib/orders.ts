import type { CartLine, PaymentMethod } from "@/lib/cart-math";

export type OrderStatus = "Pago" | "Em separação" | "Enviado" | "Entregue";

export type Order = {
  id: string;
  customer: string;
  email: string;
  city: string;
  date: string;
  items: CartLine[];
  total: number;
  method: PaymentMethod;
  status: OrderStatus;
};

const KEY = "bellume-orders";

export const sampleOrders: Order[] = [
  { id: "BL-10428", customer: "Marina Albuquerque", email: "marina@email.com", city: "São Paulo, SP", date: "2026-11-19", items: [{ slug: "conjunto-renda-noir", size: "M", qty: 1, price: 289.9 }, { slug: "vela-aromatica-desejo", size: "220 g", qty: 1, price: 149.9 }], total: 439.8, method: "cartao", status: "Em separação" },
  { id: "BL-10427", customer: "Helena Duarte", email: "helena@email.com", city: "Curitiba, PR", date: "2026-11-19", items: [{ slug: "robe-seda-bordeaux", size: "P/M", qty: 1, price: 459.9 }], total: 436.91, method: "pix", status: "Pago" },
  { id: "BL-10425", customer: "Camila Ferraz", email: "camila@email.com", city: "Rio de Janeiro, RJ", date: "2026-11-18", items: [{ slug: "oleo-massagem-ambar-rosa", size: "100 ml", qty: 2, price: 129.9 }], total: 284.7, method: "cartao", status: "Enviado" },
  { id: "BL-10421", customer: "Beatriz Lemos", email: "bia@email.com", city: "Belo Horizonte, MG", date: "2026-11-17", items: [{ slug: "body-rendado-rose", size: "P", qty: 1, price: 349.9 }, { slug: "mascara-seda-rose", size: "Único", qty: 1, price: 119.9 }], total: 469.8, method: "cartao", status: "Entregue" },
  { id: "BL-10418", customer: "Luiza Prado", email: "luiza@email.com", city: "Recife, PE", date: "2026-11-16", items: [{ slug: "camisola-cetim-champagne", size: "M", qty: 1, price: 239.9 }], total: 252.8, method: "pix", status: "Entregue" },
];

export function loadPlacedOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function savePlacedOrder(order: Order) {
  const all = [order, ...loadPlacedOrders()];
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function savePlacedOrders(orders: Order[]) {
  window.localStorage.setItem(KEY, JSON.stringify(orders));
}
