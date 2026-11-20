import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Lock, QrCode } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Logo, Monogram } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { totalsFor, type PaymentMethod } from "@/lib/cart-math";
import { formatBRL, getProduct } from "@/lib/catalog";
import { savePlacedOrder } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra | BELLUME" },
      { name: "description", content: "Checkout seguro BELLUME com entrega discreta e 5% de desconto no Pix." },
      { property: "og:title", content: "Finalizar compra | BELLUME" },
      { property: "og:description", content: "Checkout seguro com entrega discreta e desconto no Pix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

function Field({ id, label, className, ...props }: { id: string; label: string; className?: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="eyebrow !text-[0.6rem] text-wine">{label}</Label>
      <Input id={id} name={id} required className="h-11 rounded-none border-input bg-card shadow-none focus-visible:ring-rose" {...props} />
    </div>
  );
}

function CheckoutPage() {
  const { lines, clear } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [placed, setPlaced] = useState<string | null>(null);
  const t = totalsFor(lines, method);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = `BL-${Math.floor(10500 + Math.random() * 9000)}`;
    savePlacedOrder({
      id,
      customer: String(f.get("nome")),
      email: String(f.get("email")),
      city: `${String(f.get("cidade"))}, ${String(f.get("uf")).toUpperCase()}`,
      date: new Date().toISOString().slice(0, 10),
      items: lines,
      total: t.total,
      method,
      status: "Pago",
    });
    clear();
    setPlaced(id);
    toast.success("Pedido confirmado.");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b hairline bg-ivory">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-8">
          <Logo size="sm" />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-rose-deep" /> Ambiente 100% seguro
          </p>
        </div>
      </header>

      {placed ? (
        <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
          <Monogram className="h-20" />
          <p className="eyebrow mt-8 text-rose-deep">Pedido {placed}</p>
          <h1 className="mt-4 text-5xl text-wine">Seu desejo está a caminho.</h1>
          <p className="mt-5 font-light leading-relaxed text-muted-foreground">
            Enviaremos a confirmação por e-mail. Seu pedido segue em embalagem neutra, sem qualquer identificação externa.
          </p>
          <Button asChild className="mt-10" size="lg">
            <Link to="/">Voltar à loja</Link>
          </Button>
        </section>
      ) : lines.length === 0 ? (
        <section className="flex flex-col items-center gap-5 py-28 text-center">
          <Monogram className="h-16 opacity-70" />
          <p className="font-display text-3xl text-wine">Sua sacola está vazia.</p>
          <Button asChild>
            <Link to="/categoria/$slug" params={{ slug: "todos" }}>Explorar coleção</Link>
          </Button>
        </section>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:px-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-12">
            <fieldset>
              <legend className="font-display text-3xl text-wine"><span className="text-rose-deep">01.</span> Contato</legend>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="nome" label="Nome completo" autoComplete="name" className="sm:col-span-2" />
                <Field id="email" label="E-mail" type="email" autoComplete="email" />
                <Field id="telefone" label="Celular" type="tel" autoComplete="tel" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-3xl text-wine"><span className="text-rose-deep">02.</span> Entrega discreta</legend>
              <div className="mt-6 grid gap-5 sm:grid-cols-6">
                <Field id="cep" label="CEP" className="sm:col-span-2" inputMode="numeric" />
                <Field id="endereco" label="Endereço" className="sm:col-span-4" autoComplete="street-address" />
                <Field id="numero" label="Número" className="sm:col-span-2" />
                <Field id="cidade" label="Cidade" className="sm:col-span-3" autoComplete="address-level2" />
                <Field id="uf" label="UF" className="sm:col-span-1" maxLength={2} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Caixa neutra, sem logotipo. Na fatura: “BLM Comércio”.</p>
            </fieldset>

            <fieldset>
              <legend className="font-display text-3xl text-wine"><span className="text-rose-deep">03.</span> Pagamento</legend>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {([
                  { value: "pix", label: "Pix", hint: "5% de desconto", icon: QrCode },
                  { value: "cartao", label: "Cartão de crédito", hint: "até 6x sem juros", icon: CreditCard },
                ] as const).map(({ value, label, hint, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setMethod(value)}
                    className={cn(
                      "flex items-center gap-4 border p-5 text-left transition-colors",
                      method === value ? "border-wine bg-wine text-ivory" : "hairline bg-card text-wine hover:border-wine",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.4} />
                    <span>
                      <span className="block font-medium">{label}</span>
                      <span className={cn("text-xs", method === value ? "text-champagne/80" : "text-muted-foreground")}>{hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              {method === "cartao" && (
                <div className="mt-6 grid gap-5 sm:grid-cols-4">
                  <Field id="cartao" label="Número do cartão" inputMode="numeric" className="sm:col-span-4" />
                  <Field id="validade" label="Validade" placeholder="MM/AA" className="sm:col-span-2" />
                  <Field id="cvv" label="CVV" inputMode="numeric" maxLength={4} className="sm:col-span-2" />
                </div>
              )}
            </fieldset>
          </div>

          <aside className="h-fit border hairline bg-card p-8 lg:sticky lg:top-8">
            <h2 className="text-3xl text-wine">Seu pedido</h2>
            <ul className="mt-6 space-y-4">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                return (
                  <li key={`${l.slug}-${l.size}`} className="flex gap-4">
                    <div className="relative">
                      <img src={p.image} alt={p.name} className="h-20 w-16 object-cover" />
                      <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-wine text-[0.65rem] text-ivory">{l.qty}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-lg leading-tight text-wine">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Tamanho {l.size}</p>
                    </div>
                    <span className="text-sm">{formatBRL(l.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-6 space-y-2 border-t hairline pt-6 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBRL(t.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Frete</dt><dd>{t.shipping === 0 ? "Grátis" : formatBRL(t.shipping)}</dd></div>
              {t.discount > 0 && (
                <div className="flex justify-between text-rose-deep"><dt>Desconto Pix</dt><dd>− {formatBRL(t.discount)}</dd></div>
              )}
            </dl>
            <div className="mt-6 flex justify-between border-t hairline pt-6 font-display text-3xl text-wine">
              <span>Total</span><span>{formatBRL(t.total)}</span>
            </div>
            <Button type="submit" size="lg" className="mt-8 w-full">Confirmar pedido</Button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3" /> Seus dados são criptografados
            </p>
          </aside>
        </form>
      )}
    </div>
  );
}
