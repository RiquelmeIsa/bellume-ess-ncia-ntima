import { Link } from "@tanstack/react-router";
import { Instagram, Lock, Package, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/catalog";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-gradient-wine text-champagne">
      <div className="mx-auto grid max-w-7xl gap-6 border-b hairline px-4 py-10 sm:grid-cols-3 md:px-8">
        {[
          { icon: Package, title: "Entrega discreta", text: "Embalagem neutra, sem identificação da marca." },
          { icon: Lock, title: "Compra protegida", text: "Pagamento criptografado e dados preservados." },
          { icon: ShieldCheck, title: "Troca garantida", text: "Primeira troca grátis em até 30 dias." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <Icon className="mt-1 size-5 text-rose" strokeWidth={1.3} />
            <div>
              <p className="font-display text-xl text-ivory">{title}</p>
              <p className="mt-1 text-sm text-champagne/70">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.4fr] md:px-8">
        <div>
          <Logo tone="light" size="sm" withSlogan />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-champagne/70">
            Moda íntima e bem-estar para quem vive o próprio desejo com confiança, sofisticação e liberdade.
          </p>
        </div>
        <div>
          <p className="eyebrow text-rose">Coleções</p>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/categoria/$slug" params={{ slug: c.slug }} className="text-champagne/80 hover:text-ivory">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-rose">Atendimento</p>
          <ul className="mt-5 space-y-3 text-sm text-champagne/80">
            <li><Link to="/carrinho" className="hover:text-ivory">Minha sacola</Link></li>
            <li><Link to="/checkout" className="hover:text-ivory">Finalizar compra</Link></li>
            <li><Link to="/admin" className="hover:text-ivory">Área administrativa</Link></li>
            <li>contato@bellume.com.br</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-rose">Círculo Bellume</p>
          <p className="mt-5 font-display text-2xl text-ivory">Convites, lançamentos e segredos.</p>
          <form
            className="mt-5 flex border-b border-champagne/40"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) {
                toast.error("Informe um e-mail válido.");
                return;
              }
              toast.success("Bem-vinda ao Círculo Bellume.");
              setEmail("");
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              aria-label="Seu e-mail"
              className="flex-1 bg-transparent py-3 text-sm text-ivory placeholder:text-champagne/50 focus:outline-none"
            />
            <Button type="submit" variant="link" className="text-rose">Assinar</Button>
          </form>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-champagne/60 md:flex-row md:px-8">
          <p>© 2026 BELLUME. Todos os direitos reservados. Venda proibida para menores de 18 anos.</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-ivory">
            <Instagram className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
