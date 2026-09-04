# Agent appartement — scraper

Petit programme Node/TypeScript, séparé de l'app front, qui:

1. lit les critères de recherche actifs de tous les utilisateurs dans
   Firestore (`users/{uid}/apartmentCriteria`),
2. va chercher les annonces disponibles pour chaque critère via une
   "source" branchable (RSS aujourd'hui, HTML sur mesure si vous en
   configurez un),
3. compare chaque annonce au critère (`src/matcher.ts`),
4. écrit une notification dans Firestore (`users/{uid}/apartmentNotifications`)
   pour chaque nouvelle correspondance — l'app affiche ensuite ces
   notifications dans la page "Agent" (`/agent`).

Ce dossier est un package Node indépendant (ses dépendances, comme
`firebase-admin`, n'ont pas leur place dans le bundle Vite de l'app).

## ⚠️ Pourquoi pas de scraping direct de leboncoin / SeLoger ?

Ces sites utilisent des protections anti-bot (Datadome, etc.) qui bloquent
les requêtes HTTP simples et renvoient une page de challenge/CAPTCHA au
lieu des annonces. Contourner ce type de protection (navigateur headless
avec empreinte falsifiée, résolution de CAPTCHA, rotation de proxies) est
volontairement hors du périmètre de ce projet: c'est fragile, coûteux à
maintenir, et contraire aux conditions d'utilisation de ces sites.

Deux options réalistes pour brancher une vraie source:

- **RSS** (`src/sources/rss.ts`, déjà fonctionnel): si le portail que vous
  visez propose un flux RSS/Atom pour une recherche sauvegardée, collez son
  URL dans le champ "Flux RSS" du critère créé dans l'app. L'agent en tirera
  titre, lien, prix/pièces/surface (extraits du texte par heuristique).
- **HTML simple** (`src/sources/html.ts`, squelette fourni): pour un site
  sans protection anti-bot (petite annonce locale, site d'agence...),
  inspectez son HTML et renseignez les sélecteurs CSS dans une config
  `HtmlSourceConfig`, puis ajoutez la source dans `src/index.ts`.

## Installation

```bash
cd scraper
yarn install # ou npm install
cp .env.example .env
# éditez .env avec votre clé de compte de service Firebase
```

La clé de compte de service s'obtient dans la console Firebase:
Paramètres du projet → Comptes de service → Générer une nouvelle clé
privée. Collez le JSON entier (sur une seule ligne) dans
`FIREBASE_SERVICE_ACCOUNT_KEY`.

## Lancer une fois

```bash
yarn start
```

## Planifier l'exécution

Voir `.github/workflows/apartment-agent.yml` à la racine du repo: un
workflow GitHub Actions planifié qui exécute ce script périodiquement,
à condition d'ajouter le secret `FIREBASE_SERVICE_ACCOUNT_KEY` dans les
paramètres du repository (Settings → Secrets and variables → Actions).

## Sécurité et bon usage

- Ce script tourne côté serveur avec une clé d'administration Firestore:
  ne la commitez jamais, ne la partagez pas.
- Respectez les CGU des sources que vous configurez et gardez un rythme de
  requêtes raisonnable (`REQUEST_DELAY_MS`, `MAX_REQUESTS_PER_RUN`) —
  cet agent est pensé pour un usage personnel, pas pour de la collecte de
  masse.
