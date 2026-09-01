"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

const CARD_REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type LightProjectCardProps = {
  project: Project;
  index?: number;
  total?: number;
  priority?: boolean;
};

export default function LightProjectCard({
  project,
  index = 0,
  total = 1,
  priority = false,
}: LightProjectCardProps) {
  const cardClassName =
    "group flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white text-left shadow-[0_18px_45px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20";

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(231,231,231,0.95)_40%,_rgba(212,212,212,1)_100%)]">
        <Image
          src={project.coverImage}
          alt={`${project.title} cover image`}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5 md:p-6">
        <div className="space-y-1.5">
          <h4 className="project-heading text-2xl font-semibold text-neutral-900">
            {project.title}
          </h4>
          <p className="project-copy text-base leading-7 text-neutral-500">
            {project.description}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1 text-sm font-medium uppercase tracking-[0.24em] text-neutral-600">
          <span>{project.href ? "View Source" : "Open Project"}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      id={`project-${project.slug}`}
      data-galaxy-project-card={project.slug}
      className="scroll-mt-28 h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.55,
        delay: 0.06 * (index % Math.max(total, 1)),
        ease: CARD_REVEAL_EASE,
      }}
    >
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={cardClassName}
        >
          {cardContent}
        </a>
      ) : (
        <Link href={`/projects/${project.slug}`} className={cardClassName}>
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}
