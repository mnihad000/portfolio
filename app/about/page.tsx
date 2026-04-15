import type { Metadata } from "next";
import { aboutPageContent, type RichParagraph } from "@/lib/about";

export const metadata: Metadata = {
  title: "About | Mohammed Nihad",
  description:
    "About page for Mohammed Nihad with current status, technical focus, and curated tech stack.",
};

function renderRichParagraph(paragraph: RichParagraph) {
  return paragraph.map((segment, index) => (
    <span
      key={`${segment.text}-${index}`}
      className={segment.strong ? "font-semibold text-white" : "text-white/78"}
    >
      {segment.text}
    </span>
  ));
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.15]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.07]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_48%)]" />

      <section className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pt-24 pb-16 md:px-8 lg:pt-28 lg:pb-20">
        <div className="about-enter mb-8 md:mb-10">
          <h1 className="font-heading text-[clamp(3.9rem,10vw,6.6rem)] leading-none tracking-[0.04em] text-white">
            {aboutPageContent.title}
          </h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)_320px] xl:items-start xl:gap-8">
          <aside className="about-enter" style={{ animationDelay: "60ms" }}>
            <div className="overflow-hidden rounded-[22px] border border-white/16 bg-[#101010]">
              <div className="relative aspect-[0.86] overflow-hidden bg-[linear-gradient(180deg,#2a2a2a_0%,#141414_100%)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
                <div className="pointer-events-none absolute inset-x-[16%] top-[10%] h-[42%] rounded-[2rem] bg-white/8 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
                <div className="pointer-events-none absolute inset-x-[18%] top-[14%] h-[48%] rounded-full bg-white/7 blur-2xl" />
                <div className="pointer-events-none absolute left-[22%] right-[22%] bottom-[16%] top-[38%] rounded-[2rem] border border-white/8" />
                <div className="absolute inset-x-0 bottom-4 text-center">
                  <p className="font-mono text-[9px] tracking-[0.18em] text-white/55 uppercase">
                    Portrait Placeholder
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="about-enter min-w-0" style={{ animationDelay: "120ms" }}>
            <div className="space-y-6">
              {aboutPageContent.heroParagraphs.map((paragraph, index) => (
                <p
                  key={`hero-${index}`}
                  className="max-w-3xl font-mono text-[clamp(1.2rem,1.7vw,1.7rem)] leading-[1.65] tracking-[-0.015em]"
                >
                  {renderRichParagraph(paragraph)}
                </p>
              ))}
            </div>
          </div>

          <aside className="about-enter flex flex-col gap-4" style={{ animationDelay: "180ms" }}>
            {aboutPageContent.statuses.map((status) => {
              const toneClasses =
                status.tone === "success"
                  ? "border-emerald-500/40 bg-[rgba(8,18,13,0.84)]"
                  : "border-amber-500/38 bg-[rgba(24,16,8,0.82)]";
              const dotClasses =
                status.tone === "success"
                  ? "bg-emerald-300"
                  : "bg-amber-300";

              return (
                <article
                  key={status.title}
                  className={`overflow-hidden rounded-[18px] border px-4 py-3.5 ${toneClasses}`}
                >
                  <div className="mb-2.5 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] text-white/62 uppercase">
                    <span className={`h-2 w-2 rounded-full ${dotClasses}`} />
                    <span>{status.label}</span>
                  </div>
                  <h2 className="font-mono text-[0.98rem] leading-6 text-white">
                    {status.title}
                  </h2>
                  <p className="mt-2 font-mono text-[0.84rem] leading-6 text-white/60">
                    {status.description}
                  </p>
                  {status.ctaLabel && status.ctaHref ? (
                    <a
                      href={status.ctaHref}
                      className="mt-3 inline-flex items-center font-mono text-[0.95rem] text-white transition-colors hover:text-white/80"
                    >
                      {status.ctaLabel}
                    </a>
                  ) : null}
                </article>
              );
            })}

            <section className="overflow-hidden rounded-[20px] border border-white/12 bg-[rgba(14,14,14,0.88)] p-4">
              <h2 className="font-mono text-[1.65rem] tracking-[-0.03em] text-white">
                Tech Stack
              </h2>

              <div className="mt-5 space-y-4">
                {aboutPageContent.skillGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
                      {group.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-[8px] border border-white/16 px-2.5 py-1 font-mono text-[0.82rem] text-white/86"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
