import { createFileRoute } from "@tanstack/react-router";

/**
 * Webhook Lovable Payments (Stripe via gateway).
 * Reçoit les événements normalisés du gateway. Marque les réservations
 * comme `confirmed` quand un paiement est complété.
 */
export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = url.searchParams.get("env") ?? "sandbox";
        const bodyText = await request.text();

        // Logguer pour debug — on pourra durcir la vérif de signature ensuite
        console.log(`[payments-webhook] env=${env} body=${bodyText.slice(0, 800)}`);

        let payload: any;
        try {
          payload = JSON.parse(bodyText);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // Tente plusieurs formes : événement Stripe natif OU gateway normalisé
        const type: string | undefined = payload?.type ?? payload?.event_type;
        const obj = payload?.data?.object ?? payload?.object ?? payload?.data ?? payload;
        const metadata =
          obj?.metadata ??
          obj?.payment_intent?.metadata ??
          payload?.metadata ??
          {};
        const bookingId: string | undefined = metadata?.booking_id;
        const sessionId: string | undefined = obj?.id ?? obj?.session_id;

        const isPaid =
          type === "checkout.session.completed" ||
          type === "transaction.completed" ||
          type === "payment_intent.succeeded";
        const isFailed =
          type === "transaction.payment_failed" ||
          type === "payment_intent.payment_failed";

        if (!isPaid && !isFailed) {
          return new Response("ignored", { status: 200 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let query = supabaseAdmin.from("bookings").update({
          status: isPaid ? "confirmed" : "cancelled",
          paid_at: isPaid ? new Date().toISOString() : null,
          stripe_payment_intent_id: obj?.payment_intent ?? obj?.id ?? null,
        });

        if (bookingId) {
          query = query.eq("id", bookingId);
        } else if (sessionId) {
          query = query.eq("stripe_session_id", sessionId);
        } else {
          console.warn("[payments-webhook] no booking_id/session_id in payload");
          return new Response("no booking ref", { status: 200 });
        }

        const { error } = await query;
        if (error) {
          console.error("[payments-webhook] update error", error);
          return new Response("db error", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
