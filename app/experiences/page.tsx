"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RoleData = {
  id: string;
  company: string;
  title: string;
  dates: string;
  bullets: string[];
  stack: string[];
  featured: boolean;
  statusBadge: "[ ACTIVE ]" | "[ INCOMING ]" | "[ COMPLETED ]" | "[ RESEARCH ]";
  bootLabel: string;
  secureStep?: string;
  progressDuration: number;
  dramaMultiplier: number;
};

type HudElements = {
  phase: HTMLElement | null;
  role: HTMLElement | null;
  status: HTMLElement | null;
  time: HTMLElement | null;
};

type BootElements = {
  initLine: HTMLElement | null;
  secureLine: HTMLElement | null;
  loadingLine: HTMLElement | null;
  progressFill: HTMLElement | null;
  progressValue: HTMLElement | null;
  statusLine: HTMLElement | null;
  cursor: HTMLElement | null;
};

type BootSequenceOptions = {
  hudElements?: HudElements;
  compact?: boolean;
  withScrollTrigger?: boolean;
};

const EXPERIENCE_ROLES: RoleData[] = [
  {
    id: "buildify",
    company: "Buildify",
    title: "Software Engineering Intern",
    dates: "December 2025 - Present",
    bullets: [
      "Built an agentic Retention Autopilot that ingests analytics, segments users, and automates retention operations at campaign scale.",
      "Launched approved A/B-tested push and rewards campaigns that improved 30-day returning users while reducing campaign setup time by 30%.",
    ],
    stack: ["Agentic Workflows", "A/B Testing", "Analytics", "Push Campaigns"],
    featured: true,
    statusBadge: "[ ACTIVE ]",
    bootLabel: "BUILDIFY_NODE_01",
    secureStep: "> ESTABLISHING SECURE CONNECTION...",
    progressDuration: 1.8,
    dramaMultiplier: 1.3,
  },
  {
    id: "bloom-energy",
    company: "Bloom Energy",
    title: "Software Engineering Intern (Incoming)",
    dates: "June 2026 - August 2026",
    bullets: [
      "Incoming SWE intern building scalable backend tooling and automated data pipelines for real-time monitoring across 30,000+ distributed energy systems.",
      "Leveraging Kubernetes, Grafana, and FastAPI to support observability and infrastructure-scale operational workflows.",
    ],
    stack: ["Kubernetes", "Grafana", "FastAPI", "Backend Tooling"],
    featured: false,
    statusBadge: "[ INCOMING ]",
    bootLabel: "BLOOM_NODE_02",
    progressDuration: 1.45,
    dramaMultiplier: 1,
  },
  {
    id: "research-paper",
    company: "Research Paper",
    title: "Co-Author / Research Contributor",
    dates: "June 2025 - December 2025",
    bullets: [
      "Co-authored a research paper on a self-critiquing LLM pipeline using expert feedback, distillation, reinforcement learning, and Pareto optimization.",
      "Improved model accuracy while reducing infrastructure costs by up to 90% using open-weight models.",
    ],
    stack: ["LLMs", "Distillation", "RL", "Pareto Optimization"],
    featured: false,
    statusBadge: "[ RESEARCH ]",
    bootLabel: "RESEARCH_03",
    progressDuration: 1.4,
    dramaMultiplier: 0.95,
  },
  {
    id: "stemkasa",
    company: "STEMKasa",
    title: "Software Engineering Intern",
    dates: "June 2025 - August 2025",
    bullets: [
      "Led three interns to rebuild a 17-file monolith into a MERN app with component-based architecture, REST APIs, and integration tests while preserving 100% functionality.",
      "Implemented secure authentication with Node.js and MongoDB, integrated Stripe subscriptions, and added GPT flashcards and lessons, increasing student engagement by 25% across three schools.",
      "Wrote unit tests with Jest and Postman, reducing integration bugs by 20% and improving authentication and data consistency across endpoints.",
    ],
    stack: ["MERN", "Node.js", "MongoDB", "Stripe", "Jest", "Postman"],
    featured: false,
    statusBadge: "[ COMPLETED ]",
    bootLabel: "STEMKASA_04",
    progressDuration: 1.35,
    dramaMultiplier: 0.92,
  },
  {
    id: "universacare",
    company: "Universacare",
    title: "Software Automation Intern",
    dates: "June 2023 - September 2023",
    bullets: [
      "Built a Python Selenium web-scraping workflow to extract daily Home Health Aide data, automating manual processes and improving productivity by 11%.",
      "Developed 15 reusable React components and integrated a role-aware production application form, improving UI consistency and access control while saving 2+ hours per submission.",
    ],
    stack: ["Python", "Selenium", "React", "Automation"],
    featured: false,
    statusBadge: "[ COMPLETED ]",
    bootLabel: "UNIVERSACARE_05",
    progressDuration: 1.35,
    dramaMultiplier: 0.92,
  },
];

