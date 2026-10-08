import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { PARCOURS_CANOE, PHOTOS, RESERVATION_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/canoe")({
  head: () => ({
    meta: [
      { title: "Location canoë & kayak en Dordogne — Cap Evasion" },
      {
        name: "description",
        content:
          "4 parcours en canoë ou kayak sur la Dordogne : La Sauvage, La Familiale, La Pittoresque, L'Intégrale. De 8 à 29 km, dès 16 €. Retour en bus gratuit.",
      },
      { property: "og:title", content: "Canoe & kayak rentals on the Dordogne" },
      { property: "og:image", content: PHOTOS.canoeIntegrale },
    ],
  }),
  component: CanoePage,
});

function CanoePage() {
  const { t, tr } = useI18n();
  return (
    <div className="bg-stone">
      <Header />
      <PageHero
        eyebrow={t("canoe.eyebrow")}
        title={
          <>
            {t("canoe.title1")} <span className="italic">{t("canoe.title2")}</span>
          </>
        }
        subtitle={t("canoe.subtitle")}
        image={PHOTOS.heroValley}
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          {PARCOURS_CANOE.map((p, i) => (
            <article
              key={p.slug}
              className={`grid md:grid-cols-2 gap-10 items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img src={p.photo} alt={tr(p.name)} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ochre">
                  {t("canoe.parcoursLabel")} {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-river mt-3 mb-4">
                  {tr(p.name)}
                </h2>
                <div className="text-cliff text-sm uppercase tracking-widest mb-6">
                  {p.trajet}
                </div>
                <p className="text-cliff text-lg leading-relaxed mb-8">{tr(p.description)}</p>

                <div className="flex flex-wrap gap-8 mb-8">
                  <Stat label={t("label.distance")} value={p.km} />
                  <Stat label={t("label.duree")} value={tr(p.duree)} />
                  <Stat label={t("label.tarif")} value={`${p.prix}${t("parcours.perPers")}`} accent />
                </div>

                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex bg-river text-stone px-7 py-3 rounded-full text-sm font-semibold hover:bg-river/90 transition-colors"
                >
                  {t("canoe.reserveParcours")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-river text-stone py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <Info title={t("canoe.info1.t")} text={t("canoe.info1.x")} />
          <Info title={t("canoe.info2.t")} text={t("canoe.info2.x")} />
          <Info title={t("canoe.info3.t")} text={t("canoe.info3.x")} />
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-cliff mb-1">{label}</div>
      <div className={`font-serif text-2xl ${accent ? "text-ochre" : "text-river"} font-semibold`}>
        {value}
      </div>
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-serif text-2xl text-stone mb-2">{title}</h3>
      <p className="text-stone/70 text-sm">{text}</p>
    </div>
  );
}
