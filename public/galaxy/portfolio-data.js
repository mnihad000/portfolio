(function () {
  window.PORTFOLIO = {
    resume: {
      url: "/resume",
    },
    planets: [
      {
        id: "buildify",
        label: "Buildify",
        sublabel: "Software Engineering Intern · Dec 2025-Present",
        type: "internship",
        prestige: 10,
        color: 0x2f7cf6,
        description:
          "Built an agentic Retention Autopilot that ingests analytics, segments users, and automates retention operations at campaign scale. Launched approved A/B-tested push and rewards campaigns that improved 30-day returning-user workflows while cutting campaign setup time by 30%.",
        moons: [
          {
            label: "Retention Autopilot",
            description:
              "Agentic retention workflow that turns analytics signals into automated campaign operations.",
          },
          {
            label: "A/B Campaign Engine",
            description:
              "Approved push and rewards experiments that accelerated setup and improved returning-user performance.",
          },
        ],
      },
      {
        id: "bloom-energy",
        label: "Bloom Energy",
        sublabel: "Software Engineering Intern (Incoming) · Summer 2026",
        type: "internship",
        prestige: 9,
        color: 0xf59e0b,
        description:
          "Incoming software engineering intern focused on scalable backend tooling and automated data pipelines for real-time monitoring across 30,000+ distributed energy systems.",
        moons: [
          {
            label: "30,000+ Systems",
            description:
              "Monitoring and observability work scoped around large-scale distributed energy infrastructure.",
          },
          {
            label: "Infra Tooling",
            description:
              "Backend tooling, Kubernetes, Grafana, and FastAPI support for infrastructure-scale workflows.",
          },
        ],
      },
      {
        id: "ccny",
        label: "CCNY",
        sublabel: "B.E. Computer Engineering",
        type: "education",
        prestige: 8,
        color: 0x1f2937,
        description:
          "Computer Engineering major at The City College of New York with a focus on full-stack product engineering, backend-heavy systems, and applied AI/ML workflows.",
        moons: [
          {
            label: "Full-Stack Systems",
            description:
              "Hands-on coursework and independent builds across product engineering, infrastructure, and AI application layers.",
          },
          {
            label: "Rapid Prototyping",
            description:
              "Strong bias toward learning new frameworks quickly and turning ideas into working products.",
          },
        ],
      },
      {
        id: "cornell-breakthrough-tech",
        label: "Cornell Tech",
        sublabel: "Break Through Tech AI",
        type: "education",
        prestige: 7,
        color: 0xb91c1c,
        description:
          "Break Through Tech AI credential represented as a separate education node in the system, highlighting advanced AI-focused training alongside the core CCNY degree path.",
        moons: [
          {
            label: "AI Credential",
            description:
              "Supplemental program experience centered on AI fluency, applied technical work, and industry-facing preparation.",
          },
        ],
      },
      {
        id: "research-paper",
        label: "Research Paper",
        sublabel: "Co-Author / Research Contributor · 2025",
        type: "job",
        prestige: 7,
        color: 0x7c3aed,
        description:
          "Co-authored a self-critiquing LLM research pipeline combining expert feedback, distillation, reinforcement learning, and Pareto optimization, improving model accuracy while reducing infrastructure costs by up to 90% using open-weight models.",
        moons: [
          {
            label: "Self-Critiquing LLMs",
            description:
              "Pipeline design across expert feedback loops, distillation, and reinforcement learning.",
          },
          {
            label: "90% Cost Reduction",
            description:
              "Open-weight model strategy that cut infrastructure cost while preserving strong performance.",
          },
        ],
      },
      {
        id: "stemkasa",
        label: "STEMKasa",
        sublabel: "Software Engineering Intern · Summer 2025",
        type: "internship",
        prestige: 6,
        color: 0x0f766e,
        description:
          "Led a three-intern rebuild of a 17-file monolith into a MERN application with component-based architecture, secure auth, Stripe subscriptions, GPT-powered learning features, and stronger automated testing.",
        moons: [
          {
            label: "Led 3 Interns",
            description:
              "Drove the rebuild from monolith to component-based MERN architecture while preserving system behavior.",
          },
          {
            label: "+25% Engagement",
            description:
              "AI flashcards and lessons improved engagement across three schools.",
          },
        ],
      },
      {
        id: "universacare",
        label: "Universacare",
        sublabel: "Software Automation Intern · 2023",
        type: "internship",
        prestige: 5,
        color: 0x6b7280,
        description:
          "Built Selenium-based automation to extract daily Home Health Aide data and developed reusable React components for a role-aware production application flow, reducing manual work and improving UI consistency.",
        moons: [
          {
            label: "Automation",
            description:
              "Python Selenium workflow that improved operational productivity by 11%.",
          },
          {
            label: "15 React Components",
            description:
              "Reusable UI components that improved consistency and saved hours across submission workflows.",
          },
        ],
      },
    ],
    asteroids: [
      {
        id: "rhetoriq",
        label: "RhetoriQ",
        description:
          "Autonomous pipeline that detects, investigates, and visualizes political narrative spread across platforms.",
        tags: ["Python", "LLMs", "TypeScript"],
        url: "/lightmode#project-rhetoriq",
        cardSelector: "#project-rhetoriq",
      },
      {
        id: "clash-royale-ai-agent",
        label: "Clash Royale AI Agent",
        description:
          "Autonomous gameplay agent using computer vision, strategic LLM planning, and ADB automation.",
        tags: ["Python", "Computer Vision", "LLMs"],
        url: "/lightmode#project-clash-royale-ai-agent",
        cardSelector: "#project-clash-royale-ai-agent",
      },
      {
        id: "squeeze-ai",
        label: "Squeeze AI",
        description:
          "AI compression workspace that distills long-form content into concise structured outputs for faster decision-making.",
        tags: ["Next.js", "TypeScript", "LLMs"],
        url: "/lightmode#project-squeeze-ai",
        cardSelector: "#project-squeeze-ai",
      },
      {
        id: "autonomous-dataset-agent",
        label: "Autonomous Dataset Agent",
        description:
          "Agentic pipeline for sourcing, validating, and versioning structured datasets from noisy public inputs.",
        tags: ["Python", "FastAPI", "PostgreSQL"],
        url: "/lightmode#project-autonomous-dataset-agent",
        cardSelector: "#project-autonomous-dataset-agent",
      },
    ],
  };
})();
