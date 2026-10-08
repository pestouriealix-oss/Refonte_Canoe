import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Cloud, Droplets, Wind } from "lucide-react";

interface WeatherData {
  air: number;
  water: number;
  wind: number;
}

export function Weather() {
  const { t, lang } = useI18n();
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=44.8553&longitude=1.3475" +
      "&current=temperature_2m,wind_speed_10m&timezone=Europe%2FParis";
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const air = Math.round(j?.current?.temperature_2m ?? 0);
        const wind = Math.round(j?.current?.wind_speed_10m ?? 0);
        // Eau ≈ air − 4 (estimation simple pour la Dordogne en saison)
        const water = Math.max(12, air - 4);
        setData({ air, water, wind });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur border border-river/10 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ochre mb-1">
              {t("weather.title")}
            </div>
            <div className="font-serif text-xl text-river">Saint-Julien-de-Lampon</div>
          </div>
          <div className="flex items-center gap-8 text-river">
            <Stat
              icon={<Cloud size={18} />}
              label={t("weather.air")}
              value={data ? `${data.air}°` : "—"}
            />
            <Stat
              icon={<Droplets size={18} />}
              label={t("weather.water")}
              value={data ? `${data.water}°` : "—"}
            />
            <Stat
              icon={<Wind size={18} />}
              label={t("weather.wind")}
              value={data ? `${data.wind} ${lang === "fr" ? "km/h" : "kph"}` : "—"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 text-ochre">{icon}</div>
      <div className="font-serif text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-cliff">{label}</div>
    </div>
  );
}
