export type Project = {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  dateLabel: string;
  technologies: string[];
  coverImage: string;
};

export const projects: Project[] = [
  {
    slug: "rhetoriq",
    title: "Rhetoriq",
    description:
      "AI rhetoric workspace for drafting, refining, and evaluating persuasive writing with real-time feedback loops.",
    fullDescription:
      "Rhetoriq is a long-form writing platform focused on argument quality and clarity. The system blends structured drafting with AI guidance so users can iterate on thesis framing, supporting evidence, and rhetorical flow in one place. The current implementation includes a project workspace, revision checkpoints, and contextual feedback that helps tighten reasoning without flattening voice.",
    dateLabel: "APRIL 2026",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI API"],
    coverImage: "/projects/rhetoriq-cover.svg",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
