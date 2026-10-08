import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

const DICT = {
  fr: {
    "nav.canoe": "Canoë",
    "nav.velo": "Vélo",
    "nav.combines": "Combinés",
    "nav.infos": "Infos",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.reservation": "Réserver",
    "nav.avis": "Avis",
    "nav.acces": "Accès",
    "cta.reserver": "Réserver",
    "cta.reserverNow": "Réserver maintenant",
    "cta.reserverOnline": "Réserver en ligne",
    "cta.voirParcours": "Voir les parcours",
    "cta.call": "Appeler",
    "hero.region": "Périgord Noir, France",
    "hero.title1": "L'aventure au",
    "hero.title2": "fil de l'eau.",
    "hero.subtitle":
      "Découvrez la vallée de la Dordogne, ses châteaux médiévaux et ses falaises majestueuses en canoë, en kayak ou à vélo. Une base familiale depuis plus de 15 ans.",
    "hero.shuttle": "Navette retour gratuite incluse",
    "intro.kicker": "Cap Evasion",
    "intro.title1": "Au cœur du Périgord Noir,",
    "intro.title2": "la Dordogne à votre rythme.",
    "intro.text":
      "Idéalement situés en Pays Fénelon, sur la rivière Dordogne, à 15 minutes de Sarlat, Souillac et Gourdon, nous proposons des parcours sur-mesure adaptés à vos envies.",
    "act.canoe.title": "Canoë & Kayak",
    "act.canoe.text":
      "4 parcours de 8 à 29 km, entre falaises de calcaire, plages de galets et villages classés.",
    "act.canoe.cta": "Découvrir les parcours",
    "act.velo.title": "Vélo & VAE",
    "act.velo.text":
      "VTT, VTC, vélos électriques et enfants. Plus de 30 km de voie verte le long de la Dordogne.",
    "act.velo.cta": "Louer un vélo",
    "act.combine.title": "Combinés",
    "act.combine.text":
      "Le meilleur des deux mondes : aller à vélo, retour en canoë au fil de la rivière.",
    "act.combine.cta": "Voir les combinés",
    "act.from": "Dès",
    "services.title": "Sur la base",
    "services.text":
      "Tout ce qu'il faut pour passer une journée tranquille en famille ou entre amis.",
    "parcours.kicker": "Nos parcours canoë",
    "parcours.title1": "4 descentes,",
    "parcours.title2": "une seule rivière.",
    "parcours.details": "Détails",
    "parcours.perPers": "/pers",
    "label.distance": "Distance",
    "label.duree": "Durée",
    "label.tarif": "Tarif",
    "label.demi": "Demi-journée",
    "label.jour": "Journée",
    "label.sup": "Jour suppl.",
    "label.aller": "Aller — vélo",
    "label.retour": "Retour — canoë",
    "avis.kicker": "Avis clients",
    "avis.title": "Ils ont navigué avec nous.",
    "avis.google": "4,5 / 5 sur Google",
    "avis.all": "Voir tous les avis",
    "avis.allGoogle": "Voir tous les avis Google",
    "gallery.kicker": "Galerie",
    "gallery.title": "La vallée vue d'ici.",
    "faq.kicker": "Questions fréquentes",
    "faq.title1": "Tout ce qu'on nous demande",
    "faq.title2": "le plus souvent.",
    "faq.all": "Toutes les questions",
    "cta.bigTitle": "Prêt à pagayer ?",
    "cta.bigText":
      "Réservez votre canoë, votre vélo ou votre combiné directement en ligne — c'est rapide et confirmé instantanément.",
    "weather.title": "Météo sur la rivière",
    "weather.air": "Air",
    "weather.water": "Eau",
    "weather.wind": "Vent",
    "season.short": "Ouvert tous les jours · 9 h – 19 h",
    "season.opening": "Du 1er mai au 30 septembre",
    "services.parking": "Parking gratuit",
    "services.buvette": "Buvette",
    "services.plage": "Plage pour baignade",
    "services.picnic": "Espace pique-nique",
    "services.animals": "Animaux acceptés",
    "services.shop": "Boutique",
    "services.bus": "Retour en bus gratuit",
    "services.kids": "−50 % pour les enfants de moins de 10 ans",
    "stats.years": "Années d'expérience",
    "stats.river": "Parcours navigable",
    "stats.bike": "Voie verte cyclable",
    "stats.castles": "Châteaux du Périgord",
    // Canoë page
    "canoe.eyebrow": "Canoë & kayak",
    "canoe.title1": "Glisser entre",
    "canoe.title2": "châteaux et falaises.",
    "canoe.subtitle":
      "4 parcours pensés pour tous les niveaux, de la balade tranquille en famille à la grande descente sportive.",
    "canoe.reserveParcours": "Réserver ce parcours",
    "canoe.info1.t": "Retour en bus",
    "canoe.info1.x": "Inclus et gratuit pour tous les parcours avec navette.",
    "canoe.info2.t": "−50 % enfants",
    "canoe.info2.x": "Réduction pour les moins de 10 ans accompagnés.",
    "canoe.info3.t": "Matériel récent",
    "canoe.info3.x": "Canoës, kayaks et gilets vérifiés à chaque sortie.",
    "canoe.parcoursLabel": "Parcours",
    // Vélo page
    "velo.eyebrow": "Vélo & VAE",
    "velo.title1": "30 km de voie verte",
    "velo.title2": "au fil de la rivière.",
    "velo.subtitle":
      "Notre base est située au pied de l'ancienne voie ferrée, aujourd'hui piste cyclable sécurisée, qui relie Sarlat à Cazoulès.",
    "velo.family.title": "Pour toute la famille.",
    "velo.family.t1":
      "Du vélo électrique pour profiter sans effort à la remorque enfant pour les plus petits, nous avons l'équipement qu'il vous faut. Le casque est inclus avec chaque vélo loué.",
    "velo.family.t2":
      "La voie verte de plus de 30 km vous permet de rejoindre Sarlat, ville incontournable du Périgord Noir, en toute sécurité.",
    "velo.prices": "Tarifs location",
    "velo.reserve": "Réserver un vélo",
    "velo.helmet": "Casque inclus pour chaque vélo loué",
    // Combinés
    "combines.eyebrow": "Combinés",
    "combines.title1": "Vélo le matin,",
    "combines.title2": "canoë l'après-midi.",
    "combines.subtitle":
      "Une activité 100 % nature qui combine les chemins de campagne et la rivière. Partez en vélo, continuez en canoë pour rentrer au fil de l'eau.",
    "combines.formula": "Formule",
    "combines.day.title": "Une journée, deux ambiances.",
    "combines.day.text":
      "Les combinés sont parfaits pour les groupes, les familles ou les couples qui veulent profiter au maximum de la Dordogne sur une seule journée. Pique-nique au bord de l'eau possible entre les deux activités.",
    // Infos
    "infos.eyebrow": "Infos pratiques",
    "infos.title1": "Tout pour préparer",
    "infos.title2": "votre journée.",
    "infos.subtitle":
      "Tout est prévu sur place pour que vous puissiez profiter sereinement de la vallée, en famille ou entre amis.",
    "infos.when.t": "Quand venir ?",
    "infos.when.x":
      "La base est ouverte d'avril à octobre, tous les jours en haute saison. La Dordogne reste navigable même en été — parfait pour les débutants comme pour les enfants.",
    "infos.what.t": "Quoi prévoir ?",
    "infos.what.x":
      "Une tenue qui ne craint pas l'eau, des chaussures fermées, de la crème solaire, une casquette et une gourde. Sac étanche conseillé pour téléphone.",
    "infos.who.t": "Avec qui ?",
    "infos.who.x":
      "Tous les parcours sont accessibles dès 6 ans (sachant nager). Les moins de 10 ans bénéficient de −50 %.",
    "infos.dogs.t": "Et les chiens ?",
    "infos.dogs.x":
      "Vos compagnons à 4 pattes sont les bienvenus, sur la base comme dans les canoës.",
    // Contact
    "contact.eyebrow": "Contact & accès",
    "contact.title1": "On vous attend",
    "contact.title2": "à Saint-Julien.",
    "contact.subtitle":
      "Au cœur du Pays Fénelon, à 15 minutes de Sarlat, Souillac et Gourdon.",
    "contact.address": "Adresse",
    "contact.opening": "Ouverture",
    "contact.openingText": "D'avril à octobre, tous les jours en haute saison",
    "contact.follow": "Suivez-nous",
    // FAQ
    "faqPage.eyebrow": "Questions fréquentes",
    "faqPage.title1": "Tout savoir",
    "faqPage.title2": "avant de pagayer.",
    "faqPage.subtitle":
      "Les réponses aux questions les plus posées. Une autre question ? Appelez-nous, on adore discuter rivière.",
    // Avis
    "avisPage.eyebrow": "Avis clients",
    "avisPage.title1": "Ils ont",
    "avisPage.title2": "navigué avec nous.",
    "avisPage.subtitle":
      "4,5 / 5 sur Google. Voici les retours, sans filtre, de celles et ceux qui sont descendus avec nous.",
    "avisPage.count": "4,5 / 5 sur Google · 100+ avis",
    // Accès
    "acces.eyebrow": "Accès & itinéraire",
    "acces.title1": "Nous trouver",
    "acces.title2": "au bord de la Dordogne.",
    "acces.subtitle":
      "Cap Evasion est situé au Port à Saint-Julien-de-Lampon, à 15 minutes de Sarlat et Souillac. Parking gratuit sur place.",
    "acces.address.t": "Adresse",
    "acces.maps": "Ouvrir dans Google Maps",
    "acces.parking.t": "Parking",
    "acces.parking.x":
      "Grand parking gratuit sur la base, ombragé. Place pour camping-cars et vélos.",
    "acces.from": "Depuis chez vous",
    // Réservation
    "reservation.eyebrow": "Réservation",
    "reservation.title1": "Choisissez votre",
    "reservation.title2": "date.",
    "reservation.subtitle":
      "Notre base est ouverte du 1er mai au 30 septembre, tous les jours. Sélectionnez une date pour réserver en ligne.",
    "reservation.cta": "Réserver pour cette date",
    "reservation.help":
      "La réservation se finalise sur notre plateforme partenaire Elloha (paiement sécurisé, confirmation instantanée).",
    "reservation.legend.open": "Ouvert",
    "reservation.legend.closed": "Fermé",
    "reservation.legend.selected": "Date choisie",
    "reservation.pick": "Sélectionnez une date",
    "reservation.byPhone": "Préférez réserver par téléphone ?",
  },
  en: {
    "nav.canoe": "Canoe",
    "nav.velo": "Bike",
    "nav.combines": "Combos",
    "nav.infos": "Info",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.reservation": "Book",
    "nav.avis": "Reviews",
    "nav.acces": "Access",
    "cta.reserver": "Book",
    "cta.reserverNow": "Book now",
    "cta.reserverOnline": "Book online",
    "cta.voirParcours": "See the routes",
    "cta.call": "Call",
    "hero.region": "Périgord Noir, France",
    "hero.title1": "Adventure along",
    "hero.title2": "the river.",
    "hero.subtitle":
      "Discover the Dordogne valley, its medieval castles and majestic cliffs by canoe, kayak or bike. A family-run base for over 15 years.",
    "hero.shuttle": "Free return shuttle included",
    "intro.kicker": "Cap Evasion",
    "intro.title1": "In the heart of the Périgord Noir,",
    "intro.title2": "the Dordogne at your own pace.",
    "intro.text":
      "Located in the Pays Fénelon on the Dordogne river, 15 minutes from Sarlat, Souillac and Gourdon. Tailor-made trips to suit you.",
    "act.canoe.title": "Canoe & Kayak",
    "act.canoe.text":
      "4 routes from 8 to 29 km, between limestone cliffs, pebble beaches and listed villages.",
    "act.canoe.cta": "Discover the routes",
    "act.velo.title": "Bike & E-Bike",
    "act.velo.text":
      "MTBs, hybrids, e-bikes and kids' bikes. Over 30 km of greenway along the Dordogne.",
    "act.velo.cta": "Rent a bike",
    "act.combine.title": "Combos",
    "act.combine.text":
      "Best of both worlds: ride out by bike, paddle back down the river.",
    "act.combine.cta": "See the combos",
    "act.from": "From",
    "services.title": "On site",
    "services.text":
      "Everything you need for a relaxed day with family or friends.",
    "parcours.kicker": "Our canoe routes",
    "parcours.title1": "4 descents,",
    "parcours.title2": "one single river.",
    "parcours.details": "Details",
    "parcours.perPers": "/person",
    "label.distance": "Distance",
    "label.duree": "Duration",
    "label.tarif": "Price",
    "label.demi": "Half-day",
    "label.jour": "Full day",
    "label.sup": "Extra day",
    "label.aller": "Outbound — bike",
    "label.retour": "Return — canoe",
    "avis.kicker": "Customer reviews",
    "avis.title": "They paddled with us.",
    "avis.google": "4.5 / 5 on Google",
    "avis.all": "See all reviews",
    "avis.allGoogle": "See all Google reviews",
    "gallery.kicker": "Gallery",
    "gallery.title": "The valley from here.",
    "faq.kicker": "Frequently asked",
    "faq.title1": "What people ask us",
    "faq.title2": "the most.",
    "faq.all": "All questions",
    "cta.bigTitle": "Ready to paddle?",
    "cta.bigText":
      "Book your canoe, your bike or a combo online — fast, instantly confirmed.",
    "weather.title": "Weather on the river",
    "weather.air": "Air",
    "weather.water": "Water",
    "weather.wind": "Wind",
    "season.short": "Open every day · 9 am – 7 pm",
    "season.opening": "From May 1st to September 30th",
    "services.parking": "Free parking",
    "services.buvette": "Snack bar",
    "services.plage": "Swimming beach",
    "services.picnic": "Picnic area",
    "services.animals": "Pets welcome",
    "services.shop": "Shop",
    "services.bus": "Free return bus",
    "services.kids": "−50% for kids under 10",
    "stats.years": "Years of experience",
    "stats.river": "Navigable river",
    "stats.bike": "Cycling greenway",
    "stats.castles": "Castles in Périgord",
    "canoe.eyebrow": "Canoe & kayak",
    "canoe.title1": "Glide between",
    "canoe.title2": "castles and cliffs.",
    "canoe.subtitle":
      "4 routes for all levels, from an easy family paddle to a long sporty descent.",
    "canoe.reserveParcours": "Book this route",
    "canoe.info1.t": "Return shuttle",
    "canoe.info1.x": "Free and included for all shuttle routes.",
    "canoe.info2.t": "−50% kids",
    "canoe.info2.x": "Discount for accompanied children under 10.",
    "canoe.info3.t": "Quality gear",
    "canoe.info3.x": "Canoes, kayaks and life jackets checked every day.",
    "canoe.parcoursLabel": "Route",
    "velo.eyebrow": "Bike & E-Bike",
    "velo.title1": "30 km of greenway",
    "velo.title2": "along the river.",
    "velo.subtitle":
      "Our base sits at the foot of the former railway, now a safe cycle path linking Sarlat to Cazoulès.",
    "velo.family.title": "For the whole family.",
    "velo.family.t1":
      "From e-bikes for effortless rides to child trailers for little ones, we have the gear you need. Helmet included with every bike.",
    "velo.family.t2":
      "The 30+ km greenway safely connects you to Sarlat, the must-see town of the Périgord Noir.",
    "velo.prices": "Rental rates",
    "velo.reserve": "Book a bike",
    "velo.helmet": "Helmet included with every rental",
    "combines.eyebrow": "Combos",
    "combines.title1": "Bike in the morning,",
    "combines.title2": "canoe in the afternoon.",
    "combines.subtitle":
      "A 100% outdoor activity combining countryside paths and the river. Ride out by bike, paddle back down the water.",
    "combines.formula": "Option",
    "combines.day.title": "One day, two moods.",
    "combines.day.text":
      "Combos are perfect for groups, families or couples wanting to enjoy the Dordogne to the fullest in a single day. Riverside picnic possible between activities.",
    "infos.eyebrow": "Useful info",
    "infos.title1": "Everything to plan",
    "infos.title2": "your day.",
    "infos.subtitle":
      "Everything is set up on site so you can enjoy the valley with family or friends.",
    "infos.when.t": "When to come?",
    "infos.when.x":
      "Base open April to October, every day in high season. The Dordogne stays paddleable all summer — perfect for beginners and kids.",
    "infos.what.t": "What to bring?",
    "infos.what.x":
      "Clothes that can get wet, closed shoes, sunscreen, a cap and a water bottle. A waterproof bag is recommended for phones.",
    "infos.who.t": "Who can join?",
    "infos.who.x":
      "All routes open from age 6 (must be able to swim). Under-10s get −50%.",
    "infos.dogs.t": "And dogs?",
    "infos.dogs.x":
      "Four-legged friends are welcome on site and in the canoes.",
    "contact.eyebrow": "Contact & access",
    "contact.title1": "We're waiting for you",
    "contact.title2": "in Saint-Julien.",
    "contact.subtitle":
      "In the heart of the Pays Fénelon, 15 minutes from Sarlat, Souillac and Gourdon.",
    "contact.address": "Address",
    "contact.opening": "Opening",
    "contact.openingText": "April to October, every day in high season",
    "contact.follow": "Follow us",
    "faqPage.eyebrow": "FAQ",
    "faqPage.title1": "Everything to know",
    "faqPage.title2": "before you paddle.",
    "faqPage.subtitle":
      "Answers to the most common questions. Another question? Just call us — we love talking river.",
    "avisPage.eyebrow": "Reviews",
    "avisPage.title1": "They paddled",
    "avisPage.title2": "with us.",
    "avisPage.subtitle":
      "4.5 / 5 on Google. Unfiltered feedback from those who came down the river with us.",
    "avisPage.count": "4.5 / 5 on Google · 100+ reviews",
    "acces.eyebrow": "Access & directions",
    "acces.title1": "Find us",
    "acces.title2": "on the Dordogne river.",
    "acces.subtitle":
      "Cap Evasion is at Le Port in Saint-Julien-de-Lampon, 15 min from Sarlat and Souillac. Free parking on site.",
    "acces.address.t": "Address",
    "acces.maps": "Open in Google Maps",
    "acces.parking.t": "Parking",
    "acces.parking.x":
      "Large free shaded parking on site. Space for motorhomes and bikes.",
    "acces.from": "From your city",
    "reservation.eyebrow": "Booking",
    "reservation.title1": "Pick your",
    "reservation.title2": "date.",
    "reservation.subtitle":
      "Our base is open May 1st to September 30th, every day. Pick a date to book online.",
    "reservation.cta": "Book for this date",
    "reservation.help":
      "Booking is finalised on our partner platform Elloha (secure payment, instant confirmation).",
    "reservation.legend.open": "Open",
    "reservation.legend.closed": "Closed",
    "reservation.legend.selected": "Selected date",
    "reservation.pick": "Pick a date",
    "reservation.byPhone": "Prefer to book by phone?",
  },
} satisfies Record<Lang, Record<string, string>>;

type Key = keyof (typeof DICT)["fr"];

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key) => string;
  tr: (v: { fr: string; en: string }) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = typeof window !== "undefined"
      ? (localStorage.getItem("lang") as Lang | null)
      : null;
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const t = (key: Key) => DICT[lang][key] ?? DICT.fr[key] ?? String(key);
  const tr = (v: { fr: string; en: string }) => v[lang] ?? v.fr;

  return <Ctx.Provider value={{ lang, setLang, t, tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
