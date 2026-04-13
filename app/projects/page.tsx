import ProjectCard from "@/components/ui/project-card";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pt-28 pb-16 md:px-10">
        <header className="mb-14 space-y-5 text-center">
          <h1 className="font-heading text-5xl tracking-[0.12em] md:text-7xl">projects</h1>
          <p className="mx-auto max-w-3xl font-mono text-sm leading-8 text-white/70 md:text-base">
            Selected engineering work with dedicated detail pages.
          </p>
        </header>

        <div className="mx-auto grid max-w-[1360px] justify-items-center gap-8 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              imageLoading={index === 0 ? "eager" : "lazy"}
              imagePriority={index === 0}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
