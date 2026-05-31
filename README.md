# Lookahead — Site web

Site vitrine statique (HTML / CSS / JavaScript). Aucune dépendance, aucun build, aucune installation. Tout est prêt à être mis en ligne tel quel sur GitHub Pages.

## Contenu du dossier (tout ce dont GitHub a besoin)

```
lookahead-site/
├── index.html                 # Page d'accueil (toutes les sections + animations)
├── reserver.html              # Page de réservation (widget de booking)
├── mentions-legales.html      # Mentions légales
├── cgv.html                   # Conditions générales de vente
├── cgu.html                   # Conditions générales d'utilisation
├── confidentialite.html       # Politique de confidentialité
├── cookies.html               # Politique de cookies
├── .nojekyll                  # Indispensable : indique à GitHub de servir le site tel quel
├── .gitignore
└── assets/
    ├── css/styles.css         # Tout le design
    ├── js/main.js             # Toutes les animations / interactions
    └── img/favicon.svg        # Favicon
```

Les polices (Plus Jakarta Sans + Instrument Serif) se chargent automatiquement
via Google Fonts. Le site n'utilise aucune image lourde.

---

## METTRE LE SITE EN LIGNE (méthode simple, sans terminal)

1. Allez sur https://github.com et connectez-vous (créez un compte si besoin).
2. Cliquez sur **New repository**. Nommez-le par exemple `lookahead-site`,
   laissez **Public**, puis **Create repository**.
3. Sur la page du dépôt vide, cliquez sur **uploading an existing file**.
4. **Décompressez** d'abord `lookahead-site.zip`, puis **glissez-déposez le
   contenu** du dossier (le fichier `index.html`, le dossier `assets`, les
   pages `.html`, le fichier `.nojekyll`, etc.) dans la zone d'upload.
   > Important : déposez les fichiers eux-mêmes, pas le fichier .zip.
   > Pour que `.nojekyll` soit visible, activez l'affichage des fichiers cachés.
5. Cliquez sur **Commit changes**.
6. Allez dans **Settings → Pages**.
   - **Source** : *Deploy from a branch*
   - **Branch** : `main` puis dossier `/ (root)` → **Save**
7. Patientez 1 à 2 minutes : votre site est en ligne à l'adresse
   `https://VOTRE-COMPTE.github.io/lookahead-site/`

### Brancher le domaine lookahead.fr
Dans **Settings → Pages → Custom domain**, saisissez `lookahead.fr`. Puis chez
votre fournisseur de domaine (OVH, Gandi, etc.), créez un enregistrement CNAME
`www` vers `VOTRE-COMPTE.github.io`, et les enregistrements A vers les IP de
GitHub Pages (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153).

---

## Tester en local avant de publier

Double-cliquez simplement sur `index.html`. Ou, pour un rendu identique à la
production :

```bash
cd lookahead-site
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Modifier le contenu

- **Textes / sections** : `index.html` (et les pages `.html`).
- **Couleurs, polices, styles** : `assets/css/styles.css` (variables tout en haut, dont `--accent: #4b49ec`).
- **Animations (démos, apparitions)** : `assets/js/main.js`.
- **Lien de réservation** : l'iframe dans `reserver.html`.
