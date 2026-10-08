// Constantes globales du site Cap Evasion (FR + EN condensé)

// Page de réservation interne (calendrier + paiement Stripe / sur place).
// Note : tous les <a href={RESERVATION_URL}> deviennent des liens internes.
export const RESERVATION_URL = "/reservation";

export const CONTACT = {
  address: "Le Port, 24370 Saint-Julien-de-Lampon",
  region: "Périgord Noir, France",
  phone: "+33 5 53 29 74 02",
  phoneDisplay: "05 53 29 74 02",
  email: "contact@canoe-sur-dordogne.com",
  facebook: "https://www.facebook.com/canoe.en.dordogne",
  maps: "https://maps.google.com/?cid=8212064261327681242",
  tripadvisor:
    "https://www.tripadvisor.fr/Attraction_Review-g3874017-d10754294-Reviews-Cap_Evasion-Saint_Julien_de_Lampon_Dordogne_Nouvelle_Aquitaine.html",
  lat: 44.8553,
  lng: 1.3475,
};

// Saison : mai → septembre
export const SEASON = {
  startMonth: 4, // 0-indexed (mai)
  endMonth: 8, // septembre
};

const wp = (path: string, w = 1600) =>
  `https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/${path}?fit=${w}%2C${Math.round(
    (w * 2) / 3
  )}&ssl=1`;

export const PHOTOS = {
  heroValley: wp("2022/04/AdobeStock_282044418-2-scaled.jpeg", 1920),
  heroAlt: wp("2022/04/AdobeStock_178556149-scaled.jpeg", 1920),
  canoeSauvage: wp("2022/04/AdobeStock_308214234-scaled.jpeg", 1200),
  canoeFamily: wp("2022/04/3889671326_d213aaeccb_o.jpg", 1200),
  canoePittoresque: wp("2022/04/AdobeStock_282044418-2-scaled.jpeg", 1200),
  canoeIntegrale: wp("2022/04/AdobeStock_234345499-scaled.jpeg", 1200),
  veloVoieVerte: wp("2023/04/Voie-verte-Sarlat-Cap-Evasion.webp", 1200),
  veloPont: wp("2023/04/Pont-grolejac-Piste-Cyclable.webp", 1200),
  veloGare: wp("2023/04/Gare-Robert-Doisneau-cote-piste-cyclable.jpg", 1200),
  combine: wp("2022/04/AdobeStock_56586890-1-scaled.jpeg", 1200),
  domme: wp("2022/04/AdobeStock_176215288-scaled.jpeg", 1200),
  roque: wp("2022/04/AdobeStock_180472181-scaled.jpeg", 1200),
  drone1: wp("2020/05/C5B8A1B670A320DD1489AED93DB3EB73-scaled.jpg", 1200),
  drone2: wp("2020/05/AFFFBF04E3090785DDD6113722ED77C2-scaled.jpg", 1200),
  drone3: wp("2020/05/BA1C75A04F7FE38BA7EE51DF8F71986B-scaled.jpg", 1200),
  drone4: wp("2020/05/12890FDB4AC5C133354DBE67A466C652-scaled.jpg", 1200),
  groupe: wp("2022/04/51946446260_e4670f6cfe_o.jpg", 1200),
  groupe2: wp("2022/04/51944854977_6113a31632_o.jpg", 1200),
  groupe3: wp("2022/04/51945913608_50562a8380_o.jpg", 1200),
  base: wp("2022/04/IMG_1901.jpg", 1200),
  base2: wp("2020/05/IMG_1902.png", 1200),
  base3: wp("2020/05/IMG_1896.png", 1200),
};

export type Bi = { fr: string; en: string };
export const pick = (v: Bi, lang: "fr" | "en") => v[lang];

export interface Parcours {
  slug: string;
  name: Bi;
  trajet: string;
  km: string;
  duree: Bi;
  prix: string;
  photo: string;
  description: Bi;
}

