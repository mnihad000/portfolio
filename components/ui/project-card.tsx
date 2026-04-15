import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  imageLoading?: "eager" | "lazy";
  imagePriority?: boolean;
};

export default function ProjectCard({
  project,
  imageLoading = "lazy",
  imagePriority = false,
}: ProjectCardProps) {
  const visibleTechnologies = project.technologies.slice(0, 3);
  const remainingTechnologies = project.technologies.length - visibleTechnologies.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="portfolio-panel-strong group block w-full max-w-[410px] overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-0.5 xl:max-w-[400px]"
      style={{ boxShadow: "var(--portfolio-shadow-soft)" }}
    >
      <div
        className="relative h-[210px] overflow-hidden border-b"
        style={{
          borderColor: "var(--portfolio-border)",
          background: "var(--portfolio-panel-solid)",
        }}
      >
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          fill
          loading={imageLoading}
          priority={imagePriority}
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, var(--portfolio-glow), transparent 60%)",
          }}
        />
      </div>

      <article className="flex h-[315px] flex-col gap-3 overflow-hidden p-5 md:h-[325px] md:p-6">
        <div className="space-y-2">
          <h2
            className="font-heading text-3xl leading-tight tracking-[0.08em] md:text-4xl"
            style={{ color: "var(--portfolio-ink)" }}
          >
            {project.title}
          </h2>
          <p
            className="font-mono text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--portfolio-ink-faint)" }}
          >
            {project.dateLabel}
          </p>
        </div>

        <p
          className="overflow-hidden font-mono text-base leading-7 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]"
          style={{ color: "var(--portfolio-ink-muted)" }}
        >
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {visibleTechnologies.map((technology) => (
            <span key={technology} className="portfolio-chip rounded-xl px-2.5 py-1 font-mono text-xs">
              {technology}
            </span>
          ))}
          {remainingTechnologies > 0 ? (
            <span className="portfolio-chip-muted rounded-xl px-2.5 py-1 font-mono text-xs">
              +{remainingTechnologies}
            </span>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
