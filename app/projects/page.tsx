import ProjectCard from "@/components/ui/project-card";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <main className="font-mono relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="route-enter relative z-10 mx-auto w-full max-w-[1500px] px-6 pt-32 pb-16 md:px-10 lg:pt-40">
        <header className="space-y-5 text-center">
          <h1 className="text-3xl tracking-[0.em] md:text-5xl">projects</h1>
          <p className="mx-auto max-w-3xl text-sm leading-8 text-white/70 md:text-base">
            Selected engineering work with dedicated detail pages.
          </p>
        </header>

        {/* Desktop tuning targets: subtitle-to-rail gap ~96px, rail width ~1260-1300px, rail gap ~40-48px. */}
        <div className="mx-auto mt-20 grid max-w-[1280px] justify-items-center gap-8 md:mt-24 lg:max-w-[1120px] lg:grid-cols-3 lg:gap-8">
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
