/*
 * Catalogue des biens Dubernet Immobilier — c'est le seul fichier à modifier
 * pour ajouter, retirer ou mettre à jour un bien.
 *
 * ⚠ Biens D'EXEMPLE pour la maquette : textes, prix et surfaces sont fictifs,
 *   les photos illustrent le Quercy (Wikimedia Commons). À remplacer par les
 *   annonces réelles de l'agence avant la mise en ligne.
 *
 * Champs :
 *   id          : référence unique (ex. "DUB-007")
 *   type        : "Maison", "Appartement", "Terrain", "Propriété", "Local commercial"…
 *   commune     : commune du bien (filtre « Commune »)
 *   secteur     : précision libre (quartier, distance de Cahors…)
 *   prix        : prix FAI en euros — ou null pour « Prix sur demande »
 *   surface     : surface habitable (texte libre, ex. "145 m²")
 *   terrain     : surface du terrain (texte libre) — facultatif
 *   pieces      : nombre de pièces — facultatif
 *   dpe         : lettre A à G — facultatif
 *   details     : liste de caractéristiques affichées dans la fiche
 *   image       : chemin d'une photo (ou une URL)
 */
window.DUBERNET_BIENS = [
  {
    id: "DUB-001",
    titre: "Maison de caractère avec pigeonnier",
    type: "Maison",
    commune: "Le Vigan",
    secteur: "Bouriane, 40 min de Cahors",
    prix: 395000,
    surface: "185 m²",
    terrain: "4 200 m²",
    pieces: 7,
    dpe: "D",
    details: [
      ["Chambres", "4"],
      ["Dépendance", "Pigeonnier restauré"],
      ["Chauffage", "Pompe à chaleur + cheminée"]
    ],
    image: "assets/img/bien-maison-pigeonnier.jpg",
    description: "Belle demeure en pierre du pays, poutres et tomettes d'origine, ouverte sur un parc arboré. Le pigeonnier attenant offre un bureau ou une suite d'amis."
  },
  {
    id: "DUB-002",
    titre: "Corps de ferme en Quercy Blanc",
    type: "Propriété",
    commune: "Montcuq-en-Quercy-Blanc",
    secteur: "25 min de Cahors",
    prix: 468000,
    surface: "240 m²",
    terrain: "1,2 ha",
    pieces: 8,
    dpe: "E",
    details: [
      ["Chambres", "5"],
      ["Dépendances", "Grange et gîte indépendant"],
      ["Atouts", "Vue dégagée, sans vis-à-vis"]
    ],
    image: "assets/img/bien-ferme-quercy-blanc.jpg",
    description: "Ensemble de bâtiments en pierre blanche autour d'une cour, prairie et vieux arbres. Idéal pour un projet familial ou de chambres d'hôtes."
  },
  {
    id: "DUB-003",
    titre: "Appartement dans le centre historique",
    type: "Appartement",
    commune: "Cahors",
    secteur: "Quartier des Badernes",
    prix: 149000,
    surface: "82 m²",
    pieces: 3,
    dpe: "C",
    details: [
      ["Chambres", "2"],
      ["Étage", "2e sur 3, sans ascenseur"],
      ["Atouts", "Parquet, cheminée, cave"]
    ],
    image: "assets/img/bien-appartement-centre.jpg",
    description: "Au cœur du secteur sauvegardé, à deux pas de la cathédrale et du marché : un appartement lumineux et rénové, aux volumes d'hôtel particulier."
  },
  {
    id: "DUB-004",
    titre: "Maison vigneronne au milieu des vignes",
    type: "Maison",
    commune: "Parnac",
    secteur: "Vallée du Lot, 20 min de Cahors",
    prix: 289000,
    surface: "130 m²",
    terrain: "2 600 m²",
    pieces: 5,
    dpe: "D",
    details: [
      ["Chambres", "3"],
      ["Extérieur", "Terrasse plein sud, piscine possible"],
      ["Atouts", "Vue sur le vignoble AOC Cahors"]
    ],
    image: "assets/img/bien-maison-vigneronne.jpg",
    description: "Maison de pays entourée de vignes, au calme absolu, avec chai voûté en rez-de-jardin et grand terrain plat."
  },
  {
    id: "DUB-005",
    titre: "Terrain à bâtir avec vue sur la vallée",
    type: "Terrain",
    commune: "Mercuès",
    secteur: "10 min de Cahors",
    prix: 69000,
    surface: null,
    terrain: "1 450 m²",
    details: [
      ["Viabilisation", "Eau, électricité en bordure"],
      ["Urbanisme", "Certificat d'urbanisme opérationnel"],
      ["Atouts", "Exposition sud-ouest, vue dégagée"]
    ],
    image: "assets/img/bien-terrain-mercues.jpg",
    description: "Parcelle constructible en hauteur, à quelques minutes du centre de Cahors, avec une vue panoramique sur la vallée du Lot."
  },
  {
    id: "DUB-006",
    titre: "Maison de ville près du pont Valentré",
    type: "Maison",
    commune: "Cahors",
    secteur: "Rive gauche, pont Valentré",
    prix: null,
    surface: "112 m²",
    pieces: 4,
    dpe: "D",
    details: [
      ["Chambres", "3"],
      ["Extérieur", "Jardinet clos"],
      ["Atouts", "À pied des quais et du centre"],
      ["Stationnement", "Garage"]
    ],
    image: "assets/img/bien-quai-valentre.jpg",
    description: "Rare : maison de ville avec jardinet à quelques pas du pont Valentré et des berges du Lot. Visites sur rendez-vous."
  }
];
