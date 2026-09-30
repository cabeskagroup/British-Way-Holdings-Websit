export interface Sector {
  id: string;
  index: string;
  title: string;
  /** Giant word shown across the sector panel. */
  word: string;
  tagline: string;
  description: string;
  image: string;
  /** Used when `image` can't load. */
  fallbackImage?: string;
  companies: string[];
  stat: { value: string; label: string };
  color: string;
}

export const sectors: Sector[] = [
  {
    id: "education",
    index: "01",
    title: "Education & Academies",
    word: "ACADEMIES",
    tagline: "From first words to world-class degrees.",
    description:
      "A complete learning journey: English mastery, international schooling, UK-partnered higher education and professional qualifications, all under one family of institutions.",
    image: "/logos/opt/bwisschool.jpg",
    companies: ["bwea", "bwis", "british-campus", "thames-college"],
    stat: { value: "4", label: "Institutions, one learning journey" },
    color: "#8fb6f2",
  },
  {
    id: "hospitality",
    index: "02",
    title: "Hotels & Hospitality",
    word: "HOTELS",
    tagline: "Where elegance meets exceptional service.",
    description:
      "The Pharo Hotel brings boutique luxury, award-winning dining and premium event spaces, all delivered with the same care as every classroom.",
    image: "/logos/opt/hotel.jpg",
    companies: ["pharo-hotel"],
    stat: { value: "Boutique", label: "Luxury stays & events" },
    color: "#e2c27e",
  },
  {
    id: "media",
    index: "03",
    title: "Media & Productions",
    word: "PRODUCTIONS",
    tagline: "Stories that move audiences.",
    description:
      "Emika Productions crafts films, brand stories, events and digital content. It is the creative engine that gives the group its voice on screen and on stage.",
    image: "/logos/opt/emikaproduction.jpg",
    companies: ["emika-productions"],
    stat: { value: "360°", label: "Film, events & digital" },
    color: "#f08a5d",
  },
  {
    id: "sports",
    index: "04",
    title: "Sports & Athletics",
    word: "SPORTS",
    tagline: "Building champions on and off the field.",
    description:
      "Wisdom Cricket Academy develops young cricketers with professional coaching, structured age-group pathways and competitive match experience.",
    image: "https://images.unsplash.com/photo-1531418841129-388b303f0c4a?w=1600&auto=format&fit=crop&q=80",
    fallbackImage: "/logos/opt/glry05.jpg",
    companies: ["wisdom-cricket-academy"],
    stat: { value: "Pro", label: "Coaching & match play" },
    color: "#5cc28f",
  },
  {
    id: "entertainment",
    index: "05",
    title: "Entertainment & Events",
    word: "& MORE",
    tagline: "Experiences that bring people together.",
    description:
      "Concerts, cultural festivals, corporate events and artist showcases: British Way Entertainment turns moments into memories across Sri Lanka.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80",
    fallbackImage: "/logos/opt/glry11.jpg",
    companies: ["british-way-entertainment"],
    stat: { value: "8", label: "Brands, one family" },
    color: "#ef4a5a",
  },
];
