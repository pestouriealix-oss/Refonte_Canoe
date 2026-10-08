import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { ACCES, CONTACT, PHOTOS } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { MapPin, Car, Navigation } from "lucide-react";

export const Route = createFileRoute("/acces")({
  head: () => ({
    meta: [
      { title: "Accès — Cap Evasion à Saint-Julien-de-Lampon" },
      {
        name: "description",
        content:
          "Comment venir chez Cap Evasion : itinéraires depuis Sarlat, Souillac, Brive, Bergerac, Périgueux et Bordeaux.",
      },
      { property: "og:image", content: PHOTOS.base },
    ],
  }),
  component: AccesPage,
});

function AccesPage() {
  const { t, tr } = useI18n();
  return (
    <div className="bg-stone min-h-screen">
      <Header />
      <PageHero
        eyebrow={t("acces.eyebrow")}
        title={<>{t("acces.title1")} <span className="italic">{t("acces.title2")}</span></>}
        subtitle={t("acces.subtitle")}
        image={PHOTOS.base}
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-river/10">
              <MapPin className="text-ochre mb-4" size={28} />
              <h2 className="font-serif text-2xl text-river mb-2">{t("acces.address.t")}</h2>
              <p className="text-cliff leading-relaxed">
                {CONTACT.address}<br />
                {CONTACT.region}
              </p>
              <a
                href={CONTACT.maps}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-river hover:text-ochre transition-colors"
              >
                <Navigation size={14} /> {t("acces.maps")}
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-river/10">
              <Car className="text-ochre mb-4" size={28} />
              <h2 className="font-serif text-2xl text-river mb-2">{t("acces.parking.t")}</h2>
              <p className="text-cliff leading-relaxed">{t("acces.parking.x")}</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-serif text-3xl text-river mb-6">{t("acces.from")}</h2>
            <ul className="divide-y divide-river/10 bg-white rounded-2xl border border-river/10 overflow-hidden">
              {ACCES.map((a) => (
                <li key={a.from} className="p-6 flex flex-wrap items-baseline gap-4 justify-between">
                  <div className="min-w-0">
                    <div className="font-serif text-xl text-river">{a.from}</div>
                    <div className="text-sm text-cliff mt-1">{tr(a.route)}</div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-cliff"><span className="font-semibold text-river">{a.distance}</span></span>
                    <span className="text-ochre font-semibold">{tr(a.duree)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-river/10 aspect-[16/9]">
          <iframe
            title="Carte Cap Evasion"
            src="https://www.openstreetmap.org/export/embed.html?bbox=1.3375%2C44.8503%2C1.3575%2C44.8603&layer=mapnik&marker=44.8553%2C1.3475"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </section>
      <Footer />
      <MobileCTA />
    </div>
  );
}
