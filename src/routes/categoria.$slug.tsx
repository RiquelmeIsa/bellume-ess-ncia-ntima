import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/store/ProductCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Input } from "@/components/ui/input";
import { categories, getCategory, productsByCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    if (params.slug === "todos") return { name: "Toda a coleção", tagline: "Seu desejo, sua essência", image: null as string | null };
    const c = getCategory(params.slug);
    if (!c) throw notFound();
    return { name: c.name, tagline: c.tagline, image: c.image as string | null };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Coleção";
    const desc = `${name} BELLUME — ${loaderData?.tagline ?? ""}. Entrega discreta em todo o Brasil.`;
    return {
      meta: [
        { title: `${name} | BELLUME` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} | BELLUME` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

type Sort = "relevancia" | "menor" | "maior";

function CategoryPage() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("relevancia");

  const list = useMemo(() => {
    let items = productsByCategory(slug).filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "menor") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "maior") items = [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [slug, query, sort]);

  return (
    <StoreLayout>
      <section className="relative isolate overflow-hidden bg-wine">
        {data.image && <img src={data.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />}
        <div className="bg-veil absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <p className="eyebrow text-rose">{data.tagline}</p>
          <h1 className="mt-4 text-5xl text-ivory md:text-7xl">{data.name}</h1>
        </div>
      </section>

      <div className="sticky top-20 z-30 border-b hairline bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 md:px-8">
          <nav className="flex flex-1 gap-2 overflow-x-auto">
            {[{ slug: "todos", name: "Todos" }, ...categories].map((c) => (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className={cn(
                  "eyebrow whitespace-nowrap border px-4 py-2 !text-[0.6rem] transition-colors",
                  c.slug === slug ? "border-wine bg-wine text-ivory" : "hairline text-wine hover:border-wine",
                )}
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar peça…"
            className="h-9 w-44 rounded-none border-0 border-b bg-transparent shadow-none focus-visible:ring-0"
          />
          <select
            aria-label="Ordenar"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="eyebrow h-9 border hairline bg-transparent px-3 !text-[0.6rem] text-wine"
          >
            <option value="relevancia">Relevância</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-sm text-muted-foreground">{list.length} {list.length === 1 ? "peça" : "peças"}</p>
        {list.length === 0 ? (
          <p className="py-24 text-center font-display text-3xl text-wine">Nenhuma peça encontrada.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
