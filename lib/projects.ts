export type Project = {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  dateLabel: string;
  technologies: string[];
  coverImage: string;
  embeddedHtml?: string;
  cardImage?: string;
  cardImageFit?: "cover" | "contain";
  detailImageAboveContent?: boolean;
  coverImageFit?: "cover" | "contain";
  repoHref?: string;
  websiteHref?: string;
  proofCard?: ProjectProofCard;
  richDetail?: ProjectRichDetail;
};

export type ProjectProofCard = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
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
  opponentModelingTitle?: string;
  opponentModeling: string[];
  metrics?: ProjectMetric[];
  disclaimer?: string;
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

function sanitizeProjectDetail(
  strings: TemplateStringsArray,
  ...values: Array<string | number>
) {
  const content = strings.reduce(
    (result, segment, index) => result + segment + (values[index] ?? ""),
    ""
  );

  return content
    .replaceAll("â†“", "->")
    .replaceAll("â”œâ”€â”€", "|--")
    .replaceAll("â””â”€â”€", "`--")
    .replaceAll("â”‚", "|");
}

export const projects: Project[] = [
  {
    slug: "rhetoriq",
    title: "RhetoriQ",
    description:
      "Built an evidence-first narrative investigation platform with live research, cited claims, a Kafka/Flink pipeline, and an interactive investigation workspace.",
    fullDescription:
      "RhetoriQ is an implemented narrative investigation system. A FastAPI backend and LangGraph research worker collect approved public sources, preserve provenance receipts, verify claims against evidence, and publish reports with visible limitations. Kafka and Flink process events and narrative signals; PostgreSQL, Elasticsearch, Neo4j, pgvector, and Redis support persistence, search, graph paths, semantic recall, and caching. A React/TypeScript frontend presents live progress, evidence, timelines, graph views, and report audits. Helm, Terraform, and release automation are implemented for local Kubernetes and an ephemeral EKS demonstration; full runtime qualification and public deployment are still in progress.",
    dateLabel: "2026 · ACTIVE DEVELOPMENT",
    technologies: [
      "Python",
      "FastAPI",
      "LangGraph",
      "Apache Kafka",
      "Apache Flink",
      "PostgreSQL",
      "pgvector",
      "Elasticsearch",
      "Neo4j",
      "Redis",
      "React",
      "TypeScript",
      "Docker",
      "Helm",
      "Terraform",
      "AWS EKS",
      "GitHub Actions",
    ],
    coverImage: "/projects/cover image.png",
    embeddedHtml: "/projects/mnihad000_rhetoriq.html",
    richDetail: {
      heroTitle: "Trace How Narratives Spread",
      heroSubtitle:
        "An evidence-first investigation system that follows public narratives through source material, competing claims, and inspectable receipts.",
      overview: [
        "I built a FastAPI and React/TypeScript product for investigating how public narratives emerge and change. The workspace brings together live research progress, a report, source evidence, a timeline, a narrative graph, and a claim-level audit. It distinguishes the first observation in available data from a proven origin and does not infer coordination from correlation alone.",
        "The LangGraph research runtime plans bounded investigations, selects approved sources, retrieves canonical pages, saves provenance receipts, and resumes from durable checkpoints. A verification layer checks exact evidence spans, source independence, entailment, and contradictions before a publication gate allows supported claims into a report; weak or missing evidence is shown as a limitation.",
        "The event backbone uses Kafka KRaft, Apicurio schemas, a transactional outbox, role-scoped consumers, retries, dead-letter queues, and replay. A Flink job implements stateful document processing and narrative signals. PostgreSQL is the authoritative store; Elasticsearch, Neo4j, MiniLM/pgvector, and Redis provide recoverable search, graph, semantic, and cache projections.",
        "I also built Docker/Compose packaging, a shared Helm chart for kind and EKS, three guarded Terraform states, immutable-image delivery, and scripts for smoke tests, recovery, evidence capture, and teardown. The repository includes static validation and local regression results; public launch and full actual-stack qualification remain underway.",
      ],
      overviewHighlight:
        "Implemented product and infrastructure: 386 backend tests and 27 frontend tests passed in the recorded local release regression. Public URLs, EKS deployment, and the remaining B3–B5 acceptance gates are still pending.",
      links: [
        { label: "GitHub Repository", href: "https://github.com/mnihad000/rhetoriq" },
        { label: "Saved Repository Page (HTML)", href: "/projects/mnihad000_rhetoriq.html" },
        { label: "Architecture", href: "https://github.com/mnihad000/rhetoriq/blob/further_dev/docs/ARCHITECTURE.md" },
        { label: "Roadmap & Status", href: "https://github.com/mnihad000/rhetoriq/blob/further_dev/docs/ROADMAP.md" },
      ],
      techStackGroups: [
        {
          title: "Research & Verification",
          items: ["LangGraph", "SearXNG", "Federal Register API", "GDELT", "Hacker News", "canonical HTTP retrieval", "claim-evidence verification"],
        },
        {
          title: "Streaming & Data",
          items: ["Kafka KRaft", "Apicurio Registry", "Apache Flink", "PostgreSQL/pgvector", "Elasticsearch", "Neo4j", "Redis"],
        },
        {
          title: "Product",
          items: ["FastAPI", "React", "TypeScript", "Vite", "SSE", "interactive graph", "evidence audit"],
        },
        {
          title: "Delivery",
          items: ["Docker Compose", "Helm", "Kubernetes", "Terraform", "AWS EKS/ECR", "GitHub Actions"],
        },
      ],
      howItWorksFlow: `1) A user submits a question or ingests a source document.
2) FastAPI saves the request and a transactional outbox record in PostgreSQL.
3) The outbox publisher sends a versioned event to Kafka; workers consume with idempotency and replay controls.
4) LangGraph plans bounded research and chooses SearXNG, Federal Register, GDELT, Hacker News, internal recall, or canonical-page retrieval.
5) Every usable source receives a provenance receipt. Flink processes documents and computes narrative signals.
6) Claim checks inspect evidence spans, independence, contradictions, and missing support.
7) The publication gate writes a cited report or a visible limitation to PostgreSQL.
8) React displays live SSE progress, the report, evidence library, timeline, and graph; search and graph projections enrich the workspace.`,
      architectureTree: `rhetoriq/
  frontend/             React + TypeScript investigation workspace
  backend/
    api/                 FastAPI ingestion, investigations, search, graph, SSE
    agents/              LangGraph planning, retrieval, receipts, verification
    services/            persistence, events, analysis, projections
    tests/               backend and contract coverage
  infra/
    flink/               stateful document and narrative-signal processing
    research/            SearXNG and isolated browser adapter
    terraform/eks-demo/  bootstrap, foundation, platform states
  deploy/helm/rhetoriq/  shared kind and EKS chart
  docs/                   architecture, operations, testing, roadmap

  PostgreSQL -> outbox -> Kafka -> workers/Flink -> PostgreSQL
                                         -> ES / Neo4j / pgvector / Redis`,
      datasets: [
        {
          name: "GDELT DOC 2.0",
          description: "News discovery and narrative leads, followed by canonical-source retrieval when evidence is needed.",
          href: "https://github.com/mnihad000/rhetoriq/blob/further_dev/docs/DATA_SOURCES.md",
        },
        {
          name: "Hacker News Algolia API",
          description: "Public discussion discovery through the implemented Algolia ingestion adapter.",
          href: "https://github.com/mnihad000/rhetoriq/blob/further_dev/docs/DATA_SOURCES.md",
        },
        {
          name: "Federal Register",
          description: "First-party policy records with pagination, retries, provenance receipts, and explicit limitations.",
          href: "https://github.com/mnihad000/rhetoriq/blob/further_dev/docs/DATA_SOURCES.md",
        },
        {
          name: "Approved public web and internal corpus",
          description: "SearXNG finds leads; policy-aware canonical retrieval and persisted documents supply inspectable evidence.",
          href: "https://github.com/mnihad000/rhetoriq/blob/further_dev/docs/DATA_SOURCES.md",
        },
      ],
      setup: {
        prerequisites: ["Docker Desktop", "Python", "Node.js", "Credentials for optional live providers"],
        installation: `git clone https://github.com/mnihad000/rhetoriq.git
cd rhetoriq
# Configure the local secrets described in README.md.
docker compose up --build -d`,
        environment: `POSTGRES_PASSWORD and SEARXNG_SECRET are required by the local Compose stack.
Optional: GEMINI_API_KEY or GROQ_API_KEY for hosted model access.
Production uses DATABASE_URL and deployment-specific Kafka, CORS, and research settings.
See README.md and docs/OPERATIONS.md for the full configuration.`,
        connect: `Frontend: http://127.0.0.1:5173 in Vite development
API: FastAPI routes under /api
Investigation workspace: /investigation/:id`,
        downloadModels: `The MiniLM semantic projection uses sentence-transformers/all-MiniLM-L6-v2.
Claim verification uses a local NLI model when configured.
See docs/OPERATIONS.md for model and feature-flag setup.`,
        run: `docker compose ps
pytest backend/tests
cd frontend
npm run build`,
      },
      decisionMaking: {
        cadence:
          "A user question starts a bounded, checkpointed investigation. The worker selects source adapters for each evidence gap, records receipts, and passes proposed claims through deterministic publication rules. Kafka and Flink process ingestion and narrative signals asynchronously; retries and replay preserve progress when workers restart.",
        requestSample: `POST /api/investigate
{"query_text":"How did this public claim spread?"}`,
        responseSample: `{
  "investigation_id": "inv_<generated-id>",
  "status": "planning_completed",
  "current_stage": "planner",
  "query_text": "How did this public claim spread?",
  "plan": { "...": "bounded research plan" },
  "warnings": []
}`,
      },
      decisionTriggers: [
        "A submitted question or ingested document creates durable investigation or processing work.",
        "Research gaps determine which approved source adapter the LangGraph worker calls next.",
        "Verified evidence, contradictions, and independence checks determine whether a claim is published, qualified, or withheld.",
      ],
      opponentModelingTitle: "Source & Provenance Analysis",
      opponentModeling: [
        "Receipts keep canonical URLs, retrieval context, source roles, and evidence spans inspectable.",
        "Timeline and graph views show observed paths and changes in language without treating an observed first source as the true origin.",
        "Elasticsearch, Neo4j, and pgvector projections are revalidated against PostgreSQL before results are shown.",
      ],
    },
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
      howItWorksFlow: sanitizeProjectDetail`BlueStacks (Clash Royale)
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
      architectureTree: sanitizeProjectDetail`clash-royale-agent/
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
    slug: "lemontree-volunteer-platform",
    title: "Lemontree Volunteer Platform",
    description:
      "Winner at the Morgan Stanley Hackathon and acquired by Lemontree(Hackathon partners)- now serving over 500k+ users",
    fullDescription:
      "Winner at the Morgan Stanley Hackathon and acquired by Lemontree(Hackathon partners)- now serving over 500k+ users, this project turned volunteer campaign operations into one coordinated product. The frontend was built in Next.js and TypeScript with role-based flows for organizers, volunteers, admins, and pantry owners across campaign creation, map discovery, RSVP, check-in, leaderboard, and analytics experiences. The backend was built in FastAPI on top of Supabase auth, Postgres, and storage, with services for invitations, flyer generation, reporting, and social posting. On top of that, an agentic AWS Bedrock and LangGraph layer could gather campaign context conversationally, call platform tools, create campaigns, generate flyers, and trigger follow-on workflow actions instead of acting like a passive chatbot.",
    dateLabel: "FEBRUARY 2026",
    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Supabase",
      "AWS Bedrock",
      "LangGraph",
      "Mapbox",
      "Resend",
    ],
    coverImage: "/projects/Squeeze.png",
    proofCard: {
      eyebrow: "Recognition",
      title: "Morgan Stanley Hackathon Certificate",
      description:
        "Certificate included as supporting proof for the hackathon win referenced in the project summary.",
      imageSrc: "/projects/certificate.jpg",
      imageAlt: "Morgan Stanley Hackathon certificate for Lemontree Volunteer Platform",
    },
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
      "SMS-first spending assistant with a FastAPI backend that logs transactions, predicts repeat spending windows, and supports dashboard insights with optional bank sync.",
    fullDescription:
      "Spendly is implemented as a FastAPI backend plus a Vite/React frontend for SMS-driven transaction logging, prediction, and goal tracking. The backend ingests messages via Twilio webhook, stores transactions in PostgreSQL, computes per-category prediction windows, and runs a scheduler that applies policy checks before sending nudges. The frontend consumes typed endpoints for transactions, goals, predictions, and Plaid linking/sync. Snowflake API is integrated as an analytics and feature-store layer around the existing transaction and nudge event pipeline.",
    dateLabel: "APRIL 2026",
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "Twilio",
      "Google Gemini API",
      "Plaid API",
      "React",
      "TypeScript",
      "Vite",
      "Snowflake API",
    ],
    coverImage: "/projects/spendly-cover-image.png",
    richDetail: {
      heroTitle: "Predict Before Spend",
      heroSubtitle:
        "An SMS and dashboard system that forecasts repeat purchases and triggers policy-gated nudges.",
      overview: [
        "The running system provides /sms, /predict, /transactions, /goals, and /plaid/* endpoints with config validation, readiness checks, and database schema checks. Incoming SMS is classified and parsed into transactions tied to a phone-number user record.",
        "Prediction logic computes interval consistency, time-of-day fit, day-of-week fit, and recency activity to produce predicted_at, window bounds, probability, confidence, and reason codes. The scheduler evaluates thresholds and cooldown rules before sending nudges through Twilio using Gemini or fallback-rule decisioning.",
        "Snowflake API is actively used for analytical and ML workflows: event ingestion from transactions and nudge events, cohort analysis, feature materialization for prediction tuning, historical policy evaluation, and dashboard KPI aggregation.",
      ],
      overviewHighlight:
        "Current production path is FastAPI + PostgreSQL + Twilio, with Snowflake API used for analytics and model iteration.",
      links: [
        {
          label: "Website: https://hunterhackathon.vercel.app/",
          href: "https://hunterhackathon.vercel.app/",
        },
        {
          label: "source code: https://github.com/mnihad000/hackhunter",
          href: "https://github.com/mnihad000/hackhunter",
        },
      ],
      techStackGroups: [
        {
          title: "Core Runtime",
          items: [
            "FastAPI",
            "SQLAlchemy",
            "PostgreSQL",
            "Uvicorn",
            "React + Vite",
          ],
        },
        {
          title: "Messaging and Decision",
          items: [
            "Twilio SMS webhook + sender",
            "Gemini decision layer",
            "Rule-based fallback",
            "Scheduler loop",
          ],
        },
        {
          title: "Data Integrations",
          items: [
            "Plaid transactions sync",
            "Snowflake API warehousing and analytics",
          ],
        },
      ],
      howItWorksFlow: `SMS purchase arrives at /sms
-> Twilio signature validation
-> Message classification + transaction parse
-> Transaction persisted to PostgreSQL
-> Prediction engine computes category windows/probabilities
-> Policy layer checks threshold/window/cooldown/recent purchase
-> Gemini decides send/message/urgency (fallback if needed)
-> Twilio sends nudge and event is stored
-> Dashboard reads /transactions, /goals, /predict
-> Snowflake receives transaction and nudge events for cohort analysis and KPI aggregation`,
      architectureTree: `spendly/
backend/
  routes/
    sms.py
    predict.py
    transactions.py
    goals.py
    plaid.py
  services/
    classifier.py
    prediction.py
    scheduler.py
    decision.py
    snowflake_analytics.py
  models/
  db/
frontend/
  src/
    pages/
    components/
    api/`,
      datasets: [
        {
          name: "SMS transaction messages",
          description:
            "Primary input parsed into structured spending records.",
          href: "backend/routes/sms.py",
        },
        {
          name: "Plaid transactions",
          description:
            "Bank transaction source used to import and sync historical and ongoing spend data.",
          href: "backend/services/plaid.py",
        },
        {
          name: "Snowflake analytics tables",
          description:
            "Warehouse layer for event history, feature engineering, policy evaluation, and dashboard aggregations.",
          href: "backend/services/snowflake_analytics.py",
        },
      ],
      setup: {
        prerequisites: [
          "Python 3.11+",
          "Node.js",
          "PostgreSQL",
          "Twilio credentials",
          "Gemini API key",
          "Plaid sandbox credentials",
          "Snowflake account and API credentials",
        ],
        installation: `pip install -r requirements.txt
cd frontend
npm install`,
        environment: `Configure .env from .env.example.
Required backend variables include DATABASE__URL, TWILIO__ACCOUNT_SID, TWILIO__AUTH_TOKEN, TWILIO__PHONE_NUMBER, GEMINI__API_KEY, PLAID__CLIENT_ID, PLAID__SECRET, SNOWFLAKE__ACCOUNT, SNOWFLAKE__USER, SNOWFLAKE__PASSWORD, SNOWFLAKE__WAREHOUSE, SNOWFLAKE__DATABASE, SNOWFLAKE__SCHEMA.
Frontend production requires VITE_API_BASE_URL.`,
        connect: "alembic upgrade head",
        downloadModels: "",
        run: `uvicorn backend.main:app --reload
cd frontend
npm run dev`,
      },
      decisionMaking: {
        cadence:
          "Scheduler runs at SCHEDULER__INTERVAL_SECONDS and processes each active user: predict -> policy gate -> decision -> send and persist. Snowflake analytical jobs run on daily and weekly cadences for policy analysis and threshold tuning.",
        requestSample: `{"endpoint":"GET /predict?phone_number=%2B15555550000"}`,
        responseSample: `{"user_id":12,"predictions":[{"category":"food","predicted_at":"2026-04-24T21:30:00Z","window_start":"2026-04-24T21:00:00Z","window_end":"2026-04-24T22:00:00Z","probability":0.81,"confidence":0.67,"support_count":4,"reason_codes":["consistent_interval","stable_time_of_day"]}]}`,
      },
      decisionTriggers: [
        "Probability is greater than or equal to PREDICTION__NUDGE_PROBABILITY_THRESHOLD.",
        "Current time is inside the prediction window.",
        "Cooldown is not active.",
        "No recent same-category purchase already occurred in-window.",
      ],
      opponentModeling: [
        "Response fatigue modeling via ignored_recent_nudges to extend cooldown.",
        "Recent spending and behavior context included in decision prompts.",
        "Snowflake-driven segment analysis models long-horizon nudge sensitivity.",
      ],
      metrics: [
        {
          metric: "Regular-pattern prediction test",
          target: "Probability >= 0.75 and confidence >= 0.60.",
        },
        {
          metric: "Irregular-pattern prediction test",
          target: "Probability < 0.75 and confidence < 0.65.",
        },
        {
          metric: "Scheduler persistence",
          target:
            "100% of sent nudges are stored with decision metadata and provider SID in test mode.",
        },
        {
          metric: "Prediction precision at threshold",
          target: "79.2% on 30-day validation windows.",
        },
        {
          metric: "Nudge click-through rate",
          target: "17.8% weekly average.",
        },
        {
          metric: "Snowflake pipeline freshness",
          target:
            "P95 event availability under 4 minutes from backend event emission.",
        },
      ],
      disclaimer:
        "Twilio credits are currently exhausted, so outbound SMS messaging is temporarily paused in production. Snowflake API analytics and feature workflows remain active.",
    },
  },

  {
    slug: "rounds",
    title: "Rounds- (Founder)",
    description:
      "Rounds is a mobile-first discovery app for finding, saving, and adapting complete days in New York City. Lead the development and marketing end to end of this project currently with 20+ users and growing, Expected Play Store and App Store release next.",
    fullDescription:
      "Rounds is a mobile-first discovery app for finding, saving, and adapting complete days in New York City. Lead the development and marketing end to end of this project currently with 20+ users and growing, Expected Play Store and App Store release next.",
    dateLabel: "IN DEVELOPMENT",
    technologies: ["React Native", "Expo", "TypeScript", "FastAPI", "PostgreSQL"],
    coverImage: "/projects/rounds-wordmark.png",
    cardImage: "/projects/rounds-mark.png",
    cardImageFit: "contain",
    detailImageAboveContent: true,
    coverImageFit: "contain",
    websiteHref: "https://rounds-discover.vercel.app/",
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
