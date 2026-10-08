import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { CONTACT, PHOTOS, RESERVATION_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Facebook, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & accès — Cap Evasion Saint-Julien-de-Lampon" },
      {
        name: "description",
        content:
          "Nous trouver à Saint-Julien-de-Lampon en Périgord Noir, à 15 min de Sarlat, Souillac et Gourdon.",
      },
      { property: "og:image", content: PHOTOS.base2 },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="bg-stone">
      <Header />
      <PageHero
        eyebrow={t("contact.eyebrow")}
        title={<>{t("contact.title1")} <span className="italic">{t("contact.title2")}</span></>}
        subtitle={t("contact.subtitle")}
        image={PHOTOS.heroAlt}
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-4xl text-river mb-8">Cap Evasion</h2>

            <div className="space-y-6 mb-10">
              <Item label={t("contact.address")}>
                {CONTACT.address}<br />
                <span className="text-cliff">{CONTACT.region}</span>
              </Item>
              <Item label={t("contact.opening")}>{t("contact.openingText")}</Item>
              <Item label={t("contact.follow")}>
                <div className="flex gap-3 mt-2">
                  <a href={CONTACT.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="size-11 rounded-full border border-river/20 grid place-items-center hover:bg-river hover:text-stone transition-colors">
                    <Facebook size={16} />
                  </a>
                  <a href={CONTACT.maps} target="_blank" rel="noreferrer" aria-label="Google Maps" className="size-11 rounded-full border border-river/20 grid place-items-center hover:bg-river hover:text-stone transition-colors">
                    <MapPin size={16} />
                  </a>
                </div>
              </Item>
            </div>

            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-ochre text-white px-8 py-4 rounded-full font-semibold hover:scale-[1.03] transition-transform"
            >
              {t("cta.reserverOnline")}
            </a>
          </div>

          <div className="aspect-square md:aspect-auto rounded-2xl overflow-hidden border border-river/10">
            <iframe
              title="Cap Evasion — Saint-Julien-de-Lampon"
              src="https://www.google.com/maps?q=Saint-Julien-de-Lampon,+France&output=embed"
              className="w-full h-full min-h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-ochre font-bold mb-2">{label}</div>
      <div className="text-river text-lg leading-relaxed">{children}</div>
    </div>
  );
}
