# Dubernet Immobilier — site vitrine (maquette)

Site statique (HTML / CSS / JS, sans build) pour l'agence Dubernet Immobilier, 78 rue Henry Puget, 46000 Cahors — tél. 05 65 30 57 63.

- **Direction artistique :** même style « Apollo » (Refero Styles) que le site Monimo : toile crème, filets fins, serif ultra-fin, rayon 3px, majuscules espacées, sans ombres.
- **Couleurs :** vin de Cahors (`#7A2337`) et tons de pierre calcaire du Quercy. Logo typographique en attendant le logo officiel de l'agence.
- **Animations :** parallaxe du hero (pont Valentré), parallaxe à l'intérieur des photos, bandeau plein cadre Saint-Cirq-Lapopie en parallaxe, communes qui défilent au scroll, apparitions en cascade. Tout est coupé si l'utilisateur a demandé « réduire les animations ».

## Pages
- `index.html` — accueil : biens à la une, l'agence, services, estimation vendeurs, contact + plan.
- `biens.html` — biens à vendre, filtres (type, commune, budget, recherche) et fiche détaillée (DPE, bouton d'appel).

## À valider avec l'agence avant mise en ligne
- **Les 6 biens sont des exemples** (textes, prix, surfaces fictifs) : les remplacer par les vraies annonces dans `assets/js/biens.js`.
- Logo, adresse e-mail, réseaux sociaux, mentions légales (carte T, garantie financière, barème d'honoraires) : non trouvés en ligne, à demander.
- Horaires repris des annuaires (lundi 15h–19h, mardi–vendredi 9h–19h).

## Photos
Wikimedia Commons, licences libres — crédits affichés en pied de page (pont Valentré © Benjamin Smith et © Krzysztof Golik, Saint-Cirq-Lapopie © AronMSzabo, maison à bolet © Sornin87, Le Vigan © Michel Chanaud, vignes de Parnac © MikeDicaire — CC BY-SA 4.0 ; Quercy Blanc © Jean-Luc Bach — CC BY-SA 2.5 ; Mercuès © Torsade de Pointes — CC BY 3.0 ; rue du Château-du-Roi © Genium — CC0).

## Aperçu local
`cd dubernet && python3 -m http.server` puis http://localhost:8000.
