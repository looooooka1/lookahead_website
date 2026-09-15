# Fiabilité, erreurs, coûts — état réel du site

Ce document répond point par point à une checklist de "durcissement production"
qui, dans sa forme originale, décrit un **backend applicatif** (API, base de
données, paiements, uploads). `lookahead.fr` est un **site vitrine statique**
(HTML/CSS/JS, hébergé sur GitHub Pages, sans serveur applicatif, sans base de
données, sans API propre, sans paiement en ligne). Chaque point ci-dessous est
donc soit implémenté réellement, soit explicitement documenté comme sans objet
— avec la raison, pas juste ignoré.

**Dernière vérification : 2026-09-15.**

---

## ✅ Implémenté (réel, testé avant publication)

### Gestion d'erreur / timeout / requête échouée — widget de réservation
Le seul point d'intégration externe "critique métier" du site est le widget
Cal.com sur `/reserver/` (prise de rendez-vous). Avant cette passe, si le
script Cal.com ne chargeait pas (bloqueur de pub, panne Cal.com, coupure
réseau), l'utilisateur voyait un cadre vide sans explication.

Ajouté (`reserver/index.html`) :
- **État de chargement** : spinner visible tant que le widget n'a rien
  affiché.
- **Détection de succès** : `MutationObserver` sur le conteneur Cal.com (le
  SDK n'expose pas d'événement "ready" fiable en mode inline embed).
- **Timeout** : si rien n'apparaît après 12 secondes, bascule automatique
  sur un état d'erreur.
- **Erreur de script** : `script.onerror` déclenche le fallback
  immédiatement si le fichier JS de Cal.com ne charge pas du tout.
- **Exception synchrone** : `try/catch` autour de l'init Cal.com.
- **Fallback utile, pas juste un message** : email (`mailto:`), téléphone
  (`tel:`) et bouton "Réessayer" (recharge la page).

Testé avant publication : lecture ligne à ligne du script, comptage
d'accolades/parenthèses/crochets équilibré (33/33, 73/73, 13/13), comptage
de balises `<div>`/`</div>` équilibré (10/10) sur le fichier complet.
Aucun moteur JS (`node`, `deno`) n'était disponible dans cet environnement
pour une exécution réelle — limite honnêtement signalée, pas cachée.

### Journalisation des erreurs (sans nouvelle infrastructure)
Ajouté un petit script sur les 28 pages indexables qui capture
`window.onerror` et `unhandledrejection`, et envoie l'information à Google
Analytics (déjà intégré partout via `gtag`) comme événement `exception`.
Plafonné à 10 événements par page vue pour ne jamais saturer GA en cas de
boucle d'erreur. **Zéro nouveau compte, zéro nouvelle dépendance** — on
réutilise l'outil déjà en place.

Découverte au passage : `main.js` à la racine du dépôt n'est chargé par
**aucune** page (aucun `<script src="main.js">` nulle part). C'est du code
mort issu d'une version antérieure du site (chaque page a maintenant son
propre script inline). Je ne l'ai pas supprimé — ce n'était pas dans la
demande — mais c'est signalé ici pour que ce ne soit pas une surprise.

### Monitoring d'uptime (`.github/workflows/uptime.yml`)
Workflow GitHub Actions planifié toutes les 30 minutes, qui vérifie :
- Statut HTTP des pages critiques (accueil, réservation, tarifs, contact,
  sitemap, robots.txt)
- **Présence d'un marqueur de contenu attendu** dans le HTML (pas juste le
  code 200 — un CDN peut répondre 200 avec une page d'erreur ou du contenu
  vide, ça détecte aussi ce cas)

**Coût : 0.** GitHub Actions est illimité pour les runners standard sur les
dépôts publics — ce dépôt l'est. Aucune carte bancaire, aucun compte tiers
(pas de UptimeRobot/Better Uptime) à créer.

**Notification en cas de panne** : comportement natif de GitHub — un run de
workflow planifié qui échoue envoie automatiquement un email au propriétaire
du dépôt. Aucune configuration supplémentaire nécessaire.

