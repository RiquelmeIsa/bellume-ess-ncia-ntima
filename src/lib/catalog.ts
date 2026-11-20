import heroImg from "@/assets/hero.jpg";
import editorialImg from "@/assets/editorial.jpg";
import catLingerie from "@/assets/cat-lingerie.jpg";
import catSleepwear from "@/assets/cat-sleepwear.jpg";
import catWellness from "@/assets/cat-wellness.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import pConjunto from "@/assets/p-conjunto-noir.jpg";
import pBody from "@/assets/p-body-rose.jpg";
import pRobe from "@/assets/p-robe-bordeaux.jpg";
import pCamisola from "@/assets/p-camisola-champagne.jpg";
import pOleo from "@/assets/p-oleo-ambar.jpg";
import pVela from "@/assets/p-vela-desejo.jpg";
import pMascara from "@/assets/p-mascara-seda.jpg";
import pBalconette from "@/assets/p-balconette-nude.jpg";

export const images = { hero: heroImg, editorial: editorialImg };

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  image: string;
  description: string;
  details: string[];
  sizes: string[];
  badge?: string;
  stock: number;
};

export const categories: Category[] = [
  { slug: "lingerie", name: "Lingerie", tagline: "Renda que revela atitude", image: catLingerie },
  { slug: "robes-e-camisolas", name: "Robes & Camisolas", tagline: "Seda para noites longas", image: catSleepwear },
  { slug: "bem-estar", name: "Bem-estar", tagline: "Rituais para os sentidos", image: catWellness },
  { slug: "acessorios", name: "Acessórios", tagline: "Detalhes que seduzem", image: catAccessories },
];

export const products: Product[] = [
  {
    slug: "conjunto-renda-noir",
    name: "Conjunto Renda Noir",
    category: "lingerie",
    price: 289.9,
    compareAt: 339.9,
    image: pConjunto,
    description:
      "Renda francesa em vinho profundo com acabamento em cetim e laços delicados. Um conjunto que se sente antes de se mostrar.",
    details: ["Renda francesa com toque macio", "Alças reguláveis em cetim", "Sem bojo, máximo conforto"],
    sizes: ["P", "M", "G", "GG"],
    badge: "Mais desejado",
    stock: 18,
  },
  {
    slug: "body-rendado-rose",
    name: "Body Rendado Rosé",
    category: "lingerie",
    price: 349.9,
    image: pBody,
    description: "Body em renda rosé queimado com barbatanas suaves que desenham a silhueta com elegância.",
    details: ["Renda floral elástica", "Fechamento com colchetes", "Bojo com aro sutil"],
    sizes: ["P", "M", "G"],
    badge: "Novo",
    stock: 9,
  },
  {
    slug: "robe-seda-bordeaux",
    name: "Robe de Seda Bordeaux",
    category: "robes-e-camisolas",
    price: 459.9,
    image: pRobe,
    description: "Robe longo em seda acetinada bordeaux, com faixa e mangas amplas. Fluido, confiante, inesquecível.",
    details: ["Cetim de seda de toque frio", "Comprimento midi-longo", "Faixa removível"],
    sizes: ["P/M", "G/GG"],
    stock: 12,
  },
  {
    slug: "camisola-cetim-champagne",
    name: "Camisola Cetim Champagne",
    category: "robes-e-camisolas",
    price: 239.9,
    image: pCamisola,
    description: "Camisola em cetim champagne com renda na barra e no decote. A leveza de quem sabe o que quer.",
    details: ["Cetim acetinado", "Renda delicada no decote", "Alças finas reguláveis"],
    sizes: ["P", "M", "G"],
    stock: 22,
  },
  {
    slug: "oleo-massagem-ambar-rosa",
    name: "Óleo de Massagem Âmbar & Rosa",
    category: "bem-estar",
    price: 129.9,
    image: pOleo,
    description: "Blend de óleos vegetais com notas de âmbar e rosa damascena. Desliza na pele e perfuma o momento.",
    details: ["100 ml", "Vegano e sem parabenos", "Notas de âmbar, rosa e baunilha"],
    sizes: ["100 ml"],
    badge: "Ritual",
    stock: 40,
  },
  {
    slug: "vela-aromatica-desejo",
    name: "Vela Aromática Desejo",
    category: "bem-estar",
    price: 149.9,
    image: pVela,
    description: "Cera vegetal em vaso cerâmico vinho. Notas de figo, pimenta rosa e sândalo para criar atmosfera.",
    details: ["Queima de até 45 horas", "Cera de soja", "Vaso reutilizável"],
    sizes: ["220 g"],
    stock: 31,
  },
  {
    slug: "mascara-seda-rose",
    name: "Máscara de Seda Rosé",
    category: "acessorios",
    price: 119.9,
    image: pMascara,
    description: "Máscara em seda mulberry 22 momme. Suave na pele, perfeita para o descanso ou para o jogo.",
    details: ["Seda mulberry pura", "Elástico revestido", "Acompanha embalagem presenteável"],
    sizes: ["Único"],
    stock: 27,
  },
  {
    slug: "sutia-balconette-nude",
    name: "Sutiã Balconette Nude",
    category: "lingerie",
    price: 199.9,
    image: pBalconette,
    description: "Balconette em tule bordado nude champagne. Sustenta, valoriza e desaparece sob a roupa.",
    details: ["Tule bordado", "Bojo com aro", "Alças com renda"],
    sizes: ["40", "42", "44", "46"],
    stock: 15,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(slug: string) {
  if (slug === "todos") return products;
  return products.filter((p) => p.category === slug);
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
