import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { galleryPhotos as photos, galleryCategories, type GalleryPhoto } from "@/data/gallery";
import { PageHero } from "../components/ui-luxe/PageHero";
import { SectionHeading } from "../components/ui-luxe/SectionHeading";
import { Liyawela } from "../components/ui-luxe/Heritage";
import { Reveal } from "../components/fx/Reveal";
import { GalleryHelix } from "../components/gallery/GalleryHelix";
import { Lightbox } from "../components/gallery/Lightbox";

const collections = galleryCategories.filter((c) => c !== "All");

const blurbs: Record<string, string> = {
  "Our Brands": "Campuses, stages and spaces across the family",
  Community: "Giving back and honouring family",
  "Educational Activities": "Learning beyond the classroom",
  "Corporate Events": "Leadership, strategy and milestones",
  Graduation: "Celebrating every graduate",
};

/** A fanned stack of three photos that spreads apart on hover. */
function CollectionCard({ name, items, onOpen }: { name: string; items: GalleryPhoto[]; onOpen: () => void }) {
  const fan = items.slice(0, 3);
  return (
    <button onClick={onOpen} className="group relative flex flex-col gap-6 text-left" aria-label={`Open ${name} collection`}>
      <div className="relative mx-auto h-72 w-full max-w-[20rem]">
        {fan.map((p, i) => {
          const pos = i - (fan.length - 1) / 2;
          return (
            <div
              key={p.id}
              className="absolute inset-x-8 inset-y-2 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-[0_30px_60px_-28px_rgba(20,33,63,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform:rotate(var(--r))_translateX(var(--x))] group-hover:[transform:rotate(var(--rh))_translateX(var(--xh))_translateY(-10px)]"
              style={
                {
                  zIndex: 10 - Math.abs(pos),
                  "--r": `${pos * 5}deg`,
                  "--x": `${pos * 10}px`,
                  "--rh": `${pos * 14}deg`,
                  "--xh": `${pos * 70}px`,
                } as React.CSSProperties
              }
            >
              <img src={p.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          );
        })}
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-fg/10 pt-5">
        <div>
          <p className="font-display text-xl font-semibold text-fg">{name}</p>
          <p className="mt-1 text-sm text-mist">{blurbs[name]}</p>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full border border-fg/15 px-3 py-1.5 font-display text-xs text-fg/70 transition-colors group-hover:border-gold group-hover:text-gold-hi">
          {items.length} photos <ArrowUpRight size={13} />
        </span>
      </div>
    </button>
  );
}

export function GalleryPage() {
  const [viewer, setViewer] = useState<{ list: GalleryPhoto[]; index: number } | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        crumb="Gallery"
        watermark="GALLERY"
        image="/logos/opt/glry11.jpg"
        title={
          <>
            Moments of <span className="accent">excellence.</span>
          </>
        }
        description="Ceremonies, premieres, campuses and community: a living portrait of the British Way family. Scroll to turn the spiral."
      />

      <GalleryHelix photos={photos} onOpen={(index) => setViewer({ list: photos, index })} />

      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <Liyawela className="mb-14" opacity={0.3} />
          <SectionHeading
            eyebrow="Collections"
            title={
              <>
                Explore by <span className="accent">story.</span>
              </>
            }
            description="Hover a collection to fan it open, then step inside."
          />
          <Reveal className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1} y={60}>
            {collections.map((c) => {
              const items = photos.filter((p) => p.cat === c);
              return <CollectionCard key={c} name={c} items={items} onOpen={() => setViewer({ list: items, index: 0 })} />;
            })}
          </Reveal>
        </div>
      </section>

      {viewer && (
        <Lightbox photos={viewer.list} index={viewer.index} onIndex={(index) => setViewer({ ...viewer, index })} onClose={() => setViewer(null)} />
      )}
    </>
  );
}
