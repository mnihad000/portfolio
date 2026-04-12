import { FolderKanban } from "lucide-react";
import ProjectCard from "@/components/ui/project-card";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10">
        <header className="mb-10 border border-white/15 bg-black/45 p-6 backdrop-blur-sm md:p-8">
          <div className="mb-4 flex items-center gap-3 text-white/65">
            <FolderKanban className="h-4 w-4" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Work Index</span>
          </div>
          <h1 className="font-heading text-5xl tracking-[0.12em] md:text-7xl">Projects</h1>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-7 text-white/70 md:text-base">
            Selected engineering work with dedicated detail pages.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
