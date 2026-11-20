import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Lock, Minus, Package, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/store/ProductCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { PIX_DISCOUNT } from "@/lib/cart-math";
import { formatBRL, getCategory, getProduct, products } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Produto"} | BELLUME` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Produto"} | BELLUME` },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const category = getCategory(product.category);
  const { add, setOpen } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "Único");
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.slug !== slug && p.category === product.category).slice(0, 4);
  const fill = products.filter((p) => p.slug !== slug && p.category !== product.category);
  const suggestions = [...related, ...fill].slice(0, 4);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        <nav className="eyebrow !text-[0.6rem] text-muted-foreground">
          <Link to="/" className="hover:text-wine">Início</Link> /{" "}
          <Link to="/categoria/$slug" params={{ slug: product.category }} className="hover:text-wine">{category?.name}</Link> /{" "}
          <span className="text-wine">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-8">
        <div className="relative aspect-[3/4] overflow-hidden bg-champagne">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          {product.badge && (
            <span className="eyebrow absolute left-4 top-4 bg-ivory/90 px-3 py-1.5 !text-[0.55rem] text-wine">{product.badge}</span>
          )}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow text-rose-deep">{category?.name}</p>
          <h1 className="mt-3 text-4xl leading-tight text-wine md:text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-medium text-wine">{formatBRL(product.price)}</span>
            {product.compareAt && <span className="text-sm text-muted-foreground line-through">{formatBRL(product.compareAt)}</span>}
          </div>
          <p className="mt-1 text-sm text-rose-deep">
            ou {formatBRL(product.price * (1 - PIX_DISCOUNT))} no Pix · até 6x sem juros
          </p>
          <p className="mt-6 font-light leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <p className="eyebrow !text-[0.6rem] text-wine">Tamanho</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-12 border px-4 py-2.5 text-sm transition-colors",
                    s === size ? "border-wine bg-wine text-ivory" : "hairline text-wine hover:border-wine",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex items-center border hairline">
              <button aria-label="Diminuir" className="px-3 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="size-3" />
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button aria-label="Aumentar" className="px-3 py-3" onClick={() => setQty((q) => q + 1)}>
                <Plus className="size-3" />
              </button>
            </div>
            <Button
              className="flex-1"
              size="lg"
              onClick={() => {
                add(product.slug, size, qty);
                toast.success(`${product.name} foi para a sacola.`);
                setOpen(true);
              }}
            >
              Adicionar à sacola
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3 text-success" /> {product.stock} unidades disponíveis
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 border-y hairline py-5 text-center">
            {[
              { icon: Package, label: "Embalagem discreta" },
              { icon: Lock, label: "Compra segura" },
              { icon: RotateCcw, label: "Troca em 30 dias" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="size-4 text-rose-deep" strokeWidth={1.4} />
                <span className="text-[0.7rem] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible defaultValue="detalhes" className="mt-4">
            <AccordionItem value="detalhes">
              <AccordionTrigger className="eyebrow !text-[0.65rem] text-wine">Detalhes</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.details.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="entrega">
              <AccordionTrigger className="eyebrow !text-[0.65rem] text-wine">Entrega & discrição</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Enviamos em caixa neutra, sem logotipo ou descrição do conteúdo. Na fatura, a compra aparece como “BLM Comércio”.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="text-center text-4xl text-wine">Você também vai desejar</h2>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {suggestions.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </StoreLayout>
  );
}
