## Site Web BPM — Démarrage rapide

Ce dépôt contient le site web BPM basé sur React, Three.js (react-three-fiber) et Parcel.

## Prérequis

- Node.js `>=24 <25` (un fichier `.nvmrc` est fourni)
  - Avec nvm : `nvm install` puis `nvm use`
- Gestionnaire de paquets : pnpm (recommandé) ou npm
  - Activer Corepack (recommandé) : `corepack enable`
  - Sinon : `npm i -g pnpm`

## Installation

Avec pnpm (recommandé) :

```bash
pnpm install
```

Ou avec npm :

```bash
npm install
```

## Lancer en développement

- Avec pnpm :

```bash
pnpm start
```

- Avec npm :

```bash
npm run start
```

- Via Makefile (équivalent npm) :

```bash
make dev
```

Par défaut, Parcel ouvre le navigateur et sert l’app sur `http://localhost:1234`.

## Build de production

Générer les fichiers statiques dans `dist/` :

```bash
pnpm build
# ou
npm run build
```

Vous pouvez ensuite servir le dossier `dist/` avec n’importe quel serveur statique.

## Scripts utiles

- `pnpm lowres-imgs` / `npm run lowres-imgs` : génère des versions basse résolution des images (nécessite `sharp`).

## Dépannage

- Version de Node : assurez‑vous d’utiliser Node 24 (`nvm use`).
- Port déjà utilisé : lancez avec un port personnalisé :

  ```bash
  pnpm start -- --port 3001
  # ou
  npm run start -- --port 3001
  ```

- pnpm introuvable : `corepack enable` puis réessayez, ou installez pnpm globalement (`npm i -g pnpm`).

## Stack principale

- React 18, react-three-fiber, drei, three
- Parcel 2 pour le bundling
- styled-components, TailwindCSS, GSAP, Framer Motion
