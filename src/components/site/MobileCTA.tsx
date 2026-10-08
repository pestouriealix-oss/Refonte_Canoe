import { RESERVATION_URL, CONTACT } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Phone } from "lucide-react";

export function MobileCTA() {
  const { t } = useI18n();
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-stone/95 backdrop-blur-md border-t border-river/10 px-4 py-3 flex gap-2 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
      <a
        href={`tel:${CONTACT.phone}`}
        aria-label={t("cta.call")}
        className="grid place-items-center size-12 rounded-full border border-river/20 text-river"
      >
        <Phone size={18} />
      </a>
      <a
        href={RESERVATION_URL}
        target="_blank"
        rel="noreferrer"
        className="flex-1 bg-river text-stone rounded-full text-sm font-semibold grid place-items-center"
      >
        {t("cta.reserverOnline")}
      </a>
    </div>
  );
}
