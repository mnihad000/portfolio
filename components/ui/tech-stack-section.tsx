"use client";

import { useEffect, useState } from "react";

const DEVICON_STYLESHEET_ID = "devicon-cdn-stylesheet";
const DEVICON_STYLESHEET_HREF =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";

type IconKind = "devicon" | "avatar";
type BeltDirection = "left" | "right";

type TechItem = {
  name: string;
  iconKind: IconKind;
  iconClass?: string;
  avatarText?: string;
  avatarBg?: string;
  avatarTextColor?: string;
};

type BeltConfig = {
  label: string;
  direction: BeltDirection;
  items: TechItem[];
};

const TECH_BELTS: BeltConfig[] = [
  {
    label: "Languages",
    direction: "left",
    items: [
      { name: "Python", iconKind: "devicon", iconClass: "devicon-python-plain colored" },
      { name: "C++", iconKind: "devicon", iconClass: "devicon-cplusplus-plain colored" },
      {
        name: "TypeScript",
        iconKind: "devicon",
        iconClass: "devicon-typescript-plain colored",
      },
      { name: "Java", iconKind: "devicon", iconClass: "devicon-java-plain colored" },
      { name: "MATLAB", iconKind: "devicon", iconClass: "devicon-matlab-plain colored" },
      {
        name: "SQL",
        iconKind: "devicon",
        iconClass: "devicon-azuresqldatabase-plain colored",
      },
      { name: "HTML/CSS", iconKind: "devicon", iconClass: "devicon-html5-plain colored" },
    ],
  },
  {
    label: "Frameworks",
    direction: "right",
    items: [
      { name: "FastAPI", iconKind: "devicon", iconClass: "devicon-fastapi-plain colored" },
      {
        name: "Spring Boot",
        iconKind: "devicon",
        iconClass: "devicon-spring-plain colored",
      },
      { name: "React", iconKind: "devicon", iconClass: "devicon-react-original colored" },
      {
        name: "React Native",
        iconKind: "devicon",
        iconClass: "devicon-react-original colored",
      },
      { name: "PyTorch", iconKind: "devicon", iconClass: "devicon-pytorch-plain colored" },
      {
        name: "scikit-learn",
        iconKind: "avatar",
        avatarText: "SK",
        avatarBg: "#E8500A",
        avatarTextColor: "#FFFFFF",
      },
      {
        name: "React Three Fiber",
        iconKind: "devicon",
        iconClass: "devicon-react-original colored",
      },
    ],
  },
  {
    label: "Tools",
    direction: "left",
    items: [
      { name: "Git", iconKind: "devicon", iconClass: "devicon-git-plain colored" },
      { name: "GitHub", iconKind: "devicon", iconClass: "devicon-github-original colored" },
      {
        name: "AWS",
        iconKind: "devicon",
        iconClass: "devicon-amazonwebservices-plain-wordmark colored",
      },
      { name: "Docker", iconKind: "devicon", iconClass: "devicon-docker-plain colored" },
      { name: "Figma", iconKind: "devicon", iconClass: "devicon-figma-plain colored" },
      {
        name: "PostgreSQL",
        iconKind: "devicon",
        iconClass: "devicon-postgresql-plain colored",
      },
      { name: "MongoDB", iconKind: "devicon", iconClass: "devicon-mongodb-plain colored" },
      {
        name: "REST APIs",
        iconKind: "avatar",
        avatarText: "API",
        avatarBg: "#1e1e28",
        avatarTextColor: "#FFFFFF",
      },
      {
        name: "Kubernetes",
        iconKind: "devicon",
        iconClass: "devicon-kubernetes-plain colored",
      },
      {
        name: "Claude Code",
        iconKind: "avatar",
        avatarText: "CC",
        avatarBg: "#E8500A",
        avatarTextColor: "#FFFFFF",
      },
      {
        name: "Codex",
        iconKind: "avatar",
        avatarText: "CX",
        avatarBg: "#1e1e28",
        avatarTextColor: "#FFFFFF",
      },
    ],
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function TechBadge({ item }: { item: TechItem }) {
  return (
    <div className="tech-pill flex shrink-0 items-center gap-3 rounded-full border border-white/35 bg-[rgba(30,30,40,0.06)] px-4 py-2 text-sm font-semibold text-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition duration-200 ease-out hover:scale-[1.05] hover:shadow-[0_12px_30px_rgba(214,90,18,0.16)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center">
        {item.iconKind === "devicon" ? (
          <i className={`${item.iconClass} text-[28px] leading-none`} aria-hidden="true" />
        ) : (
          <span
            className="flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tracking-[0.08em]"
            style={{
              backgroundColor: item.avatarBg,
              color: item.avatarTextColor,
            }}
            aria-hidden="true"
          >
            {item.avatarText}
          </span>
        )}
      </span>
      <span className="whitespace-nowrap">{item.name}</span>
    </div>
  );
}

function TechBelt({
  belt,
  prefersReducedMotion,
}: {
  belt: BeltConfig;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">{belt.label}</p>
      <div className="belt relative w-full overflow-hidden rounded-[1.9rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,242,238,0.9))] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_18px_40px_rgba(0,0,0,0.04)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-2 right-2 rounded-full border border-black/5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.52),rgba(255,255,255,0.12)_55%,transparent_78%)]"
        />
        <div
          className="belt-inner flex w-max items-center gap-3"
          data-animate={!prefersReducedMotion}
          data-direction={belt.direction}
        >
          <div className="flex items-center gap-3">
            {belt.items.map((item) => (
              <TechBadge key={`${belt.label}-${item.name}-first`} item={item} />
            ))}
          </div>
          <div className="flex items-center gap-3" aria-hidden="true">
            {belt.items.map((item) => (
              <TechBadge key={`${belt.label}-${item.name}-second`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TechStackSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (document.getElementById(DEVICON_STYLESHEET_ID)) {
      return;
    }

    const stylesheet = document.createElement("link");
    stylesheet.id = DEVICON_STYLESHEET_ID;
    stylesheet.rel = "stylesheet";
    stylesheet.type = "text/css";
    stylesheet.href = DEVICON_STYLESHEET_HREF;
    document.head.appendChild(stylesheet);
  }, []);

  return (
    <section id="stack" className="mx-auto mt-24 max-w-6xl scroll-mt-28">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-500"></p>
        <h3 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
          My Stack
        </h3>
        <p className="mt-3 text-base leading-8 text-neutral-500 md:text-lg">
          The tools I reach for.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {TECH_BELTS.map((belt) => (
          <TechBelt
            key={belt.label}
            belt={belt}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
