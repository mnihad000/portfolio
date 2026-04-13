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
  {
    slug: "clash-royale-ai-agent",
    title: "Clash Royale AI Agent",
    description:
      "Competitive gameplay agent that analyzes board state in real time and recommends high-probability card sequences.",
    fullDescription:
      "Clash Royale AI Agent is an experimental assistant for tactical decision support during live matches. It combines match-state feature extraction with strategy scoring to suggest next moves based on elixir economy, lane pressure, and opponent cycle patterns. The current version focuses on low-latency recommendations and a clean feedback loop for evaluating win-rate impact against different archetypes.",
    dateLabel: "MARCH 2026",
    technologies: [
      "Python",
      "PyTorch",
      "Computer Vision",
      "FastAPI",
      "WebSockets",
    ],
    coverImage: "/projects/clash-royale-ai-agent-cover.svg",
  },
  {
    slug: "squeeze-ai",
    title: "Squeeze Ai",
    description:
      "AI compression workspace that distills long-form content into concise, structured outputs for faster decision-making.",
    fullDescription:
      "Squeeze Ai is a content compression and synthesis tool designed for high-volume information workflows. The system ingests long documents, transcripts, and notes, then produces layered summaries tuned for depth and reading time. It emphasizes controllable output quality with adjustable abstraction levels, making it useful for research briefings, project updates, and rapid context loading.",
    dateLabel: "FEBRUARY 2026",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL", "Prisma"],
    coverImage: "/projects/squeeze-ai-cover.svg",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
