import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { formatBRL, getCategory, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const category = getCategory(product.category);

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-champagne">
        <Link to="/produto/$slug" params={{ slug: product.slug }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <span className="eyebrow absolute left-3 top-3 bg-ivory/90 px-3 py-1.5 !text-[0.55rem] text-wine">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => {
            add(product.slug, product.sizes[0] ?? "Único");
            toast.success(`${product.name} foi para a sacola.`);
            setOpen(true);
          }}
          className="eyebrow absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-wine py-3 !text-[0.6rem] text-ivory opacity-0 transition-all duration-500 hover:bg-wine-soft group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="size-3" /> Adicionar à sacola
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow !text-[0.55rem] text-rose-deep">{category?.name}</p>
          <Link to="/produto/$slug" params={{ slug: product.slug }}>
            <h3 className="mt-1 font-display text-xl leading-tight text-wine transition-colors hover:text-rose-deep">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-wine">{formatBRL(product.price)}</p>
          {product.compareAt && (
            <p className="text-xs text-muted-foreground line-through">{formatBRL(product.compareAt)}</p>
          )}
        </div>
      </div>
    </article>
  );
}
