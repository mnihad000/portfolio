export type Project = {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  dateLabel: string;
  technologies: string[];
  coverImage: string;
  richDetail?: ProjectRichDetail;
};

export type ProjectRichDetail = {
  heroTitle: string;
  heroSubtitle: string;
  overview: string[];
  overviewHighlight?: string;
  links: ProjectLink[];
  techStackGroups: ProjectTechStackGroup[];
  howItWorksFlow: string;
  architectureTree: string;
  datasets: ProjectDataset[];
  setup: ProjectSetup;
  decisionMaking: ProjectDecisionMaking;
  decisionTriggers: string[];
  opponentModeling: string[];
  metrics: ProjectMetric[];
  disclaimer: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectTechStackGroup = {
  title: string;
  items: string[];
};

export type ProjectDataset = {
  name: string;
  description: string;
  href: string;
};

export type ProjectSetup = {
  prerequisites: string[];
  installation: string;
  environment: string;
  connect: string;
  downloadModels: string;
  run: string;
};

export type ProjectDecisionMaking = {
  cadence: string;
  requestSample: string;
  responseSample: string;
};

export type ProjectMetric = {
  metric: string;
  target: string;
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
      "Autonomous AI agent that plays Clash Royale in real time using computer vision, strategic LLM planning, and ADB automation.",
    fullDescription:
      "An autonomous gameplay system that watches a live BlueStacks Clash Royale session, tracks the battlefield with YOLO models, and executes strategic taps chosen by Claude in real time.",
    dateLabel: "MARCH 2026",
    technologies: [
      "Python",
      "YOLOv8",
      "Claude API",
      "ADB",
      "BlueStacks 5",
    ],
    coverImage: "/projects/clash-royale-ai-agent-cover.svg",
    richDetail: {
      heroTitle: "AI Royale",
      heroSubtitle:
        "Autonomous Clash Royale gameplay agent with real-time vision, strategic LLM planning, and tap-level execution.",
      overview: [
        "The agent continuously watches a live BlueStacks session, detects battlefield units and cards in hand, reads OCR signals for elixir and tower HP, then decides when to play and where to place cards.",
        "Perception runs at high frame rate while strategic inference is event-gated, so decisions stay timely without overcalling the model.",
      ],
      overviewHighlight:
        "Perception loop runs continuously; Claude is called only on meaningful decision windows to keep latency and cost low.",
      links: [
        {
          label: "GitHub Repo",
          href: "https://github.com/mnihad000/ai-royale",
        },
      ],
      techStackGroups: [
        {
          title: "Perception",
          items: ["mss", "YOLOv8", "YOLOv8n", "pytesseract", "Roboflow"],
        },
        {
          title: "Strategic AI",
          items: ["Claude Sonnet 4 API", "JSON state prompts", "Decision triggers"],
        },
        {
          title: "Execution",
          items: ["ADB", "pure-python-adb", "BlueStacks 5"],
        },
        {
          title: "Storage + Evaluation",
          items: ["SQLite", "Match logs", "Decision traces"],
        },
      ],
      howItWorksFlow: `BlueStacks (Clash Royale)
    ↓ screen capture @ ~60fps (mss)
YOLOv8  -> battlefield units, positions, HP
YOLOv8n -> cards in hand
OCR     -> elixir bar, tower HP
    ↓ structured game state (JSON)
Claude API -> strategic decision every 2-3s
    ↓ {"card":"hog_rider","x":540,"y":800}
ADB input_tap
    ↓
BlueStacks executes tap`,
      architectureTree: `clash-royale-agent/
├── perception/
│   ├── screen_capture.py
│   ├── unit_detector.py
│   ├── card_detector.py
│   └── ocr_reader.py
├── agent/
│   ├── claude_planner.py
│   ├── opponent_memory.py
│   └── decision_trigger.py
├── execution/
│   ├── adb_controller.py
│   └── card_placer.py
├── data/
│   ├── card_stats.json
│   └── arena_map.py
├── logs/
├── models/
├── requirements.txt
└── .env.example`,
      datasets: [
        {
          name: "AngelFire's Clash Royale Dataset",
          description:
            "148 classes for ally + enemy versions of core units (archer, hog rider, giant, balloon, and more).",
          href: "https://universe.roboflow.com/angelfire/clash-royale-cylln",
        },
        {
          name: "Vision Bot Card Detection",
          description:
            "Card-in-hand classification from spectator and player viewpoints.",
          href: "https://universe.roboflow.com/vision-bot/clash-royale-card-detection-ylzsc",
        },
      ],
      setup: {
        prerequisites: [
          "Python 3.11+",
          "BlueStacks 5 with Clash Royale installed",
          "ADB enabled in BlueStacks settings",
          "Anthropic API key",
        ],
        installation: `git clone https://github.com/yourusername/clash-royale-agent
cd clash-royale-agent

python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

pip install -r requirements.txt`,
        environment: `cp .env.example .env
ANTHROPIC_API_KEY=your_key_here`,
        connect: `adb connect 127.0.0.1:5555
adb devices  # should show emulator-5554`,
        downloadModels: `python scripts/download_models.py
# Downloads AngelFire + Vision Bot weights from Roboflow`,
        run: `python main.py`,
      },
      decisionMaking: {
        cadence:
          "Claude is invoked every 2-3 seconds or when a trigger fires (new opponent play, elixir threshold, bridge crossing, tower pressure).",
        requestSample: `{
  "elixir": 7,
  "my_towers": { "left": 2400, "right": 2400, "king": 4000 },
  "opp_towers": { "left": 1800, "right": 2400, "king": 4000 },
  "battlefield_units": [
    { "type": "hog_rider", "team": "opponent", "x": 9, "y": 14, "hp": 1200 }
  ],
  "my_hand": ["knight", "fireball", "musketeer", "arrows"],
  "opponent_seen_cards": ["hog_rider", "fireball", "ice_spirit"],
  "time_remaining": 87
}`,
        responseSample: `{
  "action": "play_card",
  "card": "knight",
  "x": 9,
  "y": 15,
  "reasoning": "Opponent hog rider approaching right tower. Knight at 9,15 intercepts cleanly with elixir advantage."
}`,
      },
      decisionTriggers: [
        "Elixir crosses a threshold (>= 6 by default)",
        "Opponent plays a card",
        "A unit crosses the bridge",
        "Tower HP drops below 50%",
        "Time remaining enters double elixir (60s)",
      ],
      opponentModeling: [
        "Cards seen so far plus estimated cycle position",
        "Aggression score (push frequency and elixir spent per minute)",
        "Preferred lane (left/right bias)",
        "Win/loss history persisted in SQLite",
      ],
      metrics: [
        { metric: "Win rate vs random baseline", target: "60%+" },
        { metric: "Decision latency (Claude round-trip)", target: "<2s" },
        { metric: "YOLO unit detection accuracy", target: ">85% mAP" },
        { metric: "Tool call success rate", target: ">95%" },
        { metric: "API calls per match", target: "~15-25" },
      ],
      disclaimer:
        "Built for educational and portfolio purposes. Automated play on official Clash Royale servers violates Supercell Terms of Service and can lead to account bans. Use a secondary test account or private matches.",
    },
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
  {
    slug: "autonomous-dataset-agent",
    title: "Autonomous Dataset Agent",
    description:
      "Agentic pipeline for sourcing, validating, and versioning structured datasets from noisy public inputs.",
    fullDescription:
      "Autonomous Dataset Agent is a workflow-oriented project focused on collecting raw sources, normalizing schema, and running quality checks automatically before dataset release.",
    dateLabel: "APRIL 2026",
    technologies: ["Python", "TypeScript", "FastAPI", "PostgreSQL"],
    coverImage: "/projects/autonomous-dataset-agent-cover.svg",
  },
  {
    slug: "familyos",
    title: "FamilyOS",
    description:
      "Unified household command center for planning, reminders, shared tasks, and family-level coordination.",
    fullDescription:
      "FamilyOS is a multi-user product concept for organizing day-to-day family logistics, including schedules, recurring tasks, reminders, and shared updates in one interface.",
    dateLabel: "APRIL 2026",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    coverImage: "/projects/familyos-cover.svg",
  },
  {
    slug: "spendly",
    title: "Spendly",
    description:
      "Personal finance workspace that tracks spending patterns, budgets, and monthly trends with actionable insights.",
    fullDescription:
      "Spendly is a budgeting and expense-analysis app that emphasizes fast categorization, behavior-level analytics, and clear weekly or monthly spending breakdowns.",
    dateLabel: "APRIL 2026",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    coverImage: "/projects/spendly-cover.svg",
  },
  {
    slug: "agent-orchestrator",
    title: "Agent Orchestrator",
    description:
      "Coordination layer for multi-agent workflows with retries, routing policies, and traceable execution state.",
    fullDescription:
      "Agent Orchestrator is an infrastructure-focused project that manages handoffs between specialized agents, handles failure recovery, and records execution traces for debugging and observability.",
    dateLabel: "APRIL 2026",
    technologies: ["TypeScript", "Node.js", "Redis", "OpenAI API"],
    coverImage: "/projects/agent-orchestrator-cover.svg",
  },
  {
    slug: "amigmi",
    title: "Amigmi",
    description:
      "Social recommendation prototype that matches people to local activities based on interests, vibe, and availability.",
    fullDescription:
      "Amigmi is an experimentation project around social discovery and recommendation quality, with a focus on intent matching and low-friction coordination.",
    dateLabel: "APRIL 2026",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Framer Motion"],
    coverImage: "/projects/amigmi-cover.svg",
  },
  {
    slug: "mira",
    title: "MIRA",
    description:
      "Research assistant concept for summarizing technical materials, mapping concepts, and maintaining persistent context.",
    fullDescription:
      "MIRA is an AI assistant concept oriented around technical research workflows, combining retrieval, synthesis, and iterative note refinement to accelerate deep work.",
    dateLabel: "APRIL 2026",
    technologies: ["Next.js", "TypeScript", "Vector DB", "OpenAI API"],
    coverImage: "/projects/mira-cover.svg",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