function getBadgeClassNames(role: RoleData) {
  if (role.statusBadge === "[ ACTIVE ]") {
    return "border-gray-500 text-gray-200";
  }
  if (role.statusBadge === "[ INCOMING ]") {
    return "border-gray-600 text-gray-300";
  }
  if (role.statusBadge === "[ RESEARCH ]") {
    return "border-gray-700 text-gray-300";
  }
  return "border-gray-700 text-gray-400";
}

function hudStatusFromBadge(statusBadge: RoleData["statusBadge"]) {
  return statusBadge.replace(/\[|\]/g, "").trim();
}

function setHud(hud: HudElements, values: { phase?: string; role?: string; status?: string }) {
  if (values.phase && hud.phase) hud.phase.textContent = values.phase;
  if (values.role && hud.role) hud.role.textContent = values.role;
  if (values.status && hud.status) hud.status.textContent = values.status;
}

function createTypewriterTween(element: HTMLElement | null, text: string, cps = 34) {
  const typingState = { index: 0 };
  return gsap.to(typingState, {
    index: text.length,
    duration: Math.max(text.length / cps, 0.3),
    ease: "none",
    onStart: () => {
      if (element) element.textContent = "";
    },
    onUpdate: () => {
      if (!element) return;
      element.textContent = text.slice(0, Math.floor(typingState.index));
    },
    onComplete: () => {
      if (element) element.textContent = text;
    },
  });
}

function addFlicker(timeline: gsap.core.Timeline, target: HTMLElement | null, cycles = 4, step = 0.07) {
  if (!target) return;

  for (let i = 0; i < cycles; i += 1) {
    timeline.to(target, {
      opacity: i % 2 === 0 ? 1 : 0.2,
      duration: step,
      ease: "none",
    });
  }

  timeline.to(target, { opacity: 1, duration: 0.05, ease: "none" });
}

function getCardBootElements(card: HTMLElement): BootElements {
  return {
    initLine: card.querySelector<HTMLElement>("[data-boot-init]"),
    secureLine: card.querySelector<HTMLElement>("[data-boot-secure]"),
    loadingLine: card.querySelector<HTMLElement>("[data-boot-loading]"),
    progressFill: card.querySelector<HTMLElement>("[data-boot-progress-fill]"),
    progressValue: card.querySelector<HTMLElement>("[data-boot-progress-value]"),
    statusLine: card.querySelector<HTMLElement>("[data-boot-status]"),
    cursor: card.querySelector<HTMLElement>("[data-boot-cursor]"),
  };
}

