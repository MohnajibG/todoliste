# Agent appartement — scraper

Petit programme Node/TypeScript, séparé de l'app front, qui:

1. lit les critères de recherche actifs de tous les utilisateurs dans
   Firestore (`users/{uid}/apartmentCriteria`),
2. va chercher les annonces disponibles pour chaque critère via une ou
   plusieurs "sources" branchables (RSS, leboncoin, SeLoger...),
3. compare chaque annonce au critère (`src/matcher.ts`),
4. écrit une notification dans Firestore (`users/{uid}/apartmentNotifications`)
   pour chaque nouvelle correspondance — l'app affiche ensuite ces
   notifications dans la page "Agent" (`/agent`).

Ce dossier est un package Node indépendant (ses dépendances, comme
`firebase-admin` et `playwright`, n'ont pas leur place dans le bundle
Vite de l'app).

## Sources disponibles

| Source | Fichier | Activation | Fiabilité |
|---|---|---|---|
| RSS/Atom | `src/sources/rss.ts` | champ "Flux RSS" du critère | Élevée si le site propose un flux |
| leboncoin | `src/sources/leboncoin.ts` | case à cocher "leboncoin" du critère | Best-effort, peut être bloqué |
| SeLoger | `src/sources/seloger.ts` | case à cocher "SeLoger" du critère | Best-effort, peut être bloqué |

Un même critère peut combiner plusieurs sources à la fois.

### leboncoin / SeLoger : ce qu'il faut savoir avant d'utiliser ces sources

Ces deux adaptateurs utilisent un vrai navigateur headless (Chromium via
Playwright, `src/sources/browser.ts`) plutôt qu'une simple requête HTTP:
c'est nécessaire car ces sites affichent leurs résultats via
React/Next.js après exécution du JavaScript.

**Ce que ce projet fait** : ouvrir la page de recherche avec un navigateur
standard (User-Agent réaliste, pas d'automatisation cachée), attendre le
rendu, extraire les annonces.

**Ce que ce projet ne fait volontairement PAS** : contourner une
protection anti-bot qui détecterait et bloquerait cette requête (pas de
résolution de CAPTCHA, pas de plugin "stealth" pour masquer l'automation,
pas de rotation de proxies/IP). Si leboncoin ou SeLoger renvoient une
page de challenge au lieu des annonces, l'agent s'arrêtera là — c'est une
limite assumée, pas un bug à contourner à tout prix.

**Sélecteurs non vérifiés en direct** : le code de `leboncoin.ts` et
`seloger.ts` a été écrit dans un environnement dont le réseau bloque
l'accès à ces deux sites — impossible de les tester avant livraison. À la
première exécution, si une source ne trouve aucune annonce pour un
critère qui l'utilise, inspectez les fichiers générés automatiquement:

```
scraper/debug/leboncoin.html   scraper/debug/leboncoin.png
scraper/debug/seloger.html     scraper/debug/seloger.png
```

- Si le screenshot montre une page de CAPTCHA/challenge → la source est
  bloquée par le site, il n'y a rien à corriger côté sélecteurs.
- Si le screenshot montre bien des résultats de recherche mais que
  l'extraction est vide → ouvrez le `.html` correspondant, cherchez la
  structure d'une carte d'annonce dans votre navigateur (clic droit →
  Inspecter sur une annonce du site en vrai), et ajustez les constantes
  `itemSelector`/`titleSelector`/`priceSelector`/... en haut du fichier
  correspondant.

**Utilisez ces deux sources avec modération** (délai raisonnable entre
requêtes, pas d'exécution toutes les minutes) — c'est un outil de
recherche personnelle, pas un outil de collecte de masse, et ça reste
soumis aux CGU de ces sites.

### RSS (source recommandée si disponible)

Si le portail que vous visez propose un flux RSS/Atom pour une recherche
sauvegardée, collez son URL dans le champ "Flux RSS" du critère créé dans
l'app. L'agent en tirera titre, lien, prix/pièces/surface (extraits du
texte par heuristique). Aucune protection anti-bot à contourner ici,
c'est un mécanisme officiel du site.

### Ajouter une source HTML pour un autre site

Pour un site sans protection anti-bot qui n'exécute pas de JS (petite
annonce locale, site d'agence...), utilisez `createHtmlSource` de
`src/sources/html.ts` directement avec le `fetch()` par défaut (pas
besoin de `fetchRenderedHtml`) — voir `leboncoin.ts`/`seloger.ts` comme
modèle, en retirant l'option `fetchHtml`.

## Installation

```bash
cd scraper
npm install
# npm install déclenche automatiquement `playwright install chromium`
# (téléchargement d'un Chromium headless, ~150 Mo, une seule fois)
cp .env.example .env
# éditez .env avec votre clé de compte de service Firebase
```

La clé de compte de service s'obtient dans la console Firebase:
Paramètres du projet → Comptes de service → Générer une nouvelle clé
privée. Collez le JSON entier (sur une seule ligne) dans
`FIREBASE_SERVICE_ACCOUNT_KEY`.

## Lancer une fois

```bash
npm start
```

## Planifier l'exécution

Voir `.github/workflows/apartment-agent.yml` à la racine du repo: un
workflow GitHub Actions planifié qui exécute ce script périodiquement, à
condition d'ajouter le secret `FIREBASE_SERVICE_ACCOUNT_KEY` dans les
paramètres du repository (Settings → Secrets and variables → Actions).

⚠️ Les sources leboncoin/SeLoger ont plus de chances d'être bloquées
depuis un runner GitHub Actions que depuis votre propre machine: les
adresses IP des runners sont des IP de datacenter connues, plus
fréquemment associées à du trafic automatisé par les systèmes anti-bot
qu'une IP résidentielle classique. Pour ces deux sources, privilégiez une
exécution planifiée sur votre propre machine (cron local, tâche planifiée)
plutôt que GitHub Actions — le flux RSS, lui, n'a pas cette limite.

## Sécurité et bon usage

- Ce script tourne côté serveur avec une clé d'administration Firestore:
  ne la commitez jamais, ne la partagez pas.
- Respectez les CGU des sources que vous configurez et gardez un rythme de
  requêtes raisonnable (`REQUEST_DELAY_MS`) — cet agent est pensé pour un
  usage personnel, pas pour de la collecte de masse.
