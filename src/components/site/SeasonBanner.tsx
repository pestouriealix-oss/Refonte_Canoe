import { CONTACT } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Sun, Phone } from "lucide-react";

export function SeasonBanner() {
  const { t } = useI18n();
  return (
    <div className="bg-river text-stone text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Sun size={14} className="text-ochre shrink-0" />
          <span className="truncate">
            <span className="font-semibold">{t("season.short")}</span>
            <span className="hidden md:inline text-stone/70"> · {t("season.opening")}</span>
          </span>
        </div>
        <a
          href={`tel:${CONTACT.phone}`}
          className="flex items-center gap-1.5 text-ochre hover:underline whitespace-nowrap"
        >
          <Phone size={12} />
          <span className="hidden sm:inline">{CONTACT.phoneDisplay}</span>
          <span className="sm:hidden">{t("cta.call")}</span>
        </a>
      </div>
    </div>
  );
}
