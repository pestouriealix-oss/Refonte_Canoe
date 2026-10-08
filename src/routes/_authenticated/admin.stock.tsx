import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/stock")({
  component: StockPage,
});

function StockPage() {
  return (
    <div className="p-10 max-w-4xl">
      <h1 className="font-serif text-3xl text-river mb-1">Stock</h1>
      <p className="text-sm text-cliff mb-8">Disponibilités par jour et par activité.</p>

      <div className="bg-white border border-river/10 rounded-2xl p-12 text-center">
        <p className="text-cliff text-sm">
          Module de gestion du stock — à venir en Phase 5.
        </p>
        <p className="text-xs text-cliff mt-3 max-w-lg mx-auto">
          Permettra d'ajuster le nombre de canoës/vélos disponibles par jour (météo, maintenance),
          de bloquer des dates, et de visualiser le taux de remplissage.
        </p>
      </div>
    </div>
  );
}
