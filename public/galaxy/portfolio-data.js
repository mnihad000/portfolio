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
        panelSectionTitle: "Key Initiatives",
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
        panelSectionTitle: "Focus Areas",
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
        id: "uva",
        label: "University of Virginia",
        labelShort: "UVA",
        labelDetail: "Aug 2026 - May 2028",
        labelPriority: 74,
        preferredLabelPlacement: "left",
        labelGroup: "education",
        panelSectionTitle: "Relevant Coursework",
        sublabel: "Transferred this semester",
        type: "education",
        prestige: 8,
        color: 0x1f2937,
        description:
          "Transferred to the University of Virginia this semester. Computer Engineering major expected to graduate in May 2028.",
        moons: [
          {
            label: "Machine Learning",
            description:
              "Relevant UVA coursework from the resume.",
          },
          {
            label: "Distributed Systems",
            description:
              "Relevant UVA coursework from the resume.",
          },
          {
            label: "Database Systems",
            description:
              "Relevant UVA coursework from the resume.",
          },
          {
            label: "Computer Architecture",
            description:
              "Relevant UVA coursework from the resume.",
          },
          {
            label: "Data Structures and Algorithms",
            description:
              "Relevant UVA coursework from the resume.",
          },
          {
            label: "Software Engineering and Design",
            description:
              "Relevant UVA coursework from the resume.",
          },
          {
            label: "Signals and Systems",
            description:
              "Relevant UVA coursework from the resume.",
          },
        ],
      },
      {
        id: "ccny",
        label: "City College of New York",
        labelShort: "CCNY",
        labelDetail: "Aug 2024 - May 2026",
        labelPriority: 76,
        preferredLabelPlacement: "bottom-right",
        labelGroup: "education",
        panelSectionTitle: "Relevant Coursework",
        sublabel: "Transferred to UVA",
        type: "education",
        prestige: 7,
        color: 0x7c3aed,
        description:
          "Computer Engineering student at CCNY before transferring to the University of Virginia. 5x Hackathon Winner and 3x Dean's List.",
        moons: [
          {
            label: "Data Structures and Algorithms",
            description:
              "Relevant CCNY coursework from the resume.",
          },
          {
            label: "Software Engineering and Design",
            description:
              "Relevant CCNY coursework from the resume.",
          },
          {
            label: "Linear Algebra",
            description:
              "Relevant CCNY coursework from the resume.",
          },
          {
            label: "5x Hackathon Winner",
            description:
              "Resume highlight carried over from the CCNY section.",
          },
          {
            label: "3x Dean's List",
            description:
              "Resume highlight carried over from the CCNY section.",
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
        panelSectionTitle: "Highlights",
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
        panelSectionTitle: "Highlights",
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
