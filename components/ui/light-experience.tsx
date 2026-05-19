"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import {
  ArrowUpRight,
  Download,
  FolderGit2,
  Link2,
  Mail,
} from "lucide-react";
import headshotFinal from "@/app/profile_picture/headshot_final.jpg";
import { aboutPageContent } from "@/lib/about";
import { lightModeContent } from "@/lib/light-mode-content";
import { projects } from "@/lib/projects";
import { AnimatedName } from "@/components/ui/animated-name";
import { SplineSceneBasic } from "@/components/ui/demo";
import LightProjectCard from "@/components/ui/light-project-card";
import RecentCommitsSection from "@/components/ui/recent-commits-section";
import TechStackSection from "@/components/ui/tech-stack-section";
import { WavyWhatIfText } from "@/components/ui/wavy-what-if-text";

const PROJECT_CARD_COUNT = projects.length;
const revealTransition: Transition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1],
};

function renderRichParagraph(
  paragraph: (typeof aboutPageContent.heroParagraphs)[number],
  keyPrefix: string
) {
  return (
    <p key={keyPrefix} className="text-base leading-8 text-neutral-700 md:text-lg">
      {paragraph.map((segment, index) => (
        <span
          key={`${keyPrefix}-${index}`}
          className={segment.strong ? "font-semibold text-[#d65a12]" : undefined}
        >
          {segment.text}
        </span>
      ))}
    </p>
  );
}

export default function LightExperience() {
  useEffect(() => {
    const timers: number[] = [];

    const clearHighlight = (element: Element) => {
      element.classList.remove("galaxy-highlight");
      void (element as HTMLElement).offsetWidth;
      element.classList.add("galaxy-highlight");
      timers.push(
        window.setTimeout(() => {
          element.classList.remove("galaxy-highlight");
        }, 1600)
      );
    };

    const highlightProjectFromHash = (attempt = 0) => {
      const hash = window.location.hash;

      if (!hash.startsWith("#project-")) {
        return;
      }

      const target = document.querySelector(hash);

      if (!target) {
        if (attempt < 12) {
          timers.push(
            window.setTimeout(() => {
              highlightProjectFromHash(attempt + 1);
            }, 120)
          );
        }
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "center" });
      clearHighlight(target);
    };

    const handleHashChange = () => {
      highlightProjectFromHash();
    };

    highlightProjectFromHash();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div
      className="min-h-svh bg-white text-neutral-950"
      style={{ fontFamily: 'var(--font-geist-sans), "IBM Plex Mono", sans-serif' }}
    >
      <div className="px-4 pb-2 pt-0 md:px-10" />

      <div className="px-4 pb-14 pt-24 md:px-10 md:pt-28">
        <section id="home" className="scroll-mt-28">
          <HeroSection />
        </section>
        <AboutSection />
        <TechStackSection />
        <RecentCommitsSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </div>
  );
}

function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={revealTransition}
      className="rounded-[2rem] border border-black/7 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.05)] md:p-5"
    >
      <div className="relative overflow-hidden rounded-[1.7rem] border border-black/8 bg-[#fbfaf8]">
        <SplineSceneBasic />
      </div>
    </motion.section>
  );
}

function AboutSection() {
  const resumeHref = aboutPageContent.statuses[0]?.ctaHref ?? "/resume";

  return (
    <section
      id="about"
      className="profile-dots relative mt-10 scroll-mt-28 rounded-3xl border border-black/5 bg-white px-4 py-10 md:px-8 md:py-12"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div className="relative isolate space-y-6">
          <div className="floating-accent-dots" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">About me</p>
            <AnimatedName
              text={lightModeContent.name}
              className="mt-2 text-4xl font-bold tracking-tight text-[#d65a12] drop-shadow-[0_4px_18px_rgba(214,90,18,0.2)] md:text-6xl"
            />
            <p className="mt-3 text-xl font-medium text-neutral-700">
              {lightModeContent.role}
            </p>
          </div>

          <div className="max-w-xl space-y-4">
            {aboutPageContent.heroParagraphs.map((paragraph, index) =>
              renderRichParagraph(paragraph, `about-paragraph-${index}`)
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              Contact
            </a>
            <a
              href={resumeHref}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
            >
              <Download className="h-4 w-4" strokeWidth={1.9} />
              Download Resume
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-neutral-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] md:h-96 md:w-96">
            <Image
              src={headshotFinal}
              alt="Portrait of Mohammed Nihad"
              fill
              priority
              sizes="(min-width: 768px) 384px, 288px"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,90,18,0.08),_transparent_58%)]" />
          </div>
        </div>
      </div>

      <div id="experiences" className="mx-auto mt-16 max-w-6xl scroll-mt-28">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
            Experiences
          </h3>
        </div>

        <div className="relative mt-8 pl-8 md:pl-10">
          <div
            className="absolute bottom-3 left-[7px] top-3 w-px bg-neutral-200 md:left-[9px]"
            aria-hidden="true"
          />

          <div className="space-y-8 md:space-y-10">
            {lightModeContent.experienceItems.map((item, index) => (
              <article key={`${item.title}-${index}`} className="relative">
                {item.title.includes("Bloom Energy") ? (
                  <div
                    className="absolute left-[-25px] top-1 h-4 w-4 rounded-full border border-emerald-300 bg-emerald-500 md:left-[-31px]"
                    aria-hidden="true"
                  />
                ) : (
                  <div
                    className="absolute left-[-25px] top-1 h-4 w-4 rounded-full border border-neutral-300 bg-neutral-900 md:left-[-31px]"
                    aria-hidden="true"
                  />
                )}

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                    {item.date}
                  </p>
                  <h4 className="text-lg font-semibold text-neutral-900 md:text-xl">
                    {item.title}
                  </h4>
                  <p className="max-w-3xl text-sm leading-7 text-neutral-600 md:text-base">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto mt-24 max-w-6xl scroll-mt-28">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h3
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={revealTransition}
          className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-6xl"
        >
          My Projects
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ ...revealTransition, delay: 0.12 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-8 text-neutral-500 md:text-2xl md:leading-10"
        >
          Things I built, most of these started with a
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...revealTransition, delay: 0.2 }}
        className="mt-4"
      >
        <WavyWhatIfText text="what if" />
      </motion.div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <LightProjectCard
            key={project.slug}
            project={project}
            index={index}
            total={PROJECT_CARD_COUNT}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const resumeHref = aboutPageContent.statuses[0]?.ctaHref ?? "/resume";

  return (
    <section
      id="contact"
      className="mx-auto mt-24 max-w-6xl scroll-mt-28 rounded-[2rem] border border-black/10 bg-white px-5 py-6 shadow-[0_20px_55px_rgba(0,0,0,0.06)] md:px-8 md:py-7"
    >
      <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={revealTransition}
            className="space-y-3"
          >
            <h3 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Contact Me
            </h3>
            <p className="max-w-xl text-base leading-8 text-neutral-600 md:text-lg">
              Got a project idea, opportunity, want to team up for a hackathon, or just want to chat? I&apos;d love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <MagneticContactCard
              href={lightModeContent.linkedin}
              target="_blank"
              rel="noreferrer"
              icon={<Link2 className="h-5 w-5" strokeWidth={1.8} />}
              eyebrow="Professional"
              title="LinkedIn"
              description="Find my profile and connect there."
              accent="dark"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Open profile
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </MagneticContactCard>

            <MagneticContactCard
              href={`mailto:${lightModeContent.email}`}
              icon={<Mail className="h-5 w-5" strokeWidth={1.8} />}
              eyebrow="Direct"
              title="Email Me"
              description={lightModeContent.email}
              accent="light"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Start an email
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </MagneticContactCard>

            <MagneticContactCard
              href={lightModeContent.github}
              target="_blank"
              rel="noreferrer"
              icon={<FolderGit2 className="h-5 w-5" strokeWidth={1.8} />}
              eyebrow="Code"
              title="GitHub"
              description="Browse the repos behind the portfolio."
              accent="subtle"
              fullWidth
              compact
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                Open GitHub
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </MagneticContactCard>

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ ...revealTransition, delay: 0.16 }}
          className="h-[560px] md:h-[640px] lg:h-[680px]"
        >
          <ContactTerminal resumeHref={resumeHref} />
        </motion.div>
      </div>
    </section>
  );
}

