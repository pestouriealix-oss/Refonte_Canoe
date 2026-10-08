import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdminIfNeeded } from "@/lib/admin.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace administration — Cap Evasion" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const bootstrap = useServerFn(bootstrapAdminIfNeeded);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        // Try to promote to admin if no admin exists yet
        try { await bootstrap(); } catch { /* ignore */ }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      setError(e.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-river font-serif text-2xl mb-2 hover:text-ochre">
          Cap Evasion
        </Link>
        <p className="text-center text-xs uppercase tracking-[0.2em] text-cliff mb-8">
          Espace administration
        </p>

        <div className="bg-white rounded-2xl border border-river/10 p-8 shadow-sm">
          <div className="flex gap-2 mb-6 p-1 bg-stone rounded-full">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "login" ? "bg-river text-white" : "text-cliff"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "signup" ? "bg-river text-white" : "text-cliff"
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cliff mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-river/15 bg-white focus:outline-none focus:border-ochre"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cliff mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-river/15 bg-white focus:outline-none focus:border-ochre"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ochre text-white py-3 rounded-full font-semibold text-sm hover:scale-[1.01] transition-transform disabled:opacity-50"
            >
              {loading ? "…" : mode === "login" ? "Se connecter" : "Créer le compte"}
            </button>
          </form>

          {mode === "signup" && (
            <p className="text-xs text-cliff mt-4 leading-relaxed">
              Le premier compte créé devient automatiquement administrateur.
            </p>
          )}
        </div>

        <Link to="/" className="block text-center text-xs text-cliff hover:text-river mt-6">
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
