
-- Nouveau type pour le mode de paiement
DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('on_site', 'online');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_method public.payment_method NOT NULL DEFAULT 'on_site',
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Remplacer la policy d'insertion publique pour inclure la nouvelle colonne
DROP POLICY IF EXISTS "bookings insert public validated" ON public.bookings;

CREATE POLICY "bookings insert public validated"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  adults >= 1 AND adults <= 20
  AND children >= 0 AND children <= 20
  AND (adults + children) <= 20
  AND length(customer_name) BETWEEN 2 AND 120
  AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(customer_email) <= 254
  AND date >= CURRENT_DATE
  AND date <= (CURRENT_DATE + INTERVAL '1 year')
  AND EXISTS (SELECT 1 FROM public.activities a WHERE a.id = bookings.activity_id AND a.active = true)
  AND status = 'pending'::booking_status
  AND amount_cents >= 0
  AND payment_method IN ('on_site'::public.payment_method, 'online'::public.payment_method)
);