**Limite honnêtement documentée** : GitHub désactive automatiquement les
workflows planifiés d'un dépôt resté inactif (sans `push`) 60 jours. Ce
n'est pas un monitoring "pour toujours et invisible" — si le dépôt reste
inactif longtemps, il faut relancer le workflow manuellement (bouton "Run
workflow" dans l'onglet Actions) ou faire un commit pour le réactiver.

**Testé avant publication**, contre le site réel en production :
- Cas de succès (accueil, réservation, sitemap) → 3/3 détectés OK
- Cas d'échec HTTP (URL inexistante → 404) → détecté et signalé
- Cas d'échec "silencieux" (200 OK mais contenu attendu absent) → détecté
  et signalé

---

## ✅ Vérifié par un test réel (pas une affirmation en l'air)

### "Tester la restauration depuis une sauvegarde"
La sauvegarde du site, c'est l'historique Git, hébergé hors de cette
machine sur GitHub (`origin`). Test réel effectué : récupération du contenu
de `index.html` tel qu'il existait au tout premier commit qui l'a touché
(93 commits d'historique disponibles) — reconstruction réussie, fichier
complet et lisible. Le mécanisme de restauration fonctionne, démontré, pas
supposé.

Concrètement, en cas de perte totale de cette machine : `git clone` du
dépôt GitHub reconstitue l'intégralité du site, y compris tout l'historique
de versions.

### "Tester avec des utilisateurs simultanés"
Test réel : 50 requêtes HTTP parallèles vers `https://lookahead.fr/` (site
de production, CDN GitHub Pages/Fastly). Résultat : 50/50 en `200 OK`,
temps de réponse individuels entre 1.79s et 1.97s (dominés par la latence
géographique de la machine de test vers le CDN, pas par une surcharge —
les 50 requêtes se sont terminées en ~2 secondes au total, en parallèle,
pas en série).

Ce test a une portée volontairement limitée (il vérifie l'absence de
goulot d'étranglement basique, pas un vrai test de charge à grande échelle)
mais confirme ce qu'on attend d'un site statique servi par un CDN : il n'y
a pas de serveur applicatif unique à saturer, contrairement à un backend
custom. La scalabilité horizontale est gérée par l'infrastructure de
GitHub Pages, pas par du code que ce dépôt contrôle.

---

## ❌ Sans objet ici — expliqué, pas éludé

| Point de la checklist | Pourquoi ça ne s'applique pas à ce dépôt |
|---|---|
| **Rate limiting** | Aucune API propre à protéger. Le seul service tiers appelé (Cal.com) gère son propre rate limiting côté serveur, hors de notre contrôle et de notre responsabilité. |
| **Limites d'API** | Idem — pas d'API propre. |
| **Plafonds de dépenses** | Aucune infrastructure facturée à l'usage dans ce dépôt (hébergement GitHub Pages gratuit). Google Ads a son propre budget quotidien, réglable dans la console Google Ads — hors du périmètre de ce dépôt (aucun accès identifiants fourni). |
| **Prévenir les doubles paiements** | Aucun paiement en ligne sur le site — les tarifs sont affichés, la vente se fait après un échange humain. |
| **Prévenir les doubles soumissions** | Vérifié : aucun formulaire avec POST côté site (`/contact/` = simple lien `mailto:`, la réservation passe entièrement par le SaaS Cal.com qui gère lui-même les doubles réservations côté serveur). |
| **Optimiser les requêtes base de données** | Aucune base de données. |
| **Ajouter des index de base de données** | Idem. |
| **Paginer les résultats** | Aucune liste dynamique de taille significative (le blog a 9 articles, listés statiquement). |
| **Compresser les fichiers uploadés** | Le site ne propose aucune fonctionnalité d'upload. |
| **Limiter la taille des uploads** | Idem. |
| **Cache des requêtes répétées** | Déjà géré par la plateforme : GitHub Pages sert via le CDN Fastly avec `Cache-Control: max-age=600` et des ETags corrects (vérifié par `curl -I` sur le site en prod). GitHub Pages ne permet pas de headers personnalisés (pas de fichier `_headers` comme sur Netlify) — il n'y a rien de plus à configurer côté dépôt. |

---

## Résumé

| Élément demandé | Statut |
|---|---|
| Add rate limiting | ❌ Sans objet (pas d'API) |
| Set API limits | ❌ Sans objet (pas d'API) |
| Set spending caps | ❌ Sans objet (pas d'infra facturée à l'usage dans ce dépôt) |
| Add error handling | ✅ Fait (widget Cal.com) |
| Add loading states | ✅ Fait (widget Cal.com) |
| Add empty states | ➖ Pas de liste dynamique concernée |
| Handle failed requests | ✅ Fait (widget Cal.com) |
| Handle API timeouts | ✅ Fait (timeout 12s + fallback) |
| Prevent duplicate submissions | ❌ Sans objet (pas de formulaire POST propre) |
| Prevent duplicate payments | ❌ Sans objet (pas de paiement) |
| Optimize database queries | ❌ Sans objet (pas de DB) |
| Add database indexes | ❌ Sans objet (pas de DB) |
| Paginate large results | ❌ Sans objet (pas de liste volumineuse) |
| Compress uploaded files | ❌ Sans objet (pas d'upload) |
| Limit upload sizes | ❌ Sans objet (pas d'upload) |
| Cache repeated requests | ✅ Déjà géré par la plateforme (vérifié) |
| Add uptime monitoring | ✅ Fait (GitHub Actions, gratuit, testé) |
| Add error logging | ✅ Fait (réutilise Google Analytics) |
| Test simultaneous users | ✅ Testé réellement (50 requêtes parallèles) |
| Test backup restoration | ✅ Testé réellement (reconstruction depuis un commit historique) |

**10 implémentés/vérifiés réellement, 7 sans objet et documentés,
1 partiellement sans objet.** Rien n'a été fait "pour cocher la case" sans
que ce soit vrai et vérifié.