type TerminalLineKind = "command" | "output" | "success" | "error";

type TerminalTextLine = {
  id: number;
  type: "text";
  text: string;
  kind: TerminalLineKind;
};

type TerminalSecretFormLine = {
  id: number;
  type: "secret-form";
};

type TerminalLine = TerminalTextLine | TerminalSecretFormLine;

type SecretMessage = {
  number: number;
  name: string;
  message: string;
};

type SecretAccessState = {
  unlocked: boolean;
  visitorNumber: number | null;
  visitorTotal: number | null;
  messages: SecretMessage[];
  messagesLoaded: boolean;
  promptClosed: boolean;
  isUnlocking: boolean;
  unlockFailed: boolean;
};

type SecretSession = {
  visitorNumber: number;
  visitorTotal: number | null;
  promptClosed: boolean;
};

const TERMINAL_COMMAND_GLOW_CLASS =
  "text-[#d65a12] drop-shadow-[0_0_10px_rgba(214,90,18,0.45)]";

const SECRET_SESSION_STORAGE_KEY = "nihad-os-secret-access";
const PUBLIC_VISITOR_COUNT_START = 300;
const SECRET_SEPARATOR = "———————————————————————";

const INITIAL_SECRET_ACCESS: SecretAccessState = {
  unlocked: false,
  visitorNumber: null,
  visitorTotal: null,
  messages: [],
  messagesLoaded: false,
  promptClosed: false,
  isUnlocking: false,
  unlockFailed: false,
};

function isSecretMessage(value: unknown): value is SecretMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<SecretMessage>;

  return (
    Number.isInteger(entry.number) &&
    typeof entry.name === "string" &&
    typeof entry.message === "string"
  );
}

function readSecretSession(): SecretSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.sessionStorage.getItem(SECRET_SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsed = JSON.parse(rawSession) as Partial<SecretSession>;
    const visitorNumber = Number(parsed.visitorNumber);
    const visitorTotal = Number(parsed.visitorTotal);

    if (!Number.isInteger(visitorNumber) || visitorNumber < 1) {
      return null;
    }

    return {
      visitorNumber,
      visitorTotal: Number.isInteger(visitorTotal) && visitorTotal >= 1 ? visitorTotal : null,
      promptClosed: parsed.promptClosed === true,
    };
  } catch {
    return null;
  }
}

function writeSecretSession(
  visitorNumber: number,
  promptClosed: boolean,
  visitorTotal: number | null
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      SECRET_SESSION_STORAGE_KEY,
      JSON.stringify({ visitorNumber, visitorTotal, promptClosed })
    );
  } catch {
    // The active component state still carries the unlock if storage is blocked.
  }
}