export const PARCOURS_CANOE: Parcours[] = [
  {
    slug: "sauvage",
    name: { fr: "La Sauvage", en: "The Wild" },
    trajet: "Cazoulès → Saint-Julien",
    km: "8 km",
    duree: { fr: "2 h", en: "2 hr" },
    prix: "16 €",
    photo: PHOTOS.canoeSauvage,
    description: {
      fr: "Parcours sauvage pour un moment 100 % détente. Le léger courant vous permet de naviguer sans effort. Faune et flore vous émerveilleront tout au long de la descente.",
      en: "A peaceful, wild stretch. A gentle current carries you effortlessly, with rich wildlife along the way. Perfect for a relaxed first descent.",
    },
  },
  {
    slug: "familiale",
    name: { fr: "La Familiale", en: "The Family" },
    trajet: "Saint-Julien → Vitrac",
    km: "16 km",
    duree: { fr: "3 h 30", en: "3h30" },
    prix: "20 €",
    photo: PHOTOS.canoeFamily,
    description: {
      fr: "Profitez de la Dordogne, de ses plages de galets, et admirez l'impressionnant château de Montfort dominant la vallée. Idéal en demi-journée ou journée.",
      en: "Pebble beaches, swimming spots and the dramatic Montfort castle towering over the valley. Ideal for a half-day with family.",
    },
  },
  {
    slug: "pittoresque",
    name: { fr: "La Pittoresque", en: "The Scenic" },
    trajet: "Saint-Julien → La Roque-Gageac",
    km: "22 km",
    duree: { fr: "5 h", en: "5 hr" },
    prix: "24 €",
    photo: PHOTOS.canoePittoresque,
    description: {
      fr: "Plages sauvages, châteaux et villages classés « Plus Beaux Villages de France ». Le parcours idéal pour une journée à la découverte des merveilles de la vallée.",
      en: "Wild beaches, castles and listed 'Most Beautiful Villages of France'. The ideal full-day to discover the valley's wonders.",
    },
  },
  {
    slug: "integrale",
    name: { fr: "L'Intégrale", en: "The Full Run" },
    trajet: "Saint-Julien → Beynac",
    km: "29 km",
    duree: { fr: "6 h", en: "6 hr" },
    prix: "26 €",
    photo: PHOTOS.canoeIntegrale,
    description: {
      fr: "Pour les plus sportifs : 6 châteaux et 3 des plus beaux villages de France. Un parcours sur mesure pour une journée d'aventure complète sur la Dordogne.",
      en: "For active paddlers: 6 castles and 3 of France's most beautiful villages. A full adventure day on the Dordogne.",
    },
  },
];

export interface Velo {
  name: Bi;
  description: Bi;
  demi: string;
  jour: string;
  sup: string;
}

export const VELOS: Velo[] = [
  {
    name: { fr: "Vélo électrique", en: "E-Bike" },
    description: {
      fr: "Jusqu'à 80 km d'autonomie. L'idéal pour profiter de la vallée avec le plus grand confort.",
      en: "Up to 80 km range. The most comfortable way to explore the valley.",
    },
    demi: "30 €",
    jour: "42 €",
    sup: "35 €",
  },
  {
    name: { fr: "VTT / VTC", en: "MTB / Hybrid" },
    description: {
      fr: "Vélos adaptés à la voie verte, plusieurs tailles et types de cadre disponibles.",
      en: "Bikes suited to the greenway, several sizes and frames available.",
    },
    demi: "15 €",
    jour: "20 €",
    sup: "16 €",
  },
  {
    name: { fr: "Vélo enfant", en: "Kids' Bike" },
    description: {
      fr: "Vélos 16 à 24 pouces pour enfants de 2 à 13 ans, en toute sécurité sur la piste cyclable.",
      en: "16–24 inch bikes for kids aged 2 to 13, safe on the cycle path.",
    },
    demi: "10 €",
    jour: "14 €",
    sup: "11 €",
  },
  {
    name: { fr: "Remorque", en: "Child Trailer" },
    description: {
      fr: "Pour emmener les plus petits et découvrir les paysages de la Dordogne en famille.",
      en: "To bring the youngest along and enjoy the Dordogne landscapes as a family.",
    },
    demi: "10 €",
    jour: "14 €",
    sup: "11 €",
  },
];

