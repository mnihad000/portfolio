import LightProjectCard from "@/components/ui/light-project-card";
import { projects } from "@/lib/projects";

export default function LightModeProjectsPage() {
  return (
    <main className="min-h-screen bg-[#f6f2eb] text-neutral-950">
      <section className="mx-auto w-full max-w-[1240px] px-6 pb-16 pt-32 md:px-10 lg:pt-36">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-6xl">
            Light Mode Projects
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-neutral-500 md:text-xl">
            The same project catalog, but with dedicated light-mode detail pages and stable
            nested routing.
          </p>
        </header>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <LightProjectCard
              key={project.slug}
              project={project}
              index={index}
              total={projects.length}
              priority={index === 0}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
