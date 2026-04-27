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

const GITHUB_PUBLIC_EVENTS_URL = "https://api.github.com/users/mnihad000/events/public";
const COMMIT_PREVIEW_LIMIT = 2;
const UNKNOWN_REPOSITORY = "Unknown repository";
const UNKNOWN_BRANCH = "unknown branch";
const UNKNOWN_SHA = "unknown";

function getRepoName(event: GitHubPublicEvent): string {
  if (typeof event.repo?.name === "string" && event.repo.name.trim().length > 0) {
    return event.repo.name;
  }

  return UNKNOWN_REPOSITORY;
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

function getCommitPreview(commits: GitHubPushCommit[] | undefined): GitHubActivityItem["commitsPreview"] {
  if (!Array.isArray(commits) || commits.length === 0) {
    return [];
  }

  return commits
    .filter(
      (commit) =>
        typeof commit.message === "string" &&
        commit.message.trim().length > 0,
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

function sortByRecency(a: GitHubActivityItem, b: GitHubActivityItem): number {
  const aTime = Date.parse(a.occurredAt);
  const bTime = Date.parse(b.occurredAt);
  return bTime - aTime;
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

export async function getRecentGitHubActivity(
  limit = 5,
): Promise<GitHubActivityItem[]> {
  const safeLimit = Math.max(0, limit);
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(GITHUB_PUBLIC_EVENTS_URL, {
      headers,
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return [];
    }

    const parsed = (await response.json()) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return mapGitHubEventsToActivity(parsed, safeLimit);
  } catch {
    return [];
  }
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