function formatOrdinal(value: number) {
  const remainder = value % 100;

  if (remainder >= 11 && remainder <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

function normalizeVisitorTotal(visitorTotal: number | null, visitorNumber: number) {
  return Math.max(
    Number.isInteger(visitorTotal) && visitorTotal !== null
      ? visitorTotal
      : PUBLIC_VISITOR_COUNT_START,
    PUBLIC_VISITOR_COUNT_START,
    visitorNumber
  );
}

function formatSecretMessages(messages: SecretMessage[]) {
  if (!messages.length) {
    return "  No messages have been left yet.";
  }

  return messages
    .map((entry) => {
      const name = entry.name.trim() || "Anonymous";
      const message = entry.message.replace(/"/g, '\\"');

      return `  #${entry.number} · ${name}: "${message}"`;
    })
    .join("\n");
}

function buildSecretDossier(
  visitorNumber: number,
  visitorTotal: number | null,
  messages: SecretMessage[]
) {
  const normalizedVisitorTotal = normalizeVisitorTotal(visitorTotal, visitorNumber);

  return [
    "DECRYPTED. ACCESSING CLASSIFIED DOSSIER...",
    "",
    `NIHAD_OS: You are the ${formatOrdinal(visitorNumber)} person out of ${normalizedVisitorTotal.toLocaleString()} visitors to reach this far.`,
    "",
    "BREACH COMPLETE.",
    "You're one of the few who made it this far.",
    "Most people just scroll portfolios.",
    "You played the game.",
    "That's exactly how I approach engineering.",
    "— Mohammed",
    "",
    SECRET_SEPARATOR,
    "MESSAGES FROM THOSE WHO CAME BEFORE:",
    "",
    formatSecretMessages(messages),
    "",
    SECRET_SEPARATOR,
    "OPTIONAL: Leave a message for those who follow.",
  ].join("\n");
}

const TERMINAL_COMMANDS = [
  "help",
  "whoami",
  "status",
  "projects",
  "skills",
  "contact",
  "resume",
  "clear",
  "start game",
  "sudo hire me",
  "ls secrets/",
] as const;

const TERMINAL_COMMAND_PATTERN = new RegExp(
  `^([\\s>]*)(?:${TERMINAL_COMMANDS.map((command) =>
    command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  ).join("|")})(?=\\s+-|\\s|$)`,
  "i"
);

const QUOTED_TERMINAL_COMMAND_PATTERN = new RegExp(
  `'(${TERMINAL_COMMANDS.map((command) =>
    command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  ).join("|")})'`,
  "gi"
);

function renderCommandHighlights(text: string): ReactNode {
  return text.split(/(\n)/).map((part, partIndex) => {
    if (part === "\n") {
      return part;
    }

    const leadingCommandMatch = part.match(TERMINAL_COMMAND_PATTERN);

    if (leadingCommandMatch) {
      const leading = leadingCommandMatch[1] ?? "";
      const command = leadingCommandMatch[0].slice(leading.length);

      return (
        <span key={`${partIndex}-${part}`}>
          {leading}
          <span className={TERMINAL_COMMAND_GLOW_CLASS}>{command}</span>
          {part.slice(leadingCommandMatch[0].length)}
        </span>
      );
    }

    const fragments: ReactNode[] = [];
    let lastIndex = 0;

    part.replace(QUOTED_TERMINAL_COMMAND_PATTERN, (match, command: string, offset: number) => {
      fragments.push(part.slice(lastIndex, offset), "'");
      fragments.push(
        <span key={`${partIndex}-${offset}`} className={TERMINAL_COMMAND_GLOW_CLASS}>
          {command}
        </span>
      );
      fragments.push("'");
      lastIndex = offset + match.length;
      return match;
    });

    if (!fragments.length) {
      return part;
    }

    fragments.push(part.slice(lastIndex));
    return <span key={`${partIndex}-${part}`}>{fragments}</span>;
  });
}

function ContactTerminal({ resumeHref }: { resumeHref: string }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 0,
      type: "text",
      text: "NIHAD_OS boot complete. Type 'help' for available commands.",
      kind: "output",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [secretAccess, setSecretAccess] = useState<SecretAccessState>(INITIAL_SECRET_ACCESS);
  const [isSecretMessageSubmitting, setIsSecretMessageSubmitting] = useState(false);
  const lineIdRef = useRef(1);
  const typeTimerRef = useRef<number | null>(null);
  const secretAccessRef = useRef<SecretAccessState>(secretAccess);
  const secretUnlockRequestedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const terminalContent = useMemo(() => {
    const bio = aboutPageContent.heroParagraphs
      .map((paragraph) => paragraph.map((segment) => segment.text).join(""))
      .join(" ");

    const status = aboutPageContent.statuses
      .map((item) => `${item.label}: ${item.title} ${item.description}`)
      .join("\n");

    const projectList = projects
      .map((project) => {
        const links = [
          `/projects/${project.slug}`,
          ...(project.richDetail?.links
            .filter((link) => link.href.startsWith("http"))
            .map((link) => link.href) ?? []),
        ];

        return `${project.title}: ${project.description}\n  link: ${links.join(" | ")}`;
      })
      .join("\n\n");

    const skills = aboutPageContent.skillGroups
      .map((group) => `${group.title}: ${group.items.join(", ")}`)
      .join("\n");

    return {
      bio,
      contact: [
        `email: ${lightModeContent.email}`,
        `linkedin: ${lightModeContent.linkedin}`,
        `github: ${lightModeContent.github}`,
      ].join("\n"),
      projectList,
      skills,
      status,
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typeTimerRef.current) {
        window.clearInterval(typeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const savedSession = readSecretSession();

    if (!savedSession) {
      return;
    }

    secretUnlockRequestedRef.current = true;
    setSecretAccess((current) => ({
      ...current,
      unlocked: true,
      visitorNumber: savedSession.visitorNumber,
      visitorTotal: savedSession.visitorTotal,
      promptClosed: savedSession.promptClosed,
    }));
  }, []);

  useEffect(() => {
    secretAccessRef.current = secretAccess;
  }, [secretAccess]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  const addLine = (text: string, kind: TerminalLineKind) => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    setLines((current) => [...current, { id, type: "text", text, kind }]);
  };

  const addTypedLine = (
    text: string,
    kind: TerminalLineKind = "output",
    onComplete?: () => void
  ) => {
    if (typeTimerRef.current) {
      window.clearInterval(typeTimerRef.current);
    }

    const id = lineIdRef.current;
    lineIdRef.current += 1;
    let index = 0;
    setLines((current) => [...current, { id, type: "text", text: "", kind }]);

    typeTimerRef.current = window.setInterval(() => {
      index = Math.min(index + 4, text.length);
      setLines((current) =>
        current.map((line) =>
          line.type === "text" && line.id === id
            ? { ...line, text: text.slice(0, index) }
            : line
        )
      );

      if (index >= text.length && typeTimerRef.current) {
        window.clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
        onComplete?.();
      }
    }, 7);
  };

  const addSecretFormLine = () => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    setLines((current) => [
      ...current.filter((line) => line.type !== "secret-form"),
      { id, type: "secret-form" },
    ]);
  };

  const fetchSecretMessages = async () => {
    const current = secretAccessRef.current;

    if (current.messagesLoaded) {
      return current.messages;
    }

    const response = await fetch("/api/secrets/messages", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to load secret messages.");
    }

    const payload = (await response.json()) as { messages?: unknown[] };
    const messages = Array.isArray(payload.messages)
      ? payload.messages.filter(isSecretMessage)
      : [];

    setSecretAccess((state) => {
      const nextState = {
        ...state,
        messages,
        messagesLoaded: true,
      };
      secretAccessRef.current = nextState;
      return nextState;
    });

    return messages;
  };

  const fetchVisitorTotal = async () => {
    const currentTotal = secretAccessRef.current.visitorTotal;

    if (currentTotal) {
      return currentTotal;
    }

    const response = await fetch("/api/visitors", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { visitors?: unknown };
    const visitorTotal = Number(payload.visitors);

    if (!Number.isInteger(visitorTotal) || visitorTotal < 1) {
      return null;
    }

    setSecretAccess((state) => {
      const nextState = {
        ...state,
        visitorTotal,
      };
      secretAccessRef.current = nextState;
      return nextState;
    });

    return visitorTotal;
  };

  const closeSecretPrompt = () => {
    const { visitorNumber, visitorTotal } = secretAccessRef.current;

    if (visitorNumber) {
      writeSecretSession(visitorNumber, true, visitorTotal);
    }

    setSecretAccess((current) => {
      const nextState = {
        ...current,
        promptClosed: true,
      };
      secretAccessRef.current = nextState;
      return nextState;
    });
    setLines((current) => current.filter((line) => line.type !== "secret-form"));
  };

  const handleSecretMessageSubmit = async (values: { name: string; message: string }) => {
    const visitorNumber = secretAccessRef.current.visitorNumber;
    const message = values.message.trim();

    if (!visitorNumber || !message) {
      return;
    }

    setIsSecretMessageSubmitting(true);

    try {
      const response = await fetch("/api/secrets/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: visitorNumber,
          name: values.name.trim() || "Anonymous",
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to store secret message.");
      }

      const payload = (await response.json()) as { message?: unknown };
      const savedMessage = isSecretMessage(payload.message)
        ? payload.message
        : {
            number: visitorNumber,
            name: values.name.trim() || "Anonymous",
            message,
          };

      setSecretAccess((current) => {
        const nextState = {
          ...current,
          messages: [...current.messages, savedMessage],
          messagesLoaded: true,
        };
        secretAccessRef.current = nextState;
        return nextState;
      });
      closeSecretPrompt();
      addTypedLine("MESSAGE ENCRYPTED AND STORED.", "success");
    } catch {
      addTypedLine("MESSAGE STORAGE FAILED. TRY AGAIN LATER.", "error");
    } finally {
      setIsSecretMessageSubmitting(false);
    }
  };

  const handleSecretMessageSkip = () => {
    closeSecretPrompt();
    addTypedLine("MESSAGE ENCRYPTED AND STORED.", "success");
  };

  const revealSecrets = () => {
    const current = secretAccessRef.current;

    if (!current.unlocked) {
      if (current.isUnlocking) {
        addTypedLine("DECRYPTION HANDSHAKE IN PROGRESS. TRY AGAIN IN A MOMENT.", "output");
        return;
      }

      if (current.unlockFailed) {
        addTypedLine("CLASSIFIED DOSSIER SYNC FAILED. TRY AGAIN LATER.", "error");
        return;
      }

      addTypedLine("CLEARANCE LEVEL INSUFFICIENT. BEAT THE MAINFRAME FIRST.", "error");
      return;
    }

    if (!current.visitorNumber) {
      addTypedLine("CLASSIFIED DOSSIER SYNC FAILED. TRY AGAIN LATER.", "error");
      return;
    }

    void Promise.all([fetchSecretMessages(), fetchVisitorTotal()])
      .then(([messages, visitorTotal]) => {
        const visitorNumber = secretAccessRef.current.visitorNumber ?? current.visitorNumber;
        const currentVisitorTotal = secretAccessRef.current.visitorTotal ?? visitorTotal;

        if (!visitorNumber) {
          throw new Error("Missing visitor number.");
        }

        addTypedLine(buildSecretDossier(visitorNumber, currentVisitorTotal, messages), "success", () => {
          if (!secretAccessRef.current.promptClosed) {
            addSecretFormLine();
          }
        });
      })
      .catch(() => {
        addTypedLine("CLASSIFIED DOSSIER UNAVAILABLE. TRY AGAIN LATER.", "error");
      });
  };

  const handleGameComplete = useCallback(() => {
    const savedSession = readSecretSession();

    if (savedSession) {
      secretUnlockRequestedRef.current = true;
      setSecretAccess((current) => {
        const nextState = {
          ...current,
          unlocked: true,
          visitorNumber: savedSession.visitorNumber,
          visitorTotal: savedSession.visitorTotal,
          promptClosed: savedSession.promptClosed,
        };
        secretAccessRef.current = nextState;
        return nextState;
      });
      return;
    }

    if (secretUnlockRequestedRef.current) {
      return;
    }

    secretUnlockRequestedRef.current = true;
    setSecretAccess((current) => {
      const nextState = {
        ...current,
        isUnlocking: true,
        unlockFailed: false,
      };
      secretAccessRef.current = nextState;
      return nextState;
    });

    void fetch("/api/secrets/complete", {
      method: "POST",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to unlock secrets.");
        }

        return (await response.json()) as {
          number?: unknown;
          visitorTotal?: unknown;
          messages?: unknown[];
        };
      })
      .then((payload) => {
        const visitorNumber = Number(payload.number);
        const visitorTotal = Number(payload.visitorTotal);

        if (!Number.isInteger(visitorNumber) || visitorNumber < 1) {
          throw new Error("Invalid visitor number.");
        }

        const normalizedVisitorTotal = normalizeVisitorTotal(
          Number.isInteger(visitorTotal) && visitorTotal >= 1 ? visitorTotal : null,
          visitorNumber
        );
        const messages = Array.isArray(payload.messages)
          ? payload.messages.filter(isSecretMessage)
          : [];
        writeSecretSession(visitorNumber, false, normalizedVisitorTotal);

        const nextState = {
          unlocked: true,
          visitorNumber,
          visitorTotal: normalizedVisitorTotal,
          messages,
          messagesLoaded: true,
          promptClosed: false,
          isUnlocking: false,
          unlockFailed: false,
        };

        secretAccessRef.current = nextState;
        setSecretAccess(nextState);
      })
      .catch(() => {
        setSecretAccess((current) => {
          const nextState = {
            ...current,
            isUnlocking: false,
            unlockFailed: true,
          };
          secretAccessRef.current = nextState;
          return nextState;
        });
      });
  }, []);

  const runCommand = (rawInput: string) => {
    const submitted = rawInput.trim();
    const command = submitted.toLowerCase().replace(/\s+/g, " ");

    if (!submitted) {
      return;
    }

    addLine(`> ${submitted}`, "command");
    setHistory((current) => [...current, submitted]);
    setHistoryIndex(null);
    setInput("");

    if (command === "clear") {
      if (typeTimerRef.current) {
        window.clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
      }
      setLines([]);
      return;
    }

    if (command === "resume") {
      addTypedLine("Resume download ready. Opening PDF...", "success");
      window.setTimeout(() => {
        window.location.href = resumeHref;
      }, 350);
      return;
    }

    if (command === "sudo hire me") {
      addTypedLine("Access granted. Redirecting to contact form...", "success");
      return;
    }

    if (command === "ls secrets/") {
      revealSecrets();
      return;
    }

    if (command === "start game") {
      addTypedLine("GAME MODULE LOADING...", "success");
      window.setTimeout(() => {
        setIsGameActive(true);
      }, 450);
      return;
    }

    const outputs: Partial<Record<(typeof TERMINAL_COMMANDS)[number], string>> = {
      help: [
        "Available commands:",
        "help - list commands",
        "whoami - short bio",
        "status - current internship and search signal",
        "projects - real projects and links",
        "skills - tech stack",
        "contact - contact links",
        "resume - download resume PDF",
        "clear - clear terminal",
        "start game - launch stealth extraction module",
        "sudo hire me - request elevated access",
        "ls secrets/ - inspect restricted path",
      ].join("\n"),
      whoami: terminalContent.bio,
      status: terminalContent.status,
      projects: terminalContent.projectList,
      skills: terminalContent.skills,
      contact: terminalContent.contact,
    };

    const output = outputs[command as keyof typeof outputs];

    if (output) {
      addTypedLine(output);
      return;
    }

    addTypedLine(
      `command not found: ${submitted}. Type 'help' for available commands.`,
      "error"
    );
  };

  const autocompleteCommand = () => {
    const normalizedInput = input.toLowerCase();
    const matches = TERMINAL_COMMANDS.filter((command) => command.startsWith(normalizedInput));

    if (matches.length === 1) {
      setInput(matches[0]);
      return;
    }

    if (matches.length > 1 && normalizedInput) {
      const commonPrefix = matches.reduce<string>((prefix, command) => {
        let index = 0;

        while (index < prefix.length && prefix[index] === command[index]) {
          index += 1;
        }

        return prefix.slice(0, index);
      }, matches[0]);

      if (commonPrefix.length > normalizedInput.length) {
        setInput(commonPrefix);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      runCommand(input);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!history.length) {
        return;
      }

      const nextIndex =
        historyIndex === null
          ? history.length - 1
          : historyIndex === 0
            ? history.length - 1
            : historyIndex - 1;

      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!history.length || historyIndex === null) {
        return;
      }

      const nextIndex = historyIndex === history.length - 1 ? 0 : historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      autocompleteCommand();
    }
  };

  if (isGameActive) {
    return (
      <StealthResumeGame
        resumeHref={resumeHref}
        onComplete={handleGameComplete}
        onExit={() => {
          setIsGameActive(false);
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
      />
    );
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.9rem] border border-black/8 bg-white shadow-[0_22px_55px_rgba(0,0,0,0.07)]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-black/8 bg-[#fbfaf8] px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
          NIHAD_OS v1.0
        </p>
        <div className="w-[52px]" aria-hidden="true" />
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 font-mono text-sm leading-7 text-neutral-700 md:px-5 md:py-5"
      >
        <div className="space-y-3">
          {lines.map((line) =>
            line.type === "secret-form" ? (
              <SecretMessageForm
                key={line.id}
                isSubmitting={isSecretMessageSubmitting}
                onSkip={handleSecretMessageSkip}
                onSubmit={handleSecretMessageSubmit}
              />
            ) : (
              <pre
                key={line.id}
                className={`whitespace-pre-wrap break-words font-mono ${
                  line.kind === "command" || line.kind === "success"
                    ? TERMINAL_COMMAND_GLOW_CLASS
                    : line.kind === "error"
                      ? "text-red-600"
                      : "text-neutral-700"
                }`}
              >
                {renderCommandHighlights(line.text)}
              </pre>
            )
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 border-t border-black/8 bg-[#fbfaf8] px-4 py-3 font-mono text-sm md:px-5">
        <span className={TERMINAL_COMMAND_GLOW_CLASS}>&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setHistoryIndex(null);
          }}
          onKeyDown={handleKeyDown}
          className={`min-w-0 flex-1 bg-transparent font-mono outline-none placeholder:text-neutral-300 ${TERMINAL_COMMAND_GLOW_CLASS}`}
          spellCheck={false}
          autoComplete="off"
          aria-label="NIHAD OS terminal command"
          placeholder="type a command"
        />
        <span
          className="h-5 w-2 animate-pulse bg-[#d65a12] shadow-[0_0_10px_rgba(214,90,18,0.45)]"
          aria-hidden="true"
        />
      </label>
    </div>
  );
}

function SecretMessageForm({
  isSubmitting,
  onSkip,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSkip: () => void;
  onSubmit: (values: { name: string; message: string }) => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const canSubmit = message.trim().length > 0 && !isSubmitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit({ name, message });
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(event) => event.stopPropagation()}
      className="space-y-3 rounded-lg border border-[#d65a12]/35 bg-[#fffdf8] p-3 font-mono text-sm text-neutral-800"
    >
      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
          NAME (optional):
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={64}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#d65a12] focus:ring-2 focus:ring-[#d65a12]/20"
          placeholder="Anonymous"
          disabled={isSubmitting}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
          MESSAGE:
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={360}
          rows={3}
          className="w-full resize-none rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#d65a12] focus:ring-2 focus:ring-[#d65a12]/20"
          placeholder="message here"
          disabled={isSubmitting}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md border border-[#d65a12] bg-[#d65a12] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#bd4f10] disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          SUBMIT
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neutral-800 transition hover:border-[#d65a12] hover:text-[#d65a12] disabled:cursor-not-allowed disabled:opacity-60"
        >
          SKIP
        </button>
      </div>
    </form>
  );
}

type Direction = "up" | "right" | "down" | "left";

type GridPoint = {
  x: number;
  y: number;
};

type GuardPlan = {
  path: GridPoint[];
};

type CameraPlan = GridPoint & {
  directions: Direction[];
};

type LaserPlan =
  | { orientation: "horizontal"; y: number; x1: number; x2: number }
  | { orientation: "vertical"; x: number; y1: number; y2: number };

type FloorLayout = {
  cols: number;
  rows: number;
  start: GridPoint;
  server: GridPoint;
  walls: GridPoint[];
  guards: GuardPlan[];
  cameras?: CameraPlan[];
  lasers?: LaserPlan[];
};

type GuardRuntime = GuardPlan & {
  step: number;
  forward: 1 | -1;
  dir: Direction;
};

type CameraRuntime = CameraPlan & {
  dir: Direction;
  dirIndex: number;
};

type DetectorRuntime = GridPoint & {
  dir: Direction;
  range: number;
  kind: "guard" | "camera";
};

type GameRuntime = {
  floorIndex: number;
  agent: GridPoint;
  guards: GuardRuntime[];
  cameras: CameraRuntime[];
  laserActive: boolean;
  mode: "playing" | "compromised" | "floor-clear" | "complete";
  completeText: string;
  completeReady: boolean;
};

const MISSION_COMPLETE_LINES = [
  "BREACH SUCCESSFUL.",
  "ACCESSING CLASSIFIED FILE...",
  "nihad_resume.enc — DECRYPTED.",
];

const GUARD_VISION_RANGE = 3;
const CAMERA_VISION_RANGE = 3;
const PATROL_TICK_MS = 620;
const LASER_TICK_MS = 900;

const range = (start: number, end: number) =>
  Array.from({ length: Math.abs(end - start) + 1 }, (_, index) =>
    start <= end ? start + index : start - index
  );

const horizontalPath = (y: number, x1: number, x2: number) =>
  range(x1, x2).map((x) => ({ x, y }));

const verticalPath = (x: number, y1: number, y2: number) =>
  range(y1, y2).map((y) => ({ x, y }));

const FLOOR_LAYOUTS: FloorLayout[] = [
  {
    cols: 13,
    rows: 9,
    start: { x: 1, y: 7 },
    server: { x: 11, y: 1 },
    walls: [
      ...range(2, 10).filter((x) => x !== 5).map((x) => ({ x, y: 2 })),
      ...range(2, 11).filter((x) => x !== 9).map((x) => ({ x, y: 5 })),
      ...range(3, 6).filter((y) => y !== 5).map((y) => ({ x: 7, y })),
    ],
    guards: [
      { path: horizontalPath(1, 3, 8) },
      { path: verticalPath(11, 6, 7) },
    ],
  },
  {
    cols: 14,
    rows: 10,
    start: { x: 1, y: 8 },
    server: { x: 12, y: 1 },
    walls: [
      ...range(1, 11).filter((x) => x !== 3 && x !== 7 && x !== 10).map((x) => ({ x, y: 3 })),
      ...range(2, 12).filter((x) => x !== 5 && x !== 9).map((x) => ({ x, y: 6 })),
      ...range(4, 8).filter((y) => y !== 5 && y !== 7).map((y) => ({ x: 8, y })),
    ],
    guards: [
      { path: horizontalPath(1, 4, 9) },
      { path: verticalPath(12, 5, 8) },
    ],
    cameras: [
      { x: 3, y: 4, directions: ["right", "down", "left", "up"] },
    ],
  },
  {
    cols: 15,
    rows: 10,
    start: { x: 1, y: 8 },
    server: { x: 13, y: 1 },
    walls: [
      ...range(2, 13).filter((x) => x !== 4 && x !== 8 && x !== 11).map((x) => ({ x, y: 2 })),
      ...range(1, 11).filter((x) => x !== 3 && x !== 7).map((x) => ({ x, y: 5 })),
      ...range(4, 13).filter((x) => x !== 7 && x !== 10).map((x) => ({ x, y: 7 })),
      ...range(3, 8).filter((y) => y !== 4 && y !== 5).map((y) => ({ x: 6, y })),
    ],
    guards: [
      { path: horizontalPath(0, 3, 8) },
      { path: horizontalPath(4, 8, 12) },
      { path: verticalPath(13, 5, 8) },
    ],
    cameras: [
      { x: 11, y: 3, directions: ["down", "left", "up", "right"] },
    ],
    lasers: [
      { orientation: "horizontal", y: 4, x1: 2, x2: 5 },
      { orientation: "vertical", x: 10, y1: 4, y2: 7 },
    ],
  },
];

function pointKey(point: GridPoint) {
  return `${point.x}:${point.y}`;
}

function pointsEqual(a: GridPoint, b: GridPoint) {
  return a.x === b.x && a.y === b.y;
}

function isOutOfBounds(layout: FloorLayout, point: GridPoint) {
  return point.x < 0 || point.y < 0 || point.x >= layout.cols || point.y >= layout.rows;
}

function isWall(layout: FloorLayout, point: GridPoint) {
  return layout.walls.some((wall) => pointsEqual(wall, point));
}

function directionBetween(from: GridPoint, to?: GridPoint): Direction {
  if (!to) {
    return "right";
  }

  if (to.x > from.x) {
    return "right";
  }

  if (to.x < from.x) {
    return "left";
  }

  if (to.y > from.y) {
    return "down";
  }

  return "up";
}

function createGameRuntime(floorIndex: number): GameRuntime {
  const layout = FLOOR_LAYOUTS[floorIndex];

  return {
    floorIndex,
    agent: { ...layout.start },
    guards: layout.guards.map((guard) => ({
      path: guard.path,
      step: 0,
      forward: 1,
      dir: directionBetween(guard.path[0], guard.path[1]),
    })),
    cameras: (layout.cameras ?? []).map((camera) => ({
      ...camera,
      dir: camera.directions[0],
      dirIndex: 0,
    })),
    laserActive: false,
    mode: "playing",
    completeText: "",
    completeReady: false,
  };
}

function cloneGameRuntime(runtime: GameRuntime): GameRuntime {
  return {
    ...runtime,
    agent: { ...runtime.agent },
    guards: runtime.guards.map((guard) => ({ ...guard })),
    cameras: runtime.cameras.map((camera) => ({ ...camera })),
  };
}

function isBlocked(layout: FloorLayout, point: GridPoint) {
  return isOutOfBounds(layout, point) || isWall(layout, point);
}

function advancePatrols(runtime: GameRuntime) {
  runtime.guards.forEach((guard) => {
    let nextStep = guard.step + guard.forward;

    if (!guard.path[nextStep]) {
      guard.forward = guard.forward === 1 ? -1 : 1;
      nextStep = guard.step + guard.forward;
    }

    if (guard.path[nextStep]) {
      guard.dir = directionBetween(guard.path[guard.step], guard.path[nextStep]);
      guard.step = nextStep;
    }
  });

  runtime.cameras.forEach((camera) => {
    camera.dirIndex = (camera.dirIndex + 1) % camera.directions.length;
    camera.dir = camera.directions[camera.dirIndex];
  });
}

function detectorPosition(detector: DetectorRuntime, distance: number, offset: number) {
  if (detector.dir === "up") {
    return { x: detector.x + offset, y: detector.y - distance };
  }

  if (detector.dir === "down") {
    return { x: detector.x + offset, y: detector.y + distance };
  }

  if (detector.dir === "left") {
    return { x: detector.x - distance, y: detector.y + offset };
  }

  return { x: detector.x + distance, y: detector.y + offset };
}

function detectorVisiblePoints(layout: FloorLayout, detector: DetectorRuntime) {
  const visible = new Map<string, GridPoint>();
  const maxSpread = Math.max(0, Math.floor(detector.range / 2));

  for (let rayOffset = -maxSpread; rayOffset <= maxSpread; rayOffset += 1) {
    for (let distance = 1; distance <= detector.range; distance += 1) {
      const offset = Math.round((rayOffset * distance) / detector.range);
      const point = detectorPosition(detector, distance, offset);

      if (isOutOfBounds(layout, point)) {
        break;
      }

      if (isWall(layout, point)) {
        break;
      }

      visible.set(pointKey(point), point);
    }
  }

  return Array.from(visible.values());
}

function isInVision(layout: FloorLayout, detector: DetectorRuntime, point: GridPoint) {
  return detectorVisiblePoints(layout, detector).some((visiblePoint) =>
    pointsEqual(visiblePoint, point)
  );
}

function getDetectors(runtime: GameRuntime): DetectorRuntime[] {
  return [
    ...runtime.guards.map((guard) => ({
      ...guard.path[guard.step],
      dir: guard.dir,
      range: GUARD_VISION_RANGE,
      kind: "guard" as const,
    })),
    ...runtime.cameras.map((camera) => ({
      x: camera.x,
      y: camera.y,
      dir: camera.dir,
      range: CAMERA_VISION_RANGE,
      kind: "camera" as const,
    })),
  ];
}

function isLaserHit(layout: FloorLayout, agent: GridPoint, laserActive: boolean) {
  if (!laserActive) {
    return false;
  }

  return (layout.lasers ?? []).some((laser) => {
    if (laser.orientation === "horizontal") {
      return agent.y === laser.y && agent.x >= laser.x1 && agent.x <= laser.x2;
    }

    return agent.x === laser.x && agent.y >= laser.y1 && agent.y <= laser.y2;
  });
}

function isDetected(runtime: GameRuntime) {
  const layout = FLOOR_LAYOUTS[runtime.floorIndex];

  return (
    getDetectors(runtime).some((detector) => {
      if (pointsEqual(detector, runtime.agent)) {
        return true;
      }

      return isInVision(layout, detector, runtime.agent);
    }) || isLaserHit(layout, runtime.agent, runtime.laserActive)
  );
}

function StealthResumeGame({
  resumeHref,
  onComplete,
  onExit,
}: {
  resumeHref: string;
  onComplete: () => void;
  onExit: () => void;
}) {
  const gameRef = useRef<GameRuntime>(createGameRuntime(0));
  const [view, setView] = useState<GameRuntime>(() => createGameRuntime(0));
  const rafRef = useRef<number | null>(null);
  const lastGuardTickRef = useRef(0);
  const lastLaserTickRef = useRef(0);
  const completeTimerRef = useRef<number | null>(null);
  const floorTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const syncView = useCallback(() => {
    setView(cloneGameRuntime(gameRef.current));
  }, []);

  const clearTypewriter = useCallback(() => {
    if (completeTimerRef.current) {
      window.clearInterval(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  const playTone = useCallback((frequencies: number[], duration = 0.08, gap = 0.03) => {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;

    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * (duration + gap);
      const end = start + duration;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(end + 0.02);
    });
  }, []);

  const playSound = useCallback(
    (sound: "move" | "compromise" | "floor" | "complete") => {
      if (sound === "move") {
        playTone([430], 0.035, 0);
        return;
      }

      if (sound === "compromise") {
        playTone([92, 74], 0.16, 0.015);
        return;
      }

      if (sound === "floor") {
        playTone([440, 554, 659], 0.09, 0.035);
        return;
      }

      playTone([523, 784], 0.2, 0.055);
    },
    [playTone]
  );

  const startFloor = useCallback(
    (floorIndex: number) => {
      clearTypewriter();

      if (floorTimerRef.current) {
        window.clearTimeout(floorTimerRef.current);
        floorTimerRef.current = null;
      }

      gameRef.current = createGameRuntime(floorIndex);
      lastGuardTickRef.current = 0;
      lastLaserTickRef.current = 0;
      syncView();
      window.setTimeout(() => surfaceRef.current?.focus(), 0);
    },
    [clearTypewriter, syncView]
  );

  const startMissionComplete = useCallback(() => {
    clearTypewriter();
    playSound("complete");
    onComplete();

    const runtime = gameRef.current;
    const fullText = MISSION_COMPLETE_LINES.join("\n");
    runtime.mode = "complete";
    runtime.completeText = "";
    runtime.completeReady = false;
    syncView();

    let index = 0;
    completeTimerRef.current = window.setInterval(() => {
      index += 1;
      runtime.completeText = fullText.slice(0, index);
      syncView();

      if (index >= fullText.length) {
        clearTypewriter();
        runtime.completeReady = true;
        syncView();
      }
    }, 42);
  }, [clearTypewriter, onComplete, playSound, syncView]);

  const triggerCompromise = useCallback(() => {
    const runtime = gameRef.current;

    if (runtime.mode !== "playing") {
      return;
    }

    runtime.mode = "compromised";
    playSound("compromise");
    syncView();
  }, [playSound, syncView]);

  useEffect(() => {
    startFloor(0);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }

      if (floorTimerRef.current) {
        window.clearTimeout(floorTimerRef.current);
      }

      clearTypewriter();
      audioContextRef.current?.close();
    };
  }, [clearTypewriter, startFloor]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      const runtime = gameRef.current;

      if (runtime.mode === "playing") {
        if (!lastGuardTickRef.current) {
          lastGuardTickRef.current = timestamp;
        }

        if (timestamp - lastGuardTickRef.current >= PATROL_TICK_MS) {
          advancePatrols(runtime);
          lastGuardTickRef.current = timestamp;

          if (isDetected(runtime)) {
            triggerCompromise();
          } else {
            syncView();
          }
        }

        if (FLOOR_LAYOUTS[runtime.floorIndex].lasers?.length) {
          if (!lastLaserTickRef.current) {
            lastLaserTickRef.current = timestamp;
          }

          if (timestamp - lastLaserTickRef.current >= LASER_TICK_MS) {
            runtime.laserActive = !runtime.laserActive;
            lastLaserTickRef.current = timestamp;

            if (isDetected(runtime)) {
              triggerCompromise();
            } else {
              syncView();
            }
          }
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [syncView, triggerCompromise]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const runtime = gameRef.current;

      if (runtime.mode !== "playing") {
        return;
      }

      const deltas: Partial<Record<string, GridPoint>> = {
        w: { x: 0, y: -1 },
        a: { x: -1, y: 0 },
        s: { x: 0, y: 1 },
        d: { x: 1, y: 0 },
        arrowup: { x: 0, y: -1 },
        arrowleft: { x: -1, y: 0 },
        arrowdown: { x: 0, y: 1 },
        arrowright: { x: 1, y: 0 },
      };
      const delta = deltas[event.key.toLowerCase()];

      if (!delta) {
        return;
      }

      event.preventDefault();
      const layout = FLOOR_LAYOUTS[runtime.floorIndex];
      const nextAgent = {
        x: runtime.agent.x + delta.x,
        y: runtime.agent.y + delta.y,
      };

      if (isBlocked(layout, nextAgent)) {
        return;
      }

      runtime.agent = nextAgent;
      playSound("move");

      if (isDetected(runtime)) {
        triggerCompromise();
        return;
      }

      if (pointsEqual(nextAgent, layout.server)) {
        runtime.mode = "floor-clear";
        playSound("floor");
        syncView();

        floorTimerRef.current = window.setTimeout(() => {
          if (runtime.floorIndex === FLOOR_LAYOUTS.length - 1) {
            startMissionComplete();
            return;
          }

          startFloor(runtime.floorIndex + 1);
        }, 520);
        return;
      }

      syncView();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playSound, startFloor, startMissionComplete, syncView, triggerCompromise]);

  const runtime = view;
  const layout = FLOOR_LAYOUTS[runtime.floorIndex];
  const wallKeys = new Set(layout.walls.map(pointKey));
  const guardByKey = new Map(runtime.guards.map((guard) => [pointKey(guard.path[guard.step]), guard]));
  const cameraByKey = new Map(runtime.cameras.map((camera) => [pointKey(camera), camera]));
  const detectors = getDetectors(runtime);
  const radarKeys = new Set(
    detectors.flatMap((detector) => detectorVisiblePoints(layout, detector).map(pointKey))
  );
  const cells = Array.from({ length: layout.cols * layout.rows }, (_, index) => ({
    x: index % layout.cols,
    y: Math.floor(index / layout.cols),
  }));

  return (
    <div
      ref={surfaceRef}
      tabIndex={0}
      className={`stealth-game-shell flex h-full min-h-0 flex-col overflow-hidden rounded-[1.9rem] border border-black/8 bg-white shadow-[0_22px_55px_rgba(0,0,0,0.07)] outline-none ${
        runtime.mode === "compromised" ? "stealth-compromised" : ""
      }`}
      aria-label="Stealth resume extraction game"
    >
      <div className="flex items-center justify-between border-b border-black/8 bg-[#fbfaf8] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <p className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
            FLOOR {runtime.floorIndex + 1} / 3
          </p>
        </div>
        <p className="hidden font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500 sm:block">
          NIHAD_OS v1.0
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700 shadow-sm transition hover:border-neutral-900 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          ✕ Exit
        </button>
      </div>

      {runtime.mode === "complete" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-white px-6 text-center">
          <pre className="min-h-[112px] whitespace-pre-wrap text-left font-mono text-lg font-semibold leading-9 tracking-normal text-neutral-950">
            {runtime.completeText}
            {!runtime.completeReady ? <span className="animate-pulse text-[#d65a12]">_</span> : null}
          </pre>

          {runtime.completeReady ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={resumeHref}
                  download
                  className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
                >
                  Download Resume
                </a>
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  Return to Terminal
                </button>
              </div>
              <p className="font-mono text-xs text-[#d65a12]/80">
                🔓 ls secrets/ has been unlocked in the terminal.
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col justify-center bg-white p-4">
          <div
            className="relative mx-auto grid w-full max-w-[560px] overflow-hidden rounded-[1.15rem] border border-black/10 bg-white shadow-inner"
            style={{
              aspectRatio: `${layout.cols} / ${layout.rows}`,
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
            }}
          >
            {(layout.lasers ?? []).map((laser, index) => {
              const activeClass = runtime.laserActive
                ? "bg-[#ef3b2d] shadow-[0_0_14px_rgba(239,59,45,0.7)]"
                : "bg-neutral-300";
              const laserStyle =
                laser.orientation === "horizontal"
                  ? {
                      left: `${(laser.x1 / layout.cols) * 100}%`,
                      top: `${((laser.y + 0.46) / layout.rows) * 100}%`,
                      width: `${((laser.x2 - laser.x1 + 1) / layout.cols) * 100}%`,
                      height: "2px",
                    }
                  : {
                      left: `${((laser.x + 0.46) / layout.cols) * 100}%`,
                      top: `${(laser.y1 / layout.rows) * 100}%`,
                      width: "2px",
                      height: `${((laser.y2 - laser.y1 + 1) / layout.rows) * 100}%`,
                    };

              return (
                <span
                  key={`${laser.orientation}-${index}`}
                  className={`pointer-events-none absolute z-20 ${activeClass}`}
                  style={laserStyle}
                  aria-hidden="true"
                />
              );
            })}

            {cells.map((cell) => {
              const key = pointKey(cell);
              const isWall = wallKeys.has(key);
              const isServer = pointsEqual(cell, layout.server);
              const guard = guardByKey.get(key);
              const camera = cameraByKey.get(key);
              const isAgent = pointsEqual(cell, runtime.agent);
              const isRadarCell = radarKeys.has(key);

              return (
                <div
                  key={key}
                  className={`relative z-10 flex items-center justify-center border border-neutral-200/80 ${
                    isWall ? "bg-neutral-200" : "bg-white"
                  } ${isServer ? "bg-[#f5f5f2]" : ""}`}
                >
                  {isRadarCell ? (
                    <span
                      className="pointer-events-none absolute inset-0 z-0 bg-[#f58220]/18 ring-1 ring-inset ring-[#d65a12]/20"
                      aria-hidden="true"
                    />
                  ) : null}
                  {isServer ? (
                    <span className="relative z-40 font-mono text-[7px] font-bold leading-none text-neutral-950 sm:text-[8px]">
                      [SERVER]
                    </span>
                  ) : null}
                  {camera ? (
                    <span
                      className="absolute z-40 h-[42%] w-[42%] rotate-45 rounded-[2px] bg-neutral-800"
                      aria-hidden="true"
                    />
                  ) : null}
                  {guard ? (
                    <span className="absolute z-40 h-[48%] w-[48%] rounded-[3px] bg-neutral-950" aria-hidden="true" />
                  ) : null}
                  {isAgent ? (
                    <span className="absolute z-50 h-[38%] w-[38%] rounded-full bg-neutral-950 ring-2 ring-white" aria-hidden="true" />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            <span>Objective: Extract [SERVER]</span>
            <span className="text-red-600">Move: WASD / Arrows</span>
            <span>{runtime.mode === "floor-clear" ? "Floor Clear" : "Live Patrol"}</span>
          </div>

          {runtime.mode === "compromised" ? (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/92 px-6 text-center">
              <div className="stealth-glitch text-3xl font-black uppercase tracking-[0.14em] text-red-600">
                IDENTITY COMPROMISED
              </div>
              <p className="mt-3 font-mono text-sm font-semibold uppercase tracking-[0.24em] text-neutral-950">
                ACCESS REVOKED
              </p>
              <button
                type="button"
                onClick={() => startFloor(runtime.floorIndex)}
                className="mt-7 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
              >
                [ RETRY FLOOR ]
              </button>
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        .stealth-game-shell {
          position: relative;
        }

        .stealth-compromised {
          animation: stealth-red-flash 420ms ease-out;
        }

        .stealth-compromised::after {
          animation: stealth-scan 620ms linear infinite;
          background: repeating-linear-gradient(
            to bottom,
            rgba(239, 68, 68, 0.16),
            rgba(239, 68, 68, 0.16) 1px,
            transparent 1px,
            transparent 5px
          );
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
          z-index: 60;
        }

        .stealth-glitch {
          animation: stealth-glitch 700ms steps(2, end) infinite;
        }

        @keyframes stealth-red-flash {
          0%, 100% {
            box-shadow: 0 22px 55px rgba(0, 0, 0, 0.07);
          }

          22%, 58% {
            box-shadow: 0 0 0 999px rgba(239, 68, 68, 0.2), 0 0 44px rgba(239, 68, 68, 0.55);
          }
        }

        @keyframes stealth-scan {
          from {
            transform: translateY(-10px);
          }

          to {
            transform: translateY(10px);
          }
        }

        @keyframes stealth-glitch {
          0%, 100% {
            transform: translate(0);
          }

          25% {
            transform: translate(2px, -1px);
          }

          50% {
            transform: translate(-2px, 1px);
          }

          75% {
            transform: translate(1px, 1px);
          }
        }
      `}</style>
    </div>
  );
}

type MagneticContactCardProps = {
  href: string;
  target?: string;
  rel?: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accent: "dark" | "light" | "subtle";
  fullWidth?: boolean;
  compact?: boolean;
  children: ReactNode;
};

function MagneticContactCard({
  href,
  target,
  rel,
  icon,
  eyebrow,
  title,
  description,
  accent,
  fullWidth = false,
  compact = false,
  children,
}: MagneticContactCardProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 });
  const glowX = useTransform(springX, [-16, 16], ["44%", "56%"]);
  const glowY = useTransform(springY, [-16, 16], ["44%", "56%"]);

  const accentStyles =
    accent === "dark"
      ? "border-neutral-900 bg-neutral-900 text-white"
      : accent === "light"
        ? "border-black/10 bg-white text-neutral-900"
        : "border-black/8 bg-neutral-50 text-neutral-900";

  const descriptionClass = accent === "dark" ? "text-white/72" : "text-neutral-500";
  const eyebrowClass = accent === "dark" ? "text-white/55" : "text-neutral-400";
  const iconClass = accent === "dark" ? "bg-white/10 text-white" : "bg-black/5 text-neutral-800";
  const glowColor =
    accent === "dark"
      ? "radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 62%)"
      : "radial-gradient(circle at center, rgba(17,17,17,0.06), transparent 62%)";

  const handleMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);

    x.set(offsetX * 0.12);
    y.set(offsetY * 0.12);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      className={`${fullWidth ? "sm:col-span-2" : ""} relative block overflow-hidden rounded-[1.75rem] border shadow-[0_14px_35px_rgba(0,0,0,0.05)] ${accentStyles}`}
    >
      <motion.div
        aria-hidden="true"
        style={reducedMotion ? undefined : { left: glowX, top: glowY }}
        className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
      >
        <div className="h-full w-full rounded-full" style={{ backgroundImage: glowColor }} />
      </motion.div>

      <div className={`relative z-10 flex h-full flex-col justify-between ${compact ? "gap-3 p-4 md:p-5" : "gap-5 p-5 md:p-6"}`}>
        <div className={compact ? "space-y-3" : "space-y-4"}>
          <div className={`inline-flex ${compact ? "h-10 w-10" : "h-11 w-11"} items-center justify-center rounded-2xl ${iconClass}`}>
            {icon}
          </div>

          <div className="space-y-1.5">
            <p className={`text-[11px] uppercase tracking-[0.24em] ${eyebrowClass}`}>{eyebrow}</p>
            <h4 className={`${compact ? "text-xl" : "text-2xl"} font-semibold tracking-tight`}>{title}</h4>
            <p className={`text-sm ${compact ? "leading-6" : "leading-7"} ${descriptionClass}`}>{description}</p>
          </div>
        </div>

        <div>{children}</div>
      </div>
    </motion.a>
  );
}

