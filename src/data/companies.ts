export interface Company {
  slug: string;
  short: string;
  name: string;
  color: string;
  accent: string;
  cat: string;
  tagline: string;
  desc: string;
  longDesc: string;
  img: string;
  points: string[];
  website: string;
  phone?: string;
  email?: string;
}

export const companies: Company[] = [
  {
    slug: "bwea",
    short: "BWEA",
    name: "British Way English Academy",
    color: "#2a5a94",
    accent: "#4a80b4",
    cat: "English Language Education",
    tagline: "Master English. Master Your Future.",
    desc: "Sri Lanka's premier English language institute offering internationally recognised programmes, Cambridge preparation, and professional development courses for all ages.",
    longDesc:
      "British Way English Academy (BWEA) has been at the forefront of English language education in Sri Lanka for over a decade. From young learners taking their first steps in English to professionals preparing for international careers, BWEA delivers structured programmes aligned with Cambridge and IELTS standards. Our experienced faculty, modern classrooms, and flexible online learning options ensure every student receives personalised attention and measurable progress.",
    img: "/logos/opt/britishway.jpg",
    points: ["Cambridge & IELTS Preparation", "Corporate English Training", "Kids & Teens Programmes", "Online Learning Platform"],
    website: "https://www.bwea.lk",
    phone: "+94 33 202 4141",
    email: "bwea@britishway.lk",
  },
  {
    slug: "bwis",
    short: "BWIS",
    name: "British Way International School",
    color: "#1a6b3a",
    accent: "#2a9854",
    cat: "K-12 International Education",
    tagline: "Nurturing Global Citizens from Day One.",
    desc: "An internationally-accredited school offering a world-class curriculum that prepares students for a competitive global future, with a strong emphasis on character development.",
    longDesc:
      "British Way International School (BWIS) provides a holistic British-style education from early years through A-Levels. Our curriculum balances academic rigour with creative arts, sports, and leadership development. With modern STEM facilities, dedicated pastoral care, and a diverse student community, BWIS equips young people with the knowledge, confidence, and values to succeed anywhere in the world.",
    img: "/logos/opt/bwisschool.jpg",
    points: ["British National Curriculum", "O/L & A/L Programmes", "Extra-curricular Excellence", "Modern STEM Facilities"],
    website: "https://www.bwis.lk",
    phone: "+94 11 234 5683",
    email: "bwis@britishway.lk",
  },
  {
    slug: "british-campus",
    short: "BC",
    name: "British Campus",
    color: "#4a1a7a",
    accent: "#6a3a9a",
    cat: "Higher Education",
    tagline: "UK Qualifications. Sri Lankan Roots.",
    desc: "A higher education institution offering degree and diploma programmes in partnership with leading UK universities, bridging Sri Lankan students to world-class qualifications.",
    longDesc:
      "British Campus connects ambitious students and working professionals with internationally recognised UK degree and diploma programmes. Through partnerships with leading British universities, we offer pathways in business, management, IT, and engineering — with flexible full-time, part-time, and blended study modes. Our academic support team guides every learner from enrolment to graduation and beyond.",
    img: "/logos/opt/bche.jpg",
    points: ["UK University Partnerships", "Business & Management", "IT & Engineering", "Flexible Study Modes"],
    website: "https://www.britishcampus.lk",
    phone: "+94 11 234 5681",
    email: "campus@britishway.lk",
  },
  {
    slug: "pharo-hotel",
    short: "TPH",
    name: "The Pharo Hotel",
    color: "#7a5a1e",
    accent: "#b08030",
    cat: "Hospitality",
    tagline: "Where Elegance Meets Exceptional Service.",
    desc: "A distinguished hospitality establishment offering world-class accommodation, award-winning dining experiences, and premium event facilities in the heart of Colombo.",
    longDesc:
      "The Pharo Hotel is a boutique luxury destination in Colombo, designed for discerning travellers, corporate guests, and event organisers. From elegantly appointed rooms and suites to our award-winning restaurant, spa, and versatile conference spaces, every detail reflects our commitment to refined hospitality. Whether for business or leisure, The Pharo Hotel delivers an unforgettable stay.",
    img: "/logos/opt/hotel.jpg",
    points: ["Luxury Accommodation", "Fine Dining Restaurant", "Events & Conferences", "Spa & Wellness"],
    website: "https://www.pharohotel.lk",
    phone: "+94 11 234 5680",
    email: "pharo@britishway.lk",
  },
  {
    slug: "thames-college",
    short: "TC",
    name: "Thames College",
    color: "#7a1a1a",
    accent: "#a03030",
    cat: "Professional Development",
    tagline: "Skills That Shape Careers.",
    desc: "A leading college for professional qualifications and vocational training, delivering programmes aligned with global industry standards and employer expectations.",
    longDesc:
      "Thames College specialises in professional qualifications that open doors to rewarding careers. Our portfolio includes AAT, CIMA, digital marketing, leadership development, and industry certifications — all taught by practitioners with real-world experience. With flexible schedules and career counselling support, Thames College helps professionals at every stage advance with confidence.",
    img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=560&h=360&fit=crop&auto=format",
    points: ["AAT & CIMA Pathways", "Digital Skills Training", "Leadership Development", "Industry Certifications"],
    website: "https://www.thamescollege.lk",
    phone: "+94 11 234 5682",
    email: "thames@britishway.lk",
  },
  {
    slug: "emika-productions",
    short: "EP",
    name: "Emika Productions",
    color: "#5a2a6b",
    accent: "#8a4a9a",
    cat: "Media & Production",
    tagline: "Stories That Move Audiences.",
    desc: "A creative production house delivering high-quality film, television, and digital content for brands, events, and entertainment across Sri Lanka and beyond.",
    longDesc:
      "Emika Productions is the creative engine behind compelling visual storytelling for brands, events, and entertainment. Our team of directors, cinematographers, editors, and designers produces everything from corporate brand films and television content to live event coverage and digital campaigns. We combine artistic vision with technical excellence to deliver content that resonates.",
    img: "/logos/opt/emikaproduction.jpg",
    points: ["Film & Video Production", "Corporate Brand Films", "Event Coverage", "Digital Content Creation"],
    website: "https://www.emikaproductions.lk",
    phone: "+94 11 234 5684",
    email: "emika@britishway.lk",
  },
  {
    slug: "wisdom-cricket-academy",
    short: "WCA",
    name: "Wisdom Cricket Academy",
    color: "#1a5a3a",
    accent: "#2a8a5a",
    cat: "Sports & Athletics",
    tagline: "Building Champions On and Off the Field.",
    desc: "A premier cricket academy nurturing young talent through professional coaching, structured training programmes, and competitive match experience at all levels.",
    longDesc:
      "Wisdom Cricket Academy develops the next generation of cricketing talent through structured coaching programmes for all age groups. Led by experienced coaches, our academy offers technical training, match practice, fitness programmes, and tournament exposure. We believe in building not just skilled players, but disciplined athletes with strong character and teamwork.",
    img: "https://images.unsplash.com/photo-1531418841129-388b303f0c4a?w=560&h=360&fit=crop&auto=format",
    points: ["Professional Coaching Staff", "Age-group Development", "Match Practice & Tournaments", "Fitness & Performance Training"],
    website: "https://www.wisdomcricket.lk",
    phone: "+94 11 234 5685",
    email: "wisdom@britishway.lk",
  },
  {
    slug: "british-way-entertainment",
    short: "BWE",
    name: "British Way Entertainment",
    color: "#8a1a4a",
    accent: "#b03070",
    cat: "Entertainment & Events",
    tagline: "Experiences That Bring People Together.",
    desc: "The entertainment arm of British Way Holdings, producing live events, concerts, and cultural experiences that bring audiences together across Sri Lanka.",
    longDesc:
      "British Way Entertainment curates and produces live concerts, cultural festivals, corporate events, and artist showcases across Sri Lanka. From intimate performances to large-scale productions, our experienced events team handles concept, production, artist management, and promotion. We create memorable experiences that celebrate talent and bring communities together.",
    img: "",
    points: ["Live Concerts & Shows", "Corporate Events", "Artist Management", "Cultural Festivals"],
    website: "https://www.britishwayentertainment.lk",
    phone: "+94 11 234 5686",
    email: "entertainment@britishway.lk",
  },
];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function getCompanyLogoPath(slug: string): string {
  return `/logos/${slug}.png`;
}
