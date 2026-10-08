import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { RESERVATION_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Menu, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useI18n();

  const NAV = [
    { to: "/canoe" as const, label: t("nav.canoe") },
    { to: "/velo" as const, label: t("nav.velo") },
    { to: "/combines" as const, label: t("nav.combines") },
    { to: "/reservation" as const, label: t("nav.reservation") },
    { to: "/infos" as const, label: t("nav.infos") },
    { to: "/faq" as const, label: t("nav.faq") },
    { to: "/contact" as const, label: t("nav.contact") },
  ];

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div
      className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-widest ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`px-2 py-1 transition-colors ${
          lang === "fr" ? "text-ochre" : "text-river/50 hover:text-river"
        }`}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <span className="text-river/30">/</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2 py-1 transition-colors ${
          lang === "en" ? "text-ochre" : "text-river/50 hover:text-river"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-stone/85 backdrop-blur-md border-b border-river/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-river">
          Cap Evasion
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium uppercase tracking-widest text-river">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-ochre transition-colors"
              activeProps={{ className: "text-ochre" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle className="hidden sm:inline-flex" />
          <Link
            to="/reservation"
            className="hidden sm:inline-flex bg-river text-stone px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-river/90 transition-all"
          >
            {t("cta.reserver")}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            className="lg:hidden p-2 -mr-2 text-river"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-river/10 bg-stone">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-widest text-river hover:text-ochre"
                activeProps={{ className: "text-ochre" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <LangToggle />
            </div>
            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 bg-river text-stone px-6 py-3 rounded-full text-sm font-semibold text-center"
            >
              {t("cta.reserver")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