function bootSequence(cardEl: HTMLElement | null, roleData: RoleData, options: BootSequenceOptions = {}) {
  if (!cardEl) return null;

  const compact = options.compact ?? false;
  const hud = options.hudElements ?? { phase: null, role: null, status: null, time: null };
  const withScrollTrigger = options.withScrollTrigger ?? false;

  const bootElements = getCardBootElements(cardEl);
  const content = cardEl.querySelector<HTMLElement>("[data-boot-content]");
  const revealItems = Array.from(cardEl.querySelectorAll<HTMLElement>("[data-boot-reveal]"));

  if (
    !content ||
    revealItems.length === 0 ||
    !bootElements.initLine ||
    !bootElements.loadingLine ||
    !bootElements.progressFill ||
    !bootElements.statusLine ||
    !bootElements.cursor
  ) {
    return null;
  }

  const initLine = bootElements.initLine;
  const secureLine = bootElements.secureLine;
  const loadingLine = bootElements.loadingLine;
  const progressFill = bootElements.progressFill;
  const progressValue = bootElements.progressValue;
  const statusLine = bootElements.statusLine;
  const cursor = bootElements.cursor;

  const flickerStep = compact ? 0.05 : 0.07;
  const baseCycles = compact ? 3 : 4;
  const flickerCycles = Math.max(2, Math.round(baseCycles * roleData.dramaMultiplier));
  const secureCycles = Math.max(2, Math.round((baseCycles - 1) * roleData.dramaMultiplier));
  const typeCps = compact ? 44 : 34;
  const progressDuration = Math.max(0.4, roleData.progressDuration * (compact ? 0.42 : 0.55));

  const timelineOptions: gsap.TimelineVars = {
    defaults: { ease: "none" },
  };

  if (withScrollTrigger) {
    timelineOptions.scrollTrigger = {
      id: `exp-card-${roleData.id}`,
      trigger: cardEl,
      start: "top 80%",
      once: true,
      toggleActions: "play none none none",
    };
  }

  const timeline = gsap.timeline(timelineOptions);

  timeline.call(() => {
    setHud(hud, { phase: "INIT", role: roleData.bootLabel, status: "RUNNING" });
    initLine.textContent = "> INITIALIZING ROLE...";
    if (secureLine) secureLine.textContent = roleData.secureStep ?? "";
    loadingLine.textContent = "";
    statusLine.textContent = "[ OK ] SYSTEM AUTHENTICATED";

    gsap.set([initLine, secureLine, loadingLine, statusLine, cursor], { opacity: 0 });
    gsap.set(progressFill, { width: "0%" });
    if (progressValue) progressValue.textContent = "0%";
  });

  addFlicker(timeline, initLine, flickerCycles, flickerStep);

  if (roleData.secureStep && secureLine) {
    timeline.call(() => setHud(hud, { phase: "AUTH", role: roleData.bootLabel, status: "HANDSHAKE" }));
    addFlicker(timeline, secureLine, secureCycles, flickerStep);
  }

  timeline.call(() => setHud(hud, { phase: "MOUNT", role: roleData.bootLabel, status: "LOADING" }));
  timeline.to(loadingLine, { opacity: 1, duration: 0.04 });
  timeline.add(
    createTypewriterTween(loadingLine, `> LOADING: [${roleData.company.toUpperCase()}]`, typeCps)
  );

  const progressState = { value: 0 };
  timeline.to(progressState, {
    value: 100,
    duration: progressDuration,
    ease: "none",
    onUpdate: () => {
      const percent = Math.floor(progressState.value);
      progressFill.style.width = `${percent}%`;
      if (progressValue) progressValue.textContent = `${percent}%`;
    },
  });

  timeline.call(() =>
    setHud(hud, { phase: "VERIFY", role: roleData.bootLabel, status: "AUTHENTICATED" })
  );
  timeline.to(statusLine, { opacity: 1, duration: 0.08, ease: "steps(1)" });
  timeline.to(content, { opacity: 0.9, duration: 0.07 }).to(content, { opacity: 1, duration: 0.12 });
  timeline.fromTo(
    revealItems,
    { y: 2, opacity: 0.96 },
    {
      y: 0,
      opacity: 1,
      duration: compact ? 0.14 : 0.18,
      stagger: compact ? 0.02 : 0.03,
      ease: "power1.out",
    },
    "<"
  );
  timeline.to(cursor, { opacity: 1, duration: 0.05, ease: "none" }, "<");
  timeline.call(() =>
    setHud(hud, { phase: "READY", role: roleData.bootLabel, status: hudStatusFromBadge(roleData.statusBadge) })
  );

  return timeline;
}

