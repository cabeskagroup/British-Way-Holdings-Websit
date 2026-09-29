// Content for the About page timeline and the 3D Heritage Hall.
// NOTE: the milestone years and wording below are demo placeholders built around
// the group's companies. Replace them with the real dates and stories.
// The Hall of Honours shows real milestones taken from the group's event posters (see news.ts).

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
    image: "/logos/opt/britishway.jpg",
    historic: true,
  },
  {
    year: "2008",
    title: "A school for global citizens",
    text: "British Way International School welcomes its first students to a British-curriculum education.",
    image: "/logos/opt/bwisschool.jpg",
    historic: true,
  },
  {
    year: "2012",
    title: "UK degrees, Sri Lankan roots",
    text: "British Campus partners with UK universities to bring internationally recognised qualifications home.",
    image: "/logos/opt/bche.jpg",
    historic: true,
  },
  {
    year: "2015",
    title: "Skills that shape careers",
    text: "Thames College launches professional and vocational pathways aligned with global industry standards.",
    image: "/logos/opt/glry07.jpg",
  },
  {
    year: "2018",
    title: "Hospitality with heart",
    text: "The Pharo Hotel joins the family, bringing boutique luxury, fine dining and event spaces.",
    image: "/logos/opt/hotel.jpg",
  },
  {
    year: "2020",
    title: "Stories on screen",
    text: "Emika Productions becomes the group's creative voice across film, brand stories and live events.",
    image: "/logos/opt/glry08.jpg",
  },
  {
    year: "2023",
    title: "Champions and stages",
    text: "Wisdom Cricket Academy and British Way Entertainment extend the group into sport and entertainment.",
    image: "/logos/opt/glry11.jpg",
  },
  {
    year: "2026",
    title: "A year of firsts",
    text: "A private-sector first in employee pension rights, national dance honours for BWIS and 2,000 families at Ma Piya Wandana.",
    image: "/logos/opt/aboutus.jpg",
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
  { title: "First private-sector pension rights", by: "British Way Holdings · government-backed, for every employee", year: "Milestone", kind: "star" },
  { title: "2nd Place, All Island Dance Competition", by: "BWIS dance team · Gampaha zonal level", year: "2026", kind: "medal" },
  { title: "Convocation Ceremony 2026", by: "British Way English Academy · Galle-Matara branch", year: "2026", kind: "cup" },
  { title: "“Manamala Katha” premiere", by: "Emika Productions", year: "Premiere", kind: "crystal" },
  { title: "2,000+ at Ma Piya Wandana", by: "Parents and students honouring family", year: "2026", kind: "shield" },
];