export interface Combine {
  name: Bi;
  aller: Bi;
  retour: Bi;
  prix: string;
}

export const COMBINES: Combine[] = [
  {
    name: { fr: "Parcours Détente", en: "Easy Combo" },
    aller: { fr: "Saint-Julien → Cazoulès (vélo) 8 km", en: "Saint-Julien → Cazoulès (bike) 8 km" },
    retour: { fr: "Cazoulès → Saint-Julien (canoë) 8 km", en: "Cazoulès → Saint-Julien (canoe) 8 km" },
    prix: "24 €",
  },
  {
    name: { fr: "Détente Fénelon", en: "Fénelon Loop" },
    aller: { fr: "Circuit Fénelon (vélo) 9 km", en: "Fénelon loop (bike) 9 km" },
    retour: { fr: "Saint-Julien → Vitrac (canoë) 16 km", en: "Saint-Julien → Vitrac (canoe) 16 km" },
    prix: "28 €",
  },
  {
    name: { fr: "Parcours Sportif", en: "Sport Combo" },
    aller: { fr: "Saint-Julien → Carsac (vélo) 11 km", en: "Saint-Julien → Carsac (bike) 11 km" },
    retour: { fr: "Carsac → La Roque-Gageac (canoë) 14 km", en: "Carsac → La Roque-Gageac (canoe) 14 km" },
    prix: "30 €",
  },
];

export const AVIS: { name: string; text: Bi }[] = [
  {
    name: "Alexandre Pradel",
    text: {
      fr: "Toujours bien accueilli, cadre idéal et reposant. L'équipe est efficace et toujours à l'heure pour les ramassages.",
      en: "Always a warm welcome, ideal restful setting. The team is efficient and always on time for pickups.",
    },
  },
  {
    name: "Dominique Hauchecorne",
    text: {
      fr: "Équipe très sympathique et professionnelle qui explique parfaitement le parcours et prend soin de ses clients.",
      en: "Very friendly, professional team — clear briefing and great care for customers.",
    },
  },
  {
    name: "Thibaut Lagrève",
    text: {
      fr: "Très agréable balade le long de la Dordogne, les ramassages en minibus sont à l'heure le soir.",
      en: "Lovely paddle down the Dordogne, evening minibus pickups right on schedule. Recommended.",
    },
  },
  {
    name: "Sophie Marchand",
    text: {
      fr: "Une journée mémorable en famille. Les enfants ont adoré, l'accueil est top et le parcours jusqu'à La Roque-Gageac est magnifique.",
      en: "A memorable family day. The kids loved it, great welcome and the route to La Roque-Gageac is stunning.",
    },
  },
  {
    name: "Julien Berthier",
    text: {
      fr: "Loueur sérieux, équipement nickel, conseils avisés. Le combiné vélo + canoë est une super formule.",
      en: "Reliable rental, spotless gear, sound advice. The bike + canoe combo is excellent.",
    },
  },
  {
    name: "Camille Dupré",
    text: {
      fr: "Cadre paisible, accueil chaleureux. On revient chaque été depuis 4 ans, jamais déçus.",
      en: "Peaceful setting, warm welcome. We've been back every summer for 4 years — never disappointed.",
    },
  },
];

