"use client";

import { useEffect, useState } from "react";

const GITHUB_EVENTS_URL = "https://api.github.com/users/mnihad000/events/public";
const MAX_COMMITS = 5;

type GitHubPushCommit = {
  sha?: string;
  message?: string;
};

type GitHubPushEvent = {
  id?: string;
  type?: string;
  repo?: {
    name?: string;
  };
  payload?: {
    ref?: string;
    commits?: GitHubPushCommit[];
  };
  created_at?: string;
};

type RecentCommit = {
  id: string;
  repo: string;
  branch: string;
  message: string;
  shortSha: string | null;
  relativeTime: string;
  createdAt: string;
};

function formatRelativeTime(createdAt: string) {
  const parsed = Date.parse(createdAt);

  if (!Number.isFinite(parsed)) {
    return "Recently";
  }

  const diffMs = Date.now() - parsed;

  if (diffMs < 0) {
    return "Recently";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    return `${Math.max(1, Math.floor(diffMs / minute))}m ago`;
  }

  if (diffMs < day) {
    return `${Math.max(1, Math.floor(diffMs / hour))}h ago`;
  }

  return `${Math.max(1, Math.floor(diffMs / day))}d ago`;
}

function truncateMessage(message: string, maxLength = 80) {
  const trimmed = message.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}

function mapEventsToCommits(events: GitHubPushEvent[]) {
  return events
    .filter((event) => event.type === "PushEvent")
    .map((event, index) => {
      const latestCommit = event.payload?.commits?.at(-1);

      if (!event.created_at) {
        return null;
      }

      const repoName = event.repo?.name?.replace(/^mnihad000\//, "").trim() || "Unknown repo";
      const branchName =
        event.payload?.ref?.replace(/^refs\/heads\//, "").trim() || "unknown";
      const shortSha = latestCommit?.sha?.slice(0, 7) ?? null;
      const fallbackMessage = `Pushed updates to ${branchName}`;

      return {
        id:
          event.id?.trim() ||
          `${repoName}-${branchName}-${event.created_at}-${shortSha}-${index}`,
        repo: repoName,
        branch: branchName,
        message: truncateMessage(latestCommit?.message ?? fallbackMessage),
        shortSha,
        relativeTime: formatRelativeTime(event.created_at),
        createdAt: event.created_at,
      } satisfies RecentCommit;
    })
    .filter((item): item is RecentCommit => item !== null)
    .slice(0, MAX_COMMITS);
}

function CommitSkeletonCard() {
  return (
    <div className="rounded-[14px] border border-[rgba(232,80,10,0.08)] bg-[rgba(255,255,255,0.7)] px-[18px] py-[14px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-[12px]">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-24 rounded-full bg-neutral-200/80" />
          <div className="h-7 w-20 rounded-full bg-neutral-200/70" />
          <div className="ml-auto h-4 w-14 rounded bg-neutral-200/70" />
        </div>
        <div className="h-4 w-full rounded bg-neutral-200/70" />
        <div className="h-4 w-4/5 rounded bg-neutral-200/60" />
        <div className="h-3 w-16 rounded bg-neutral-200/65" />
      </div>
    </div>
  );
}

function CommitCard({ commit }: { commit: RecentCommit }) {
  return (
    <article className="rounded-[14px] border border-[rgba(232,80,10,0.1)] bg-[rgba(255,255,255,0.7)] px-[18px] py-[14px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] backdrop-blur-[12px] transition duration-200 ease-out hover:-translate-y-[2px] hover:border-[rgba(232,80,10,0.25)] hover:shadow-[0_8px_32px_rgba(232,80,10,0.08)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[rgba(232,80,10,0.15)] bg-[rgba(232,80,10,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8500A]">
          {commit.repo}
        </span>
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-500">
          branch: {commit.branch}
        </span>
        <time
          dateTime={commit.createdAt}
          className="ml-auto text-xs font-medium text-neutral-400"
        >
          {commit.relativeTime}
        </time>
      </div>

      <p className="mt-3 text-[14px] leading-[1.5] text-neutral-900">{commit.message}</p>

      {commit.shortSha ? (
        <p className="mt-3 font-mono text-xs text-neutral-400">{commit.shortSha}</p>
      ) : null}
    </article>
  );
}

export default function RecentCommitsSection() {
  const [commits, setCommits] = useState<RecentCommit[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCommits() {
      try {
        const response = await fetch(GITHUB_EVENTS_URL, {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`GitHub responded with ${response.status}`);
        }

        const parsed = (await response.json()) as unknown;

        if (!Array.isArray(parsed)) {
          throw new Error("Unexpected GitHub response");
        }

        setCommits(mapEventsToCommits(parsed as GitHubPushEvent[]));
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load recent commits", error);
        setStatus("error");
      }
    }

    loadCommits();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section id="recent-commits" className="mx-auto mt-24 max-w-6xl scroll-mt-28">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">GITHUB</p>
        <h3 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
          Recent Commits
        </h3>
        <p className="mt-3 text-base leading-8 text-neutral-500 md:text-lg">
          what I&apos;ve been building lately
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/45" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="uppercase tracking-[0.14em]">live from github</span>
        </div>
      </div>

      <div className="relative mt-10 pl-8 md:pl-10">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[4px] top-2 w-px bg-[linear-gradient(180deg,#E8500A_0%,#E8500A_72%,rgba(232,80,10,0)_100%)] md:left-[5px]"
        />

        <div className="space-y-5">
          {status === "loading"
            ? Array.from({ length: MAX_COMMITS }).map((_, index) => (
                <div key={`commit-skeleton-${index}`} className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute left-[-26px] top-5 h-[10px] w-[10px] rounded-full bg-[#E8500A] shadow-[0_0_0_3px_rgba(232,80,10,0.15)] md:left-[-35px]"
                  />
                  <CommitSkeletonCard />
                </div>
              ))
            : null}

          {status === "ready" && commits.length > 0
            ? commits.map((commit) => (
                <div key={commit.id} className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute left-[-26px] top-5 h-[10px] w-[10px] rounded-full bg-[#E8500A] shadow-[0_0_0_3px_rgba(232,80,10,0.15)] md:left-[-35px]"
                  />
                  <CommitCard commit={commit} />
                </div>
              ))
            : null}

          {status === "ready" && commits.length === 0 ? (
            <div className="rounded-[14px] border border-[rgba(232,80,10,0.08)] bg-[rgba(255,255,255,0.7)] px-[18px] py-[16px] text-sm text-neutral-500 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-[12px]">
              No recent public push activity available right now.
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-[14px] border border-[rgba(232,80,10,0.08)] bg-[rgba(255,255,255,0.7)] px-[18px] py-[16px] text-sm text-neutral-500 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-[12px]">
              Couldn&apos;t load recent commits from GitHub right now.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

