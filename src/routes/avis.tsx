import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { AVIS, PHOTOS, CONTACT } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Star, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/avis")({
  head: () => ({
    meta: [
      { title: "Avis clients — Cap Evasion" },
      {
        name: "description",
        content:
          "Des centaines de familles nous ont fait confiance. Découvrez leurs témoignages.",
      },
      { property: "og:image", content: PHOTOS.groupe },
    ],
  }),
  component: AvisPage,
});

function AvisPage() {
  const { t, tr } = useI18n();
  return (
    <div className="bg-stone min-h-screen">
      <Header />
      <PageHero
        eyebrow={t("avisPage.eyebrow")}
        title={<>{t("avisPage.title1")} <span className="italic">{t("avisPage.title2")}</span></>}
        subtitle={t("avisPage.subtitle")}
        image={PHOTOS.groupe}
      />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex gap-1 text-ochre">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-cliff">{t("avisPage.count")}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {AVIS.map((a, i) => (
              <blockquote key={i} className="bg-white rounded-2xl p-8 border border-river/5">
                <div className="flex gap-1 text-ochre mb-4">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif text-lg leading-relaxed italic text-river mb-5">
                  « {tr(a.text)} »
                </p>
                <footer className="text-xs uppercase tracking-widest text-cliff">— {a.name}</footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href={CONTACT.maps}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-river text-stone px-6 py-3 rounded-full text-sm font-semibold hover:bg-river/90 transition-colors"
            >
              {t("avis.allGoogle")} <ExternalLink size={14} />
            </a>
            <a
              href={CONTACT.tripadvisor}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-river/20 text-river px-6 py-3 rounded-full text-sm font-semibold hover:bg-river/5 transition-colors"
            >
              Tripadvisor <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
      <Footer />
      <MobileCTA />
    </div>
  );
}
