import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listBookings } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsPage,
});

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmée", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Annulée", cls: "bg-stone text-cliff" },
  refunded: { label: "Remboursée", cls: "bg-blue-100 text-blue-800" },
};

function BookingsPage() {
  const fetch = useServerFn(listBookings);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => fetch(),
  });

  const bookings = data?.bookings ?? [];

  return (
    <div className="p-10 max-w-7xl">
      <h1 className="font-serif text-3xl text-river mb-1">Réservations</h1>
      <p className="text-sm text-cliff mb-8">
        {isLoading ? "Chargement…" : `${bookings.length} réservation${bookings.length > 1 ? "s" : ""}`}
      </p>

      {bookings.length === 0 && !isLoading ? (
        <div className="bg-white border border-river/10 rounded-2xl p-12 text-center text-cliff">
          Aucune réservation pour le moment.
          <p className="text-xs mt-2">Le parcours client sera activé en Phase 2.</p>
        </div>
      ) : (
        <div className="bg-white border border-river/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone text-cliff text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Réf</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Activité</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-center">Pers.</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-t border-river/5 hover:bg-stone/50">
                  <td className="px-4 py-3 font-mono text-xs">{b.booking_ref}</td>
                  <td className="px-4 py-3">{new Date(b.date).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">{b.activities?.name_fr ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div>{b.customer_name}</div>
                    <div className="text-xs text-cliff">{b.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-center">{b.adults + b.children}</td>
                  <td className="px-4 py-3 text-right">{(b.amount_cents / 100).toFixed(2)} €</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_LABEL[b.status]?.cls ?? ""}`}>
                      {STATUS_LABEL[b.status]?.label ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
