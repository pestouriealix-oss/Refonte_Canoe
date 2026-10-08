import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MobileCTA } from "@/components/site/MobileCTA";
import { CONTACT, PHOTOS } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRight, ArrowLeft, Check, Phone, Users, Minus, Plus } from "lucide-react";
import { fr, enUS } from "date-fns/locale";
import {
  listActivitiesPublic,
  getMonthAvailability,
  createBooking,
} from "@/lib/reservation.functions";
import { CreditCard, MapPin } from "lucide-react";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Réservation en ligne — Cap Evasion Dordogne" },
      { name: "description", content: "Réservez votre canoë, kayak ou vélo en ligne, en quelques clics." },
      { property: "og:title", content: "Réservation — Cap Evasion" },
      { property: "og:image", content: PHOTOS.heroValley },
    ],
  }),
  component: ReservationPage,
});

type Activity = {
  id: string;
  slug: string;
  type: "canoe" | "velo" | "combine";
  name_fr: string;
  name_en: string;
  description_fr: string | null;
  description_en: string | null;
  duration_minutes: number;
  base_price_cents: number;
  child_price_cents: number | null;
  max_capacity: number;
};

type Step = "activity" | "date" | "contact" | "done";

function ReservationPage() {
  const { lang, tr } = useI18n();
  const [step, setStep] = useState<Step>("activity");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState<"on_site" | "online">("on_site");
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [paidConfirm, setPaidConfirm] = useState(false);

  // Retour depuis Stripe Checkout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (params.get("paid") === "1" && ref) {
      setBookingRef(ref);
      setPaidConfirm(true);
      setStep("done");
      window.history.replaceState({}, "", "/reservation");
    } else if (params.get("canceled") === "1") {
      window.history.replaceState({}, "", "/reservation");
    }
  }, []);

  const fetchActivities = useServerFn(listActivitiesPublic);
  const { data: actData } = useQuery({
    queryKey: ["public-activities"],
    queryFn: () => fetchActivities(),
  });

  return (
    <div className="bg-stone min-h-screen pb-20 md:pb-0">
      <Header />
      <PageHero
        eyebrow={tr({ fr: "Réservation", en: "Booking" })}
        title={<>{tr({ fr: "Réservez en", en: "Book in a" })} <span className="italic">{tr({ fr: "quelques clics", en: "few clicks" })}</span></>}
        subtitle={tr({
          fr: "Choisissez votre activité, votre date, et nous nous occupons du reste.",
          en: "Pick your activity, your date, we handle the rest.",
        })}
        image={PHOTOS.heroAlt}
      />

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Stepper step={step} lang={lang} />

          {step === "activity" && (
            <ActivityStep
              activities={(actData?.activities ?? []) as Activity[]}
              onPick={(a) => {
                setActivity(a);
                setStep("date");
              }}
            />
          )}

          {step === "date" && activity && (
            <DateStep
              activity={activity}
              date={date}
              setDate={setDate}
              adults={adults}
              setAdults={setAdults}
              childrenCount={children}
              setChildren={setChildren}
              onBack={() => setStep("activity")}
              onNext={() => setStep("contact")}
              lang={lang}
            />
          )}

          {step === "contact" && activity && date && (
            <ContactStep
              activity={activity}
              date={date}
              adults={adults}
              childrenCount={children}
              form={form}
              setForm={setForm}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onBack={() => setStep("date")}
              onConfirmed={(ref) => {
                setBookingRef(ref);
                setStep("done");
              }}
            />
          )}

          {step === "done" && bookingRef && (
            <DoneStep bookingRef={bookingRef} paid={paidConfirm} />
          )}
        </div>
      </section>

      <Footer />
      <MobileCTA />
    </div>
  );
}

