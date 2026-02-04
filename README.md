## Site Web BPM — Vue 3 + TypeScript

Ce dépôt contient un site statique BPM construit avec Vue 3, TypeScript et Vite.
Pages disponibles : `/`, `/equipe`, `/event`.

## Prérequis

- Node.js `>=24 <25` (un fichier `.nvmrc` est fourni)
  - Avec nvm : `nvm install` puis `nvm use`
- Gestionnaire de paquets : npm

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

Par défaut, Vite sert l'app sur `http://localhost:5173`.

## Build de production

Générer les fichiers statiques dans `dist/` :

```bash
npm run build
```

Prévisualiser le build localement :

```bash
npm run preview
```

## Docker

Construire l'image (multi-stage) :

```bash
docker build -t site-bpm .
```

Lancer le conteneur et exposer le site sur `http://localhost:8080` :

```bash
docker run --rm -p 8080:80 site-bpm
```

Le conteneur construit le bundle avec npm/Vite puis le sert via Nginx avec un fallback `index.html` pour les routes client.

### Docker Compose (prod)

```bash
docker compose up --build
```

Le service unique `site` build l'image et mappe le port `8080` sur `80` du conteneur.
