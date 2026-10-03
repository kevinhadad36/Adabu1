# Monimo Immobilier — site vitrine

Site statique (HTML / CSS / JS, sans build) de l'agence immobilière Monimo, Zilimadjou, Moroni (Comores).

- **Direction artistique :** style « Apollo » de Refero Styles (toile crème, filets gris, serif ultra-fin, rayon 3px, majuscules espacées, sans ombres).
- **Charte :** logo et couleurs Monimo repris d'Instagram @monimo_comores (magenta `#C2186E`, gris argent, taupe).

## Pages
- `index.html` — accueil. Le lien principal **« Voir les biens disponibles »** et les accès « Louer / Acheter » mènent à `biens.html`.
- `biens.html` — biens à louer et à vendre, avec filtres et fiche détaillée (contact WhatsApp prérempli).

## Mettre à jour les biens
Tout se fait dans `assets/js/biens.js` (un bloc par bien) ; les photos vont dans `assets/img/`.

## Aperçu local
`python3 -m http.server` puis http://localhost:8000. Déploiement possible sur n'importe quel hébergeur statique (GitHub Pages, Netlify…).

---

## Autres sites du dépôt
- [`dubernet/`](dubernet/) — Dubernet Immobilier, Cahors (Lot) : même style, avec parallaxe.
