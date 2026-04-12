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
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <article className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10">
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
