# lookahead.fr — V2 (architecture SEO)

Site statique de LookAhead, agence française d'automatisation IA pour PME et TPE.
Hébergé sur GitHub Pages, domaine `lookahead.fr` (fichier `CNAME`).

## Architecture

Modèle hub-and-spoke. La page d'accueil est le hub ; chaque service a sa propre
URL, avec son mot-clé principal et sa propre intention de recherche.

| URL | Type | Mot-clé principal | Intention |
|---|---|---|---|
| `/` | Hub | agence automatisation IA | commerciale |
| `/agent-vocal-ia/` | Guide | agent vocal IA | informationnelle |
| `/chatbot-ia-entreprise/` | Spoke | chatbot IA entreprise | commerciale |
| `/automatisation-n8n-make/` | Spoke | agence n8n France | commerciale |
| `/ia-souveraine-rgpd/` | Guide | automatisation IA RGPD | informationnelle |
| `/agence-automatisation-ia-grenoble/` | Local | agence IA Grenoble | commerciale locale |
| `/recuperation-projet-ia/` | Spoke | récupération projet IA | commerciale |
| `/tarifs/` | Transactionnelle | prix automatisation IA PME | transactionnelle |
| `/a-propos/` | E-E-A-T | qui est LookAhead | marque |
| `/contact/` | Transactionnelle | audit automatisation IA | transactionnelle |
| `/reserver/` | Conversion | réserver diagnostic | transactionnelle |

Pages légales : `/mentions-legales/`, `/cgv/`, `/cgu/`, `/confidentialite/`, `/cookies/`.
`/merci-rendez-vous/` est en `noindex`.

## URLs propres

Toutes les pages sont servies en `/dossier/`, sans extension `.html`.
Les anciennes URL en `.html` sont conservées comme stubs de redirection
(`meta refresh` + `canonical` + `noindex`) : GitHub Pages ne permet pas de
redirection 301 côté serveur, et ces URL sont déjà indexées. Ne pas les
supprimer avant que Search Console ait enregistré les nouvelles.

Les slugs sont définitifs. GitHub Pages ne gère pas les redirections serveur :
changer une URL après indexation crée un lien mort.

## Structure

```
index.html              Hub
<slug>/index.html       Pages de service et guides
assets/styles.css       Feuille de style partagée (sous-pages)
robots.txt              Autorise explicitement les crawlers IA
sitemap.xml             14 URL
CNAME                   lookahead.fr
```

La page d'accueil embarque son CSS en ligne (héritage V1). Les sous-pages
utilisent `assets/styles.css`, extrait du même bloc.

## Balisage structuré

Chaque page porte un `@graph` JSON-LD avec `BreadcrumbList`, `WebPage`, et selon
le cas `Service` + `Offer`, `Article` ou `FAQPage`. Les entités `Organization`
et `WebSite` sont définies une seule fois sur `/` et référencées par `@id`.

Les réponses des blocs `FAQPage` sont identiques au texte visible de la page,
comme l'exige Google.

## Points à vérifier avant mise en production

Certaines affirmations dépendent de faits que seul LookAhead peut confirmer.
Elles sont actuellement formulées de façon prudente et vérifiable :

- **Hébergement des données.** Le site ne prétend nulle part que les données
  sont hébergées en France. Il indique que le lieu de traitement dépend des
  fournisseurs retenus et se décide au diagnostic. Si l'hébergement français est
  réellement garanti sur certaines briques, l'affirmer explicitement renforcerait
  fortement la page `/ia-souveraine-rgpd/`.
- **Tarifs.** 290 / 690 / 1 490 € par mois et les montants de mise en place sont
  repris de la grille V1. À mettre à jour ici et dans le JSON-LD en cas de
  changement.
- **Délai de 4 semaines.** Repris de la V1, présent dans plusieurs pages.
- **Avis clients.** Aucun `aggregateRating` ni schema `Review` n'est déclaré.
  Les 6 témoignages de l'accueil ne portent qu'un prénom et une fonction : les
  baliser en l'état serait un risque de pénalité. Ajouter nom + entreprise (avec
  accord) ou un lien vers l'avis d'origine avant tout balisage.
- **Fiche Google Business Profile.** À créer et vérifier pour capter les requêtes
  locales Grenoble / Isère. C'est le complément indispensable de la page
  `/agence-automatisation-ia-grenoble/`.
- **Netlinking.** Le domaine est absent du graphe web Common Crawl, soit
  quasiment aucun backlink entrant. Sans travail de liens, les requêtes
  nationales resteront hors de portée quelle que soit la qualité du contenu.

## Développement

```bash
python3 -m http.server 8899
```

Les chemins sont absolus (`/assets/…`) : le site doit être servi par un serveur
HTTP, pas ouvert en `file://`.
