import type { CSSProperties } from "react";
import AboutTechStackRail from "@/components/ui/about-tech-stack-rail";
import { aboutPageContent, type RichParagraph } from "@/lib/about";
import {
  formatRelativeActivityTime,
  getRecentGitHubActivity,
} from "@/lib/github-activity";

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

function withAboutDelay(delay: string): CSSProperties {
  return {
    ["--about-delay" as string]: delay,
  };
}

function formatCommitCountLabel(commitCount: number): string {
  return `Pushed ${commitCount} commit${commitCount === 1 ? "" : "s"}`;
}

function truncateCommitMessage(message: string, maxLength = 92): string {
  const trimmed = message.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1)}...`;
}

export default async function AboutSection() {
  const recentGitHubActivity = await getRecentGitHubActivity(5);

  return (
    <section
      id="about"
      className="relative min-h-screen scroll-mt-28 overflow-hidden bg-black text-white isolate"
    >
      <div className="about-ambient-grid pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="about-ambient-scan pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="about-ambient-light pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="about-ambient-light pointer-events-none absolute -top-24 right-[16%] h-48 w-48 rounded-full bg-emerald-300/3 blur-3xl" />

      <section className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pt-24 pb-16 md:px-8 lg:pt-28 lg:pb-20">
        <div className="about-enter mb-8 md:mb-10" style={withAboutDelay("0ms")}>
          <h1 className="font-heading text-[clamp(3.9rem,10vw,6.6rem)] leading-none tracking-[0.04em] text-white">
            {aboutPageContent.title}
          </h1>

          <div
            className="about-system-strip about-enter mt-4 max-w-[340px] rounded-[16px] border border-white/12 bg-[rgba(12,12,12,0.78)] px-4 py-3"
            style={withAboutDelay("50ms")}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="about-system-led" />
                <span className="about-system-led" />
                <span className="about-system-led about-system-led-active" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">
                system ready
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-white/52 uppercase">
              <span className="about-system-phase" style={withAboutDelay("110ms")}>
                init
              </span>
              <span className="text-white/18">{">"}</span>
              <span className="about-system-phase" style={withAboutDelay("220ms")}>
                calibrating
              </span>
              <span className="text-white/18">{">"}</span>
              <span className="about-system-phase" style={withAboutDelay("340ms")}>
                ready
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
                <span className="about-system-progress block h-full w-0 bg-white/75" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.16em] text-white/52 uppercase">
                synced
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)_320px] xl:items-start xl:gap-8">
          <aside className="about-enter" style={withAboutDelay("80ms")}>
            <div className="about-portrait-shell overflow-hidden rounded-[22px] border border-white/16 bg-[#101010]">
              <div className="about-portrait-surface relative aspect-[0.86] overflow-hidden bg-[linear-gradient(180deg,#2a2a2a_0%,#141414_100%)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
                <div className="pointer-events-none absolute inset-x-[16%] top-[10%] h-[42%] rounded-[2rem] bg-white/8 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
                <div className="pointer-events-none absolute inset-x-[18%] top-[14%] h-[48%] rounded-full bg-white/7 blur-2xl" />
                <div className="pointer-events-none absolute left-[22%] right-[22%] bottom-[16%] top-[38%] rounded-[2rem] border border-white/8" />
                <div className="about-portrait-shimmer pointer-events-none absolute inset-y-0 -left-[42%] w-[38%]" />
                <div className="absolute inset-x-0 bottom-4 text-center">
                  <p className="font-mono text-[9px] tracking-[0.18em] text-white/55 uppercase">
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

            <section
              className="about-rail-panel about-enter relative mt-8 max-w-3xl overflow-hidden rounded-[20px] border border-white/12 bg-[rgba(14,14,14,0.88)] p-4"
              style={withAboutDelay("380ms")}
            >
              <span className="about-rail-intro-scan pointer-events-none absolute inset-y-0 -left-[34%] w-[32%]" />

              <h2 className="font-mono text-[1.3rem] tracking-[-0.02em] text-white">
                Recent GitHub Activity
              </h2>

              {recentGitHubActivity.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                  {recentGitHubActivity.map((activity) => (
                    <article
                      key={activity.id}
                      className="rounded-[12px] border border-white/10 bg-black/25 px-3 py-2.5"
                    >
                      <p className="font-mono text-[0.88rem] leading-5 text-white/88">
                        {formatCommitCountLabel(activity.commitCount)}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="truncate font-mono text-[0.68rem] tracking-[0.12em] text-white/42 uppercase">
                          {activity.repo} • {activity.branch}
                        </p>
                        <time
                          dateTime={activity.occurredAt}
                          className="shrink-0 font-mono text-[0.73rem] text-white/55"
                        >
                          {formatRelativeActivityTime(activity.occurredAt)}
                        </time>
                      </div>

                      {activity.commitsPreview.length > 0 ? (
                        <ul className="mt-2 space-y-1.5">
                          {activity.commitsPreview.map((commit) => (
                            <li
                              key={`${activity.id}-${commit.shortSha}-${commit.message}`}
                              className="grid grid-cols-[56px_minmax(0,1fr)] items-start gap-2"
                            >
                              <span className="font-mono text-[0.68rem] text-white/45">
                                {commit.shortSha}
                              </span>
                              <span className="truncate font-mono text-[0.74rem] leading-5 text-white/70">
                                {truncateCommitMessage(commit.message)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {activity.remainingCommitCount > 0 ? (
                        <p className="mt-1.5 font-mono text-[0.7rem] text-white/50">
                          +{activity.remainingCommitCount} more commit
                          {activity.remainingCommitCount === 1 ? "" : "s"}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 font-mono text-[0.83rem] leading-6 text-white/55">
                  No recent public activity available.
                </p>
              )}
            </section>
          </div>

          <aside className="about-enter flex flex-col gap-4" style={withAboutDelay("300ms")}>
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
                      className="about-inline-cta mt-3 inline-flex items-center gap-1 font-mono text-[0.95rem] text-white transition-colors hover:text-white/80"
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
    </section>
  );
}
