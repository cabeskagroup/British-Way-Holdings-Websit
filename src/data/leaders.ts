export interface Leader {
  name: string;
  title: string;
  bio: string;
  message?: string;
  image: string;
  featured?: boolean;
}

export const leaders: Leader[] = [
  {
    name: "Dr. Shantha Geethadewa",
    title: "Managing Director",
    bio: "Dr. Geethadewa is a visionary leader with over 20 years of experience in education and corporate management. Under his strategic direction, British Way Holdings has grown into one of Sri Lanka's most respected diversified holding groups.",
    message: "Our mission has always been to unlock the potential of every individual we serve, whether a student, a professional, or a guest.",
    image: "/logos/opt/dr_geethadewa.jpg",
    featured: true,
  },
  {
    name: "Madam Preni Rajapaksha",
    title: "Chairperson",
    bio: "A distinguished leader with an illustrious career spanning academia and corporate governance, Madam Rajapaksha chairs the board with wisdom and an unwavering commitment to the group's founding values.",
    message: "I believe that the measure of an organisation's success lies in the positive change it creates in the community it serves.",
    image: "/logos/opt/madam_rajapaksha.jpg",
    featured: true,
  },
  {
    name: "Ranga Ilandara",
    title: "Chief Executive Officer",
    bio: "Ranga brings extensive corporate experience from both local and international markets. As CEO, he oversees the strategic growth and operational excellence of all British Way Holdings enterprises.",
    image: "/logos/opt/ranga_ilandara.jpg",
  },
  {
    name: "Oshadhi Thennakoon",
    title: "General Manager",
    bio: "Oshadhi leads day-to-day operations across the group with a focus on efficiency, quality assurance, and collaborative teamwork.",
    image: "/logos/opt/oshadhi_thennakoon.jpg",
  },
  {
    name: "Emil Hettiarachchi",
    title: "Director",
    bio: "Emil brings deep expertise in corporate finance, investment strategy, and governance.",
    image: "/logos/opt/emil_hettiarachi.jpg",
  },
  {
    name: "Nisal Geethadewa",
    title: "Director",
    bio: "Nisal spearheads digital transformation and technology innovation across all group companies.",
    image: "/logos/opt/nisal_hettiarachi.jpg",
  },
];

export function getFeaturedLeaders(): Leader[] {
  return leaders.filter((l) => l.featured);
}
