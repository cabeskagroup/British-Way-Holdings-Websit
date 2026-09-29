// Newsroom stories taken from the group's own event posters (public/logos/glry*.jpg).
// Only two posters state an exact day; the others give the year at most. Add an ISO
// `date` to any story when the real day is known and it will appear on the calendar.

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (yyyy-mm-dd) when the exact day is known. */
  date?: string;
  /** Year shown when there is no exact date. */
  year?: string;
  time?: string;
  place?: string;
  category: string;
  company: string;
  image: string;
  featured?: boolean;
}

export const newsCategories = ["All", "Milestone", "Community", "Achievement", "Event", "Programme", "Corporate"];

export const newsItems: NewsItem[] = [
  {
    id: 1,
    slug: "government-backed-pension-rights",
    title: "A historic first: government-backed pension rights for our employees",
    excerpt:
      "British Way Holdings becomes the first private-sector organisation in Sri Lanka to secure government-backed pension rights for its employees — a milestone celebrated on Bizz Talks.",
    category: "Milestone",
    company: "British Way Holdings",
    image: "/logos/opt/glry04.jpg",
    featured: true,
  },
  {
    id: 2,
    slug: "ma-piya-wandana-2026",
    title: "Ma Piya Wandana brings together more than 2,000 parents and students",
    excerpt:
      "A Ma Piya Wandana ceremony honouring parents was held at the Grand Emirates Hotel with over 2,000 parents and students from the Britishway residential camp — a memorable and successful event.",
    date: "2026-05-17",
    place: "Grand Emirates Hotel",
    category: "Community",
    company: "British Way Holdings",
    image: "/logos/opt/glry03.jpg",
  },
  {
    id: 3,
    slug: "blood-donation-nittambuwa",
    title: "Blood donation programme at British Way English Academy, Nittambuwa",
    excerpt: "Students, staff and the community came together for a successful blood donation programme held at the academy in Nittambuwa.",
    date: "2026-05-12",
    time: "9.00 a.m. – 3.00 p.m.",
    place: "British Way English Academy, Nittambuwa",
    category: "Community",
    company: "British Way English Academy",
    image: "/logos/opt/glry02.jpg",
  },
  {
    id: 4,
    slug: "bwis-all-island-dance-2026",
    title: "BWIS dancers take second place in the Gampaha zone",
    excerpt: "Our British Way International School dance team secured 2nd place at the Gampaha zonal level of the All Island Dance Competition 2026.",
    year: "2026",
    category: "Achievement",
    company: "British Way International School",
    image: "/logos/opt/glry05.jpg",
  },
  {
    id: 5,
    slug: "convocation-galle-matara-2026",
    title: "Convocation Ceremony 2026 — Galle–Matara branch",
    excerpt: "British Way English Academy celebrated its graduates on the big stage at the 2026 Annual Convocation Ceremony of the Galle–Matara branch.",
    year: "2026",
    category: "Event",
    company: "British Way English Academy",
    image: "/logos/opt/glry11.jpg",
  },
  {
    id: 6,
    slug: "manamala-katha-premiere",
    title: "A proud premiere: “Manamala Katha” by Emika Productions",
    excerpt: "Emika Productions launched “Manamala Katha” (මනමාල කතා) with a premiere press event covered by Sri Lanka's leading television and news channels.",
    category: "Event",
    company: "Emika Productions",
    image: "/logos/opt/glry08.jpg",
  },
  {
    id: 7,
    slug: "empowering-educators-2026",
    title: "Empowering Educators 2026 at British Way International School",
    excerpt:
      "A professional development programme for BWIS teachers, built around the school's vision: enabling students to become well-disciplined, well-exposed citizens ready for a global future.",
    year: "2026",
    category: "Programme",
    company: "British Way International School",
    image: "/logos/opt/glry07.jpg",
  },
  {
    id: 8,
    slug: "branch-managers-meeting-2026",
    title: "Britishway Branch Managers Meeting 2026",
    excerpt: "Branch managers from across the Britishway network met to align on priorities for the year ahead.",
    year: "2026",
    category: "Corporate",
    company: "British Way Holdings",
    image: "/logos/opt/glry12.jpg",
  },
  {
    id: 9,
    slug: "mindfulness-session-educators",
    title: "Mindfulness session for educators",
    excerpt: "Teachers stepped outdoors for a guided mindfulness session focused on wellbeing, calm and presence in the classroom.",
    category: "Programme",
    company: "British Way Holdings",
    image: "/logos/opt/glry01.jpg",
  },
  {
    id: 10,
    slug: "hod-one-on-one-programme",
    title: "HOD One-on-One Programme",
    excerpt:
      "Designed to enhance employee satisfaction, strengthen workplace confidence and encourage greater efficiency through personalised guidance and support.",
    category: "Programme",
    company: "British Way Holdings",
    image: "/logos/opt/glry06.jpg",
  },
  {
    id: 11,
    slug: "hod-strategic-review",
    title: "HOD Strategic Review Meeting",
    excerpt: "Heads of department from across British Way Holdings gathered to review strategy and performance.",
    category: "Corporate",
    company: "British Way Holdings",
    image: "/logos/opt/glry09.jpg",
  },
  {
    id: 12,
    slug: "management-strategy-workshop",
    title: "Management Strategy Workshop: “Success Mantra”",
    excerpt: "Managers from across the group came together for the Success Mantra strategy workshop.",
    category: "Corporate",
    company: "British Way Holdings",
    image: "/logos/opt/glry10.jpg",
  },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "17 May 2026", "2026" or null. */
export function newsWhen(n: NewsItem): string | null {
  if (n.date) {
    const [y, m, d] = n.date.split("-").map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }
  return n.year ?? null;
}

export function getLatestNews(count = 3): NewsItem[] {
  return newsItems.slice(0, count);
}
