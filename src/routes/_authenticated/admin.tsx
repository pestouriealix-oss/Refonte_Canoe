import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/admin.functions";
import { LayoutDashboard, CalendarDays, Sprout, Boxes, LogOut, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const check = useServerFn(checkIsAdmin);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    check()
      .then((r) => setIsAdmin(r.isAdmin))
      .catch(() => setIsAdmin(false));
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, [check]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-stone flex items-center justify-center text-cliff text-sm">
        Chargement…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone flex items-center justify-center px-6">
        <div className="max-w-md bg-white border border-river/10 rounded-2xl p-10 text-center">
          <h1 className="font-serif text-2xl text-river mb-3">Accès refusé</h1>
          <p className="text-sm text-cliff mb-6">
            Ce compte n'a pas les droits administrateur. Demande à un admin existant de te donner accès.
          </p>
          <button onClick={signOut} className="text-sm text-ochre hover:underline">
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    { to: "/admin/bookings", label: "Réservations", icon: CalendarDays },
    { to: "/admin/activities", label: "Activités", icon: Sprout },
    { to: "/admin/stock", label: "Stock", icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-stone flex">
      <aside className="w-64 bg-river text-stone flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="font-serif text-xl text-white hover:text-ochre flex items-center gap-2">
            Cap Evasion <ExternalLink size={14} />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone/60 mt-1">
            Administration
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-ochre text-white" : "text-stone/80 hover:bg-white/5"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-[11px] text-stone/60 mb-2 truncate">{email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-stone/80 hover:text-white"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
