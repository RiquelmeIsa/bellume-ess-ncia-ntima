import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { CartSheet } from "@/components/store/CartSheet";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/catalog";

const navLink =
  "eyebrow whitespace-nowrap text-wine/80 transition-colors hover:text-rose-deep data-[status=active]:text-rose-deep";

export function SiteHeader() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="bg-wine py-2 text-center text-champagne">
        <p className="eyebrow !text-[0.6rem]">
          Frete grátis acima de R$ 399<span className="hidden sm:inline"> · Embalagem 100% discreta · 5% off no Pix</span>
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b hairline bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger aria-label="Abrir menu" className="lg:hidden">
                <Menu className="size-5 text-wine" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 border-r hairline bg-wine text-champagne">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="mt-6">
                  <Logo tone="light" size="sm" />
                </div>
                <nav className="mt-12 flex flex-col gap-6">
                  <Link to="/categoria/$slug" params={{ slug: "todos" }} className="font-display text-2xl text-ivory">
                    Toda a coleção
                  </Link>
                  {categories.map((c) => (
                    <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="font-display text-2xl text-ivory">
                      {c.name}
                    </Link>
                  ))}
                  <Link to="/admin" className="eyebrow mt-6 text-rose">Painel administrativo</Link>
                </nav>
              </SheetContent>
            </Sheet>
            <nav className="hidden items-center gap-6 lg:flex">
              <Link to="/categoria/$slug" params={{ slug: "todos" }} className={navLink}>Coleção</Link>
              {categories.slice(0, 3).map((c, i) => (
                <Link
                  key={c.slug}
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  className={`${navLink} ${i === 1 ? "hidden 2xl:inline" : ""}`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          <Logo size="md" className="justify-self-center" />

          <div className="flex items-center justify-end gap-5 text-wine">
            <Link to="/categoria/$slug" params={{ slug: "todos" }} aria-label="Buscar" className="hidden hover:text-rose-deep sm:block">
              <Search className="size-5" strokeWidth={1.4} />
            </Link>
            <Link to="/admin" aria-label="Painel administrativo" className="hidden hover:text-rose-deep sm:block">
              <User className="size-5" strokeWidth={1.4} />
            </Link>
            <button aria-label="Abrir sacola" onClick={() => setOpen(true)} className="relative hover:text-rose-deep">
              <ShoppingBag className="size-5" strokeWidth={1.4} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-rose text-[0.6rem] font-semibold text-wine">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartSheet />
    </>
  );
}
