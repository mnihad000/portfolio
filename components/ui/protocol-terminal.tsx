"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { projects } from "@/lib/projects";

type EntryTone = "default" | "muted" | "success" | "warning";

type BaseEntry = {
  id: string;
};

type CommandEntry = BaseEntry & {
  kind: "command";
  value: string;
};

type TextEntry = BaseEntry & {
  kind: "text";
  value: string;
  tone?: EntryTone;
};

type BlankEntry = BaseEntry & {
  kind: "blank";
};

type SeparatorEntry = BaseEntry & {
  kind: "separator";
  value: string;
};

type ProjectEntry = BaseEntry & {
  kind: "project";
  slug: string;
  title: string;
  description: string;
};

type LinkEntry = BaseEntry & {
  kind: "link";
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

type TerminalEntry =
  | CommandEntry
  | TextEntry
  | BlankEntry
  | SeparatorEntry
  | ProjectEntry
  | LinkEntry;

type PersistedState = {
  isOpen: boolean;
  hasBooted: boolean;
  entries: TerminalEntry[];
  history: string[];
};

const SESSION_KEY = "nihad.protocol.session.v1";
const PROMPT = "nihad@portfolio:~$";
const FONT_STACK = '"Courier New", Courier, monospace';
const HELP_HINT = "TYPE 'HELP'";
const CONTACT_EMAIL = "mnihad1107@gmail.com";
const GITHUB_URL = "https://github.com/mnihad000";
const LINKEDIN_URL = "https://www.linkedin.com/in/mohammed-nihad-090348263/";
const RESUME_URL = "/resume";

const BOOT_LINES = [
  "Initializing NIHAD.PROTOCOL...",
  "Loading kernel modules... done",
  "Mounting filesystem... done",
  "System ready. Type 'help' to begin.",
];

const COMMAND_SUGGESTIONS = [
  "help",
  "whoami",
  "about",
  "projects",
  "skills",
  "status",
  "contact",
  "cat resume",
  "sudo hire me",
  "clear",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createTextEntry(value: string, tone: EntryTone = "default"): TextEntry {
  return {
    id: createId(),
    kind: "text",
    value,
    tone,
  };
}

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['".,()[\]]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getToneClass(tone: EntryTone = "default") {
  if (tone === "muted") return "protocol-tone-muted";
  if (tone === "success") return "protocol-tone-success";
  if (tone === "warning") return "protocol-tone-warning";
  return "protocol-tone-default";
}

function createPersistedState(
  isOpen: boolean,
  hasBooted: boolean,
  entries: TerminalEntry[],
  history: string[]
): PersistedState {
  return {
    isOpen,
    hasBooted,
    entries,
    history,
  };
}

export default function ProtocolTerminal() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const didHydrateRef = useRef(false);
  const bootStartedRef = useRef(false);
  const historyDraftRef = useRef("");
  const timersRef = useRef<number[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isBooting, setIsBooting] = useState(false);

  function focusInput() {
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function appendEntries(nextEntries: TerminalEntry[]) {
    setEntries((current) => [...current, ...nextEntries]);
  }

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function sleep(ms: number) {
    return new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => resolve(), ms);
      timersRef.current.push(timer);
    });
  }

  function updateEntry(id: string, value: string) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id && entry.kind === "text" ? { ...entry, value } : entry
      )
    );
  }

  async function typeLine(text: string, tone: EntryTone = "default") {
    const id = createId();
    setEntries((current) => [...current, { id, kind: "text", value: "", tone }]);

    for (let index = 1; index <= text.length; index += 1) {
      updateEntry(id, text.slice(0, index));
      await sleep(20);
    }
  }

  function saveSession(nextState: PersistedState) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextState));
  }

  function openInternalRoute(href: string) {
    startTransition(() => {
      router.push(href);
    });
  }

  function triggerResumeDownload() {
    const link = document.createElement("a");
    link.href = RESUME_URL;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function appendWhoAmIEntries() {
    appendEntries([
      createTextEntry("Mohammed Nihad"),
      createTextEntry("Software Engineering student @ CCNY", "muted"),
      createTextEntry(
        "Builder. Currently obsessed with systems, AI, and shipping things.",
        "muted"
      ),
      createTextEntry(
        "\"The struggle itself toward the heights is enough to fill a man's heart.\"",
        "warning"
      ),
    ]);
  }

  function appendHelpEntries() {
    appendEntries([
      createTextEntry("Available commands:", "muted"),
      createTextEntry("  whoami       -> who is this guy", "muted"),
      createTextEntry("  about        -> open the about page", "muted"),
      createTextEntry("  projects     -> things i've built", "muted"),
      createTextEntry("  skills       -> what i work with", "muted"),
      createTextEntry("  status       -> current availability", "muted"),
      createTextEntry("  contact      -> get in touch", "muted"),
      createTextEntry("  cat resume   -> download my resume", "muted"),
      createTextEntry("  sudo hire me -> ...", "muted"),
      createTextEntry("  clear        -> clear terminal", "muted"),
    ]);
  }

  function appendProjectEntries() {
    const projectEntries: TerminalEntry[] = [
      createTextEntry("/projects", "muted"),
      ...projects.map((project, index) => ({
        id: createId(),
        kind: "project" as const,
        slug: project.slug,
        title:
          index === projects.length - 1
            ? `\\-- ${project.slug}`
            : `|-- ${project.slug}`,
        description: project.description,
      })),
      createTextEntry("Type 'open <project-name>' to visit.", "muted"),
    ];

    appendEntries(projectEntries);
  }

  function appendSkillsEntries() {
    appendEntries([
      createTextEntry("SYSTEM RESOURCES"),
      { id: createId(), kind: "separator", value: "------------------------------" },
      createTextEntry("LANGUAGES   Python / C++ / JavaScript", "muted"),
      createTextEntry("FRAMEWORKS  React / Node / Express", "muted"),
      createTextEntry("TOOLS       Git / Docker / Linux", "muted"),
      createTextEntry("LEARNING    AI agents / systems design / low-latency infra", "muted"),
    ]);
  }

  function appendStatusEntriesCurrent() {
    appendEntries([
      createTextEntry(
        "* Internship accepted at Bloom Energy for Summer 2026",
        "success"
      ),
      createTextEntry("Last updated: April 2026", "muted"),
    ]);
  }

  function appendContactEntries() {
    appendEntries([
      {
        id: createId(),
        kind: "link",
        label: "EMAIL",
        value: CONTACT_EMAIL,
        href: `mailto:${CONTACT_EMAIL}`,
        external: true,
      },
      {
        id: createId(),
        kind: "link",
        label: "GITHUB",
        value: "github.com/mnihad000",
        href: GITHUB_URL,
        external: true,
      },
      {
        id: createId(),
        kind: "link",
        label: "LINKEDIN",
        value: "linkedin.com/in/mohammed-nihad-090348263",
        href: LINKEDIN_URL,
        external: true,
      },
    ]);
  }

  function getProjectRoute(commandValue: string) {
    const requestedProject = normalizeValue(commandValue.replace(/^open\s+/i, ""));
    return projects.find((project) => {
      const slugMatch = normalizeValue(project.slug) === requestedProject;
      const titleMatch = normalizeValue(project.title) === requestedProject;
      return slugMatch || titleMatch;
    });
  }

  function autocompleteCommand() {
    const trimmedLower = inputValue.trim().toLowerCase();

    if (!trimmedLower) return;

    if (trimmedLower.startsWith("open ")) {
      const requestedProject = normalizeValue(trimmedLower.slice(5));
      const projectMatches = projects
        .map((project) => project.slug)
        .filter((slug) => slug.startsWith(requestedProject));

      if (projectMatches.length === 1) {
        setInputValue(`open ${projectMatches[0]}`);
      }

      return;
    }

    const matches = COMMAND_SUGGESTIONS.filter((command) =>
      command.startsWith(trimmedLower)
    );

    if (matches.length === 1) {
      setInputValue(matches[0]);
    }
  }

  async function runCommand(rawCommand: string) {
    const command = rawCommand.trim();
    const normalized = command.toLowerCase();

    if (!command) return;

    appendEntries([{ id: createId(), kind: "command", value: command }]);

    if (normalized === "clear") {
      setEntries([]);
      return;
    }

    if (normalized === "help") {
      appendHelpEntries();
      return;
    }

    if (normalized === "whoami") {
      appendWhoAmIEntries();
      return;
    }

    if (normalized === "about") {
      appendEntries([createTextEntry("Opening /about...", "muted")]);
      openInternalRoute("/about");
      return;
    }

    if (normalized === "projects") {
      appendProjectEntries();
      return;
    }

    if (normalized === "skills") {
      appendSkillsEntries();
      return;
    }

    if (normalized === "status") {
      appendStatusEntriesCurrent();
      return;
    }

    if (normalized === "contact") {
      appendContactEntries();
      return;
    }

    if (normalized === "cat resume") {
      appendEntries([createTextEntry("Fetching resume.pdf...", "muted")]);
      await sleep(250);
      appendEntries([createTextEntry("Done. Opening file.", "muted")]);
      triggerResumeDownload();
      return;
    }

    if (normalized === "sudo hire me") {
      appendEntries([createTextEntry("[sudo] password for nihad: ********", "muted")]);
      await sleep(350);
      appendEntries([createTextEntry("Access granted.", "success")]);
      await sleep(450);
      appendEntries([createTextEntry("Redirecting to contact page...", "muted")]);
      await sleep(1500);
      openInternalRoute("/contact");
      return;
    }

    if (normalized.startsWith("open ")) {
      const project = getProjectRoute(command);

      if (!project) {
        appendEntries([
          createTextEntry(`command not found: ${command}`),
          createTextEntry("Type 'help' for available commands.", "muted"),
        ]);
        return;
      }

      appendEntries([createTextEntry(`Opening /projects/${project.slug}...`, "muted")]);
      openInternalRoute(`/projects/${project.slug}`);
      return;
    }

    appendEntries([
      createTextEntry(`command not found: ${command}`),
      createTextEntry("Type 'help' for available commands.", "muted"),
    ]);
  }

  const startBootSequence = useEffectEvent(async () => {
    if (bootStartedRef.current) return;

    bootStartedRef.current = true;
    setIsBooting(true);

    for (const line of BOOT_LINES) {
      await typeLine(line, "muted");
      await sleep(140);
    }

    setHasBooted(true);
    setIsBooting(false);
    focusInput();
  });

  function handleSubmit() {
    const command = inputValue.trim();

    if (!command || isBooting) return;

    setHistory((current) => [...current, command]);
    setHistoryIndex(null);
    historyDraftRef.current = "";
    setInputValue("");
    void runCommand(command);
  }

  function handleHistoryNavigation(direction: "up" | "down") {
    if (history.length === 0) return;

    if (direction === "up") {
      if (historyIndex === null) {
        historyDraftRef.current = inputValue;
        const nextIndex = history.length - 1;
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
        return;
      }

      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      }

      return;
    }

    if (historyIndex === null) return;

    if (historyIndex === history.length - 1) {
      setHistoryIndex(null);
      setInputValue(historyDraftRef.current);
      return;
    }

    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setInputValue(history[nextIndex]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleHistoryNavigation("up");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      handleHistoryNavigation("down");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      autocompleteCommand();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  function renderEntry(entry: TerminalEntry): ReactNode {
    if (entry.kind === "command") {
      return (
        <div className="protocol-tone-default flex items-start gap-2">
          <span className="shrink-0">{PROMPT}</span>
          <span>{entry.value}</span>
        </div>
      );
    }

    if (entry.kind === "text") {
      return <div className={getToneClass(entry.tone)}>{entry.value}</div>;
    }

    if (entry.kind === "blank") {
      return <div className="h-2" aria-hidden="true" />;
    }

    if (entry.kind === "separator") {
      return <div className="protocol-tone-muted">{entry.value}</div>;
    }

    if (entry.kind === "project") {
      return (
        <div className="protocol-tone-default flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span>{entry.title}</span>
              <span className="protocol-tone-muted">-&gt;</span>
              <span className="protocol-tone-muted">{entry.description}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openInternalRoute(`/projects/${entry.slug}`)}
            className="protocol-link shrink-0"
          >
            [open]
          </button>
        </div>
      );
    }

    if (entry.external) {
      return (
        <div className="flex items-center justify-between gap-3">
          <span className="protocol-tone-default">
            {`${entry.label.padEnd(8, " ")}-> ${entry.value}`}
          </span>
          <a
            href={entry.href}
            target="_blank"
            rel="noreferrer noopener"
            className="protocol-link"
          >
            [open]
          </a>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => openInternalRoute(entry.href)}
        className="flex items-center justify-between gap-3 text-left"
      >
        <span className="protocol-tone-default">
          {`${entry.label.padEnd(8, " ")}-> ${entry.value}`}
        </span>
        <span className="protocol-link">[open]</span>
      </button>
    );
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);

    const timer = window.setTimeout(() => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as PersistedState;
          setIsOpen(parsed.isOpen);
          setHasBooted(parsed.hasBooted);
          setEntries(parsed.entries ?? []);
          setHistory(parsed.history ?? []);
          bootStartedRef.current = parsed.hasBooted;
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }

      didHydrateRef.current = true;
    }, 0);

    timersRef.current.push(timer);

    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!didHydrateRef.current) return;

    saveSession(createPersistedState(isOpen, hasBooted, entries, history));
  }, [entries, hasBooted, history, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    focusInput();

    if (!hasBooted) {
      const timer = window.setTimeout(() => {
        void startBootSequence();
      }, 0);

      timersRef.current.push(timer);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [hasBooted, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    focusInput();
  }, [isOpen, pathname]);

  useEffect(() => {
    if (!outputRef.current) return;
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [entries, isOpen]);

  return (
    <div
      className="pointer-events-none fixed right-6 bottom-6 z-[9999]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="relative w-[min(420px,calc(100vw-2rem))]">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`pointer-events-auto protocol-launcher relative ml-auto flex h-15 w-[400px] items-center justify-between overflow-hidden rounded-[14px] border px-3 text-left backdrop-blur-md transition-all duration-200 ${
            isOpen ? "translate-y-1 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          }`}
          style={{
            borderColor: "var(--portfolio-terminal-border-strong)",
            background: "var(--portfolio-terminal-shell)",
            boxShadow: "var(--portfolio-shadow-soft)",
          }}
          aria-label="Open interactive terminal"
        >
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top, var(--portfolio-glow), transparent 68%)",
            }}
          />
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              background:
                "radial-gradient(var(--portfolio-grid-dot) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "var(--portfolio-terminal-border)" }}
          />
          <span className="relative z-10 flex min-w-0 items-center gap-2">
            <span
              className="protocol-caret shrink-0 text-[12px]"
              style={{ color: "var(--portfolio-warning)" }}
            >
              {">_"}
            </span>
            <span
              className="truncate text-[11px] tracking-[0.16em] lowercase"
              style={{ color: "var(--portfolio-terminal-text)" }}
            >
              Start Here
            </span>
          </span>
          <span className="relative z-10 flex items-center gap-1.5">
            <span
              className="protocol-status h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--portfolio-warning)",
                boxShadow: "0 0 8px var(--portfolio-warning-bg)",
              }}
            />
            <span
              className="h-4 w-px"
              style={{ background: "var(--portfolio-terminal-border)" }}
            />
            <span
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "var(--portfolio-terminal-faint)" }}
            >
              sys
            </span>
          </span>
        </button>

        <section
          onMouseDown={() => {
            if (!isOpen) return;
            focusInput();
          }}
          className={`absolute right-0 bottom-[calc(100%+0.75rem)] pointer-events-auto w-[min(420px,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-[20px] border backdrop-blur-[10px] transition-all duration-200 ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-3 scale-[0.97] opacity-0 pointer-events-none"
          }`}
          style={{
            borderColor: "var(--portfolio-terminal-border)",
            background: "var(--portfolio-terminal-bg)",
            boxShadow: "var(--portfolio-shadow)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              background:
                "radial-gradient(var(--portfolio-grid-dot) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              background:
                "linear-gradient(to bottom, var(--portfolio-scanline) 1px, transparent 1px)",
              backgroundSize: "100% 3px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top, var(--portfolio-glow), transparent 58%)",
            }}
          />

          <header
            className="relative flex items-center justify-between border-b px-4 py-3 text-[13px]"
            style={{ borderColor: "var(--portfolio-terminal-border)" }}
          >
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--portfolio-terminal-text)" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--portfolio-frame-fill)" }}
              />
              <span className="tracking-[0.16em]">NIHAD.PROTOCOL</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="protocol-link"
              aria-label="Minimize terminal"
            >
              [x]
            </button>
          </header>

          <div className="relative flex h-[320px] max-h-[calc(100vh-7rem)] flex-col">
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto px-4 py-4 text-[13px] leading-6 [scrollbar-width:thin]"
              style={{
                color: "var(--portfolio-terminal-text)",
                scrollbarColor: "var(--portfolio-terminal-scrollbar) transparent",
              }}
            >
              <div className="space-y-1.5">
                {entries.length === 0 && !isBooting ? (
                  <div className="protocol-tone-muted">Type &apos;help&apos; to begin.</div>
                ) : null}

                {entries.map((entry) => (
                  <div key={entry.id}>{renderEntry(entry)}</div>
                ))}
              </div>
            </div>

            <div
              className="border-t px-4 py-4"
              style={{ borderColor: "var(--portfolio-terminal-border)" }}
            >
              <div
                className="mb-2 text-[11px] tracking-[0.16em]"
                style={{ color: "var(--portfolio-terminal-muted)" }}
              >
                {HELP_HINT}
              </div>
              <label
                className="flex min-h-11 items-center gap-2 text-[14px]"
                style={{ color: "var(--portfolio-terminal-text)" }}
              >
                <span className="shrink-0">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={"type 'help' to list commands"}
                  disabled={isBooting}
                  className="min-w-0 flex-1 bg-transparent py-1 text-[14px] outline-none disabled:cursor-not-allowed"
                  style={{ color: "var(--portfolio-terminal-text)" }}
                />
              </label>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        input {
          caret-color: var(--portfolio-terminal-text);
        }

        input::placeholder {
          color: var(--portfolio-terminal-placeholder);
        }

        .protocol-caret,
        .protocol-status {
          animation: protocol-caret-blink 1s steps(1) infinite;
        }

        @keyframes protocol-caret-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          51%,
          85% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}

