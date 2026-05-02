import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  if (project.richDetail) {
    const detail = project.richDetail;

    return (
      <main className="relative min-h-screen overflow-hidden bg-black font-mono text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.11)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_56%)]" />

        <article className="route-enter relative z-10 mx-auto w-full max-w-[1040px] px-6 pt-36 pb-16 md:px-8 lg:pt-40 lg:pb-24">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[1.05rem] text-white/52 transition-colors hover:text-white/78"
          >
            <span aria-hidden>←</span>
            <span>Back to Projects</span>
          </Link>

          <div className="relative mt-7 h-[260px] overflow-hidden rounded-[24px] border border-white/12 bg-black/70 md:h-[420px] lg:h-[560px]">
            <Image
              src={project.coverImage}
              alt={`${project.title} cover`}
              fill
              priority
              className="object-cover opacity-88"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_64%)]" />
          </div>

          <header className="mt-8 max-w-3xl md:mt-10">
            <h1 className="text-5xl leading-none tracking-[0.02em] text-white md:text-7xl">
              {detail.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 md:text-[2rem] md:leading-[1.45]">
              {detail.heroSubtitle}
            </p>
          </header>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-10">
            <div className="space-y-11">
              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">Overview</h2>
                <div className="mt-5 space-y-5 text-base leading-8 text-white/78 md:text-[1.06rem]">
                  {detail.overview.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {detail.overviewHighlight ? (
                  <p className="mt-6 rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-4 text-[0.95rem] leading-7 text-white/76">
                    {detail.overviewHighlight}
                  </p>
                ) : null}
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">How It Works</h2>
                <CodePanel content={detail.howItWorksFlow} className="mt-5" />
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">Architecture</h2>
                <CodePanel content={detail.architectureTree} className="mt-5" />
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">Datasets</h2>
                <div className="mt-5 space-y-4">
                  {detail.datasets.map((dataset) => (
                    <article
                      key={dataset.name}
                      className="rounded-2xl border border-white/12 bg-white/[0.03] p-5"
                    >
                      <h3 className="text-base leading-7 text-white">{dataset.name}</h3>
                      <p className="mt-1 text-sm leading-7 text-white/72">{dataset.description}</p>
                      <Link
                        href={dataset.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm text-white/90 underline decoration-white/35 underline-offset-4 transition-colors hover:text-white"
                      >
                        Open dataset
                      </Link>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">Setup</h2>
                <article className="mt-5 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
                  <p className="text-xs tracking-[0.14em] text-white/48 uppercase">Prerequisites</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-white/78">
                    {detail.setup.prerequisites.map((item) => (
                      <li key={item} className="pl-4 before:-ml-4 before:mr-2 before:text-white/58 before:content-['-']">
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
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">
                  Decision Engine
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/76">{detail.decisionMaking.cadence}</p>
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
                <p className="mt-5 text-sm leading-7 text-white/66">
                  Investigation decisions and outputs are logged to keep system behavior inspectable
                  and explainable.
                </p>
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">
                  Decision Triggers
                </h2>
                <ul className="mt-5 space-y-2 text-sm leading-7 text-white/78">
                  {detail.decisionTriggers.map((trigger) => (
                    <li
                      key={trigger}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5"
                    >
                      {trigger}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">
                  Opponent Modeling
                </h2>
                <ul className="mt-5 space-y-2 text-sm leading-7 text-white/78">
                  {detail.opponentModeling.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-[2rem] tracking-[0.01em] text-white md:text-[2.45rem]">Metrics</h2>
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03]">
                  {detail.metrics.map((metric, index) => (
                    <div
                      key={metric.metric}
                      className={`grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-3 text-sm leading-7 md:px-5 ${
                        index === 0 ? "" : "border-t border-white/10"
                      }`}
                    >
                      <p className="text-white/80">{metric.metric}</p>
                      <p className="text-right text-white">{metric.target}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-amber-300/25 bg-amber-300/5 p-5">
                <h2 className="text-[1.45rem] tracking-[0.01em] text-amber-100">Disclaimer</h2>
                <p className="mt-3 text-sm leading-7 text-amber-100/82">{detail.disclaimer}</p>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <section className="rounded-[22px] border border-white/12 bg-[rgba(12,12,12,0.9)] p-6">
                <p className="text-xs tracking-[0.16em] text-white/45 uppercase">Links</p>
                {detail.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block rounded-xl bg-white px-4 py-3 text-center text-lg text-black transition-colors hover:bg-white/88"
                  >
                    {link.label}
                  </Link>
                ))}
              </section>

              <section className="rounded-[22px] border border-white/12 bg-[rgba(12,12,12,0.9)] p-6">
                <h2 className="text-[1.8rem] leading-none tracking-[0.01em] text-white">Tech Stack</h2>
                <div className="mt-5 space-y-4">
                  {detail.techStackGroups.map((group) => (
                    <div key={group.title}>
                      <p className="mb-2 text-[10px] tracking-[0.16em] text-white/38 uppercase">
                        {group.title}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-[8px] border border-white/14 bg-white/[0.03] px-2.5 py-1 text-[0.81rem] text-white/86"
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
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <article className="route-enter relative z-10 mx-auto w-full max-w-[1040px] px-6 pt-28 pb-16 md:px-8">
        <header className="mb-8 border border-white/15 bg-black/45 p-6 backdrop-blur-sm md:p-8">
          <p className="font-mono text-xs tracking-[0.16em] text-white/55 uppercase">
            {project.dateLabel}
          </p>
          <h1 className="mt-3 font-heading text-5xl tracking-[0.12em] md:text-7xl">
            {project.title}
          </h1>
          <p className="mt-4 font-mono text-base leading-8 text-white/75">{project.description}</p>
        </header>

        <div className="relative mb-8 h-72 overflow-hidden rounded-3xl border border-white/15 bg-black/70 md:h-[28rem]">
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            fill
            priority
            className="object-cover opacity-85"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_65%)]" />
        </div>

        <section className="mb-8 border border-white/15 bg-black/40 p-6 backdrop-blur-sm md:p-8">
          <h2 className="font-mono text-sm tracking-[0.14em] text-white uppercase">Overview</h2>
          <p className="mt-4 font-mono text-base leading-8 text-white/75">
            {project.fullDescription}
          </p>
        </section>

        <section className="border border-white/15 bg-black/40 p-6 backdrop-blur-sm md:p-8">
          <h2 className="font-mono text-sm tracking-[0.14em] text-white uppercase">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-sm text-white/80"
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

type CodePanelProps = {
  content: string;
  label?: string;
  className?: string;
};

function CodePanel({ content, label, className }: CodePanelProps) {
  return (
    <article className={`rounded-2xl border border-white/12 bg-white/[0.03] p-5 ${className ?? ""}`}>
      {label ? (
        <p className="mb-3 text-xs tracking-[0.14em] text-white/45 uppercase">{label}</p>
      ) : null}
      <pre className="overflow-x-auto text-[0.82rem] leading-6 text-white/82">
        <code>{content}</code>
      </pre>
    </article>
  );
}

type SetupBlockProps = {
  title: string;
  command: string;
};

function SetupBlock({ title, command }: SetupBlockProps) {
  return (
    <article className="mt-5 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
      <p className="text-xs tracking-[0.14em] text-white/48 uppercase">{title}</p>
      <pre className="mt-3 overflow-x-auto text-[0.82rem] leading-6 text-white/82">
        <code>{command}</code>
      </pre>
    </article>
  );
}
