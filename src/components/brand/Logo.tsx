import { Link } from "@tanstack/react-router";

import monogram from "@/assets/bellume-monogram-sm.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  withSlogan?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: "h-10", word: "text-xl tracking-[0.32em]" },
  md: { mark: "h-12", word: "text-2xl md:text-[1.75rem] tracking-[0.38em]" },
  lg: { mark: "h-20", word: "text-4xl md:text-5xl tracking-[0.4em]" },
};

export function Monogram({ className }: { className?: string }) {
  return <img src={monogram} alt="" aria-hidden className={cn("w-auto select-none", className)} />;
}

export function Logo({ tone = "dark", size = "md", withSlogan = false, className }: LogoProps) {
  const s = sizes[size];
  return (
    <Link to="/" aria-label="BELLUME — página inicial" className={cn("group inline-flex items-center gap-3", className)}>
      <Monogram className={cn(s.mark, "transition-transform duration-500 group-hover:rotate-[-6deg]")} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-semibold",
            s.word,
            tone === "light" ? "text-ivory" : "text-wine",
          )}
        >
          BELLUME
        </span>
        {withSlogan && (
          <span className={cn("eyebrow mt-2 !text-[0.55rem] !tracking-[0.36em]", tone === "light" ? "text-rose" : "text-rose-deep")}>
            Seu desejo, sua essência
          </span>
        )}
      </span>
    </Link>
  );
}
