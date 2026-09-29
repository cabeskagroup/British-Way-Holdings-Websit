export interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  cat: string;
}

export const galleryCategories = ["All", "Corporate Events", "Educational Activities", "Graduation", "Community"];

export const galleryPhotos: GalleryPhoto[] = [
  { id: 1, src: "/logos/glry01.jpg", alt: "Mindfulness session for educators", cat: "Educational Activities" },
  { id: 2, src: "/logos/glry02.jpg", alt: "Blood donation programme", cat: "Community" },
  { id: 3, src: "/logos/glry03.jpg", alt: "Ma Piya Wandana ceremony honouring parents", cat: "Community" },
  { id: 4, src: "/logos/glry04.jpg", alt: "Bizz Talks — a milestone for Sri Lanka's private sector", cat: "Corporate Events" },
  { id: 5, src: "/logos/glry05.jpg", alt: "All-island dance competition", cat: "Educational Activities" },
  { id: 6, src: "/logos/glry06.jpg", alt: "HOD one-on-one programme", cat: "Corporate Events" },
  { id: 7, src: "/logos/glry07.jpg", alt: "Empowering educators 2026", cat: "Educational Activities" },
  { id: 8, src: "/logos/glry08.jpg", alt: "A proud premiere by Emika Productions", cat: "Corporate Events" },
  { id: 9, src: "/logos/glry09.jpg", alt: "HOD strategic review meeting", cat: "Corporate Events" },
  { id: 10, src: "/logos/glry10.jpg", alt: "Management strategy workshop", cat: "Corporate Events" },
  { id: 11, src: "/logos/glry11.jpg", alt: "Annual convocation ceremony", cat: "Graduation" },
  { id: 12, src: "/logos/glry12.jpg", alt: "British Way branch managers meeting 2026", cat: "Corporate Events" },
];

export function getGalleryPreview(count = 6): GalleryPhoto[] {
  return galleryPhotos.slice(0, count);
}
