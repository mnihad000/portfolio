import Image from "next/image";
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

  return (
    <main className="portfolio-page">
      <div className="portfolio-overlay-grid pointer-events-none absolute inset-0" />
      <div className="portfolio-overlay-scan pointer-events-none absolute inset-0" />
      <div className="portfolio-overlay-glow pointer-events-none absolute inset-0" />

      <article className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10">
        <header className="portfolio-panel mb-8 p-6 md:p-8">
          <p
            className="font-mono text-xs tracking-[0.16em] uppercase"
            style={{ color: "var(--portfolio-ink-faint)" }}
          >
            {project.dateLabel}
          </p>
          <h1 className="mt-3 font-heading text-5xl tracking-[0.12em] md:text-7xl">
            {project.title}
          </h1>
          <p
            className="mt-4 font-mono text-base leading-8"
            style={{ color: "var(--portfolio-ink-muted)" }}
          >
            {project.description}
          </p>
        </header>

        <div
          className="portfolio-panel-strong relative mb-8 h-72 overflow-hidden rounded-3xl md:h-[28rem]"
        >
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            fill
            priority
            className="object-cover opacity-85"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top, var(--portfolio-glow), transparent 65%)",
            }}
          />
        </div>

        <section className="portfolio-panel mb-8 p-6 md:p-8">
          <h2 className="font-mono text-sm tracking-[0.14em] uppercase">Overview</h2>
          <p
            className="mt-4 font-mono text-base leading-8"
            style={{ color: "var(--portfolio-ink-muted)" }}
          >
            {project.fullDescription}
          </p>
        </section>

        <section className="portfolio-panel p-6 md:p-8">
          <h2 className="font-mono text-sm tracking-[0.14em] uppercase">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span key={technology} className="portfolio-chip rounded-xl px-3 py-1.5 font-mono text-sm">
                {technology}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
