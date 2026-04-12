import Image from "next/image";
import type { LucideIcon } from "lucide-react";

type FeatureItem = {
  title: string;
  description: string;
};

type ImageItem = {
  title: string;
  subtitle: string;
  imageUrl: string;
};

type PortfolioSectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: FeatureItem[];
  gallery?: ImageItem[];
};

export default function PortfolioSectionPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  features,
  gallery = [],
}: PortfolioSectionPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10">
        <header className="mb-10 border border-white/15 bg-black/45 p-6 backdrop-blur-sm md:p-8">
          <div className="mb-4 flex items-center gap-3 text-white/65">
            <Icon className="h-4 w-4" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
              {eyebrow}
            </span>
          </div>
          <h1 className="font-heading text-5xl tracking-[0.12em] md:text-7xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-7 text-white/70 md:text-base">
            {description}
          </p>
        </header>

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="border border-white/15 bg-black/40 p-5 backdrop-blur-sm"
            >
              <h2 className="font-mono text-sm tracking-[0.16em] text-white uppercase">
                {feature.title}
              </h2>
              <p className="mt-3 font-mono text-sm leading-6 text-white/65">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {gallery.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden border border-white/15 bg-black/40 backdrop-blur-sm"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-44 w-full object-cover opacity-85"
                  width={1200}
                  height={880}
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-mono text-sm tracking-[0.14em] uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-white/60">
                    {item.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
