import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";

type LightProjectDetailPageProps = {
  project: Project;
};

export default function LightProjectDetailPage({
  project,
}: LightProjectDetailPageProps) {
  const detail = project.richDetail;

  if (detail) {
    return (
      <main className="min-h-screen bg-[#f6f2eb] text-neutral-950">
        <article className="mx-auto w-full max-w-[1120px] px-6 pb-20 pt-32 md:px-8 lg:pt-36">
          <BackToProjectsLink />

          <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
            <div className="relative h-[260px] md:h-[420px] lg:h-[560px]">
              <Image
                src={project.coverImage}
                alt={`${project.title} cover`}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_64%)]" />
          </div>

          <header className="mt-10 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">
              {project.dateLabel}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              {detail.heroTitle}
            </h1>
            <p className="mt-5 text-lg leading-9 text-neutral-600 md:text-[1.55rem] md:leading-[1.55]">
              {detail.heroSubtitle}
            </p>
          </header>

          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-8">
              <ContentSection title="Overview">
                <div className="space-y-5 text-base leading-8 text-neutral-700">
                  {detail.overview.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {detail.overviewHighlight ? (
                  <p className="mt-6 rounded-[1.5rem] border border-black/8 bg-[#fff8ed] px-5 py-4 text-sm leading-7 text-neutral-700">
                    {detail.overviewHighlight}
                  </p>
                ) : null}
              </ContentSection>

              <ContentSection title="How It Works">
                <CodePanel content={detail.howItWorksFlow} />
              </ContentSection>

              <ContentSection title="Architecture">
                <CodePanel content={detail.architectureTree} />
              </ContentSection>

              <ContentSection title="Datasets">
                <div className="space-y-4">
                  {detail.datasets.map((dataset) => (
                    <article
                      key={dataset.name}
                      className="rounded-[1.5rem] border border-black/8 bg-white p-5"
                    >
                      <h3 className="text-base font-medium text-neutral-900">{dataset.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-neutral-600">
                        {dataset.description}
                      </p>
                      <Link
                        href={dataset.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm font-medium text-[#d65a12] transition-colors hover:text-[#b94b0c]"
                      >
                        Open dataset
                      </Link>
                    </article>
                  ))}
                </div>
              </ContentSection>

              <ContentSection title="Setup">
                <article className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                    Prerequisites
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-neutral-700">
                    {detail.setup.prerequisites.map((item) => (
                      <li key={item} className="pl-4 before:-ml-4 before:mr-2 before:content-['-']">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <SetupBlock title="Installation" command={detail.setup.installation} />
                <SetupBlock title="Environment" command={detail.setup.environment} />
                <SetupBlock title="Connect Services" command={detail.setup.connect} />
                <SetupBlock title="Model Setup" command={detail.setup.downloadModels} />
                <SetupBlock title="Run Services" command={detail.setup.run} />
              </ContentSection>

              <ContentSection title="Decision Engine">
                <p className="text-sm leading-7 text-neutral-600">{detail.decisionMaking.cadence}</p>
                <div className="mt-5 grid gap-5 xl:grid-cols-2">
                  <CodePanel
                    label="State Snapshot (Input)"
                    content={detail.decisionMaking.requestSample}
                  />
                  <CodePanel
                    label="Structured Action (Output)"
                    content={detail.decisionMaking.responseSample}
                  />
                </div>
              </ContentSection>

              <ContentSection title="Decision Triggers">
                <ul className="space-y-2">
                  {detail.decisionTriggers.map((trigger) => (
                    <li
                      key={trigger}
                      className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-3 text-sm leading-7 text-neutral-700"
                    >
                      {trigger}
                    </li>
                  ))}
                </ul>
              </ContentSection>

              <ContentSection title="Opponent Modeling">
                <ul className="space-y-2">
                  {detail.opponentModeling.map((item) => (
                    <li
                      key={item}
                      className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-3 text-sm leading-7 text-neutral-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </ContentSection>

              <ContentSection title="Metrics">
                <div className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-white">
                  {detail.metrics.map((metric, index) => (
                    <div
                      key={metric.metric}
                      className={`grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-3 text-sm leading-7 md:px-5 ${
                        index === 0 ? "" : "border-t border-black/8"
                      }`}
                    >
                      <p className="text-neutral-600">{metric.metric}</p>
                      <p className="text-right font-medium text-neutral-900">{metric.target}</p>
                    </div>
                  ))}
                </div>
              </ContentSection>

              <section className="rounded-[1.75rem] border border-[#d65a12]/18 bg-[#fff4e8] p-5">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Disclaimer
                </h2>
                <p className="mt-3 text-sm leading-7 text-neutral-700">{detail.disclaimer}</p>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <section className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Links</p>
                <div className="mt-4 space-y-3">
                  {detail.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-black/10 bg-neutral-950 px-4 py-3 text-center text-sm font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-800"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Tech Stack
                </h2>
                <div className="mt-5 space-y-4">
                  {detail.techStackGroups.map((group) => (
                    <div key={group.title}>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                        {group.title}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-[10px] border border-black/8 bg-[#f6f2eb] px-2.5 py-1 text-[0.81rem] text-neutral-700"
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
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f2eb] text-neutral-950">
      <article className="mx-auto w-full max-w-[1040px] px-6 pb-16 pt-32 md:px-8">
        <BackToProjectsLink />

        <header className="mt-8 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
            {project.dateLabel}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-neutral-600">{project.description}</p>
        </header>

        <div className="relative mt-8 h-72 overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:h-[28rem]">
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            fill
            priority
            className="object-cover"
          />
        </div>

        <section className="mt-8 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-8">
          <h2 className="text-sm uppercase tracking-[0.16em] text-neutral-500">Overview</h2>
          <p className="mt-4 text-base leading-8 text-neutral-700">
            {project.fullDescription}
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-8">
          <h2 className="text-sm uppercase tracking-[0.16em] text-neutral-500">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-xl border border-black/10 bg-[#f6f2eb] px-3 py-1.5 text-sm text-neutral-700"
              >
                {technology}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}

function BackToProjectsLink() {
  return (
    <Link
      href="/lightmode/projects"
      className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-neutral-900"
    >
      <span aria-hidden>&larr;</span>
      <span>Back to Projects</span>
    </Link>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CodePanel({
  content,
  label,
}: {
  content: string;
  label?: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
      {label ? (
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      ) : null}
      <pre className="overflow-x-auto text-[0.82rem] leading-6 text-neutral-700">
        <code>{content}</code>
      </pre>
    </article>
  );
}

function SetupBlock({ title, command }: { title: string; command: string }) {
  return (
    <article className="mt-5 rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
      <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">{title}</p>
      <pre className="mt-3 overflow-x-auto text-[0.82rem] leading-6 text-neutral-700">
        <code>{command}</code>
      </pre>
    </article>
  );
}
