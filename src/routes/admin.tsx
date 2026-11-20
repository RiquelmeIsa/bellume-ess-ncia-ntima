import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, LayoutDashboard, Package, Palette, ShoppingCart, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Logo, Monogram } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categories, formatBRL, getCategory, products } from "@/lib/catalog";
import { loadPlacedOrders, sampleOrders, type Order, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo | BELLUME" },
      { name: "description", content: "Gestão de pedidos, produtos e identidade da marca BELLUME." },
      { property: "og:title", content: "Painel administrativo | BELLUME" },
      { property: "og:description", content: "Gestão de pedidos, produtos e identidade da marca BELLUME." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Section = "geral" | "pedidos" | "produtos" | "marca";
const STATUS_KEY = "bellume-order-status";
const statuses: OrderStatus[] = ["Pago", "Em separação", "Enviado", "Entregue"];

const nav: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "geral", label: "Visão geral", icon: LayoutDashboard },
  { id: "pedidos", label: "Pedidos", icon: ShoppingCart },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "marca", label: "Identidade da marca", icon: Palette },
];

function statusClass(s: OrderStatus) {
  return {
    Pago: "bg-rose/25 text-wine",
    "Em separação": "bg-champagne text-wine",
    Enviado: "bg-wine-soft text-ivory",
    Entregue: "bg-wine text-ivory",
  }[s];
}

