import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { FaqList } from "@/components/site/FaqList";
import { PHOTOS } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Cap Evasion" },
      {
        name: "description",
        content:
          "Tout ce qu'il faut savoir avant votre descente : âge, savoir nager, météo, navette, chiens, annulation.",
      },
      { property: "og:image", content: PHOTOS.roque },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { t } = useI18n();
  return (
    <div className="bg-stone min-h-screen">
      <Header />
      <PageHero
        eyebrow={t("faqPage.eyebrow")}
        title={<>{t("faqPage.title1")} <span className="italic">{t("faqPage.title2")}</span></>}
        subtitle={t("faqPage.subtitle")}
        image={PHOTOS.roque}
      />
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FaqList />
        </div>
      </section>
      <Footer />
      <MobileCTA />
    </div>
  );
}
