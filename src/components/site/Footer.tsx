import { Link } from "@tanstack/react-router";
import { CONTACT, RESERVATION_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Facebook, MapPin } from "lucide-react";

export function Footer() {
  const { t, lang } = useI18n();
  const tagline =
    lang === "fr"
      ? "Base de loisirs familiale au cœur du Périgord Noir. Location de canoës, kayaks et vélos depuis plus de 15 ans, à 15 minutes de Sarlat, Souillac et Gourdon."
      : "Family-run outdoor base in the heart of the Périgord Noir. Canoe, kayak and bike rentals for over 15 years, 15 min from Sarlat, Souillac and Gourdon.";
  return (
    <footer className="bg-river text-stone mt-24">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2 max-w-md">
          <h3 className="font-serif text-3xl font-bold mb-4">Cap Evasion</h3>
          <p className="text-stone/70 leading-relaxed">{tagline}</p>
          <div className="flex gap-3 mt-6">
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="size-10 rounded-full border border-stone/30 grid place-items-center hover:bg-stone/10 transition-colors">
              <Facebook size={16} />
            </a>
            <a href={CONTACT.maps} target="_blank" rel="noreferrer" aria-label="Google Maps" className="size-10 rounded-full border border-stone/30 grid place-items-center hover:bg-stone/10 transition-colors">
              <MapPin size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ochre mb-4">
            {lang === "fr" ? "Localisation" : "Location"}
          </h4>
          <p className="text-sm leading-relaxed text-stone/80">{CONTACT.address}</p>
          <p className="text-sm text-stone/60 mt-1">{CONTACT.region}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ochre mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/canoe" className="hover:text-ochre transition-colors">{t("nav.canoe")}</Link></li>
            <li><Link to="/velo" className="hover:text-ochre transition-colors">{t("nav.velo")}</Link></li>
            <li><Link to="/combines" className="hover:text-ochre transition-colors">{t("nav.combines")}</Link></li>
            <li><Link to="/reservation" className="hover:text-ochre transition-colors">{t("nav.reservation")}</Link></li>
            <li><Link to="/infos" className="hover:text-ochre transition-colors">{t("nav.infos")}</Link></li>
            <li><Link to="/faq" className="hover:text-ochre transition-colors">{t("nav.faq")}</Link></li>
            <li><Link to="/avis" className="hover:text-ochre transition-colors">{t("nav.avis")}</Link></li>
            <li><Link to="/acces" className="hover:text-ochre transition-colors">{t("nav.acces")}</Link></li>
            <li><Link to="/contact" className="hover:text-ochre transition-colors">{t("nav.contact")}</Link></li>
            <li>
              <a href={RESERVATION_URL} target="_blank" rel="noreferrer" className="text-ochre font-semibold hover:underline">
                {t("cta.reserverOnline")} →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-stone/50 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} Cap Evasion — Saint-Julien-de-Lampon</span>
          <span>Périgord Noir, France</span>
        </div>
      </div>
    </footer>
  );
}