function createFocusTrigger(cardEl: HTMLElement | null, roleData: RoleData, hud: HudElements) {
  if (!cardEl) return null;

  return ScrollTrigger.create({
    id: `exp-focus-${roleData.id}`,
    trigger: cardEl,
    start: "top 55%",
    end: "bottom 45%",
    onEnter: () => {
      setHud(hud, {
        phase: "FOCUS",
        role: roleData.bootLabel,
        status: hudStatusFromBadge(roleData.statusBadge),
      });
    },
    onEnterBack: () => {
      setHud(hud, {
        phase: "FOCUS",
        role: roleData.bootLabel,
        status: hudStatusFromBadge(roleData.statusBadge),
      });
    },
  });
}

export default function ExperiencesPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const timelineRefs = useRef<gsap.core.Timeline[]>([]);
  const focusTriggerRefs = useRef<ScrollTrigger[]>([]);
  const timeIntervalRef = useRef<number | null>(null);

  const hudPhaseRef = useRef<HTMLSpanElement | null>(null);
  const hudRoleRef = useRef<HTMLSpanElement | null>(null);
  const hudStatusRef = useRef<HTMLSpanElement | null>(null);
  const hudTimeRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    const hudElements: HudElements = {
      phase: hudPhaseRef.current,
      role: hudRoleRef.current,
      status: hudStatusRef.current,
      time: hudTimeRef.current,
    };

    const updateHudTime = () => {
      if (!hudElements.time) return;
      hudElements.time.textContent = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    updateHudTime();
    timeIntervalRef.current = window.setInterval(updateHudTime, 1000);

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compact = reducedMotion || window.innerWidth < 768;

      setHud(hudElements, {
        phase: "IDLE",
        role: "STANDBY",
        status: compact ? "ADAPTIVE_MODE" : "READY",
      });

      timelineRefs.current = cardRefs.current
        .map((card, index) =>
          bootSequence(card, EXPERIENCE_ROLES[index], {
            compact,
            withScrollTrigger: true,
            hudElements,
          })
        )
        .filter((timeline): timeline is gsap.core.Timeline => Boolean(timeline));

      focusTriggerRefs.current = cardRefs.current
        .map((card, index) => createFocusTrigger(card, EXPERIENCE_ROLES[index], hudElements))
        .filter((trigger): trigger is ScrollTrigger => Boolean(trigger));
    }, sectionRef);

    return () => {
      if (timeIntervalRef.current) {
        window.clearInterval(timeIntervalRef.current);
      }

      timelineRefs.current.forEach((timeline) => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      });
      timelineRefs.current = [];

      focusTriggerRefs.current.forEach((trigger) => trigger.kill());
      focusTriggerRefs.current = [];

      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerId = typeof trigger.vars.id === "string" ? trigger.vars.id : "";
        if (triggerId.startsWith("exp-")) {
          trigger.kill();
        }
      });

      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-24 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-25" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <header className="mb-10 md:mb-12">
          <div className="mb-4 inline-flex items-center gap-3 border border-gray-800 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-gray-400 uppercase">
            <span>CAREER_TIMELINE</span>
            <span className="h-px w-8 bg-gray-700" />
            <span className="text-gray-500">LIVE_STATUS</span>
          </div>
          <h1 className="font-mono text-5xl font-semibold tracking-[0.12em] uppercase md:text-7xl">
            Experiences
          </h1>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-7 text-gray-400 md:text-base">
            Experience records are visible immediately. Scroll for lightweight boot accents and
            live terminal status updates.
          </p>
        </header>

        <div className="sticky top-20 z-30 mb-10 border border-gray-700 bg-black px-4 py-3 font-mono md:px-5">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <p className="text-[11px] tracking-[0.16em] text-gray-500 uppercase">
              PHASE: <span ref={hudPhaseRef} className="text-gray-300">IDLE</span>
            </p>
            <p className="text-[11px] tracking-[0.16em] text-gray-500 uppercase">
              ROLE_ID: <span ref={hudRoleRef} className="text-gray-300">STANDBY</span>
            </p>
            <p className="text-[11px] tracking-[0.16em] text-gray-500 uppercase">
              STATUS: <span ref={hudStatusRef} className="text-gray-300">READY</span>
            </p>
            <p className="text-[11px] tracking-[0.16em] text-gray-500 uppercase">
              SYSTEM_TIME: <span ref={hudTimeRef} className="text-gray-300">00:00:00</span>
            </p>
          </div>
        </div>

        <div className="space-y-14 md:space-y-16">
          {EXPERIENCE_ROLES.map((role, index) => (
            <article
              key={role.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className={`border bg-black font-mono ${
                role.featured ? "border-gray-700 p-8 md:p-12" : "border-gray-800 p-6 md:p-8"
              }`}
            >
              <div className="border-b border-gray-800 pb-5">
                <p data-boot-init className="text-[11px] tracking-[0.18em] text-gray-400 uppercase opacity-0">
                  {"> INITIALIZING ROLE..."}
                </p>
                {role.secureStep ? (
                  <p
                    data-boot-secure
                    className="mt-2 text-[11px] tracking-[0.18em] text-gray-400 uppercase opacity-0"
                  >
                    {role.secureStep}
                  </p>
                ) : null}
                <p
                  data-boot-loading
                  className="mt-2 min-h-[1.1rem] text-[11px] tracking-[0.18em] text-gray-300 uppercase opacity-0"
                />

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 w-full bg-gray-800">
                    <div data-boot-progress-fill className="h-full w-0 bg-white" />
                  </div>
                  <span data-boot-progress-value className="text-[11px] text-gray-400">
                    0%
                  </span>
                  <span data-boot-cursor className="text-sm text-white opacity-0 animate-pulse">
                    {"\u2588"}
                  </span>
                </div>

                <p
                  data-boot-status
                  className="mt-3 text-[11px] tracking-[0.18em] text-gray-300 uppercase opacity-0"
                >
                  [ OK ] SYSTEM AUTHENTICATED
                </p>
              </div>

              <div data-boot-content className={role.featured ? "mt-10" : "mt-8"}>
                <div
                  data-boot-reveal
                  className="flex flex-col gap-4 border-b border-gray-800 pb-5 md:flex-row md:items-start md:justify-between"
                >
                  <h3
                    className={`tracking-[0.12em] text-white uppercase ${
                      role.featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
                    }`}
                  >
                    {role.company}
                  </h3>
                  <span
                    className={`inline-flex w-fit border px-3 py-1 text-[11px] tracking-[0.16em] uppercase ${getBadgeClassNames(
                      role
                    )}`}
                  >
                    {role.statusBadge}
                  </span>
                </div>

                <div
                  data-boot-reveal
                  className="mt-5 flex flex-col gap-2 border-b border-gray-800 pb-5 md:flex-row md:items-center md:justify-between"
                >
                  <p className="text-base text-white md:text-lg">{role.title}</p>
                  <p className="text-sm text-gray-500">{role.dates}</p>
                </div>

                <ul data-boot-reveal className="mt-6 space-y-3">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm leading-7 text-white md:text-base">
                      <span className="mr-2 text-gray-500">{"\u25B8"}</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div data-boot-reveal className="mt-7 border-t border-gray-800 pt-5">
                  <p className="mb-3 text-[11px] tracking-[0.16em] text-gray-500 uppercase">STACK://</p>
                  <div className="flex flex-wrap gap-2">
                    {role.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border border-gray-700 bg-gray-900 px-2 py-0.5 text-xs text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
