export type LightExperienceItem = {
  date: string;
  title: string;
  body: string;
};

export const lightModeContent = {
  name: "Mohammed Nihad",
  role: "Computer Engineering Major at CCNY",
  location: "New York, NY",
  email: "mnihad1107@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohammed-nihad-090348263/",
  github: "https://github.com/mnihad000",
  heroSummary:
    "I build full-stack applications and AI/ML systems with a strong bias toward rapid prototyping, clean execution, and real products that actually ship.",
  heroSecondary:
    "Focused on agentic workflows, backend-heavy systems, and learning new tools fast enough to turn an idea into something deployed.",
  aboutSummary:
    "What excites me most is rapid prototyping: taking ideas from concept to deployed product by learning new frameworks quickly, iterating fast, and staying close to the actual user problem.",
  experienceItems: [
    {
      date: "December 2025 - Present",
      title: "Software Engineering Intern · Buildify",
      body:
        "Built an agentic Retention Autopilot that automated campaign operations, improved 30-day returning-user workflows, and reduced campaign setup time by 30%.",
    },
    {
      date: "June 2026 - August 2026",
      title: "Software Engineering Intern (Incoming) · Bloom Energy",
      body:
        "Joining Bloom Energy to build backend tooling and monitoring infrastructure for real-time observability across 30,000+ distributed energy systems.",
    },
    {
      date: "June 2025 - December 2025",
      title: "Co-Author / Research Contributor · Self-Critiquing LLM Paper",
      body:
        "Co-authored a research pipeline combining expert feedback, distillation, reinforcement learning, and Pareto optimization while reducing infrastructure cost by up to 90%.",
    },
    {
      date: "June 2025 - August 2025",
      title: "Software Engineering Intern · STEMKasa",
      body:
        "Led a three-intern rebuild of a 17-file monolith into a MERN app with tests, secure auth, Stripe subscriptions, and AI-powered learning features.",
    },
    {
      date: "June 2023 - September 2023",
      title: "Software Automation Intern · Universacare",
      body:
        "Built Selenium-based automation and reusable React components that reduced manual work, improved UI consistency, and saved hours across submission workflows.",
    },
  ] satisfies LightExperienceItem[],
} as const;
