import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { Monogram } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, totalsFor } from "@/lib/cart-math";
import { formatBRL, getProduct } from "@/lib/catalog";

export function CartSheet() {
  const { lines, open, setOpen, update, remove } = useCart();
  const { subtotal } = totalsFor(lines);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 border-l hairline bg-ivory p-0 sm:max-w-md">
        <SheetHeader className="border-b hairline px-6 py-5 text-left">
          <SheetTitle className="font-display text-2xl font-medium text-wine">Sua sacola</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <Monogram className="h-16 opacity-70" />
            <p className="font-display text-2xl text-wine">Sua sacola está à espera.</p>
            <p className="text-sm text-muted-foreground">Descubra peças que traduzem o seu desejo.</p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link to="/categoria/$slug" params={{ slug: "todos" }}>Explorar coleção</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b hairline px-6 py-4">
              <p className="text-xs text-muted-foreground">
                {missing > 0 ? (
                  <>Faltam <strong className="text-wine">{formatBRL(missing)}</strong> para frete grátis</>
                ) : (
                  <strong className="text-wine">Você ganhou frete grátis ✦</strong>
                )}
              </p>
              <div className="mt-2 h-px w-full bg-champagne">
                <div className="h-px bg-rose-deep transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                return (
                  <li key={`${l.slug}-${l.size}`} className="flex gap-4 py-5">
                    <img src={p.image} alt={p.name} className="h-28 w-20 object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-lg leading-tight text-wine">{p.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Tamanho {l.size}</p>
                        </div>
                        <button
                          aria-label={`Remover ${p.name}`}
                          onClick={() => remove(l.slug, l.size)}
                          className="text-muted-foreground transition-colors hover:text-wine"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border hairline">
                          <button aria-label="Diminuir" className="p-2 hover:text-rose-deep" onClick={() => update(l.slug, l.size, l.qty - 1)}>
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{l.qty}</span>
                          <button aria-label="Aumentar" className="p-2 hover:text-rose-deep" onClick={() => update(l.slug, l.size, l.qty + 1)}>
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{formatBRL(l.price * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-3 border-t hairline bg-card px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatBRL(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Embalagem discreta, sem identificação externa.</p>
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link to="/checkout">Finalizar compra</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                <Link to="/carrinho">Ver sacola completa</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
