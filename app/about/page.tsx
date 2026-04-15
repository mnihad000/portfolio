import type { CSSProperties } from "react";
import type { Metadata } from "next";
import AboutTechStackRail from "@/components/ui/about-tech-stack-rail";
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
      className={segment.strong ? "font-semibold" : ""}
      style={{
        color: segment.strong
          ? "var(--portfolio-ink)"
          : "var(--portfolio-ink-muted)",
      }}
    >
      {segment.text}
    </span>
  ));
}

function withAboutDelay(delay: string): CSSProperties {
  return {
    ["--about-delay" as string]: delay,
  };
}

export default function AboutPage() {
  return (
    <main className="portfolio-page isolate">
      <div className="about-ambient-grid pointer-events-none absolute inset-0 portfolio-overlay-grid" />
      <div className="about-ambient-scan pointer-events-none absolute inset-0 portfolio-overlay-scan" />
      <div className="about-ambient-light pointer-events-none absolute inset-0 portfolio-overlay-glow" />
      <div
        className="about-ambient-light pointer-events-none absolute -top-24 right-[16%] h-48 w-48 rounded-full blur-3xl"
        style={{ background: "var(--portfolio-accent-glow)" }}
      />

      <section className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pt-24 pb-16 md:px-8 lg:pt-28 lg:pb-20">
        <div className="about-enter mb-8 md:mb-10" style={withAboutDelay("0ms")}>
          <h1 className="font-heading text-[clamp(3.9rem,10vw,6.6rem)] leading-none tracking-[0.04em]">
            {aboutPageContent.title}
          </h1>

          <div
            className="about-system-strip about-enter portfolio-panel-strong mt-4 max-w-[340px] rounded-[16px] px-4 py-3"
            style={withAboutDelay("50ms")}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="about-system-led" />
                <span className="about-system-led" />
                <span className="about-system-led about-system-led-active" />
              </div>
              <span
                className="font-mono text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "var(--portfolio-ink-faint)" }}
              >
                system ready
              </span>
            </div>

            <div
              className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "var(--portfolio-ink-faint)" }}
            >
              <span className="about-system-phase" style={withAboutDelay("110ms")}>
                init
              </span>
              <span style={{ color: "var(--portfolio-border-strong)" }}>{">"}</span>
              <span className="about-system-phase" style={withAboutDelay("220ms")}>
                calibrating
              </span>
              <span style={{ color: "var(--portfolio-border-strong)" }}>{">"}</span>
              <span className="about-system-phase" style={withAboutDelay("340ms")}>
                ready
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-[2px] flex-1 overflow-hidden rounded-full"
                style={{ background: "var(--portfolio-border)" }}
              >
                <span
                  className="about-system-progress block h-full w-0"
                  style={{ background: "var(--portfolio-accent-strong)" }}
                />
              </div>
              <span
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{ color: "var(--portfolio-ink-faint)" }}
              >
                synced
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)_320px] xl:items-start xl:gap-8">
          <aside className="about-enter" style={withAboutDelay("80ms")}>
            <div className="about-portrait-shell portfolio-panel-strong overflow-hidden rounded-[22px]">
              <div
                className="about-portrait-surface relative aspect-[0.86] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, var(--portfolio-panel-solid) 0%, var(--portfolio-panel-bg) 100%)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 45%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-[16%] top-[10%] h-[42%] rounded-[2rem] blur-3xl"
                  style={{ background: "var(--portfolio-accent-glow)" }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(22,27,34,0.28) 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-[18%] top-[14%] h-[48%] rounded-full blur-2xl"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                />
                <div
                  className="pointer-events-none absolute left-[22%] right-[22%] bottom-[16%] top-[38%] rounded-[2rem] border"
                  style={{ borderColor: "var(--portfolio-border)" }}
                />
                <div className="about-portrait-shimmer pointer-events-none absolute inset-y-0 -left-[42%] w-[38%]" />
                <div className="absolute inset-x-0 bottom-4 text-center">
                  <p
                    className="font-mono text-[9px] tracking-[0.18em] uppercase"
                    style={{ color: "var(--portfolio-ink-faint)" }}
                  >
                    Portrait Placeholder
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="space-y-6">
              {aboutPageContent.heroParagraphs.map((paragraph, index) => (
                <p
                  key={`hero-${index}`}
                  className="about-enter max-w-3xl font-mono text-[clamp(1.2rem,1.7vw,1.7rem)] leading-[1.65] tracking-[-0.015em]"
                  style={withAboutDelay(`${240 + index * 85}ms`)}
                >
                  {renderRichParagraph(paragraph)}
                </p>
              ))}
            </div>
          </div>

          <aside className="about-enter flex flex-col gap-4" style={withAboutDelay("300ms")}>
              {aboutPageContent.statuses.map((status) => {
                const toneClasses =
                  status.tone === "success"
                    ? "border-[color:var(--portfolio-success-border)] bg-[color:var(--portfolio-success-bg)]"
                    : "border-[color:var(--portfolio-warning-border)] bg-[color:var(--portfolio-warning-bg)]";
                const dotClasses =
                  status.tone === "success"
                    ? "bg-[color:var(--portfolio-success)]"
                    : "bg-[color:var(--portfolio-warning)]";

              return (
                <article
                  key={status.title}
                  className={`about-status-card overflow-hidden rounded-[18px] border px-4 py-3.5 ${toneClasses}`}
                >
                  <span className="about-rail-intro-scan about-rail-intro-scan-soft pointer-events-none absolute inset-y-0 -left-[34%] w-[30%]" />
                  <span
                    className={`about-status-pulse ${
                      status.tone === "success"
                        ? "about-status-pulse-success"
                        : "about-status-pulse-warning"
                    }`}
                  />
                  <div
                    className="mb-2.5 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] uppercase"
                    style={{ color: "var(--portfolio-ink-muted)" }}
                  >
                    <span className={`h-2 w-2 rounded-full ${dotClasses}`} />
                    <span>{status.label}</span>
                  </div>
                  <h2 className="font-mono text-[0.98rem] leading-6">
                    {status.title}
                  </h2>
                  <p
                    className="mt-2 font-mono text-[0.84rem] leading-6"
                    style={{ color: "var(--portfolio-ink-muted)" }}
                  >
                    {status.description}
                  </p>
                  {status.ctaLabel && status.ctaHref ? (
                    <a
                      href={status.ctaHref}
                      className="about-inline-cta mt-3 inline-flex items-center gap-1 font-mono text-[0.95rem] transition-colors"
                      style={{ color: "var(--portfolio-ink)" }}
                    >
                      <span>{status.ctaLabel}</span>
                      <span className="about-inline-arrow">-&gt;</span>
                    </a>
                  ) : null}
                </article>
              );
            })}

            <AboutTechStackRail skillGroups={aboutPageContent.skillGroups} />
          </aside>
        </div>
      </section>
    </main>
  );
}
