type GitHubEventType = "PushEvent";

type GitHubPushCommit = {
  sha?: string;
  message?: string;
};

type GitHubEventPayload = {
  size?: number;
  ref?: string;
  commits?: GitHubPushCommit[];
};

type GitHubPublicEvent = {
  id?: string;
  type?: string;
  repo?: {
    name?: string;
  };
  payload?: GitHubEventPayload;
  created_at?: string;
};

type GitHubCommitSearchResponse = {
  total_count?: number;
};

export type GitHubActivityItem = {
  id: string;
  repo: string;
  branch: string;
  commitCount: number;
  commitsPreview: Array<{
    shortSha: string;
    message: string;
  }>;
  remainingCommitCount: number;
  occurredAt: string;
};

export type RecentCommit = {
  id: string;
  repo: string;
  branch: string;
  message: string;
  shortSha: string | null;
  relativeTime: string;
  createdAt: string;
};

export type GitHubMonthlyCommit = {
  month: number;
  label: string;
  shortLabel: string;
  commitCount: number;
};

export type GitHubYearlyCommitSummary = {
  year: number;
  totalCommits: number;
  maxMonthlyCommits: number;
  months: GitHubMonthlyCommit[];
  source: "github_search" | "public_events";
};

export type GitHubActivityDashboardData = {
  recentCommits: RecentCommit[];
  yearlySummary: GitHubYearlyCommitSummary;
};

