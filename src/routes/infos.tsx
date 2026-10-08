import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { PHOTOS } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/infos")({
  head: () => ({
    meta: [
      { title: "Infos pratiques — Cap Evasion Dordogne" },
      {
        name: "description",
        content:
          "Tout savoir pour préparer votre journée : services sur la base, conseils, accès, équipements.",
      },
    ],
  }),
  component: InfosPage,
});

function InfosPage() {
  const { t } = useI18n();
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
    <div className="bg-stone">
      <Header />
      <PageHero
        eyebrow={t("infos.eyebrow")}
        title={<>{t("infos.title1")} <span className="italic">{t("infos.title2")}</span></>}
        subtitle={t("infos.subtitle")}
        image={PHOTOS.base}
      />

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl text-river mb-8">{t("services.title")}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
            {SERVICES.map((s) => (
              <li
                key={s}
                className="bg-white rounded-xl px-5 py-4 text-sm font-medium text-river border border-river/5"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="space-y-12">
            <Block title={t("infos.when.t")}>{t("infos.when.x")}</Block>
            <Block title={t("infos.what.t")}>{t("infos.what.x")}</Block>
            <Block title={t("infos.who.t")}>{t("infos.who.x")}</Block>
            <Block title={t("infos.dogs.t")}>{t("infos.dogs.x")}</Block>
          </div>
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-river/10 pt-8">
      <h3 className="font-serif text-2xl text-river mb-3">{title}</h3>
      <p className="text-cliff text-lg leading-relaxed">{children}</p>
    </div>
  );
}
