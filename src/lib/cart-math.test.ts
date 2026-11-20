import { describe, expect, it } from "vitest";

import { shippingFor, totalsFor } from "@/lib/cart-math";

describe("regras do carrinho BELLUME", () => {
  it("cobra frete de R$ 24,90 abaixo de R$ 399", () => {
    expect(shippingFor(398.99)).toBe(24.9);
  });

  it("dá frete grátis a partir de R$ 399", () => {
    expect(shippingFor(399)).toBe(0);
  });

  it("aplica 5% de desconto no Pix", () => {
    const t = totalsFor([{ slug: "x", size: "M", qty: 2, price: 200 }], "pix");
    expect(t).toEqual({ subtotal: 400, shipping: 0, discount: 20, total: 380 });
  });
});