const GITHUB_USERNAME = "mnihad000";
const GITHUB_PUBLIC_EVENTS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/events/public`;
const GITHUB_COMMIT_SEARCH_URL = "https://api.github.com/search/commits";
const COMMIT_PREVIEW_LIMIT = 2;
const UNKNOWN_REPOSITORY = "Unknown repository";
const UNKNOWN_BRANCH = "unknown branch";
const UNKNOWN_SHA = "unknown";
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function createGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getRepoName(event: GitHubPublicEvent): string {
  if (typeof event.repo?.name === "string" && event.repo.name.trim().length > 0) {
    return event.repo.name;
  }

  return UNKNOWN_REPOSITORY;
}

function getRecentCommitRepoName(event: GitHubPublicEvent): string {
  return getRepoName(event).replace(/^mnihad000\//, "").trim() || "Unknown repo";
}

function getBranchName(ref: string | undefined): string {
  if (typeof ref !== "string" || ref.trim().length === 0) {
    return UNKNOWN_BRANCH;
  }

  const headsPrefix = "refs/heads/";
  if (ref.startsWith(headsPrefix) && ref.length > headsPrefix.length) {
    return ref.slice(headsPrefix.length);
  }

  return ref;
}

function getCommitPreview(
  commits: GitHubPushCommit[] | undefined,
): GitHubActivityItem["commitsPreview"] {
  if (!Array.isArray(commits) || commits.length === 0) {
    return [];
  }

  return commits
    .filter(
      (commit) =>
        typeof commit.message === "string" && commit.message.trim().length > 0,
    )
    .slice(0, COMMIT_PREVIEW_LIMIT)
    .map((commit) => ({
      shortSha:
        typeof commit.sha === "string" && commit.sha.length > 0
          ? commit.sha.slice(0, 7)
          : UNKNOWN_SHA,
      message: (commit.message ?? "").trim(),
    }));
}

function getCommitCountFromPayload(payload: GitHubEventPayload | undefined): number {
  if (typeof payload?.size === "number" && payload.size > 0) {
    return payload.size;
  }

  if (Array.isArray(payload?.commits) && payload.commits.length > 0) {
    return payload.commits.length;
  }

  return 1;
}

function getCommitCount(
  payloadSize: number | undefined,
  commitPreviewLength: number,
  payloadCommitsLength: number,
): number {
  if (typeof payloadSize === "number" && payloadSize > 0) {
    return payloadSize;
  }

  if (payloadCommitsLength > 0) {
    return payloadCommitsLength;
  }

  if (commitPreviewLength > 0) {
    return commitPreviewLength;
  }

  return 1;
}

function truncateRecentCommitMessage(message: string, maxLength = 80): string {
  const trimmed = message.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildYearlySummary(
  year: number,
  monthlyCounts: number[],
  source: GitHubYearlyCommitSummary["source"],
): GitHubYearlyCommitSummary {
  const months = MONTH_LABELS.map((label, monthIndex) => ({
    month: monthIndex,
    label,
    shortLabel: label.slice(0, 3).toUpperCase(),
    commitCount: monthlyCounts[monthIndex] ?? 0,
  }));
  const totalCommits = months.reduce((sum, month) => sum + month.commitCount, 0);
  const maxMonthlyCommits = months.reduce(
    (maxCount, month) => Math.max(maxCount, month.commitCount),
    0,
  );

  return {
    year,
    totalCommits,
    maxMonthlyCommits,
    months,
    source,
  };
}

function toActivityItem(
  event: GitHubPublicEvent,
  index: number,
): GitHubActivityItem | null {
  if ((event.type as GitHubEventType | undefined) !== "PushEvent") {
    return null;
  }

  if (!event.created_at || typeof event.created_at !== "string") {
    return null;
  }

  const occurredAtMs = Date.parse(event.created_at);
  if (!Number.isFinite(occurredAtMs)) {
    return null;
  }

  const repoName = getRepoName(event);
  const branch = getBranchName(event.payload?.ref);
  const payloadCommitsLength = Array.isArray(event.payload?.commits)
    ? event.payload.commits.length
    : 0;
  const commitsPreview = getCommitPreview(event.payload?.commits);
  const commitCount = getCommitCount(
    event.payload?.size,
    commitsPreview.length,
    payloadCommitsLength,
  );
  const remainingCommitCount = Math.max(0, commitCount - commitsPreview.length);

  const fallbackId = `${event.type ?? "event"}-${event.created_at}-${repoName}-${index}`;
  const eventId =
    typeof event.id === "string" && event.id.trim().length > 0
      ? event.id
      : fallbackId;

  return {
    id: eventId,
    repo: repoName,
    branch,
    commitCount,
    commitsPreview,
    remainingCommitCount,
    occurredAt: event.created_at,
  };
}

function sortByRecency<T extends { createdAt?: string; occurredAt?: string }>(
  a: T,
  b: T,
): number {
  const aTime = Date.parse(a.createdAt ?? a.occurredAt ?? "");
  const bTime = Date.parse(b.createdAt ?? b.occurredAt ?? "");
  return bTime - aTime;
}

function getMonthRange(year: number, monthIndex: number) {
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function getLastQueryableMonth(year: number, now = new Date()): number {
  const currentYear = now.getUTCFullYear();

  if (year < currentYear) {
    return 11;
  }

  if (year > currentYear) {
    return -1;
  }

  return now.getUTCMonth();
}

async function getGitHubPublicEvents(): Promise<GitHubPublicEvent[]> {
  try {
    const response = await fetch(GITHUB_PUBLIC_EVENTS_URL, {
      headers: createGitHubHeaders(),
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return [];
    }

    const parsed = (await response.json()) as unknown;
    return Array.isArray(parsed) ? (parsed as GitHubPublicEvent[]) : [];
  } catch {
    return [];
  }
}

async function fetchMonthlyCommitCountFromSearch(
  year: number,
  monthIndex: number,
): Promise<number> {
  const { start, end } = getMonthRange(year, monthIndex);
  const query = `author:${GITHUB_USERNAME} author-date:${start}..${end}`;
  const url = `${GITHUB_COMMIT_SEARCH_URL}?q=${encodeURIComponent(query)}&per_page=1`;

  const response = await fetch(url, {
    headers: createGitHubHeaders(),
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub commit search failed with status ${response.status}`);
  }

  const parsed = (await response.json()) as GitHubCommitSearchResponse;
  if (typeof parsed.total_count !== "number" || parsed.total_count < 0) {
    throw new Error("GitHub commit search returned an invalid total_count");
  }

  return parsed.total_count;
}

async function getGitHubYearlyCommitSummaryFromSearch(
  year: number,
): Promise<GitHubYearlyCommitSummary> {
  const lastQueryableMonth = getLastQueryableMonth(year);

  if (lastQueryableMonth < 0) {
    return buildYearlySummary(year, Array.from({ length: 12 }, () => 0), "github_search");
  }

  const monthlyCounts = await Promise.all(
    MONTH_LABELS.map((_, monthIndex) =>
      monthIndex > lastQueryableMonth
        ? Promise.resolve(0)
        : fetchMonthlyCommitCountFromSearch(year, monthIndex),
    ),
  );

  return buildYearlySummary(year, monthlyCounts, "github_search");
}

