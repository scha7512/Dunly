# Dunly — Relance automatique de factures impayées

> "Tes factures se paient enfin."

Dunly est un SaaS B2B qui relance automatiquement tes clients impayés — au bon moment, avec le bon ton.

## Stack technique

- **Framework** : Next.js 14 (App Router)
- **Base de données** : Supabase (Auth + PostgreSQL)
- **Styles** : Tailwind CSS
- **Animations** : Framer Motion + GSAP
- **Emails** : Resend
- **Paiement** : Stripe
- **Déploiement** : Vercel

---

## Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/ton-compte/dunly.git
cd dunly
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplis chaque variable dans `.env.local` (voir les instructions ci-dessous).

### 4. Configurer Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Copie l'URL et les clés API dans `.env.local`
3. Dans l'éditeur SQL de Supabase, exécute le fichier `lib/supabase/migrations.sql`
4. Active l'authentification Google si nécessaire (Authentication → Providers)

### 5. Configurer Resend

1. Crée un compte sur [resend.com](https://resend.com)
2. Ajoute et vérifie ton domaine
3. Crée une clé API et ajoute-la dans `.env.local`

### 6. Configurer Stripe (optionnel pour le MVP)

1. Crée un compte sur [stripe.com](https://stripe.com)
2. Crée 3 produits (Starter 29€, Pro 89€, Cabinet 199€)
3. Copie les Price IDs dans `.env.local`

### 7. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## Structure du projet

```
dunly/
├── app/
│   ├── (landing)/          # Landing page publique
│   │   └── page.tsx
│   ├── auth/
│   │   ├── login/          # Page de connexion
│   │   ├── signup/         # Page d'inscription
│   │   ├── forgot-password/ # Mot de passe oublié
│   │   ├── reset-password/  # Réinitialisation
│   │   └── callback/       # Callback OAuth
│   ├── onboarding/         # Flow d'onboarding 3 étapes
│   ├── dashboard/
│   │   ├── page.tsx        # Vue d'ensemble
│   │   ├── factures/       # Gestion factures
│   │   ├── clients/        # Gestion clients
│   │   ├── relances/       # Historique relances
│   │   └── parametres/     # Paramètres compte
│   └── api/
│       └── cron/
│           └── relances/   # Route cron automatique
├── components/
│   ├── landing/            # Composants landing page
│   ├── dashboard/          # Composants dashboard
│   ├── ui/                 # Composants génériques
│   └── emails/             # Templates emails HTML
├── lib/
│   ├── supabase/           # Clients Supabase + migrations
│   ├── stripe/             # Client Stripe + plans
│   └── resend/             # Client Resend
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── utils/                  # Fonctions utilitaires
```

---

## Déploiement sur Vercel

### 1. Connecter le repo

```bash
vercel
```

### 2. Configurer les variables d'environnement

Dans le dashboard Vercel → Settings → Environment Variables, ajoute toutes les variables de `.env.local.example`.

**Important** : change `NEXT_PUBLIC_APP_URL` pour l'URL de production.

### 3. Déployer

```bash
vercel --prod
```

Le cron `/api/cron/relances` sera automatiquement configuré via `vercel.json` pour s'exécuter chaque jour à 8h.

---

## Logique des relances automatiques

Le cron s'exécute chaque jour à 8h00 et :

1. Récupère toutes les factures `en-attente` ou `relancee` avec `date_echeance < aujourd'hui`
2. Calcule les jours de retard pour chaque facture
3. Détermine le type de relance :
   - **J+30** → Relance douce (rappel amical)
   - **J+45** → Relance ferme (ton professionnel)
   - **J+60** → Relance urgente (mention des recours)
4. Vérifie qu'une relance de ce type n'a pas déjà été envoyée
5. Envoie l'email via Resend
6. Crée une entrée dans la table `relances`
7. Met à jour le statut de la facture à `relancee`

---

## Base de données

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | Extension de `auth.users` (prénom, entreprise, plan) |
| `clients` | Clients avec score de risque auto-calculé |
| `factures` | Factures avec statuts (`en-attente`, `relancee`, `payee`, `litige`) |
| `relances` | Historique des relances avec statut d'email |

### Row Level Security

Toutes les tables ont RLS activé. Chaque utilisateur ne peut lire/modifier que ses propres données.

---

## Emails transactionnels

Templates disponibles dans `components/emails/` :

| Template | Fichier | Déclencheur |
|----------|---------|-------------|
| Bienvenue | `Bienvenue.tsx` | Inscription |
| Relance douce | `RelanceDouce.tsx` | J+30 de retard |
| Relance ferme | `RelanceFerme.tsx` | J+45 de retard |
| Relance urgente | `RelanceUrgente.tsx` | J+60 de retard |

---

## Développement

```bash
# Développement
npm run dev

# Build de production
npm run build

# Linter
npm run lint

# Tester le cron localement
curl -H "Authorization: Bearer MON_CRON_SECRET" http://localhost:3000/api/cron/relances
```

---

## Couleurs & Design

| Variable | Valeur | Usage |
|----------|--------|-------|
| Background | `#050505` | Fond principal |
| Accent | `#00FF87` | Vert électrique |
| Surface | `#0D0D0D` | Cards, sidebars |
| Border | `#1A1A1A` | Bordures |
| Text secondary | `#888888` | Textes secondaires |

Fonts : **Clash Display** (titres) · **Cabinet Grotesk** (corps) — via Fontshare

---

*Dunly — "Tes factures se paient enfin."*
