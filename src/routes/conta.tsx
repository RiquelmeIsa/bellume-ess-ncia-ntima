
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/conta")({
  component: ContaPage,
});

function ContaPage() {
  const [mode, setMode] = useState<"login" | "cadastro">("login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-10 flex items-center gap-2 text-sm text-wine/70 hover:text-rose-deep"
        >
          <ArrowLeft size={16} />
          Voltar para a loja
        </Link>

        <div className="mb-10 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="border border-wine/10 bg-white p-7 shadow-sm sm:p-10">
          <p className="eyebrow mb-3 text-center text-rose-deep">
            SUA ESSÊNCIA, SEU ESPAÇO
          </p>

          <h1 className="mb-3 text-center font-display text-3xl text-wine">
            {mode === "login" ? "Bem-vinda à BELLUME" : "Crie sua conta"}
          </h1>

          <p className="mb-8 text-center text-sm text-wine/60">
            {mode === "login"
              ? "Entre para acompanhar seus pedidos e aproveitar sua experiência."
              : "Cadastre-se para acompanhar seus pedidos e novidades."}
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              alert("A integração da conta será ativada na próxima etapa.");
            }}
            className="space-y-5"
          >
            {mode === "cadastro" && (
              <label className="block">
                <span className="mb-2 block text-sm text-wine">Nome completo</span>
                <div className="flex items-center gap-3 border border-wine/15 px-4 py-3">
                  <User size={17} className="text-rose-deep" />
                  <input
                    required
                    type="text"
                    placeholder="Seu nome"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm text-wine">E-mail</span>
              <div className="flex items-center gap-3 border border-wine/15 px-4 py-3">
                <Mail size={17} className="text-rose-deep" />
                <input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-wine">Senha</span>
              <div className="flex items-center gap-3 border border-wine/15 px-4 py-3">
                <Lock size={17} className="text-rose-deep" />
                <input
                  required
                  type="password"
                  minLength={6}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full bg-wine py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-rose-deep"
            >
              {mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-wine/70">
            {mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
            {" "}
            <button
              type="button"
              onClick={() =>
                setMode(mode === "login" ? "cadastro" : "login")
              }
              className="font-semibold text-rose-deep underline underline-offset-4"
            >
              {mode === "login" ? "Cadastre-se" : "Fazer login"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-wine/45">
          BELLUME — Seu desejo, sua essência.
        </p>
      </div>
    </main>
  );
}
