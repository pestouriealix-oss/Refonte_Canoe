import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { COMBINES, PHOTOS, RESERVATION_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/combines")({
  head: () => ({
    meta: [
      { title: "Combiné vélo + canoë en Dordogne — Cap Evasion" },
      {
        name: "description",
        content:
          "Vivez la Dordogne deux fois : aller à vélo, retour en canoë. 3 formules de 24 € à 30 €.",
      },
      { property: "og:image", content: PHOTOS.combine },
    ],
  }),
  component: CombinesPage,
});

function CombinesPage() {
  const { t, tr } = useI18n();
  return (
    <div className="bg-stone">
      <Header />
      <PageHero
        eyebrow={t("combines.eyebrow")}
        title={<>{t("combines.title1")} <span className="italic">{t("combines.title2")}</span></>}
        subtitle={t("combines.subtitle")}
        image={PHOTOS.combine}
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {COMBINES.map((c, i) => (
              <article
                key={tr(c.name)}
                className="bg-white rounded-2xl p-8 border border-river/5 flex flex-col"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-ochre mb-3">
                  {t("combines.formula")} {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-3xl text-river mb-6">{tr(c.name)}</h3>

                <div className="space-y-4 mb-8 flex-grow">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-cliff mb-1">
                      {t("label.aller")}
                    </div>
                    <div className="text-river font-medium">{tr(c.aller)}</div>
                  </div>
                  <div className="h-px bg-river/10" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-cliff mb-1">
                      {t("label.retour")}
                    </div>
                    <div className="text-river font-medium">{tr(c.retour)}</div>
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-t border-river/10 pt-6">
                  <span className="font-serif text-3xl text-ochre font-bold">{c.prix}</span>
                  <a
                    href={RESERVATION_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold uppercase tracking-widest border-b-2 border-ochre pb-1 text-river hover:text-ochre transition-colors"
                  >
                    {t("cta.reserver")}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-8 items-center">
            <img src={PHOTOS.canoeFamily} alt="" className="rounded-2xl aspect-[4/3] object-cover" />
            <div>
              <h2 className="font-serif text-4xl text-river mb-4">{t("combines.day.title")}</h2>
              <p className="text-cliff text-lg leading-relaxed">{t("combines.day.text")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}
