import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListActivities } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/activities")({
  component: ActivitiesPage,
});

const TYPE_LABEL: Record<string, string> = {
  canoe: "Canoë",
  velo: "Vélo",
  combine: "Combiné",
};

function ActivitiesPage() {
  const fetch = useServerFn(adminListActivities);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: () => fetch(),
  });

  const activities = data?.activities ?? [];

  return (
    <div className="p-10 max-w-7xl">
      <h1 className="font-serif text-3xl text-river mb-1">Activités</h1>
      <p className="text-sm text-cliff mb-8">
        Catalogue des prestations proposées. {isLoading ? "" : `${activities.length} activités.`}
      </p>

      <div className="bg-white border border-river/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone text-cliff text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-center">Durée</th>
              <th className="px-4 py-3 text-right">Prix adulte</th>
              <th className="px-4 py-3 text-right">Prix enfant</th>
              <th className="px-4 py-3 text-center">Capacité/jour</th>
              <th className="px-4 py-3 text-center">Actif</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a: any) => (
              <tr key={a.id} className="border-t border-river/5 hover:bg-stone/50">
                <td className="px-4 py-3 font-medium">{a.name_fr}<div className="text-xs text-cliff">{a.name_en}</div></td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded bg-river/10 text-river">{TYPE_LABEL[a.type]}</span></td>
                <td className="px-4 py-3 text-center">{Math.round(a.duration_minutes / 60 * 10) / 10}h</td>
                <td className="px-4 py-3 text-right">{(a.base_price_cents / 100).toFixed(2)} €</td>
                <td className="px-4 py-3 text-right">{a.child_price_cents ? `${(a.child_price_cents / 100).toFixed(2)} €` : "—"}</td>
                <td className="px-4 py-3 text-center">{a.max_capacity}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`size-2.5 inline-block rounded-full ${a.active ? "bg-emerald-500" : "bg-stone"}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-cliff mt-6">
        L'édition (CRUD) sera ajoutée en Phase 5.
      </p>
    </div>
  );
}