export function mapGitHubEventsToActivity(
  events: unknown[],
  limit: number,
): GitHubActivityItem[] {
  const safeLimit = Math.max(0, limit);

  const items = events
    .map((event, index) => toActivityItem(event as GitHubPublicEvent, index))
    .filter((item): item is GitHubActivityItem => item !== null)
    .sort(sortByRecency);

  return items.slice(0, safeLimit);
}

export function mapGitHubEventsToRecentCommits(
  events: unknown[],
  limit: number,
): RecentCommit[] {
  const safeLimit = Math.max(0, limit);

  return events
    .filter(
      (event): event is GitHubPublicEvent =>
        typeof event === "object" && event !== null && (event as GitHubPublicEvent).type === "PushEvent",
    )
    .map((event, index) => {
      if (!event.created_at) {
        return null;
      }

      const createdAtMs = Date.parse(event.created_at);
      if (!Number.isFinite(createdAtMs)) {
        return null;
      }

      const branchName = getBranchName(event.payload?.ref);
      const latestCommit = event.payload?.commits?.at(-1);
      const shortSha =
        typeof latestCommit?.sha === "string" && latestCommit.sha.length > 0
          ? latestCommit.sha.slice(0, 7)
          : null;
      const repoName = getRecentCommitRepoName(event);
      const fallbackMessage = `Pushed updates to ${branchName}`;

      return {
        id:
          typeof event.id === "string" && event.id.trim().length > 0
            ? event.id
            : `${repoName}-${branchName}-${event.created_at}-${shortSha ?? index}`,
        repo: repoName,
        branch: branchName,
        message: truncateRecentCommitMessage(latestCommit?.message ?? fallbackMessage),
        shortSha,
        relativeTime: formatRelativeActivityTime(event.created_at),
        createdAt: event.created_at,
      } satisfies RecentCommit;
    })
    .filter((item): item is RecentCommit => item !== null)
    .sort(sortByRecency)
    .slice(0, safeLimit);
}

export function summarizeMonthlyCommitsFromEvents(
  events: unknown[],
  year: number,
): GitHubYearlyCommitSummary {
  const monthlyCounts = Array.from({ length: 12 }, () => 0);

  events.forEach((event) => {
    const parsedEvent = event as GitHubPublicEvent;

    if (parsedEvent.type !== "PushEvent" || typeof parsedEvent.created_at !== "string") {
      return;
    }

    const occurredAt = new Date(parsedEvent.created_at);
    if (Number.isNaN(occurredAt.getTime()) || occurredAt.getUTCFullYear() !== year) {
      return;
    }

    monthlyCounts[occurredAt.getUTCMonth()] += getCommitCountFromPayload(parsedEvent.payload);
  });

  return buildYearlySummary(year, monthlyCounts, "public_events");
}

export async function getGitHubActivityDashboardData(
  year = new Date().getUTCFullYear(),
  limit = 5,
): Promise<GitHubActivityDashboardData> {
  const publicEvents = await getGitHubPublicEvents();
  const recentCommits = mapGitHubEventsToRecentCommits(publicEvents, limit);

  try {
    const yearlySummary = await getGitHubYearlyCommitSummaryFromSearch(year);

    return {
      recentCommits,
      yearlySummary,
    };
  } catch {
    return {
      recentCommits,
      yearlySummary: summarizeMonthlyCommitsFromEvents(publicEvents, year),
    };
  }
}

export async function getRecentGitHubActivity(
  limit = 5,
): Promise<GitHubActivityItem[]> {
  const publicEvents = await getGitHubPublicEvents();
  return mapGitHubEventsToActivity(publicEvents, limit);
}

export function formatRelativeActivityTime(
  occurredAt: string,
  nowMs = Date.now(),
): string {
  const eventTime = Date.parse(occurredAt);
  if (!Number.isFinite(eventTime)) {
    return "Recently";
  }

  const diffMs = nowMs - eventTime;
  if (diffMs < 0) {
    return "Recently";
  }

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return `${minutes}m ago`;
  }

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return `${hours}h ago`;
  }

  if (diffMs < 30 * dayMs) {
    const days = Math.max(1, Math.floor(diffMs / dayMs));
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(eventTime));
}
