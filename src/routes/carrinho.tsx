import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { Monogram } from "@/components/brand/Logo";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, totalsFor } from "@/lib/cart-math";
import { formatBRL, getProduct } from "@/lib/catalog";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Sua sacola | BELLUME" },
      { name: "description", content: "Revise as peças escolhidas na sua sacola BELLUME antes de finalizar." },
      { property: "og:title", content: "Sua sacola | BELLUME" },
      { property: "og:description", content: "Revise as peças escolhidas antes de finalizar a compra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, update, remove } = useCart();
  const t = totalsFor(lines);

  return (
    <StoreLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <p className="eyebrow text-rose-deep">Sacola</p>
        <h1 className="mt-3 text-5xl text-wine">Suas escolhas</h1>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <Monogram className="h-16 opacity-70" />
            <p className="font-display text-3xl text-wine">Sua sacola está vazia.</p>
            <Button asChild>
              <Link to="/categoria/$slug" params={{ slug: "todos" }}>Explorar coleção</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
            <ul className="divide-y divide-border border-y hairline">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                return (
                  <li key={`${l.slug}-${l.size}`} className="flex gap-6 py-6">
                    <Link to="/produto/$slug" params={{ slug: p.slug }}>
                      <img src={p.image} alt={p.name} className="h-40 w-28 object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-display text-2xl text-wine">{p.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">Tamanho {l.size} · {formatBRL(l.price)}</p>
                        </div>
                        <button aria-label={`Remover ${p.name}`} onClick={() => remove(l.slug, l.size)} className="text-muted-foreground hover:text-wine">
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border hairline">
                          <button aria-label="Diminuir" className="p-2.5" onClick={() => update(l.slug, l.size, l.qty - 1)}><Minus className="size-3" /></button>
                          <span className="w-8 text-center text-sm">{l.qty}</span>
                          <button aria-label="Aumentar" className="p-2.5" onClick={() => update(l.slug, l.size, l.qty + 1)}><Plus className="size-3" /></button>
                        </div>
                        <span className="font-medium">{formatBRL(l.price * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit bg-wine p-8 text-champagne">
              <h2 className="text-3xl text-ivory">Resumo</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd className="text-ivory">{formatBRL(t.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Frete</dt><dd className="text-ivory">{t.shipping === 0 ? "Grátis" : formatBRL(t.shipping)}</dd></div>
              </dl>
              {t.shipping > 0 && (
                <p className="mt-3 text-xs text-champagne/70">Frete grátis em compras acima de {formatBRL(FREE_SHIPPING_THRESHOLD)}.</p>
              )}
              <div className="mt-6 flex justify-between border-t hairline pt-6 font-display text-2xl text-ivory">
                <span>Total</span><span>{formatBRL(t.total)}</span>
              </div>
              <Button asChild variant="rose" className="mt-8 w-full" size="lg">
                <Link to="/checkout">Finalizar compra</Link>
              </Button>
              <p className="mt-4 text-center text-xs text-champagne/60">Embalagem discreta · Pagamento seguro</p>
            </aside>
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
