type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  image: string;
};

export function PageHero({ eyebrow, title, subtitle, image }: Props) {
  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-river/90 via-river/55 to-river/30" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
        {eyebrow && (
          <span className="inline-block mb-4 py-1 px-3 border border-stone/40 rounded-full text-stone text-xs uppercase tracking-[0.2em] bg-stone/10 backdrop-blur-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
            {eyebrow}
          </span>
        )}
        <h1 className="font-serif text-5xl md:text-7xl text-stone leading-[0.95] max-w-3xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-stone text-lg md:text-xl mt-6 max-w-2xl font-light leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
