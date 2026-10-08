import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SEASON_START = 4; // mai (0-indexed)
const SEASON_END = 8;   // sept

// ---------- Liste publique des activités actives ----------
export const listActivitiesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("activities")
    .select("id, slug, type, name_fr, name_en, description_fr, description_en, duration_minutes, base_price_cents, child_price_cents, max_capacity, photo_url")
    .eq("active", true)
    .order("display_order");
  if (error) throw new Error(error.message);
  return { activities: data ?? [] };
});

// ---------- Dispo pour un mois ----------
export const getMonthAvailability = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      activityId: z.string().uuid(),
      year: z.number().int().min(2024).max(2100),
      month: z.number().int().min(0).max(11),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const start = new Date(Date.UTC(data.year, data.month, 1));
    const end = new Date(Date.UTC(data.year, data.month + 1, 0));
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const [{ data: activity }, { data: stockRows }, { data: bookings }] = await Promise.all([
      supabaseAdmin.from("activities").select("max_capacity, active").eq("id", data.activityId).single(),
      supabaseAdmin.from("stock").select("date, total_units, blocked").eq("activity_id", data.activityId).gte("date", startStr).lte("date", endStr),
      supabaseAdmin.from("bookings").select("date, adults, children").eq("activity_id", data.activityId).gte("date", startStr).lte("date", endStr).neq("status", "cancelled"),
    ]);

    if (!activity || !activity.active) throw new Error("Activité indisponible");

    const stockByDate = new Map<string, { total: number; blocked: boolean }>();
    for (const s of stockRows ?? []) {
      stockByDate.set(s.date as string, { total: s.total_units, blocked: s.blocked });
    }
    const bookedByDate = new Map<string, number>();
    for (const b of bookings ?? []) {
      bookedByDate.set(b.date as string, (bookedByDate.get(b.date as string) ?? 0) + (b.adults ?? 0) + (b.children ?? 0));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: Record<string, number> = {};
    for (let d = 1; d <= end.getUTCDate(); d++) {
      const dateObj = new Date(Date.UTC(data.year, data.month, d));
      const iso = dateObj.toISOString().slice(0, 10);
      const m = dateObj.getUTCMonth();
      if (dateObj < today || m < SEASON_START || m > SEASON_END) {
        days[iso] = 0;
        continue;
      }
      const stk = stockByDate.get(iso);
      if (stk?.blocked) {
        days[iso] = 0;
        continue;
      }
      const total = stk?.total ?? activity.max_capacity;
      const used = bookedByDate.get(iso) ?? 0;
      days[iso] = Math.max(0, total - used);
    }
    return { availability: days, maxCapacity: activity.max_capacity };
  });

// ---------- Création d'une réservation + (optionnel) checkout Stripe ----------
const bookingInput = z.object({
  activityId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email().max(254),
  customerPhone: z.string().max(40).optional(),
  notes: z.string().max(500).optional(),
  language: z.enum(["fr", "en"]).default("fr"),
  paymentMethod: z.enum(["on_site", "online"]).default("on_site"),
  origin: z.string().url(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator(bookingInput.parse)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Activité
    const { data: activity, error: actErr } = await supabaseAdmin
      .from("activities")
      .select("id, name_fr, name_en, base_price_cents, child_price_cents, max_capacity, active")
      .eq("id", data.activityId)
      .single();
    if (actErr || !activity || !activity.active) throw new Error("Activité introuvable");

    const people = data.adults + data.children;
    if (people > 20) throw new Error("Maximum 20 personnes par réservation");

    // 2. Vérif stock
    const { data: stockRow } = await supabaseAdmin
      .from("stock")
      .select("total_units, blocked")
      .eq("activity_id", data.activityId)
      .eq("date", data.date)
      .maybeSingle();
    if (stockRow?.blocked) throw new Error("Date non disponible");
    const totalUnits = stockRow?.total_units ?? activity.max_capacity;

    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("adults, children")
      .eq("activity_id", data.activityId)
      .eq("date", data.date)
      .neq("status", "cancelled");
    const used = (existing ?? []).reduce((s, b) => s + (b.adults ?? 0) + (b.children ?? 0), 0);
    if (used + people > totalUnits) throw new Error("Plus assez de places disponibles pour cette date");

    const amountCents =
      data.adults * (activity.base_price_cents ?? 0) +
      data.children * (activity.child_price_cents ?? activity.base_price_cents ?? 0);

    // 3. Insert booking pending
    const { data: booking, error: insErr } = await supabaseAdmin
      .from("bookings")
      .insert({
        activity_id: data.activityId,
        date: data.date,
        slot_time: data.slotTime ?? null,
        adults: data.adults,
        children: data.children,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone ?? null,
        notes: data.notes ?? null,
        language: data.language,
        amount_cents: amountCents,
        status: "pending",
        payment_method: data.paymentMethod,
      })
      .select("id, booking_ref, amount_cents, status, payment_method")
      .single();
    if (insErr || !booking) throw new Error(insErr?.message ?? "Erreur création réservation");

    // 4. Si paiement sur place → on s'arrête là
    if (data.paymentMethod === "on_site") {
      return { booking, checkoutUrl: null as string | null };
    }

    // 5. Sinon, on crée une session Stripe Checkout via le connector gateway
    const stripeKey = process.env.STRIPE_SANDBOX_API_KEY ?? process.env.STRIPE_LIVE_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;
    if (!stripeKey || !lovableKey) {
      throw new Error("Paiement en ligne indisponible (clés non configurées)");
    }

    const activityName = data.language === "en" ? activity.name_en : activity.name_fr;
    const description = `${data.adults} ${data.language === "en" ? "adult(s)" : "adulte(s)"}${data.children ? ` + ${data.children} ${data.language === "en" ? "child(ren)" : "enfant(s)"}` : ""} — ${data.date}`;

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${data.origin}/reservation?paid=1&ref=${booking.booking_ref}`);
    params.set("cancel_url", `${data.origin}/reservation?canceled=1&ref=${booking.booking_ref}`);
    params.set("customer_email", data.customerEmail);
    params.set("locale", data.language === "en" ? "en" : "fr");
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "eur");
    params.set("line_items[0][price_data][unit_amount]", String(amountCents));
    params.set("line_items[0][price_data][product_data][name]", `${activityName} — Cap Evasion`);
    params.set("line_items[0][price_data][product_data][description]", description);
    params.set("metadata[booking_id]", booking.id);
    params.set("metadata[booking_ref]", booking.booking_ref);
    params.set("payment_intent_data[metadata][booking_id]", booking.id);
    params.set("payment_intent_data[metadata][booking_ref]", booking.booking_ref);

    const res = await fetch("https://connector-gateway.lovable.dev/stripe/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": stripeKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const session = await res.json();
    if (!res.ok || !session?.url) {
      console.error("Stripe checkout session error:", session);
      throw new Error(session?.error?.message ?? "Erreur création paiement");
    }

    await supabaseAdmin
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return { booking, checkoutUrl: session.url as string };
  });
