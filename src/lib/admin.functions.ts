import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ------- Bootstrap : promeut le premier user en admin si aucun admin n'existe -------
export const bootstrapAdminIfNeeded = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if ((count ?? 0) === 0) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) throw new Error(error.message);
      return { promoted: true };
    }
    return { promoted: false };
  });

// ------- Vérifie si le user courant est admin -------
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId };
  });

// ------- Listing des réservations (admin) -------
export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("bookings")
      .select("*, activities(name_fr, name_en, type)")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { bookings: data ?? [] };
  });

// ------- Stats dashboard -------
export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);

    const [todayRes, weekRes, pendingRes] = await Promise.all([
      supabase.from("bookings").select("id, adults, children, amount_cents", { count: "exact" }).eq("date", today).neq("status", "cancelled"),
      supabase.from("bookings").select("amount_cents").gte("date", weekAgo).eq("status", "confirmed"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    const todayCount = todayRes.count ?? 0;
    const todayPeople = (todayRes.data ?? []).reduce((s, b) => s + (b.adults ?? 0) + (b.children ?? 0), 0);
    const weekRevenue = (weekRes.data ?? []).reduce((s, b) => s + (b.amount_cents ?? 0), 0);
    const pendingCount = pendingRes.count ?? 0;

    return { todayCount, todayPeople, weekRevenueCents: weekRevenue, pendingCount };
  });

// ------- Activities listing for admin -------
export const adminListActivities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("display_order");
    if (error) throw new Error(error.message);
    return { activities: data ?? [] };
  });
