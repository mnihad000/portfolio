import { notFound } from "next/navigation";
import LightProjectDetailPage from "@/components/ui/light-project-detail-page";
import { getProjectBySlug, projects } from "@/lib/projects";

type LightProjectDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function LightProjectDetailRoute({
  params,
}: LightProjectDetailRouteProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <LightProjectDetailPage project={project} />;
}
