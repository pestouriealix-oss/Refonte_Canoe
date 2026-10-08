import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileCTA } from "@/components/site/MobileCTA";
import { SeasonBanner } from "@/components/site/SeasonBanner";
import { FaqList } from "@/components/site/FaqList";
import { MosaicGallery } from "@/components/site/MosaicGallery";
import { Weather } from "@/components/site/Weather";
import { useI18n } from "@/lib/i18n";
import {
  PARCOURS_CANOE,
  PHOTOS,
  RESERVATION_URL,
  AVIS,
} from "@/lib/site";
import { ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cap Evasion — Canoë, kayak & vélo en Dordogne (Périgord Noir)" },
      {
        name: "description",
        content:
          "Location de canoës, kayaks et vélos sur la Dordogne. 4 parcours de 8 à 29 km, vélos électriques et combinés vélo+canoë. À Saint-Julien-de-Lampon, 15 min de Sarlat.",
      },
      { property: "og:title", content: "Cap Evasion — Canoë & vélo en Dordogne" },
      {
        property: "og:description",
        content:
          "Vivez la vallée de la Dordogne en canoë ou à vélo. Base de loisirs familiale en Périgord Noir.",
      },
      { property: "og:image", content: PHOTOS.heroValley },
      { name: "twitter:image", content: PHOTOS.heroValley },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, tr } = useI18n();

  const STATS = [
    { value: "15+", label: t("stats.years") },
    { value: "29 km", label: t("stats.river") },
    { value: "30 km", label: t("stats.bike") },
    { value: "1001", label: t("stats.castles") },
  ];

  const SERVICES = [
    t("services.parking"),
    t("services.buvette"),
    t("services.plage"),
    t("services.picnic"),
    t("services.animals"),
    t("services.shop"),
    t("services.bus"),
    t("services.kids"),
  ];

  return (
    <div className="min-h-screen bg-stone pb-20 md:pb-0">
      <SeasonBanner />
      <Header />

      {/* HERO */}
      <header className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={PHOTOS.heroValley}
            alt="La vallée de la Dordogne et le village de La Roque-Gageac"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-river/80 via-river/50 to-river/25" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 py-1 px-3 border border-stone/40 rounded-full text-stone text-xs uppercase tracking-[0.2em] bg-stone/10 backdrop-blur-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
              {t("hero.region")}
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone mb-6 leading-[0.9]" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}>
              {t("hero.title1")} <br />
              <span className="italic">{t("hero.title2")}</span>
            </h1>
            <p className="text-stone text-lg md:text-xl mb-8 font-light leading-relaxed max-w-xl" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              {t("hero.subtitle")}
            </p>


            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noreferrer"
                className="bg-ochre text-white px-8 py-4 rounded-full font-semibold text-base hover:scale-[1.03] transition-transform text-center"
              >
                {t("cta.reserverNow")}
              </a>
              <Link
                to="/canoe"
                className="border border-stone/50 text-stone px-8 py-4 rounded-full font-semibold text-base hover:bg-stone/10 transition-colors text-center"
              >
                {t("cta.voirParcours")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <section className="bg-stone py-16 border-b border-river/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-serif text-4xl md:text-5xl text-river font-bold">
                {s.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-cliff">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-ochre">
            {t("intro.kicker")}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-river mt-4 mb-6 leading-tight">
            {t("intro.title1")} <span className="italic">{t("intro.title2")}</span>
          </h2>
          <p className="text-lg text-cliff leading-relaxed">{t("intro.text")}</p>
        </div>
      </section>

      {/* ACTIVITES */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <ActivityCard
            to="/canoe"
            image={PHOTOS.canoeIntegrale}
            title={t("act.canoe.title")}
            price={`${t("act.from")} 16 €`}
            text={t("act.canoe.text")}
            cta={t("act.canoe.cta")}
          />
          <ActivityCard
            to="/velo"
            image={PHOTOS.veloVoieVerte}
            title={t("act.velo.title")}
            price={`${t("act.from")} 10 €`}
            text={t("act.velo.text")}
            cta={t("act.velo.cta")}
          />
          <ActivityCard
            to="/combines"
            image={PHOTOS.combine}
            title={t("act.combine.title")}
            price={`${t("act.from")} 24 €`}
            text={t("act.combine.text")}
            cta={t("act.combine.cta")}
          />
        </div>
      </section>

      {/* MÉTÉO */}
      <Weather />

      {/* SERVICES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <h2 className="font-serif text-4xl md:text-5xl text-river">
              {t("services.title")}
            </h2>
            <p className="text-cliff max-w-sm">{t("services.text")}</p>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SERVICES.map((s) => (
              <li
                key={s}
                className="bg-white rounded-xl px-5 py-4 text-sm font-medium text-river border border-river/5"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PARCOURS PHARES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-ochre">
              {t("parcours.kicker")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-river mt-4">
              {t("parcours.title1")} <span className="italic">{t("parcours.title2")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PARCOURS_CANOE.map((p) => (
              <article
                key={p.slug}
                className="group bg-white rounded-2xl overflow-hidden border border-river/5 hover:shadow-lg transition-shadow flex flex-col"
              >
                <Link to="/canoe" className="block aspect-[16/10] overflow-hidden">
                  <img
                    src={p.photo}
                    alt={tr(p.name)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-serif text-2xl text-river">{tr(p.name)}</h3>
                    <span className="text-ochre font-bold">
                      {p.prix}
                      {t("parcours.perPers")}
                    </span>
                  </div>
                  <div className="text-sm text-cliff mb-3">{p.trajet}</div>
                  <div className="flex gap-4 text-xs uppercase tracking-widest text-river/60 font-semibold mb-5">
                    <span>{p.km}</span>
                    <span>•</span>
                    <span>{tr(p.duree)}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={RESERVATION_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-river text-stone px-4 py-2.5 rounded-full text-sm font-semibold text-center hover:bg-river/90 transition-colors"
                    >
                      {t("cta.reserver")}
                    </a>
                    <Link
                      to="/canoe"
                      className="px-4 py-2.5 rounded-full text-sm font-semibold border border-river/20 text-river hover:bg-river/5 transition-colors"
                    >
                      {t("parcours.details")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="bg-river text-stone py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ochre">
                {t("avis.kicker")}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4">{t("avis.title")}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-ochre">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-stone/70">{t("avis.google")}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {AVIS.slice(0, 3).map((a) => (
              <blockquote key={a.name} className="border-l-2 border-ochre pl-6 py-1">
                <p className="font-serif text-lg leading-relaxed italic text-stone mb-4">
                  « {tr(a.text)} »
                </p>
                <footer className="text-xs uppercase tracking-widest text-stone/60">
                  — {a.name}
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/avis"
              className="inline-flex items-center gap-2 border border-stone/40 text-stone px-6 py-3 rounded-full text-sm font-semibold hover:bg-stone/10 transition-colors"
            >
              {t("avis.all")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* GALERIE MAGAZINE */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-ochre">
              {t("gallery.kicker")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-river mt-4">
              {t("gallery.title")}
            </h2>
          </div>
          <MosaicGallery />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-stone-warm py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-ochre">
              {t("faq.kicker")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-river mt-4">
              {t("faq.title1")} <span className="italic">{t("faq.title2")}</span>
            </h2>
          </div>
          <FaqList limit={5} />
          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-river border-b-2 border-ochre pb-1 hover:text-ochre transition-colors"
            >
              {t("faq.all")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-ochre rounded-3xl p-10 md:p-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            {t("cta.bigTitle")}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">{t("cta.bigText")}</p>
          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white text-river px-8 py-4 rounded-full font-semibold hover:scale-[1.03] transition-transform"
          >
            {t("cta.reserverOnline")} <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}

function ActivityCard({
  to,
  image,
  title,
  price,
  text,
  cta,
}: {
  to: "/canoe" | "/velo" | "/combines";
  image: string;
  title: string;
  price: string;
  text: string;
  cta: string;
}) {
  return (
    <Link to={to} className="group block">
      <div className="overflow-hidden rounded-2xl mb-6 aspect-[4/5]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="flex justify-between items-baseline mb-3">
        <h3 className="font-serif text-3xl text-river">{title}</h3>
        <span className="text-ochre font-bold">{price}</span>
      </div>
      <p className="text-cliff leading-relaxed mb-5">{text}</p>
      <span className="text-xs font-bold uppercase tracking-widest border-b-2 border-ochre pb-1 text-river group-hover:text-ochre transition-colors">
        {cta}
      </span>
    </Link>
  );
}
