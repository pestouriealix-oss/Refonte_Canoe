# Refonte du site d'une base de canoë

Nouvelle version du site d'une base de location de canoës et de vélos en Dordogne : un site
vitrine bilingue, un module de réservation et un espace d'administration.

> **Prototype.** Ce projet n'est pas en production. Voir [Limites connues](#limites-connues)
> avant toute mise en ligne.

## Fonctionnalités

- **Site vitrine** en français et en anglais : parcours en canoë, vélo, formules combinées,
  accès, avis, FAQ, contact.
- **Réservation en ligne** : calendrier des disponibilités par activité, calcul du prix,
  paiement en ligne ou sur place.
- **Administration** (accès authentifié) : réservations, activités, stock par jour.
- **Météo** et bandeau de saison sur la page d'accueil.

## Technologies

| Couche          | Choix                                             |
| --------------- | ------------------------------------------------- |
| Interface       | React 19, TypeScript, Tailwind CSS 4, shadcn/ui   |
| Framework       | TanStack Start (routage par fichiers, fonctions serveur), Vite |
| Données et auth | Supabase (PostgreSQL, Row Level Security)         |
| Paiement        | Stripe Checkout, via la passerelle Lovable        |
| Validation      | Zod                                               |

Le projet a été démarré sur la plateforme Lovable, dont il utilise la configuration Vite et
la passerelle de paiement.

## Organisation du code

```text
src/
  routes/                 pages du site (une par fichier)
    _authenticated/       espace d'administration
    api/public/payments/  webhook de paiement
  components/site/        composants propres au site
  components/ui/          composants shadcn/ui
  lib/
    reservation.functions.ts   disponibilités, création de réservation, paiement
    admin.functions.ts         fonctions réservées aux administrateurs
    site.ts                    contenus et constantes du site
    i18n.tsx                   traductions FR / EN
  integrations/supabase/  clients Supabase (navigateur et serveur)
supabase/migrations/      schéma de la base et règles d'accès (RLS)
```

## Lancer le projet

Prérequis : [Bun](https://bun.sh) et un projet [Supabase](https://supabase.com).

```bash
bun install
cp .env.example .env      # puis renseigner les valeurs
bun run dev
```

Appliquer ensuite les fichiers de `supabase/migrations/` sur la base, dans l'ordre, et
renseigner l'identifiant du projet dans `supabase/config.toml`.

## Sécurité

- Aucune clé n'est stockée dans le dépôt : tout passe par des variables d'environnement
  (voir `.env.example`).
- La clé `service_role` de Supabase n'est lue que côté serveur (`client.server.ts`).
- Toutes les tables ont la Row Level Security activée. Les visiteurs peuvent lire les
  activités et le stock, et créer une réservation ; seuls les administrateurs lisent et
  modifient les réservations.

## Limites connues

À corriger avant une mise en production :

1. **Webhook de paiement sans vérification de signature.**
   `src/routes/api/public/payments/webhook.ts` fait confiance au contenu reçu : une requête
   forgée pourrait marquer une réservation comme payée. Il faut vérifier la signature de
   l'événement avant de modifier la base.
2. **Premier compte promu administrateur.** `bootstrapAdminIfNeeded` donne le rôle
   administrateur au premier utilisateur connecté tant qu'aucun administrateur n'existe, et
   l'inscription est ouverte. Le premier administrateur doit être créé à la main, puis cette
   fonction supprimée.
3. **Journalisation du webhook.** Le corps des événements de paiement est écrit dans les
   journaux, données client comprises.
4. **Adresse de retour du paiement fournie par le navigateur.** Les adresses de succès et
   d'annulation sont construites à partir d'une origine envoyée par le client ; elle devrait
   être fixée côté serveur.

## Crédits

Les photographies sont chargées depuis le site actuel de la base et restent la propriété de
leurs auteurs.
