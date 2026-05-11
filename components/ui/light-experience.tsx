"use client";

import { useEffect, type ReactNode } from "react";
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
  Cpu,
  Download,
  FolderGit2,
  Link2,
  Mail,
} from "lucide-react";
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
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-neutral-100 shadow-[0_25px_60px_rgba(0,0,0,0.15)] md:h-96 md:w-96">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,90,18,0.18),_transparent_58%)]" />
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <div className="rounded-full border border-black/10 bg-white/80 p-4 shadow-sm">
                <Cpu className="h-16 w-16 text-[#d65a12] md:h-20 md:w-20" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Engineering + AI
              </span>
            </div>
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
  const primaryStatus = aboutPageContent.statuses[0];
  const recruitingStatus = aboutPageContent.statuses[1];

  return (
    <section
      id="contact"
      className="mx-auto mt-24 max-w-6xl scroll-mt-28 rounded-[2rem] border border-black/10 bg-white px-5 py-8 shadow-[0_20px_55px_rgba(0,0,0,0.06)] md:px-8 md:py-10"
    >
      <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={revealTransition}
            className="space-y-4"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Let&apos;s connect</p>
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
          className="rounded-[1.9rem] border border-black/8 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,244,240,0.96)_44%,_rgba(235,233,228,0.98)_100%)] p-5 shadow-[0_22px_55px_rgba(0,0,0,0.07)] md:p-6"
        >
          <div className="relative overflow-hidden rounded-[1.5rem] border border-black/8 bg-white/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl md:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(214,90,18,0.14),_transparent_36%),linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_38%)]"
            />

            <div className="relative z-10 space-y-6">
              <div className="grid gap-3">
                <StatusCard
                  label={primaryStatus.label}
                  title={primaryStatus.title}
                  description={primaryStatus.description}
                  tone={primaryStatus.tone}
                />
                <StatusCard
                  label={recruitingStatus.label}
                  title={recruitingStatus.title}
                  description={recruitingStatus.description}
                  tone={recruitingStatus.tone}
                />
              </div>

              <a
                href={primaryStatus.ctaHref ?? "/resume"}
                className="group flex items-center justify-between gap-4 rounded-[1.4rem] border border-neutral-900 bg-neutral-900 px-5 py-4 text-white shadow-[0_18px_40px_rgba(17,17,17,0.18)] transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/58">
                    Primary Action
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">Download Resume</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/88">
                  <Download className="h-4 w-4" strokeWidth={1.9} />
                  Get PDF
                </span>
              </a>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatusCard({
  label,
  title,
  description,
  tone,
}: {
  label: string;
  title: string;
  description: string;
  tone: "success" | "warning";
}) {
  const accentClass =
    tone === "success"
      ? "border-emerald-200/90 bg-emerald-50/80 text-emerald-700"
      : "border-amber-200/90 bg-amber-50/80 text-amber-700";

  return (
    <article className="rounded-[1.35rem] border border-black/8 bg-white px-4 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] ${accentClass}`}
        >
          {label}
        </span>
      </div>
      <h5 className="mt-3 text-base font-semibold leading-7 text-neutral-900">{title}</h5>
      <p className="mt-1 text-sm leading-7 text-neutral-600">{description}</p>
    </article>
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

      <div className="relative z-10 flex h-full flex-col justify-between gap-5 p-5 md:p-6">
        <div className="space-y-4">
          <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
            {icon}
          </div>

          <div className="space-y-1.5">
            <p className={`text-[11px] uppercase tracking-[0.24em] ${eyebrowClass}`}>{eyebrow}</p>
            <h4 className="text-2xl font-semibold tracking-tight">{title}</h4>
            <p className={`text-sm leading-7 ${descriptionClass}`}>{description}</p>
          </div>
        </div>

        <div>{children}</div>
      </div>
    </motion.a>
  );
}

