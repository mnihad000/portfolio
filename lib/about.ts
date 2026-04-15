export type RichTextSegment = {
  text: string;
  strong?: boolean;
};

export type RichParagraph = RichTextSegment[];

export type AboutStatus = {
  label: string;
  title: string;
  description: string;
  tone: "success" | "warning";
  ctaLabel?: string;
  ctaHref?: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export const aboutPageContent = {
  title: "about",
  heroParagraphs: [
    [
      {
        text: "Hey, I'm Mohammed Nihad, a Computer Engineering major at CCNY. ",
      },
      {
        text: "I specialize in building full-stack applications and AI/ML systems that solve real problems.",
        strong: true,
      },
    ],
    [
      { text: "What excites me most is " },
      { text: "rapid prototyping", strong: true },
      {
        text: " - taking ideas from concept to deployed product by learning new frameworks quickly and iterating fast.",
      },
    ],
  ] satisfies RichParagraph[],
  statuses: [
    {
      label: "Summer 2026",
      title: "Accepted Software Engineering Intern at Bloom Energy for Summer 2026",
      description:
        "Joining Bloom Energy to work on backend tooling and infrastructure-scale systems.",
      tone: "success",
      ctaLabel: "Download Resume",
      ctaHref: "/resume",
    },
    {
      label: "2027 Signal",
      title: "Looking for Co-ops / Summer 2027 Internships",
      description:
        "Interested in product engineering, AI/ML systems, and backend-heavy roles.",
      tone: "warning",
    },
  ] satisfies AboutStatus[],
  skillGroups: [
    {
      title: "Languages",
      items: ["Python", "C++", "TypeScript", "Java", "MATLAB", "SQL", "HTML/CSS"],
    },
    {
      title: "Frameworks & Libraries",
      items: [
        "FastAPI",
        "Spring Boot",
        "React",
        "React Native",
        "PyTorch",
        "scikit-learn",
        "React Three Fiber",
      ],
    },
    {
      title: "Tools & Platforms",
      items: [
        "Git",
        "GitHub",
        "AWS",
        "Docker",
        "Figma",
        "PostgreSQL",
        "MongoDB",
        "REST APIs",
        "Kubernetes",
        "Claude Code",
        "Codex",
      ],
    },
    {
      title: "Applied AI Workflows",
      items: [
        "LLM Apps",
        "Agentic Workflows",
        "Tool Calling",
        "RAG Pipelines",
        "Prompt Engineering",
        "Model Evaluation",
      ],
    },
  ] satisfies SkillGroup[],
} as const;
