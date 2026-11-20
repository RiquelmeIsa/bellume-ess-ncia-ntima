import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Monogram } from "@/components/brand/Logo";
import { ProductCard } from "@/components/store/ProductCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { categories, images, products } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BELLUME — Moda íntima e bem-estar | Seu desejo, sua essência" },
      {
        name: "description",
        content: "Lingerie, robes de seda e rituais de bem-estar com estética editorial e entrega 100% discreta.",
      },
      { property: "og:title", content: "BELLUME — Seu desejo, sua essência" },
      {
        property: "og:description",
        content: "Lingerie, robes de seda e rituais de bem-estar com estética editorial e entrega discreta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 4);
  const more = products.slice(4, 8);

  return (
    <StoreLayout>
      {/* Banner principal */}
      <section className="relative isolate overflow-hidden bg-wine">
        <img
          src={images.hero}
          alt="Mulher de costas vestindo robe de seda vinho"
          className="animate-slow-zoom absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]"
        />
        <div className="bg-veil absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-wine/45 md:hidden" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-24 md:px-8">
          <div className="max-w-xl text-ivory">
            <p className="eyebrow animate-fade-up text-rose">Nova coleção · Noir Désir</p>
            <h1 className="animate-fade-up mt-6 text-5xl leading-[1.02] text-ivory [animation-delay:120ms] md:text-7xl">
              Seu desejo,
              <br />
              <em className="text-champagne">sua essência.</em>
            </h1>
            <p className="animate-fade-up mt-6 max-w-md text-base font-light leading-relaxed text-champagne/85 [animation-delay:240ms]">
              Rendas, sedas e rituais criados para quem se escolhe primeiro. Ousadia com elegância, sempre com discrição.
            </p>
            <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:360ms]">
              <Button asChild variant="rose" size="lg">
                <Link to="/categoria/$slug" params={{ slug: "todos" }}>Descobrir coleção</Link>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <Link to="/categoria/$slug" params={{ slug: "lingerie" }}>Lingerie</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="flex flex-col items-center text-center">
          <Monogram className="h-10" />
          <p className="eyebrow mt-5 text-rose-deep">Universos Bellume</p>
          <h2 className="mt-3 text-4xl text-wine md:text-5xl">Explore por desejo</h2>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className={`group relative aspect-[3/4] overflow-hidden bg-wine ${i % 2 === 1 ? "md:mt-12" : ""}`}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
              />
              <div className="bg-fade-up absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                <p className="eyebrow !text-[0.55rem] text-champagne/80">{c.tagline}</p>
                <p className="mt-2 flex items-center justify-between font-display text-2xl md:text-3xl">
                  {c.name}
                  <ArrowRight className="size-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-champagne/40 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-rose-deep">Os mais desejados</p>
              <h2 className="mt-3 text-4xl text-wine md:text-5xl">Peças que provocam</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/categoria/$slug" params={{ slug: "todos" }}>Ver tudo</Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner editorial */}
      <section className="grid bg-wine md:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden">
          <img src={images.editorial} alt="Ritual de bem-estar com óleos, vela e seda" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-8 py-20 text-ivory md:px-16">
          <p className="eyebrow text-rose">Ritual Bellume</p>
          <h2 className="mt-5 text-4xl leading-tight text-ivory md:text-6xl">
            O prazer de <em className="text-champagne">desacelerar.</em>
          </h2>
          <p className="mt-6 max-w-md font-light leading-relaxed text-champagne/80">
            Óleos de massagem, velas e acessórios em seda para transformar qualquer noite em um ritual de autocuidado e conexão.
          </p>
          <div className="mt-10">
            <Button asChild variant="rose" size="lg">
              <Link to="/categoria/$slug" params={{ slug: "bem-estar" }}>Conhecer rituais</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mais produtos */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="text-center">
          <p className="eyebrow text-rose-deep">Bem-estar & acessórios</p>
          <h2 className="mt-3 text-4xl text-wine md:text-5xl">Para todos os sentidos</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {more.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-y hairline bg-ivory py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-display text-3xl italic leading-snug text-wine md:text-4xl">
            “Sensualidade não é exibição. É a confiança de quem sabe exatamente o que deseja.”
          </p>
          <p className="eyebrow mt-8 text-rose-deep">Manifesto Bellume</p>
        </div>
      </section>
    </StoreLayout>
  );
}