// -------------------- Stepper --------------------
function Stepper({ step, lang }: { step: Step; lang: "fr" | "en" }) {
  const labels = lang === "fr"
    ? ["Activité", "Date & personnes", "Coordonnées", "Confirmation"]
    : ["Activity", "Date & people", "Contact", "Confirmation"];
  const order: Step[] = ["activity", "date", "contact", "done"];
  const idx = order.indexOf(step);
  return (
    <div className="flex items-center gap-2 md:gap-4 mb-10 text-xs">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center gap-2 md:gap-4 flex-1">
          <div className={`size-7 rounded-full flex items-center justify-center font-semibold text-[11px] ${
            i < idx ? "bg-ochre text-white" :
            i === idx ? "bg-river text-stone" :
            "bg-white border border-river/15 text-cliff"
          }`}>
            {i < idx ? <Check size={13} /> : i + 1}
          </div>
          <span className={`hidden md:inline ${i === idx ? "text-river font-semibold" : "text-cliff"}`}>{l}</span>
          {i < labels.length - 1 && <div className={`flex-1 h-px ${i < idx ? "bg-ochre" : "bg-river/10"}`} />}
        </div>
      ))}
    </div>
  );
}

// -------------------- Step 1 : activité --------------------
function ActivityStep({ activities, onPick }: { activities: Activity[]; onPick: (a: Activity) => void }) {
  const { lang, tr } = useI18n();
  const types: Array<{ key: "canoe" | "velo" | "combine"; label: string }> = [
    { key: "canoe", label: tr({ fr: "Canoë & kayak", en: "Canoe & kayak" }) },
    { key: "velo", label: tr({ fr: "Vélo & VAE", en: "Bike & e-bike" }) },
    { key: "combine", label: tr({ fr: "Combinés vélo + canoë", en: "Bike + canoe combos" }) },
  ];

  return (
    <div className="space-y-10">
      {types.map((t) => {
        const items = activities.filter((a) => a.type === t.key);
        if (!items.length) return null;
        return (
          <div key={t.key}>
            <h2 className="font-serif text-2xl text-river mb-5">{t.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onPick(a)}
                  className="text-left bg-white border border-river/10 rounded-2xl p-6 hover:border-ochre hover:shadow-lg transition-all group"
                >
                  <div className="font-serif text-xl text-river mb-1">{lang === "fr" ? a.name_fr : a.name_en}</div>
                  <div className="text-xs text-cliff mb-4">
                    {Math.round(a.duration_minutes / 60 * 10) / 10}h · {tr({ fr: "max", en: "max" })} {a.max_capacity}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-cliff">{tr({ fr: "Adulte", en: "Adult" })}</div>
                      <div className="font-serif text-2xl text-river">{(a.base_price_cents / 100).toFixed(0)} €</div>
                    </div>
                    <ArrowRight size={18} className="text-ochre group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------- Step 2 : date + personnes --------------------
function DateStep(props: {
  activity: Activity;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  adults: number;
  setAdults: (n: number) => void;
  childrenCount: number;
  setChildren: (n: number) => void;
  onBack: () => void;
  onNext: () => void;
  lang: "fr" | "en";
}) {
  const { tr } = useI18n();
  const { activity, date, setDate, adults, setAdults, childrenCount, setChildren, lang } = props;
  const [month, setMonth] = useState<Date>(() => date ?? new Date());

  const fetchAvail = useServerFn(getMonthAvailability);
  const { data: availData } = useQuery({
    queryKey: ["availability", activity.id, month.getFullYear(), month.getMonth()],
    queryFn: () => fetchAvail({ data: { activityId: activity.id, year: month.getFullYear(), month: month.getMonth() } }),
  });
  const availability = availData?.availability ?? {};

  const isDisabled = (d: Date) => {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return (availability[iso] ?? 0) < adults + childrenCount;
  };

  const people = adults + childrenCount;
  const remaining = date
    ? availability[`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`] ?? 0
    : 0;
  const total =
    adults * activity.base_price_cents +
    childrenCount * (activity.child_price_cents ?? activity.base_price_cents);

  const dateLabel = date
    ? date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : tr({ fr: "Sélectionnez une date", en: "Pick a date" });

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-3 bg-white rounded-2xl border border-river/10 p-6 md:p-10 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
          disabled={isDisabled}
          locale={lang === "fr" ? fr : enUS}
          numberOfMonths={1}
          showOutsideDays={false}
          className="pointer-events-auto [--cell-size:2.6rem]"
        />
      </div>

      <aside className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border border-river/10 p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ochre mb-1">
            {lang === "fr" ? activity.name_fr : activity.name_en}
          </div>
          <div className="font-serif text-lg text-river mb-5 first-letter:uppercase">{dateLabel}</div>

          <Counter
            label={tr({ fr: "Adultes", en: "Adults" })}
            sublabel={`${(activity.base_price_cents / 100).toFixed(0)} €`}
            value={adults}
            min={1}
            max={activity.max_capacity}
            onChange={setAdults}
          />
          {activity.child_price_cents !== null && (
            <Counter
              label={tr({ fr: "Enfants (-10 ans)", en: "Children (under 10)" })}
              sublabel={`${(activity.child_price_cents / 100).toFixed(0)} €`}
              value={childrenCount}
              min={0}
              max={activity.max_capacity}
              onChange={setChildren}
            />
          )}

          <div className="border-t border-river/10 mt-5 pt-5 flex items-baseline justify-between">
            <span className="text-sm text-cliff">{tr({ fr: "Total", en: "Total" })}</span>
            <span className="font-serif text-2xl text-river">{(total / 100).toFixed(2)} €</span>
          </div>

          {date && (
            <div className="mt-3 text-xs text-cliff inline-flex items-center gap-2">
              <Users size={12} /> {remaining} {tr({ fr: "places restantes", en: "spots left" })}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={props.onBack} className="px-5 py-3 rounded-full border border-river/20 text-sm font-medium text-river hover:bg-river/5 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> {tr({ fr: "Retour", en: "Back" })}
          </button>
          <button
            onClick={props.onNext}
            disabled={!date || people < 1 || remaining < people}
            className="flex-1 px-6 py-3 rounded-full bg-ochre text-white font-semibold text-sm disabled:bg-river/15 disabled:text-river/40 hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2"
          >
            {tr({ fr: "Continuer", en: "Continue" })} <ArrowRight size={14} />
          </button>
        </div>
      </aside>
    </div>
  );
}

function Counter({ label, sublabel, value, min, max, onChange }: { label: string; sublabel?: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-river/5 last:border-0">
      <div>
        <div className="text-sm font-medium text-river">{label}</div>
        {sublabel && <div className="text-xs text-cliff">{sublabel}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="size-8 rounded-full border border-river/20 flex items-center justify-center text-river disabled:opacity-30 hover:bg-river/5"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center font-semibold text-river">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="size-8 rounded-full border border-river/20 flex items-center justify-center text-river disabled:opacity-30 hover:bg-river/5"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// -------------------- Step 3 : contact + paiement --------------------
function ContactStep(props: {
  activity: Activity;
  date: Date;
  adults: number;
  childrenCount: number;
  form: { name: string; email: string; phone: string; notes: string };
  setForm: (f: any) => void;
  paymentMethod: "on_site" | "online";
  setPaymentMethod: (m: "on_site" | "online") => void;
  onBack: () => void;
  onConfirmed: (ref: string) => void;
}) {
  const { lang, tr } = useI18n();
  const { activity, date, adults, childrenCount, form, setForm, paymentMethod, setPaymentMethod } = props;
  const create = useServerFn(createBooking);
  const mutation = useMutation({
    mutationFn: (input: any) => create({ data: input }),
    onSuccess: (res: any) => {
      if (res.checkoutUrl) {
        // Stripe Checkout refuse d'être affiché dans une iframe (preview Lovable).
        // On redirige la fenêtre top ; si bloqué (cross-origin), on ouvre dans un nouvel onglet.
        try {
          if (window.top && window.top !== window.self) {
            window.top.location.href = res.checkoutUrl;
          } else {
            window.location.href = res.checkoutUrl;
          }
        } catch {
          window.open(res.checkoutUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        props.onConfirmed(res.booking.booking_ref);
      }
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      activityId: activity.id,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      adults,
      children: childrenCount,
      customerName: form.name.trim(),
      customerEmail: form.email.trim(),
      customerPhone: form.phone.trim() || undefined,
      notes: form.notes.trim() || undefined,
      language: lang,
      paymentMethod,
      origin: window.location.origin,
    });
  };

  const total =
    adults * activity.base_price_cents +
    childrenCount * (activity.child_price_cents ?? activity.base_price_cents);

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl border border-river/10 p-8 space-y-5">
          <h2 className="font-serif text-2xl text-river">{tr({ fr: "Vos coordonnées", en: "Your details" })}</h2>

          <Field label={tr({ fr: "Nom complet", en: "Full name" })} required>
            <input required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-river/15 bg-stone/40 text-sm text-river focus:outline-none focus:border-ochre focus:bg-white transition-colors" />
          </Field>
          <Field label="Email" required>
            <input required type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-river/15 bg-stone/40 text-sm text-river focus:outline-none focus:border-ochre focus:bg-white transition-colors" />
          </Field>
          <Field label={tr({ fr: "Téléphone", en: "Phone" })}>
            <input type="tel" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-river/15 bg-stone/40 text-sm text-river focus:outline-none focus:border-ochre focus:bg-white transition-colors" />
          </Field>
          <Field label={tr({ fr: "Remarques (facultatif)", en: "Notes (optional)" })}>
            <textarea maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-river/15 bg-stone/40 text-sm text-river focus:outline-none focus:border-ochre focus:bg-white transition-colors min-h-20" />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-river/10 p-8 space-y-3">
          <h2 className="font-serif text-2xl text-river mb-2">{tr({ fr: "Mode de paiement", en: "Payment method" })}</h2>

          <PaymentOption
            selected={paymentMethod === "online"}
            onSelect={() => setPaymentMethod("online")}
            icon={<CreditCard size={20} />}
            title={tr({ fr: "Payer en ligne maintenant", en: "Pay online now" })}
            desc={tr({ fr: "Carte bancaire sécurisée. Réservation confirmée immédiatement.", en: "Secure card payment. Booking confirmed immediately." })}
            badge={tr({ fr: "Recommandé", en: "Recommended" })}
          />
          <PaymentOption
            selected={paymentMethod === "on_site"}
            onSelect={() => setPaymentMethod("on_site")}
            icon={<MapPin size={20} />}
            title={tr({ fr: "Payer sur place", en: "Pay on site" })}
            desc={tr({ fr: "Espèces, carte ou chèque le jour de votre venue.", en: "Cash, card or cheque on arrival." })}
          />
        </div>

        {mutation.isError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {(mutation.error as Error).message}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={props.onBack} className="px-5 py-3 rounded-full border border-river/20 text-sm font-medium text-river hover:bg-river/5 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> {tr({ fr: "Retour", en: "Back" })}
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 px-6 py-3 rounded-full bg-ochre text-white font-semibold text-sm disabled:opacity-60 hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2"
          >
            {mutation.isPending
              ? tr({ fr: "Traitement…", en: "Processing…" })
              : paymentMethod === "online"
                ? tr({ fr: "Continuer vers le paiement", en: "Continue to payment" })
                : tr({ fr: "Confirmer la réservation", en: "Confirm booking" })}
            {!mutation.isPending && <ArrowRight size={14} />}
          </button>
        </div>
      </div>

      <aside className="lg:col-span-2 bg-river text-stone rounded-2xl p-8 lg:sticky lg:top-24">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ochre mb-3">{tr({ fr: "Récapitulatif", en: "Summary" })}</div>
        <div className="font-serif text-xl mb-4">{lang === "fr" ? activity.name_fr : activity.name_en}</div>
        <Row label={tr({ fr: "Date", en: "Date" })} value={date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })} />
        <Row label={tr({ fr: "Adultes", en: "Adults" })} value={String(adults)} />
        <Row label={tr({ fr: "Enfants", en: "Children" })} value={String(childrenCount)} />
        <div className="border-t border-white/10 mt-4 pt-4 flex items-baseline justify-between">
          <span className="text-sm">{tr({ fr: "Total", en: "Total" })}</span>
          <span className="font-serif text-2xl">{(total / 100).toFixed(2)} €</span>
        </div>
        <p className="text-[11px] text-stone/60 mt-4 leading-relaxed">
          {paymentMethod === "online"
            ? tr({ fr: "Paiement sécurisé par Stripe. Email de confirmation envoyé immédiatement.", en: "Secure payment by Stripe. Confirmation email sent immediately." })
            : tr({ fr: "Paiement sur place le jour de votre venue. Vous recevrez un email récapitulatif.", en: "Payment on site on arrival. A summary email will be sent." })}
        </p>
      </aside>
    </form>
  );
}

function PaymentOption({ selected, onSelect, icon, title, desc, badge }: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all ${
        selected ? "border-ochre bg-ochre/5 ring-2 ring-ochre/30" : "border-river/15 hover:border-river/30 bg-stone/40"
      }`}
    >
      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${selected ? "bg-ochre text-white" : "bg-white text-river border border-river/10"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-river">{title}</span>
          {badge && <span className="text-[10px] uppercase tracking-wider bg-ochre/15 text-ochre px-2 py-0.5 rounded-full font-bold">{badge}</span>}
        </div>
        <div className="text-xs text-cliff mt-0.5">{desc}</div>
      </div>
      <div className={`size-5 rounded-full border-2 shrink-0 mt-1 ${selected ? "border-ochre bg-ochre" : "border-river/30"}`}>
        {selected && <Check size={12} className="text-white m-auto mt-0.5" strokeWidth={3} />}
      </div>
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-river mb-1.5 block">
        {label} {required && <span className="text-ochre">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-stone/70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// -------------------- Step 4 : confirmation --------------------
function DoneStep({ bookingRef, paid }: { bookingRef: string; paid?: boolean }) {
  const { tr } = useI18n();
  return (
    <div className="bg-white rounded-2xl border border-river/10 p-12 text-center max-w-2xl mx-auto">
      <div className="size-16 rounded-full bg-ochre/15 text-ochre flex items-center justify-center mx-auto mb-6">
        <Check size={28} />
      </div>
      <h2 className="font-serif text-3xl text-river mb-3">
        {paid
          ? tr({ fr: "Paiement confirmé !", en: "Payment confirmed!" })
          : tr({ fr: "Réservation enregistrée", en: "Booking received" })}
      </h2>
      <p className="text-sm text-cliff mb-6 max-w-md mx-auto">
        {paid
          ? tr({
              fr: "Merci ! Votre réservation est confirmée. Un email récapitulatif vous a été envoyé.",
              en: "Thank you! Your booking is confirmed. A summary email has been sent to you.",
            })
          : tr({
              fr: "Merci ! Votre demande est bien reçue. Paiement sur place le jour J. Nous vous contactons rapidement pour confirmer.",
              en: "Thank you! We've received your request. Payment on site on the day. We'll contact you shortly to confirm.",
            })}
      </p>
      <div className="inline-block bg-stone border border-river/10 rounded-xl px-6 py-4 mb-6">
        <div className="text-[10px] uppercase tracking-widest text-cliff">{tr({ fr: "Référence", en: "Reference" })}</div>
        <div className="font-mono font-bold text-river text-lg">{bookingRef}</div>
      </div>
      <div className="text-sm text-cliff">
        <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 text-ochre hover:underline">
          <Phone size={14} /> {CONTACT.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
