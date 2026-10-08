import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/admin.functions";
import { CalendarDays, Users, Euro, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const fetchStats = useServerFn(adminStats);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchStats(),
  });

  return (
    <div className="p-10 max-w-6xl">
      <h1 className="font-serif text-3xl text-river mb-1">Tableau de bord</h1>
      <p className="text-sm text-cliff mb-10">Vue d'ensemble des réservations.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={CalendarDays} label="Réservations aujourd'hui" value={isLoading ? "…" : String(data?.todayCount ?? 0)} />
        <StatCard icon={Users} label="Personnes aujourd'hui" value={isLoading ? "…" : String(data?.todayPeople ?? 0)} />
        <StatCard icon={Euro} label="CA 7 derniers jours" value={isLoading ? "…" : `${((data?.weekRevenueCents ?? 0) / 100).toFixed(0)} €`} />
        <StatCard icon={Clock} label="En attente paiement" value={isLoading ? "…" : String(data?.pendingCount ?? 0)} />
      </div>

      <div className="mt-12 bg-white border border-river/10 rounded-2xl p-8">
        <h2 className="font-serif text-xl text-river mb-2">Bienvenue</h2>
        <p className="text-sm text-cliff leading-relaxed max-w-2xl">
          Le back-office est en place. Phase 1 : tu peux te connecter, voir les activités du catalogue,
          et la structure des réservations. Phase 2 ajoutera le parcours de réservation côté client
          (calendrier + formulaire). Phase 3 le paiement Stripe. Phase 4 les emails de confirmation.
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white border border-river/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cliff">{label}</span>
        <Icon size={16} className="text-ochre" />
      </div>
      <div className="font-serif text-3xl text-river">{value}</div>
    </div>
  );
}
