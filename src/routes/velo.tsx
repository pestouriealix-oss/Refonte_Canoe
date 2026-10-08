import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { PHOTOS, RESERVATION_URL, VELOS } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/velo")({
  head: () => ({
    meta: [
      { title: "Location vélo & VAE en Dordogne — Cap Evasion" },
      {
        name: "description",
        content:
          "Location de vélos électriques, VTT, VTC, vélos enfants et remorques. Au pied de la voie verte de 30 km longeant la Dordogne, dès 10 € la demi-journée.",
      },
      { property: "og:image", content: PHOTOS.veloVoieVerte },
    ],
  }),
  component: VeloPage,
});

function VeloPage() {
  const { t, tr } = useI18n();
  return (
    <div className="bg-stone">
      <Header />
      <PageHero
        eyebrow={t("velo.eyebrow")}
        title={<>{t("velo.title1")} <span className="italic">{t("velo.title2")}</span></>}
        subtitle={t("velo.subtitle")}
        image={PHOTOS.veloVoieVerte}
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-river mb-6">
              {t("velo.family.title")}
            </h2>
            <p className="text-cliff text-lg leading-relaxed mb-4">{t("velo.family.t1")}</p>
            <p className="text-cliff text-lg leading-relaxed">{t("velo.family.t2")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={PHOTOS.veloVoieVerte} alt="" className="rounded-xl aspect-square object-cover" />
            <img src={PHOTOS.veloPont} alt="" className="rounded-xl aspect-square object-cover mt-8" />
            <img src={PHOTOS.veloGare} alt="" className="rounded-xl aspect-square object-cover" />
            <img src={PHOTOS.combine} alt="" className="rounded-xl aspect-square object-cover mt-8" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-river mb-10">{t("velo.prices")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VELOS.map((v) => (
              <div key={tr(v.name)} className="bg-white rounded-2xl p-8 border border-river/5">
                <h3 className="font-serif text-2xl text-river mb-2">{tr(v.name)}</h3>
                <p className="text-cliff mb-6 leading-relaxed">{tr(v.description)}</p>
                <div className="grid grid-cols-3 gap-4 border-t border-river/10 pt-6">
                  <PriceCell label={t("label.demi")} value={v.demi} />
                  <PriceCell label={t("label.jour")} value={v.jour} accent />
                  <PriceCell label={t("label.sup")} value={v.sup} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-ochre text-white px-8 py-4 rounded-full font-semibold hover:scale-[1.03] transition-transform"
            >
              {t("velo.reserve")}
            </a>
            <p className="text-xs text-cliff mt-4 uppercase tracking-widest">{t("velo.helmet")}</p>
          </div>
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}

function PriceCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-cliff mb-1">{label}</div>
      <div className={`font-serif text-xl font-semibold ${accent ? "text-ochre" : "text-river"}`}>
        {value}
      </div>
    </div>
  );
}
