// Content for the About page timeline and the 3D Heritage Hall.
// NOTE: the milestone years and wording below are demo placeholders built around
// the group's companies — replace them with the real dates and stories.
// Awards are taken from the newsroom items in news.ts.

export interface Milestone {
  year: string;
  title: string;
  text: string;
  image: string;
  /** Older milestones are shown sepia-toned like archive photographs. */
  historic?: boolean;
}

export const milestones: Milestone[] = [
  {
    year: "2004",
    title: "Where it all began",
    text: "British Way Holdings begins as a single English academy with a simple promise: world-class English for every learner.",
    image: "/logos/britishway.png",
    historic: true,
  },
  {
    year: "2008",
    title: "A school for global citizens",
    text: "British Way International School welcomes its first students to a British-curriculum education.",
    image: "/logos/bwisschool.png",
    historic: true,
  },
  {
    year: "2012",
    title: "UK degrees, Sri Lankan roots",
    text: "British Campus partners with UK universities to bring internationally recognised qualifications home.",
    image: "/logos/bche.png",
    historic: true,
  },
  {
    year: "2015",
    title: "Skills that shape careers",
    text: "Thames College launches professional and vocational pathways aligned with global industry standards.",
    image: "/logos/glry07.jpg",
  },
  {
    year: "2018",
    title: "Hospitality with heart",
    text: "The Pharo Hotel joins the family, bringing boutique luxury, fine dining and event spaces.",
    image: "/logos/hotel.png",
  },
  {
    year: "2020",
    title: "Stories on screen",
    text: "Emika Productions becomes the group's creative voice across film, brand stories and live events.",
    image: "/logos/glry08.jpg",
  },
  {
    year: "2023",
    title: "Champions and stages",
    text: "Wisdom Cricket Academy and British Way Entertainment extend the group into sport and entertainment.",
    image: "/logos/glry11.jpg",
  },
  {
    year: "2026",
    title: "A year of recognition",
    text: "ISO 9001:2015 certification, a UEL partnership, 1,200 graduates and a national hospitality award.",
    image: "/logos/aboutus.png",
  },
];

export type AwardKind = "cup" | "star" | "crystal" | "medal" | "shield";

export interface Award {
  title: string;
  by: string;
  year: string;
  kind: AwardKind;
}

export const awards: Award[] = [
  { title: "Best Boutique Hotel of the Year", by: "Sri Lanka Tourism Awards · The Pharo Hotel", year: "2026", kind: "cup" },
  { title: "ISO 9001:2015 Certification", by: "British Way English Academy", year: "2026", kind: "crystal" },
  { title: "Landmark UEL Partnership", by: "British Campus · University of East London", year: "2026", kind: "star" },
  { title: "1,200 Graduates Celebrated", by: "Annual Convocation 2026", year: "2026", kind: "medal" },
  { title: "Inter-School Tournament Hosts", by: "Wisdom Cricket Academy", year: "2026", kind: "shield" },
];
