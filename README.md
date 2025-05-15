# Scraper Google → Profils LinkedIn

Ce scraper utilise Playwright (via Browserless) pour récupérer des profils LinkedIn trouvés sur Google à partir d'une requête personnalisée.

## Usage
Déployer sur Railway. Modifier le fichier `.env` pour y inclure vos clés.

## Routes disponibles
- `GET /scrape?q=ta+requete`

## Exemple :
`/scrape?q=CEO+marketing+digital+site:linkedin.com/in`

---

Développé pour Leïla.