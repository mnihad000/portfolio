import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const visibleTechnologies = project.technologies.slice(0, 3);
  const remainingTechnologies = project.technologies.length - visibleTechnologies.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-[2rem] border border-white/15 bg-black/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="relative h-56 overflow-hidden border-b border-white/10 bg-black/80 md:h-64">
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          fill
          priority={false}
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
      </div>

      <article className="space-y-4 p-6 md:p-8">
        <div className="space-y-2">
          <h2 className="font-heading text-4xl tracking-[0.08em] text-white md:text-5xl">
            {project.title}
          </h2>
          <p className="font-mono text-xs tracking-[0.15em] text-white/50 uppercase">
            {project.dateLabel}
          </p>
        </div>

        <p className="font-mono text-lg leading-8 text-white/75">{project.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          {visibleTechnologies.map((technology) => (
            <span
              key={technology}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-sm text-white/80"
            >
              {technology}
            </span>
          ))}
          {remainingTechnologies > 0 ? (
            <span className="rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-sm text-white/50">
              +{remainingTechnologies}
            </span>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
