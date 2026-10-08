import { PHOTOS } from "@/lib/site";

const TILES: { src: string; className: string }[] = [
  { src: PHOTOS.drone1, className: "col-span-2 row-span-2 aspect-square" },
  { src: PHOTOS.roque, className: "col-span-1 row-span-1 aspect-square" },
  { src: PHOTOS.domme, className: "col-span-1 row-span-1 aspect-square" },
  { src: PHOTOS.groupe, className: "col-span-2 row-span-1 aspect-[2/1]" },
  { src: PHOTOS.drone2, className: "col-span-1 row-span-1 aspect-square" },
  { src: PHOTOS.canoeFamily, className: "col-span-1 row-span-2 aspect-[1/2]" },
  { src: PHOTOS.drone3, className: "col-span-1 row-span-1 aspect-square" },
  { src: PHOTOS.drone4, className: "col-span-2 row-span-1 aspect-[2/1]" },
];

export function MosaicGallery() {
  return (
    <div className="grid grid-cols-4 auto-rows-fr gap-3">
      {TILES.map((t, i) => (
        <div key={i} className={`overflow-hidden rounded-xl ${t.className}`}>
          <img
            src={t.src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      ))}
    </div>
  );
}
