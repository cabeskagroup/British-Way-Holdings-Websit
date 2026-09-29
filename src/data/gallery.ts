export interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  cat: string;
}

export const galleryCategories = ["All", "Our Brands", "Community", "Educational Activities", "Corporate Events", "Graduation"];

export const galleryPhotos: GalleryPhoto[] = [
  { id: 1, src: "/logos/opt/glry01.jpg", alt: "Mindfulness session for educators", cat: "Educational Activities" },
  { id: 2, src: "/logos/opt/glry02.jpg", alt: "Blood donation programme, Nittambuwa", cat: "Community" },
  { id: 3, src: "/logos/opt/glry03.jpg", alt: "Ma Piya Wandana ceremony honouring parents", cat: "Community" },
  { id: 4, src: "/logos/opt/glry04.jpg", alt: "Bizz Talks — a milestone for Sri Lanka's private sector", cat: "Corporate Events" },
  { id: 5, src: "/logos/opt/glry05.jpg", alt: "BWIS dancers, All Island Dance Competition 2026", cat: "Educational Activities" },
  { id: 6, src: "/logos/opt/glry06.jpg", alt: "HOD one-on-one programme", cat: "Corporate Events" },
  { id: 7, src: "/logos/opt/glry07.jpg", alt: "Empowering educators 2026", cat: "Educational Activities" },
  { id: 8, src: "/logos/opt/glry08.jpg", alt: "“Manamala Katha” premiere by Emika Productions", cat: "Corporate Events" },
  { id: 9, src: "/logos/opt/glry09.jpg", alt: "HOD strategic review meeting", cat: "Corporate Events" },
  { id: 10, src: "/logos/opt/glry10.jpg", alt: "Management strategy workshop", cat: "Corporate Events" },
  { id: 11, src: "/logos/opt/glry11.jpg", alt: "Convocation ceremony 2026, Galle–Matara branch", cat: "Graduation" },
  { id: 12, src: "/logos/opt/glry12.jpg", alt: "British Way branch managers meeting 2026", cat: "Corporate Events" },
  { id: 13, src: "/logos/opt/britishway.jpg", alt: "British Way English Academy, Nittambuwa", cat: "Our Brands" },
  { id: 14, src: "/logos/opt/bwisschool.jpg", alt: "British Way International School", cat: "Our Brands" },
  { id: 15, src: "/logos/opt/bche.jpg", alt: "British Campus graduates", cat: "Our Brands" },
  { id: 16, src: "/logos/opt/hotel.jpg", alt: "The Pharo Hotel", cat: "Our Brands" },
  { id: 17, src: "/logos/opt/emikaproduction.jpg", alt: "Emika Productions on premiere night", cat: "Our Brands" },
  { id: 18, src: "/logos/opt/aboutus.jpg", alt: "Dr. Shantha Geethadewa addressing the group", cat: "Our Brands" },
];

export function getGalleryPreview(count = 6): GalleryPhoto[] {
  return galleryPhotos.slice(0, count);
}
