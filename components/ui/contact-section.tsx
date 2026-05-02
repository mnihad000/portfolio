"use client";

import type { ComponentType, FormEvent, SVGProps } from "react";
import { ArrowRight, FolderGit2, Link2, Mail } from "lucide-react";

type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    handle: "mohammed-nihad-090348263",
    href: "https://www.linkedin.com/in/mohammed-nihad-090348263/",
    icon: Link2,
  },
  {
    label: "Email",
    handle: "mnihad1107@gmail.com",
    href: "mailto:mnihad1107@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    handle: "mnihad000",
    href: "http://github.com/mnihad000",
    icon: FolderGit2,
  },
];

const CONTACT_EMAIL = "mnihad1107@gmail.com";

export default function ContactSection() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const subjectBase = name ? `Message from ${name}` : "Portfolio contact message";
    const bodyParts = [
      name ? `Name: ${name}` : null,
      senderEmail ? `Email: ${senderEmail}` : null,
      "",
      message || "Hi Mohammed, I'd like to connect.",
    ].filter((part): part is string => part !== null);

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subjectBase
    )}&body=${encodeURIComponent(bodyParts.join("\n"))}`;

    window.location.href = mailto;
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen scroll-mt-28 overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.11)_1px,transparent_1px)] bg-[size:18px_18px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="route-enter relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10 lg:pt-34">
        <header className="max-w-3xl">
          <h1 className="font-mono text-6xl tracking-[0.04em] text-white md:text-7xl">contact</h1>
          <p className="mt-5 max-w-2xl font-mono text-xl leading-relaxed text-gray-400 md:text-2xl">
            got a project idea, opportunity, want to team up for a hackathon, or just want to chat? I&apos;d love to hear from you.
          </p>
        </header>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <h2 className="font-mono text-4xl tracking-[0.06em] text-white">send a message</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-7">
              <div className="space-y-3">
                <label htmlFor="name" className="font-mono text-xl text-gray-300">
                  name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="your name"
                  className="h-16 w-full rounded-2xl border border-white/15 bg-zinc-950 px-5 font-mono text-lg text-white placeholder:text-gray-600 focus:border-white/35 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="font-mono text-xl text-gray-300">
                  email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-16 w-full rounded-2xl border border-white/15 bg-zinc-950 px-5 font-mono text-lg text-white placeholder:text-gray-600 focus:border-white/35 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="font-mono text-xl text-gray-300">
                  message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="what&apos;s on your mind?"
                  className="w-full resize-none rounded-2xl border border-white/15 bg-zinc-950 px-5 py-4 font-mono text-lg text-white placeholder:text-gray-600 focus:border-white/35 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/70 bg-white px-7 font-mono text-xl text-black transition hover:bg-gray-200"
              >
                <span>Send Message</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

          <aside>
            <h2 className="font-mono text-4xl tracking-[0.06em] text-white">find me online</h2>
            <div className="mt-8 space-y-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
                    className="group flex items-center gap-4 rounded-2xl border border-white/65 bg-zinc-950 px-5 py-5 transition hover:border-white hover:bg-zinc-900"
                  >
                    <Icon className="h-7 w-7 shrink-0 text-white" />
                    <div className="min-w-0">
                      <p className="font-mono text-3xl text-white">{social.label}</p>
                      <p className="truncate font-mono text-lg text-gray-500">{social.handle}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
    </section>
  );
}
