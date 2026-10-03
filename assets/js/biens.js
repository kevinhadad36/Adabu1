/*
 * Catalogue des biens Monimo — c'est le seul fichier à modifier pour
 * ajouter, retirer ou mettre à jour un bien.
 *
 * Champs :
 *   id          : référence unique (ex. "MON-003")
 *   transaction : "location" ou "vente"
 *   type        : "Terrain", "Maison", "Appartement", "Villa", "Studio", "Local commercial", "Entrepôt"…
 *   prix        : nombre en francs comoriens (KMF), loyer mensuel pour une location — ou null pour « Prix sur demande »
 *   surface     : texte libre (ex. "120 m²", "300 à 500 m²")
 *   details     : liste de caractéristiques affichées dans la fiche
 *   image       : chemin d'une photo dans assets/img/ (ou une URL)
 *
 * Biens ci-dessous : repris des publications Instagram @monimo_comores.
 */
window.MONIMO_BIENS = [
  {
    id: "MON-001",
    titre: "Terrains à bâtir à Daché",
    transaction: "vente",
    type: "Terrain",
    ville: "Moroni",
    quartier: "Daché",
    ile: "Grande Comore",
    prix: null,
    surface: "300 à 500 m²",
    details: [
      ["Lots", "5 parcelles"],
      ["Viabilisation", "Parcelles viabilisées, viabilité en bordure"],
      ["Construction", "Libre de constructeur"]
    ],
    image: "assets/img/terrain-dache.jpg",
    description: "En exclusivité : terrains à vendre à Daché, Moroni. Viabilité en bordure, bel environnement, prêts à recevoir votre nouveau projet de construction."
  },
  {
    id: "MON-002",
    titre: "Terrains à vendre à Vouvouni",
    transaction: "vente",
    type: "Terrain",
    ville: "Vouvouni",
    quartier: "Vouvouni",
    ile: "Grande Comore",
    prix: null,
    surface: "200 à 400 m²",
    details: [
      ["Lots", "5 lots"],
      ["Viabilisation", "Entièrement viabilisé"],
      ["Construction", "Libre choix de construction"]
    ],
    image: "assets/img/terrain-vouvouni.jpg",
    description: "Terrain à vendre à Vouvouni, composé de 5 lots de 200 m² à 400 m². Le terrain est entièrement viabilisé et en libre choix de construction."
  }
];