function AdminPage() {
  const [section, setSection] = useState<Section>("geral");
  const [placed, setPlaced] = useState<Order[]>([]);
  const [overrides, setOverrides] = useState<Record<string, OrderStatus>>({});

  useEffect(() => {
    setPlaced(loadPlacedOrders());
    try {
      setOverrides(JSON.parse(window.localStorage.getItem(STATUS_KEY) ?? "{}") as Record<string, OrderStatus>);
    } catch {
      /* ignore */
    }
  }, []);

  const orders = useMemo(
    () => [...placed, ...sampleOrders].map((o) => ({ ...o, status: overrides[o.id] ?? o.status })),
    [placed, overrides],
  );

  function setStatus(id: string, status: OrderStatus) {
    const next = { ...overrides, [id]: status };
    setOverrides(next);
    window.localStorage.setItem(STATUS_KEY, JSON.stringify(next));
  }

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const units = orders.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0);
  const ticket = orders.length ? revenue / orders.length : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border px-6 py-7">
          <Logo tone="light" size="sm" />
          <p className="eyebrow mt-3 !text-[0.55rem] text-rose">Painel administrativo</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
                section === id ? "bg-sidebar-accent text-ivory" : "text-champagne/70 hover:text-ivory",
              )}
            >
              <Icon className="size-4" strokeWidth={1.4} /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-champagne/70 hover:text-ivory">
            <Store className="size-4" strokeWidth={1.4} /> Ver loja
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b hairline bg-ivory px-6 py-5 md:px-10">
          <div>
            <p className="eyebrow !text-[0.6rem] text-rose-deep">Bem-vinda de volta</p>
            <h1 className="mt-1 text-3xl text-wine">{nav.find((n) => n.id === section)?.label}</h1>
          </div>
          <div className="flex gap-2 md:hidden">
            <select
              aria-label="Seção"
              value={section}
              onChange={(e) => setSection(e.target.value as Section)}
              className="border hairline bg-card px-3 py-2 text-sm"
            >
              {nav.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <Link to="/">Ver loja <ArrowUpRight /></Link>
          </Button>
        </header>

        <main className="space-y-8 p-6 md:p-10">
          {section === "geral" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Faturamento", value: formatBRL(revenue) },
                  { label: "Pedidos", value: String(orders.length) },
                  { label: "Ticket médio", value: formatBRL(ticket) },
                  { label: "Peças vendidas", value: String(units) },
                ].map((k, i) => (
                  <div key={k.label} className={cn("p-6", i === 0 ? "bg-gradient-wine text-ivory" : "border hairline bg-card")}>
                    <p className={cn("eyebrow !text-[0.6rem]", i === 0 ? "text-rose" : "text-rose-deep")}>{k.label}</p>
                    <p className={cn("mt-3 font-display text-4xl", i === 0 ? "text-ivory" : "text-wine")}>{k.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <div className="border hairline bg-card p-6">
                  <h2 className="text-2xl text-wine">Vendas por categoria</h2>
                  <div className="mt-6 space-y-5">
                    {categories.map((c) => {
                      const value = orders.reduce(
                        (s, o) => s + o.items.filter((i) => products.find((p) => p.slug === i.slug)?.category === c.slug).reduce((n, i) => n + i.price * i.qty, 0),
                        0,
                      );
                      const pct = revenue ? (value / revenue) * 100 : 0;
                      return (
                        <div key={c.slug}>
                          <div className="flex justify-between text-sm">
                            <span className="text-wine">{c.name}</span>
                            <span className="text-muted-foreground">{formatBRL(value)}</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-champagne">
                            <div className="h-full bg-rose-deep" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border hairline bg-card p-6">
                  <h2 className="text-2xl text-wine">Pedidos recentes</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {orders.slice(0, 5).map((o) => (
                      <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                        <div>
                          <p className="text-wine">{o.customer}</p>
                          <p className="text-xs text-muted-foreground">{o.id}</p>
                        </div>
                        <span className={cn("px-2 py-1 text-[0.65rem] uppercase tracking-wider", statusClass(o.status))}>{o.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {section === "pedidos" && (
            <div className="border hairline bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Cidade</TableHead>
                    <TableHead className="hidden md:table-cell">Pagamento</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium text-wine">{o.id}</TableCell>
                      <TableCell>
                        <p>{o.customer}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.date + "T12:00:00").toLocaleDateString("pt-BR")}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{o.city}</TableCell>
                      <TableCell className="hidden md:table-cell">{o.method === "pix" ? "Pix" : "Cartão"}</TableCell>
                      <TableCell>{formatBRL(o.total)}</TableCell>
                      <TableCell>
                        <select
                          aria-label={`Status do pedido ${o.id}`}
                          value={o.status}
                          onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                          className={cn("border-0 px-2 py-1 text-xs", statusClass(o.status))}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {section === "produtos" && (
            <div className="border hairline bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="hidden md:table-cell">Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.slug}>
                      <TableCell>
                        <Link to="/produto/$slug" params={{ slug: p.slug }} className="flex items-center gap-3">
                          <img src={p.image} alt="" className="h-14 w-11 object-cover" />
                          <span className="font-display text-lg text-wine">{p.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{getCategory(p.category)?.name}</TableCell>
                      <TableCell>{formatBRL(p.price)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-none", p.stock < 10 ? "border-destructive text-destructive" : "hairline text-wine")}>
                          {p.stock} un.
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {section === "marca" && (
            <div className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col items-center justify-center gap-4 bg-wine p-12">
                  <Logo tone="light" size="lg" withSlogan />
                </div>
                <div className="flex flex-col items-center justify-center gap-4 border hairline bg-ivory p-12">
                  <Logo size="lg" withSlogan />
                </div>
              </div>
              <div className="border hairline bg-card p-6">
                <h2 className="text-2xl text-wine">Paleta oficial</h2>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { name: "Vinho profundo", hex: "#281820", cls: "bg-wine" },
                    { name: "Rosé queimado", hex: "#B98A79", cls: "bg-rose" },
                    { name: "Nude champagne", hex: "#E8D8C9", cls: "bg-champagne" },
                    { name: "Off-white", hex: "#F8F4F0", cls: "bg-ivory border hairline" },
                  ].map((c) => (
                    <div key={c.hex}>
                      <div className={cn("aspect-[4/3]", c.cls)} />
                      <p className="mt-3 font-display text-lg text-wine">{c.name}</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border hairline bg-card p-6">
                  <p className="eyebrow text-rose-deep">Títulos & logotipo</p>
                  <p className="mt-4 font-display text-5xl text-wine">Cormorant Garamond</p>
                  <p className="mt-2 font-display text-2xl italic text-muted-foreground">Seu desejo, sua essência.</p>
                </div>
                <div className="border hairline bg-card p-6">
                  <p className="eyebrow text-rose-deep">Textos & interface</p>
                  <p className="mt-4 text-4xl font-light text-wine">Jost</p>
                  <p className="mt-2 text-sm text-muted-foreground">Moderna, limpa e legível em qualquer tamanho.</p>
                </div>
              </div>
              <div className="flex items-center gap-6 border hairline bg-card p-6">
                <Monogram className="h-20" />
                <div>
                  <p className="font-display text-2xl text-wine">Monograma B</p>
                  <p className="text-sm text-muted-foreground">Símbolo secundário para ícones, embalagens, selos e estados vazios.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
