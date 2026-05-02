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
    title: "RhetoriQ",
    description:
      "Documentation-defined architecture for an autonomous pipeline that detects, investigates, and visualizes political narrative spread across platforms.",
    fullDescription:
      "RhetoriQ is specified as a 10-service event-driven system where scrapers publish to Kafka, Flink processes and detects anomalies, storage workers persist enriched data, and a LangChain agent synthesizes investigation reports with GPT-4o. The backend is designed around FastAPI REST and WebSocket endpoints, and the frontend around a React/TypeScript dashboard with Sigma.js graph visualization. The repository includes detailed schemas, service contracts, infrastructure plans, and phased execution guidance. Based on current repo contents, this is an architecture-and-roadmap codebase with minimal/no implementation files checked in.",
    dateLabel: "APRIL 2026",
    technologies: [
      "Python",
      "Apache Kafka",
      "Apache Flink",
      "PostgreSQL",
      "pgvector",
      "Elasticsearch",
      "Neo4j",
      "Redis",
      "FastAPI",
      "React",
      "TypeScript",
      "LangChain",
      "OpenAI GPT-4o",
      "Docker",
      "Kubernetes",
      "Terraform",
      "ArgoCD",
      "GitHub Actions",
    ],
    coverImage: "/projects/rhetoriq-cover.svg",
    richDetail: {
      heroTitle: "Autonomous Narrative Tracing Pipeline",
      heroSubtitle:
        "A planned end-to-end system that detects narrative spikes, traces provenance, and publishes investigation reports from a Kafka-centered microservice architecture.",
      overview: [
        "The repo defines an event-driven architecture where five ingestion services (Reddit, NewsAPI, RSS, GDELT, C-SPAN) publish normalized raw documents to Kafka topics. A Flink processor consumes raw.* topics, deduplicates and cleans content, extracts entities, generates 384-dim embeddings, and emits both processed documents and anomaly alerts.",
        "A storage worker design writes processed data into PostgreSQL/pgvector (semantic search), Elasticsearch (full-text search), Neo4j (spread graph), and Redis (cache/state). A LangChain ReAct agent is specified to consume anomalies, run semantic + graph + text retrieval tools, and synthesize markdown investigation reports with GPT-4o.",
        "The backend API is documented as a FastAPI layer with JWT auth, paginated investigation endpoints, search endpoints, graph endpoints, and WebSocket broadcast events for anomaly/investigation lifecycle updates. The frontend is documented as a React + TypeScript SPA using React Query, Zustand, Sigma.js, and Recharts for live feed, investigation detail, and graph views.",
        "The project includes extensive operational documentation for Kafka partitioning/retention, Kubernetes deployment patterns, Terraform modules, ArgoCD GitOps flow, observability dashboards, and a phased 5-6 month implementation roadmap.",
      ],
      overviewHighlight:
        "Current repo state is documentation-first: architecture, schemas, runbooks, and roadmap are present; implementation files are largely not checked in.",
      links: [
        { label: "Project README", href: "README%20(3).md" },
        { label: "Architecture Doc", href: "ARCHITECTURE.md" },
        { label: "Services Doc", href: "SERVICES.md" },
      ],
      techStackGroups: [
        {
          title: "Ingestion & Streaming",
          items: ["Python scraper services", "Apache Kafka", "Apache Flink"],
        },
        {
          title: "Data Layer",
          items: ["PostgreSQL", "pgvector", "Elasticsearch", "Neo4j", "Redis"],
        },
        {
          title: "AI & Analysis",
          items: [
            "LangChain ReAct agent",
            "OpenAI GPT-4o",
            "HuggingFace NER (dslim/bert-base-NER)",
            "sentence-transformers/all-MiniLM-L6-v2",
          ],
        },
        {
          title: "API & Frontend",
          items: [
            "FastAPI",
            "Uvicorn",
            "React 18",
            "TypeScript",
            "Vite",
            "React Query",
            "Zustand",
            "Sigma.js",
            "Recharts",
            "TailwindCSS",
          ],
        },
        {
          title: "Infra & Delivery",
          items: [
            "Docker / Docker Compose",
            "Kubernetes (EKS)",
            "Terraform",
            "ArgoCD",
            "GitHub Actions",
            "Prometheus",
            "Grafana",
            "AWS Secrets Manager",
          ],
        },
      ],
      howItWorksFlow: `1) Scrapers poll/stream Reddit, RSS, NewsAPI, GDELT, and C-SPAN.
2) Each scraper publishes normalized raw events to Kafka (raw.reddit, raw.news, raw.gdelt, raw.speeches).
3) Flink consumes raw streams, deduplicates, cleans text, extracts entities, creates embeddings, and computes 10-minute anomaly windows vs 7-day baselines.
4) Flink emits documents.processed and anomalies.detected.
5) Storage worker consumes documents.processed and writes to Postgres/pgvector, Elasticsearch, Neo4j, and Redis.
6) Agent consumes anomalies.detected, executes retrieval tools (semantic_search, graph_trace, full_text_search, get_source_profile), then calls synthesize_report.
7) Agent publishes completed reports to investigations.complete.
8) FastAPI consumes/serves investigation data via REST + WebSocket.
9) React frontend renders live feed, timeline, investigation report, and spread graph.`,
      architectureTree: `rhetoriq/
services/
  ingestion/
    reddit-scraper         -> Kafka: raw.reddit
    newsapi-scraper        -> Kafka: raw.news
    rss-scraper            -> Kafka: raw.news
    gdelt-scraper          -> Kafka: raw.gdelt
    cspan-scraper          -> Kafka: raw.speeches
  processing/
    flink-processor        <- raw.* ; -> documents.processed, anomalies.detected
  storage/
    storage-worker         <- documents.processed
                              -> PostgreSQL/pgvector
                              -> Elasticsearch
                              -> Neo4j
                              -> Redis
  analysis/
    investigation-agent    <- anomalies.detected
                              -> investigations.complete
  api/
    fastapi-backend        <- investigations.complete
                              -> REST + WebSocket
  frontend/
    react-dashboard        <- FastAPI REST/WS`,
      datasets: [
        {
          name: "Reddit API (PRAW)",
          description:
            "Streams monitored political subreddit submissions into raw.reddit for early narrative detection.",
          href: "DATA_SOURCES.md",
        },
        {
          name: "GDELT GKG/Event updates",
          description:
            "15-minute global news event feed used for high-volume narrative and theme signals in raw.gdelt.",
          href: "DATA_SOURCES.md",
        },
        {
          name: "NewsAPI",
          description:
            "Supplemental mainstream political article feed for raw.news.",
          href: "DATA_SOURCES.md",
        },
        {
          name: "Outlet RSS feeds (NYT, WaPo, Fox, Reuters, BBC, Breitbart, The Hill, Politico)",
          description:
            "Direct outlet feeds for politically diverse article ingestion into raw.news.",
          href: "DATA_SOURCES.md",
        },
        {
          name: "C-SPAN API transcripts",
          description:
            "Speech/hearing transcript source for formal political adoption signals in raw.speeches.",
          href: "DATA_SOURCES.md",
        },
      ],
      setup: {
        prerequisites: [
          "Docker Desktop",
          "Python 3.11+",
          "Node.js 18+",
          "kubectl",
          "Terraform CLI",
        ],
        installation: `git clone https://github.com/yourusername/rhetoriq.git
cd rhetoriq
cp .env.example .env
# fill required keys
docker-compose up -d
# create Kafka topics per KAFKA.md`,
        environment: `Configure keys and URLs documented across README (3).md, SERVICES.md, and BACKEND (1).md, including:
OPENAI_API_KEY
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
NEWS_API_KEY
CSPAN_API_KEY
KAFKA_BOOTSTRAP_SERVERS
POSTGRES_URL
ELASTICSEARCH_URL
NEO4J_URI
NEO4J_PASSWORD
REDIS_URL
VITE_API_URL
VITE_WS_URL`,
        connect: `Local service endpoints documented:
API: http://localhost:8000/api/v1
WebSocket: ws://localhost:8000/ws
Frontend: http://localhost:3000
Kafka UI: http://localhost:8080`,
        downloadModels: `HuggingFace models referenced for local setup:
- sentence-transformers/all-MiniLM-L6-v2
- dslim/bert-base-NER
(roadmap indicates pre-downloading these before Flink processing).`,
        run: `cd backend/scrapers && python run_all.py
cd backend/processors && python flink_job.py
cd backend/processors && python storage_worker.py
cd backend/agent && python agent.py
cd backend/api && uvicorn main:app --reload --port 8000
cd frontend && npm install && npm run dev`,
      },
      decisionMaking: {
        cadence:
          "Flink runs anomaly detection in 10-minute tumbling windows, comparing phrase frequency against a rolling 7-day baseline; if frequency exceeds threshold (default 3.0x), it emits anomalies.detected. The agent then runs a bounded ReAct loop (max 10 iterations/tool calls) over retrieval tools before synthesizing a report.",
        requestSample: `{
  "anomaly_id": "a1b2c3d4",
  "phrase": "climate lockdowns",
  "spike_magnitude": 4.7,
  "window_frequency": 847,
  "baseline_frequency": 180,
  "top_sources": [
    {"source": "reddit", "subreddit": "conspiracy", "count": 312}
  ]
}`,
        responseSample: `{
  "investigation_id": "a1b2c3d4",
  "phrase": "climate lockdowns",
  "duration_seconds": 47,
  "origin": {
    "source": "reddit",
    "outlet_or_subreddit": "r/conspiracy",
    "confidence": 0.87
  },
  "spread_path": [
    {"stage": 1, "source": "reddit", "outlet_or_subreddit": "r/conspiracy"},
    {"stage": 2, "source": "rss", "outlet_or_subreddit": "Breitbart"}
  ],
  "pattern_classification": "grassroots",
  "report": "## Narrative: climate lockdowns ..."
}`,
      },
      decisionTriggers: [
        "Phrase frequency in current 10-minute window exceeds configured spike threshold vs rolling 7-day baseline (ANOMALY_SPIKE_THRESHOLD, default 3.0).",
        "Agent invocation is triggered by new messages on Kafka topic anomalies.detected.",
      ],
      opponentModeling: [
        "Source profiling enriches nodes with type, political lean, audience size estimate, and document counts to characterize amplification roles.",
        "Spread-path and key-amplifier ranking model narrative propagation through AMPLIFIED graph relationships in Neo4j.",
        "Investigation state/status is tracked in Redis and Postgres (detected, investigating, complete, failed).",
      ],
      metrics: [
        {
          metric: "Investigation duration",
          target: "Example documented: 47 seconds per completed investigation response.",
        },
        {
          metric: "Anomaly threshold",
          target: "Default 3.0x baseline over 10-minute window.",
        },
        {
          metric: "Agent tool-call budget",
          target: "Max 10 iterations/tool calls per investigation.",
        },
        {
          metric: "API cache latency goal",
          target: "Documented target: keep common API queries under 100ms via Redis caching.",
        },
        {
          metric: "Per-investigation LLM cost estimate",
          target: "$0.035 per investigation (doc estimate).",
        },
        {
          metric: "Infrastructure cost estimate",
          target: "$500/month on AWS (doc estimate).",
        },
      ],
      disclaimer:
        "This project page reflects a documentation-defined system architecture and phased implementation roadmap. The current repository snapshot is primarily design, schema, and operations documentation; most production service code is planned but not fully checked in.",
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
    coverImage: "/projects/spendly-cover.svg",
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
      links: [],
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
    slug: "agent-orchestrator",
    title: "Agent Orchestrator",
    description:
      "A multi-agent development orchestration platform that manages task ownership, dependencies, review flow, and merge-risk visibility.",
    fullDescription:
      "Agent Orchestrator is designed to coordinate multiple AI coding agents like a software team instead of isolated chat sessions. The documented MVP includes projects, agents, tasks, dependency graphs, workflow board states, shared artifacts, and orchestration state transitions. The repo defines backend API groups, data model entities, and conflict/review logic as implementation targets. Current markdown indicates a structured execution plan with most build phases still pending.",
    dateLabel: "NOT DOCUMENTED IN REPO",
    technologies: [
      "TypeScript",
      "Next.js or React",
      "Node.js",
      "Express or Next.js API routes",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "React Flow",
      "Socket.IO or WebSockets",
    ],
    coverImage: "/projects/agent-orchestrator-cover.svg",
    richDetail: {
      heroTitle: "Coordination Layer for AI Dev Teams",
      heroSubtitle:
        "A workflow engine and dashboard that orchestrate multiple coding agents through dependencies, approvals, and conflict-aware execution.",
      overview: [
        "The repo frames Agent Orchestrator as a control layer for multi-agent software development, focused on visibility and safe integration rather than standalone code generation.",
        "Core concepts are role-based agents, task dependency graph execution, a board with explicit lifecycle states (Todo, In Progress, Blocked, Waiting Review, Done), shared context artifacts, and reviewer/QA gates.",
        "Architecture is split into frontend dashboard, API/backend coordination services, orchestrator engine, and agent integration adapters. The docs also define conflict types (dependency, ownership, file overlap, review) and mitigation strategies.",
        "TASKS.md provides a phased implementation plan from foundation and schema design through graph UI, orchestration logic, agent adapters, conflict detection, realtime updates, and deployment.",
      ],
      overviewHighlight:
        "Primary differentiator: developer supervision and merge-safe coordination for parallel AI agent work.",
      links: [],
      techStackGroups: [
        {
          title: "Frontend",
          items: [
            "Next.js or React",
            "TypeScript",
            "Tailwind CSS",
            "React Flow",
            "shadcn/ui (optional)",
          ],
        },
        {
          title: "Backend and Orchestration",
          items: [
            "Node.js",
            "Express or Next.js API routes",
            "TypeScript",
            "Custom orchestration engine",
          ],
        },
        {
          title: "Data and State",
          items: [
            "PostgreSQL",
            "Prisma",
            "Event log",
            "Task dependency graph",
          ],
        },
        {
          title: "Realtime and Queueing",
          items: [
            "Socket.IO or WebSockets",
            "Polling fallback",
            "BullMQ or Redis (optional)",
          ],
        },
        {
          title: "Integrations and Deploy",
          items: [
            "Model provider APIs",
            "GitHub token (optional)",
            "Vercel",
            "Railway/Render/Supabase",
          ],
        },
      ],
      howItWorksFlow: `1. User creates a project workflow.
2. Tasks are defined and assigned to role-based agents.
3. Dependency edges are added in a task graph.
4. Orchestrator computes ready vs blocked tasks.
5. Agents execute ready tasks in parallel.
6. Outputs, touched files/modules, and blockers are recorded.
7. Completed work moves to waiting review with QA/reviewer gates.
8. Conflict analysis flags overlap and dependency issues.
9. Approved tasks transition to done and merge-safe integration sequence.
10. Workflow completes with event history/audit trail.`,
      architectureTree: `agent-orchestrator/
app/                # frontend routes/pages
components/         # reusable UI components
lib/                # shared utilities
server/
  controllers/
  services/
  orchestrator/
  agents/
  graph/
  events/
prisma/
  schema.prisma
public/
types/
docs/
  architecture.md
  api.md
  workflow.md
.env.example
package.json
README.md
TASKS.md
API.md`,
      datasets: [
        {
          name: "Shared project artifacts",
          description:
            "Internal project context inputs such as product requirements, technical design, API contracts, acceptance criteria, decisions log, and notes used by agents and orchestration logic.",
          href: "README.md",
        },
        {
          name: "File touch mapping",
          description:
            "Tracked file/module ownership metadata for overlap detection and merge-risk warnings.",
          href: "README.md",
        },
      ],
      setup: {
        prerequisites: [
          "Node.js 18+",
          "npm, pnpm, or yarn",
          "PostgreSQL (local or remote)",
          "Git",
        ],
        installation: `git clone https://github.com/your-username/agent-orchestrator.git
cd agent-orchestrator
npm install`,
        environment: `Create a .env file from .env.example.

Example values documented:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your_auth_secret"
OPENAI_API_KEY="your_model_provider_key"
GITHUB_TOKEN="optional_github_token"
REDIS_URL="optional_if_using_queue"`,
        connect: `Configure PostgreSQL via DATABASE_URL.
Run Prisma migrations:
npx prisma migrate dev`,
        downloadModels: "",
        run: `Development:
npm run dev

Build:
npm run build

Start production server:
npm run start

Prisma Studio:
npx prisma studio`,
      },
      decisionMaking: {
        cadence:
          "Event-driven orchestration: on task creation/update, dependency resolution, agent completion, review approval/rejection, or retry, recompute task readiness/blocking and enforce allowed status transitions and approval gates.",
        requestSample: `{
  "role": "Backend Engineer",
  "taskTitle": "Build auth API",
  "taskDescription": "Implement signup and login endpoints with JWT support.",
  "context": {
    "projectName": "Agent Orchestrator",
    "artifacts": ["Product requirements", "Technical design", "Auth acceptance criteria"],
    "dependencies": ["Auth architecture approved"]
  }
}`,
        responseSample: `{
  "outputSummary": "Implemented signup/login endpoints and JWT middleware.",
  "status": "waiting_review",
  "filesTouched": ["server/controllers/auth.ts", "server/services/auth.ts"],
  "blockers": [],
  "suggestedNextSteps": ["Run QA validation", "Trigger reviewer approval"]
}`,
      },
      decisionTriggers: [
        "Task created",
        "Task updated",
        "Dependency resolved",
        "Agent finished work",
        "Review approved or rejected",
        "Retry requested",
        "Reassign requested",
      ],
      opponentModeling: [
        "Agent capability and role matching for task assignment",
        "Per-agent status and current task tracking",
        "File/module overlap heuristics via FileTouchMap for conflict prediction",
        "Dependency chain analysis for blocker detection",
      ],
      metrics: [],
      disclaimer:
        "Docs explicitly describe this as MVP/hackathon planning material and not a final production spec; many implementation items are still unchecked in TASKS.md.",
    },
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
