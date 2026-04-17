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
      className="group block w-full max-w-[410px] overflow-hidden rounded-3xl border border-white/15 bg-black/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:max-w-[344px]"
    >
      <div className="relative h-[210px] overflow-hidden border-b border-white/10 bg-black/80 lg:h-[178px]">
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          fill
          loading={imageLoading}
          priority={imagePriority}
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
      </div>

      <article className="flex h-[315px] flex-col gap-3 overflow-hidden p-5 md:h-[325px] md:p-6 lg:h-[268px] lg:p-5">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl leading-tight tracking-[0.08em] text-white md:text-4xl lg:text-3xl">
            {project.title}
          </h2>
          <p className="font-mono text-xs tracking-[0.15em] text-white/50 uppercase">
            {project.dateLabel}
          </p>
        </div>

        <p className="overflow-hidden font-mono text-base leading-7 text-white/75 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] lg:text-sm lg:leading-6 lg:[-webkit-line-clamp:4]">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {visibleTechnologies.map((technology) => (
            <span
              key={technology}
              className="rounded-xl border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-xs text-white/80"
            >
              {technology}
            </span>
          ))}
          {remainingTechnologies > 0 ? (
            <span className="rounded-xl border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-xs text-white/50">
              +{remainingTechnologies}
            </span>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