export const FAQ: { q: Bi; r: Bi }[] = [
  {
    q: { fr: "Faut-il savoir nager ?", en: "Do I need to know how to swim?" },
    r: {
      fr: "Oui, il est obligatoire de savoir nager au moins 25 mètres. Un gilet de sauvetage est fourni et doit être porté pendant toute la descente.",
      en: "Yes — you must be able to swim at least 25 metres. A life jacket is provided and worn throughout the trip.",
    },
  },
  {
    q: { fr: "À partir de quel âge peut-on faire du canoë ?", en: "What's the minimum age?" },
    r: {
      fr: "Les enfants sont acceptés dès 5 ans, accompagnés d'un adulte. Les moins de 10 ans bénéficient de 50 % de réduction.",
      en: "From 5 years old, with an adult. Under-10s get 50% off. Babies are not allowed on the river.",
    },
  },
  {
    q: { fr: "Et s'il pleut ?", en: "What if it rains?" },
    r: {
      fr: "Le canoë se pratique par tous les temps tant que la rivière reste navigable. En cas d'orage ou de crue, nous reportons ou remboursons.",
      en: "Canoeing runs in all weather as long as the river is safe. In case of storm or flood we reschedule or refund.",
    },
  },
  {
    q: { fr: "Le retour est-il vraiment inclus ?", en: "Is the return shuttle really included?" },
    r: {
      fr: "Oui, notre navette gratuite vous récupère à l'arrivée et vous ramène à la base, à votre voiture.",
      en: "Yes — our free shuttle picks you up at the end of the route and brings you back to your car.",
    },
  },
  {
    q: { fr: "Peut-on venir avec son chien ?", en: "Can I bring my dog?" },
    r: {
      fr: "Oui, les chiens sont acceptés sur la base et dans les canoës, sous votre responsabilité.",
      en: "Yes, dogs are welcome on site and in the canoes, under your responsibility.",
    },
  },
  {
    q: { fr: "Comment se passe la réservation ?", en: "How does booking work?" },
    r: {
      fr: "Réservation en ligne 24 h/24 via notre système Elloha (confirmation instantanée) ou par téléphone aux heures d'ouverture.",
      en: "Online 24/7 via our Elloha system (instant confirmation), or by phone during opening hours.",
    },
  },
  {
    q: { fr: "Y a-t-il des sanitaires ?", en: "Are there toilets / changing rooms?" },
    r: {
      fr: "Des sanitaires sont disponibles sur la base. Prévoyez des vêtements de rechange et des chaussures qui peuvent prendre l'eau.",
      en: "Toilets are available on site. Bring spare clothes and shoes that can get wet (sport sandals or old trainers).",
    },
  },
  {
    q: { fr: "Que faire en cas d'annulation ?", en: "What about cancellations?" },
    r: {
      fr: "L'annulation est gratuite jusqu'à 48 h avant le départ. En cas de mauvaise météo, nous proposons report ou remboursement intégral.",
      en: "Free cancellation up to 48 h before departure. In case of bad weather on our side, full refund or reschedule.",
    },
  },
];

export const ACCES: { from: string; distance: string; duree: Bi; route: Bi }[] = [
  {
    from: "Sarlat-la-Canéda",
    distance: "20 km",
    duree: { fr: "25 min", en: "25 min" },
    route: { fr: "D704A puis D703 direction Souillac", en: "D704A then D703 towards Souillac" },
  },
  {
    from: "Souillac",
    distance: "12 km",
    duree: { fr: "15 min", en: "15 min" },
    route: { fr: "D703 direction Sarlat", en: "D703 towards Sarlat" },
  },
  {
    from: "Brive-la-Gaillarde",
    distance: "55 km",
    duree: { fr: "50 min", en: "50 min" },
    route: { fr: "A20 sortie 55 Souillac puis D703", en: "A20 exit 55 Souillac then D703" },
  },
  {
    from: "Bergerac",
    distance: "80 km",
    duree: { fr: "1 h 20", en: "1h20" },
    route: { fr: "D660 puis D703 le long de la Dordogne", en: "D660 then D703 along the Dordogne" },
  },
  {
    from: "Périgueux",
    distance: "85 km",
    duree: { fr: "1 h 15", en: "1h15" },
    route: { fr: "N89 puis D704 par Sarlat", en: "N89 then D704 via Sarlat" },
  },
  {
    from: "Bordeaux",
    distance: "200 km",
    duree: { fr: "2 h 30", en: "2h30" },
    route: { fr: "A89 sortie 16 Mussidan puis D709", en: "A89 exit 16 Mussidan then D709" },
  },
];
