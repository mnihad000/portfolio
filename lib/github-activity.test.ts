import assert from "node:assert/strict";
import test from "node:test";
import { mapGitHubEventsToActivity } from "./github-activity.ts";

test("maps push event with repo, branch, and compact commit preview", () => {
  const events = [
    {
      id: "evt-1",
      type: "PushEvent",
      created_at: "2026-04-20T12:00:00Z",
      repo: { name: "mnihad000/hackhunter" },
      payload: {
        size: 3,
        ref: "refs/heads/main",
        commits: [
          { sha: "abcdef123456", message: "feat: add auth" },
          { sha: "bcdefa234567", message: "fix: guard null state" },
          { sha: "cdefab345678", message: "chore: update docs" },
        ],
      },
    },
  ];

  const items = mapGitHubEventsToActivity(events, 5);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.repo, "mnihad000/hackhunter");
  assert.equal(items[0]?.branch, "main");
  assert.equal(items[0]?.commitCount, 3);
  assert.equal(items[0]?.commitsPreview.length, 2);
  assert.equal(items[0]?.remainingCommitCount, 1);
  assert.deepEqual(items[0]?.commitsPreview[0], {
    shortSha: "abcdef1",
    message: "feat: add auth",
  });
});

test("falls back for missing branch and invalid/empty commit messages", () => {
  const events = [
    {
      id: "evt-2",
      type: "PushEvent",
      created_at: "2026-04-20T12:00:00Z",
      repo: { name: "mnihad000/portfolio" },
      payload: {
        size: 2,
        commits: [
          { sha: "1234567890", message: "" },
          { sha: "0987654321", message: "   " },
        ],
      },
    },
  ];

  const items = mapGitHubEventsToActivity(events, 5);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.branch, "unknown branch");
  assert.equal(items[0]?.commitsPreview.length, 0);
  assert.equal(items[0]?.remainingCommitCount, 2);
});

test("filters non-push events and invalid dates", () => {
  const events = [
    {
      id: "evt-pr",
      type: "PullRequestEvent",
      created_at: "2026-04-20T12:00:00Z",
      repo: { name: "mnihad000/repo-a" },
      payload: { action: "opened" },
    },
    {
      id: "evt-invalid-date",
      type: "PushEvent",
      created_at: "not-a-date",
      repo: { name: "mnihad000/repo-b" },
      payload: { size: 1, commits: [{ sha: "abc", message: "test" }] },
    },
    {
      id: "evt-push",
      type: "PushEvent",
      created_at: "2026-04-20T13:00:00Z",
      repo: { name: "mnihad000/repo-c" },
      payload: { size: 1, ref: "refs/heads/dev", commits: [{ sha: "abc", message: "ok" }] },
    },
  ];

  const items = mapGitHubEventsToActivity(events, 5);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.repo, "mnihad000/repo-c");
});

test("applies limit after sorting by recency", () => {
  const events = [
    {
      id: "old",
      type: "PushEvent",
      created_at: "2026-04-19T13:00:00Z",
      repo: { name: "mnihad000/old" },
      payload: { size: 1, ref: "refs/heads/main", commits: [{ sha: "aaa", message: "old" }] },
    },
    {
      id: "new",
      type: "PushEvent",
      created_at: "2026-04-20T13:00:00Z",
      repo: { name: "mnihad000/new" },
      payload: { size: 1, ref: "refs/heads/main", commits: [{ sha: "bbb", message: "new" }] },
    },
  ];

  const items = mapGitHubEventsToActivity(events, 1);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.repo, "mnihad000/new");
});
