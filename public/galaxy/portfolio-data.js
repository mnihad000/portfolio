(function () {
  window.PORTFOLIO = {
    resume: {
      url: "/resume",
    },
    planets: [
      {
        id: "buildify",
        label: "Buildify",
        labelShort: "Buildify",
        labelDetail: "Software Engineering Intern · Dec 2025-Present",
        labelPriority: 82,
        preferredLabelPlacement: "top-left",
        labelGroup: "internship",
        sublabel: "Software Engineering Intern · Dec 2025-Present",
        type: "internship",
        prestige: 10,
        color: 0x2f7cf6,
        descriptionBullets: [
          "As the sole fullstack engineer on this project, I built Retention Autopilot, an agentic AI system designed to reduce churn for the small businesses on our platform.",
          "Every time a customer logged in, the system pulled their usage data, segmented them automatically, and generated a targeted marketing campaign, renewal discounts, feature nudges, ROI summaries, upgrade prompts, or re-engagement tips depending on where they were in their journey.",
          "Each campaign had an A/B tested variant baked in. A human reviewed and approved before anything went out. The result: a 30% improvement in 30-day returning users and a 30% reduction in campaign setup time.",
        ],
        moons: [
          {
            label: "Retention Autopilot",
            description:
              "Agentic AI retention system that turns usage data into segmented, journey-specific campaigns.",
          },
          {
            label: "A/B Campaign Engine",
            description:
              "Human-reviewed campaign variants improved returning-user performance while reducing setup time.",
          },
        ],
      },
      {
        id: "bloom-energy",
        label: "Bloom Energy",
        labelShort: "Bloom Energy",
        labelDetail: "Incoming SWE Intern · Summer 2026",
        labelPriority: 80,
        preferredLabelPlacement: "top-right",
        labelGroup: "internship",
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
        labelShort: "CCNY",
        labelDetail: "B.E. Computer Engineering",
        labelPriority: 74,
        preferredLabelPlacement: "left",
        labelGroup: "education",
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
        labelShort: "Cornell Tech",
        labelDetail: "Break Through Tech AI",
        labelPriority: 70,
        preferredLabelPlacement: "top-right",
        labelGroup: "education",
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
        labelShort: "Research Paper",
        labelDetail: "Co-Author / Research Contributor · 2025",
        labelPriority: 76,
        preferredLabelPlacement: "bottom-right",
        labelGroup: "research",
        sublabel: "Co-Author / Research Contributor · 2025",
        type: "job",
        prestige: 7,
        color: 0x7c3aed,
        descriptionBullets: [
          "Co-authored an unpublished research paper introducing a feedback distillation framework for improving LLM reasoning. The system pairs a large expert model with a lightweight student model (TinyLlama 1.1B vs. LLaMA-3 8B), where the student learns to match expert-quality feedback in real time through knowledge distillation, eliminating the need for a separate fixed amateur model.",
          "Contributed to both the implementation and experimental evaluation, benchmarking the framework against CLEAR, Chain-of-Thought, and Chain-of-Draft baselines across math reasoning, instruction following, and reading comprehension tasks.",
        ],
        moons: [
          {
            label: "Feedback Distillation",
            description:
              "Student and expert models were paired so a 1.1B model could learn to produce expert-quality feedback in real time.",
          },
          {
            label: "Benchmark Evaluation",
            description:
              "Framework was benchmarked against CLEAR, Chain-of-Thought, and Chain-of-Draft across three reasoning task categories.",
          },
        ],
      },
      {
        id: "stemkasa",
        label: "STEMKasa",
        labelShort: "STEMKasa",
        labelDetail: "Software Engineering Intern · Summer 2025",
        labelPriority: 68,
        preferredLabelPlacement: "right",
        labelGroup: "internship",
        sublabel: "Software Engineering Intern · Summer 2025",
        type: "internship",
        prestige: 6,
        color: 0x0f766e,
        descriptionBullets: [
          "Led 3 interns to rebuild a 17-file monolith as a MERN app, implementing component-based design, REST APIs, and integration tests to preserve 100% functionality.",
          "Architected and deployed a full CI/CD pipeline using GitHub Actions, automating build, test, and deployment workflows to eliminate manual deployment errors across staging and production environments.",
          "Engineered an AI tutoring layer with GPT-powered adaptive flashcards and lessons, then integrated secure auth and Stripe subscriptions, driving a 25% engagement increase across 3 schools.",
        ],
        moons: [
          {
            label: "Led 3 Interns",
            description:
              "Drove the rebuild from monolith to a component-based MERN application while preserving full functionality.",
          },
          {
            label: "GitHub Actions CI/CD",
            description:
              "Automated build, test, and deployment workflows across staging and production to remove manual deployment errors.",
          },
          {
            label: "+25% Engagement",
            description:
              "GPT-powered adaptive flashcards, lessons, auth, and subscriptions increased student engagement across 3 schools.",
          },
        ],
      },
      {
        id: "universacare",
        label: "Universacare",
        labelShort: "Universacare",
        labelDetail: "Software Automation Intern · 2023",
        labelPriority: 64,
        preferredLabelPlacement: "top-right",
        labelGroup: "internship",
        sublabel: "Software Automation Intern · 2023",
        type: "internship",
        prestige: 5,
        color: 0x6b7280,
        descriptionBullets: [
          "Built a Python Selenium web scraping workflow to extract daily Home Health Aide data, automating manual work and improving productivity by 11%.",
          "Developed 15 reusable React components and integrated a role-aware online application form into the production website, improving UI consistency/access control and saving 2+ hours per submission.",
        ],
        moons: [
          {
            label: "Automation",
            description:
              "Python Selenium workflow that automated manual Home Health Aide data extraction and improved productivity by 11%.",
          },
          {
            label: "15 React Components",
            description:
              "Role-aware production form and reusable UI components improved consistency, access control, and saved 2+ hours per submission.",
          },
        ],
      },
    ],
    asteroids: [
      {
        id: "rhetoriq",
        label: "RhetoriQ",
        labelShort: "RhetoriQ",
        labelPriority: 36,
        preferredLabelPlacement: "top",
        labelGroup: "project",
        description:
          "Autonomous pipeline that detects, investigates, and visualizes political narrative spread across platforms.",
        tags: ["Python", "LLMs", "TypeScript"],
        url: "/lightmode#project-rhetoriq",
        cardSelector: "#project-rhetoriq",
      },
      {
        id: "clash-royale-ai-agent",
        label: "Clash Royale AI Agent",
        labelShort: "Clash Royale AI",
        labelPriority: 34,
        preferredLabelPlacement: "right",
        labelGroup: "project",
        description:
          "Autonomous gameplay agent using computer vision, strategic LLM planning, and ADB automation.",
        tags: ["Python", "Computer Vision", "LLMs"],
        url: "/lightmode#project-clash-royale-ai-agent",
        cardSelector: "#project-clash-royale-ai-agent",
      },
      {
        id: "lemontree-volunteer-platform",
        label: "Lemontree Volunteer Platform",
        labelShort: "Lemontree Platform",
        labelPriority: 30,
        preferredLabelPlacement: "bottom-left",
        labelGroup: "project",
        description:
          "Morgan Stanley Hackathon winner later acquired by Lemontree, combining agentic campaign creation with volunteer coordination and admin analytics.",
        tags: ["Next.js", "FastAPI", "Bedrock"],
        url: "/lightmode#project-lemontree-volunteer-platform",
        cardSelector: "#project-lemontree-volunteer-platform",
      },
      {
        id: "autonomous-dataset-agent",
        label: "Autonomous Dataset Agent",
        labelShort: "Dataset Agent",
        labelPriority: 32,
        preferredLabelPlacement: "left",
        labelGroup: "project",
        description:
          "Agentic pipeline for sourcing, validating, and versioning structured datasets from noisy public inputs.",
        tags: ["Python", "FastAPI", "PostgreSQL"],
        url: "/lightmode#project-autonomous-dataset-agent",
        cardSelector: "#project-autonomous-dataset-agent",
      },
    ],
  };
})();
