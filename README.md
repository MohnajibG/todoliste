# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Agent appartement

En plus de la todo-list, l'app propose une page **Agent** (`/agent`) pour
créer des alertes de recherche d'appartement (ville, budget, pièces,
surface) et recevoir une notification in-app dès qu'une annonce
correspondante est trouvée.

- Les critères et les notifications sont stockés dans Firestore
  (`users/{uid}/apartmentCriteria` et `users/{uid}/apartmentNotifications`).
- Un badge sur l'icône 🔔 du header indique le nombre de notifications non
  lues, visible depuis toute l'app.
- La recherche des annonces elle-même est déléguée à un agent externe
  (dossier [`scraper/`](./scraper/README.md)), qui tourne en dehors du
  front (planifiable via [`.github/workflows/apartment-agent.yml`](./.github/workflows/apartment-agent.yml)).
  Voir `scraper/README.md` pour la configuration des sources : RSS
  (fiable, si le portail en propose un), leboncoin et SeLoger (navigateur
  automatisé Playwright, best-effort face aux protections anti-bot de ces
  sites — pas de contournement/évasion volontairement).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
