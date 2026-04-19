type GitHubEventType =
  | "PushEvent"
  | "PullRequestEvent"
  | "IssuesEvent"
  | "IssueCommentEvent"
  | "CreateEvent"
  | "DeleteEvent";

type GitHubEventPayload = {
  size?: number;
  action?: string;
  ref_type?: string;
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
  action: string;
  repo: string;
  occurredAt: string;
};

const GITHUB_PUBLIC_EVENTS_URL =
  "https://api.github.com/users/mnihad000/events/public";

function formatEventAction(event: GitHubPublicEvent): string {
  const eventType = event.type as GitHubEventType | undefined;
  const payload = event.payload;

  switch (eventType) {
    case "PushEvent": {
      const commitCount =
        typeof payload?.size === "number" && payload.size > 0
          ? payload.size
          : undefined;

      if (commitCount === 1) {
        return "Pushed 1 commit";
      }

      if (typeof commitCount === "number") {
        return `Pushed ${commitCount} commits`;
      }

      return "Pushed commits";
    }
    case "PullRequestEvent": {
      const action = payload?.action;
      if (action === "opened") {
        return "Opened pull request";
      }
      if (action === "closed") {
        return "Closed pull request";
      }
      if (action === "reopened") {
        return "Reopened pull request";
      }
      return "Updated pull request";
    }
    case "IssuesEvent": {
      const action = payload?.action;
      if (action === "opened") {
        return "Opened issue";
      }
      if (action === "closed") {
        return "Closed issue";
      }
      if (action === "reopened") {
        return "Reopened issue";
      }
      return "Updated issue";
    }
    case "IssueCommentEvent":
      return "Commented on issue";
    case "CreateEvent": {
      const refType = payload?.ref_type;
      return refType ? `Created ${refType}` : "Created resource";
    }
    case "DeleteEvent": {
      const refType = payload?.ref_type;
      return refType ? `Deleted ${refType}` : "Deleted resource";
    }
    default:
      return "Updated activity";
  }
}

function toActivityItem(
  event: GitHubPublicEvent,
  index: number,
): GitHubActivityItem | null {
  if (!event.created_at || typeof event.created_at !== "string") {
    return null;
  }

  const occurredAtMs = Date.parse(event.created_at);
  if (!Number.isFinite(occurredAtMs)) {
    return null;
  }

  const repoName =
    typeof event.repo?.name === "string" && event.repo.name.trim().length > 0
      ? event.repo.name
      : "Unknown repository";

  const fallbackId = `${event.type ?? "event"}-${event.created_at}-${repoName}-${index}`;
  const eventId =
    typeof event.id === "string" && event.id.trim().length > 0
      ? event.id
      : fallbackId;

  return {
    id: eventId,
    action: formatEventAction(event),
    repo: repoName,
    occurredAt: event.created_at,
  };
}

function sortByRecency(a: GitHubActivityItem, b: GitHubActivityItem): number {
  const aTime = Date.parse(a.occurredAt);
  const bTime = Date.parse(b.occurredAt);
  return bTime - aTime;
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

    const items = parsed
      .map((event, index) => toActivityItem(event as GitHubPublicEvent, index))
      .filter((item): item is GitHubActivityItem => item !== null)
      .sort(sortByRecency);

    return items.slice(0, safeLimit);
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
