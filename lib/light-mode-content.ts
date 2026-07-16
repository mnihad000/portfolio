export type LightExperienceItem = {
  date: string;
  title: string;
  body: string | string[];
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
      date: "June 2026 - August 2026",
      title: "Software Engineering Intern — Bloom Energy",
      body: [
        "Unified millions of records across Salesforce, OSI PI, AWS Redshift, and internal systems into an internal diagnostic tool, enabling RMCC engineers to look up active escalations, match historical fault patterns, and receive root cause analysis with fix recommendations, cutting troubleshooting time by 80% across 30,000 monitored fuel cells.",
        "Built and shipped a production visual workflow builder using React Flow, FastAPI, and MongoDB, enabling engineers to assemble reusable node-based DAGs and reducing hand-authoring time for new automation scripts by ~80%.",
        "Architected a versioned compiler pipeline that translated DAGs into validated, Ruff-linted notebooks, configs, and pipeline artifacts, incorporating cycle detection and lazy-cached introspection; adopted across a team of 12.",
        "Optimized AWS Redshift queries by refactoring nested query patterns and simplifying data-access logic, reducing query runtime from ~50s to <10s; then built an MCP server to expose the data to engineers in local dev environments.",
      ],
    },
    {
      date: "December 2025 - Present",
      title: "Software Engineering Intern - Buildify",
      body: [
        "As the sole fullstack engineer on this project, I built Retention Autopilot, an agentic AI system designed to reduce churn for the small businesses on our platform.",
        "Every time a customer logged in, the system pulled their usage data, segmented them automatically, and generated a targeted marketing campaign, renewal discounts, feature nudges, ROI summaries, upgrade prompts, or re-engagement tips depending on where they were in their journey.",
        "Each campaign had an A/B tested variant baked in. A human reviewed and approved before anything went out. The result: a 30% improvement in 30-day returning users and a 30% reduction in campaign setup time.",
      ],
    },
    {
      date: "June 2025 - December 2025",
      title: "Co-Author / Research Contributor - Feedback Distillation LLM Paper",
      body: [
        "Co-authored an unpublished research paper introducing a feedback distillation framework for improving LLM reasoning. The system pairs a large expert model with a lightweight student model (TinyLlama 1.1B vs. LLaMA-3 8B), where the student learns to match expert-quality feedback in real time through knowledge distillation, eliminating the need for a separate fixed amateur model.",
        "Contributed to both the implementation and experimental evaluation, benchmarking the framework against CLEAR, Chain-of-Thought, and Chain-of-Draft baselines across math reasoning, instruction following, and reading comprehension tasks.",
      ],
    },
    {
      date: "June 2025 - August 2025",
      title: "Software Engineering Intern - STEMKasa",
      body: [
        "Led 3 interns to rebuild a 17-file monolith as a MERN app, implementing component-based design, REST APIs, and integration tests to preserve 100% functionality.",
        "Architected and deployed a full CI/CD pipeline using GitHub Actions, automating build, test, and deployment workflows to eliminate manual deployment errors across staging and production environments.",
        "Engineered an AI tutoring layer with GPT-powered adaptive flashcards and lessons, then integrated secure auth and Stripe subscriptions, driving a 25% engagement increase across 3 schools.",
      ],
    },
    {
      date: "June 2023 - September 2023",
      title: "Software Automation Intern - Universacare",
      body: [
        "Built a Python Selenium web scraping workflow to extract daily Home Health Aide data, automating manual work and improving productivity by 11%.",
        "Developed 15 reusable React components and integrated a role-aware online application form into the production website, improving UI consistency/access control and saving 2+ hours per submission.",
      ],
    },
  ] satisfies LightExperienceItem[],
} as const;
