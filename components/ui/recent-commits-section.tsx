"use client";

import { useEffect, useState } from "react";
import type {
  GitHubActivityDashboardData,
  GitHubYearlyCommitSummary,
  RecentCommit,
} from "@/lib/github-activity";

const ACTIVITY_YEAR = 2026;
const MAX_COMMITS = 5;
const RADIAL_ACTIVITY_SCALE = [
  "#FFF0F0",
  "#FFCCCC",
  "#FF8080",
  "#FF3333",
  "#E0001B",
  "#9D0013",
] as const;
const EMPTY_ACTIVITY_CELL_COLOR = "#FAFAFA";

type ActivityStatus = "loading" | "ready" | "error";

function polarToCartesian(center: number, radius: number, angleDegrees: number) {
  const angleRadians = ((angleDegrees - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(angleRadians),
    y: center + radius * Math.sin(angleRadians),
  };
}

function describeDonutSlice(
  center: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarToCartesian(center, outerRadius, startAngle);
  const outerEnd = polarToCartesian(center, outerRadius, endAngle);
  const innerEnd = polarToCartesian(center, innerRadius, endAngle);
  const innerStart = polarToCartesian(center, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function getOuterLabelAnchor(labelX: number, center: number) {
  if (Math.abs(labelX - center) < 12) {
    return "middle";
  }

  return labelX < center ? "end" : "start";
}

function CommitSkeletonCard() {
  return (
    <div className="rounded-[18px] border border-[rgba(232,80,10,0.09)] bg-[rgba(255,255,255,0.76)] px-5 py-4 shadow-[0_10px_36px_rgba(232,80,10,0.05)] backdrop-blur-[16px]">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-24 rounded-full bg-[rgba(232,80,10,0.12)]" />
          <div className="h-7 w-20 rounded-full bg-neutral-200/75" />
          <div className="ml-auto h-4 w-14 rounded bg-neutral-200/75" />
        </div>
        <div className="h-4 w-full rounded bg-neutral-200/75" />
        <div className="h-4 w-4/5 rounded bg-neutral-200/65" />
        <div className="h-3 w-16 rounded bg-neutral-200/65" />
      </div>
    </div>
  );
}

function CommitCard({ commit }: { commit: RecentCommit }) {
  return (
    <article className="rounded-[18px] border border-[rgba(232,80,10,0.11)] bg-[rgba(255,255,255,0.78)] px-5 py-4 shadow-[0_12px_40px_rgba(232,80,10,0.06)] backdrop-blur-[16px] transition duration-200 ease-out hover:-translate-y-[2px] hover:border-[rgba(232,80,10,0.24)] hover:shadow-[0_18px_48px_rgba(232,80,10,0.12)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[rgba(232,80,10,0.16)] bg-[rgba(232,80,10,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8500A]">
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

      <p className="mt-3 text-[14px] leading-[1.55] text-neutral-900">{commit.message}</p>

      {commit.shortSha ? (
        <p className="mt-3 font-mono text-xs text-neutral-400">{commit.shortSha}</p>
      ) : null}
    </article>
  );
}

function ChartSkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-[360px] rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.08),rgba(255,255,255,0.7)_42%,rgba(17,24,39,0.04)_100%)]" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="h-16 rounded-2xl bg-neutral-100/90" />
          <div className="h-16 rounded-2xl bg-neutral-100/90" />
        </div>
      </div>
    </div>
  );
}

function YearlyCommitRadialChart({ summary }: { summary: GitHubYearlyCommitSummary }) {
  const chartSize = 430;
  const center = chartSize / 2;
  const innerChartRadius = 78;
  const bandWidth = 16;
  const bandGap = 2;
  const sectorGap = 1.2;
  const outerRingRadius = innerChartRadius + RADIAL_ACTIVITY_SCALE.length * (bandWidth + bandGap);
  const labelRadius =
    innerChartRadius + RADIAL_ACTIVITY_SCALE.length * (bandWidth + bandGap) + 18;
  const maxMonthlyCommits = Math.max(summary.maxMonthlyCommits, 1);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          
          <h4 className="text-2xl font-semibold tracking-tight text-neutral-950">
            {summary.year} by month
          </h4>
        </div>

        <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 shadow-sm">
          {summary.source === "github_search" ? "authored commits" : "public pushes"}
        </span>
      </div>

      <div className="mt-6">
        <svg
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          className="h-full w-full"
          role="img"
          aria-label={`Polar chart showing ${summary.year} GitHub commits by month`}
        >
          <defs>
            <radialGradient id="commitOrbitCenter" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.99)" />
              <stop offset="100%" stopColor="rgba(243,244,246,0.98)" />
            </radialGradient>
          </defs>

          <circle cx={center} cy={center} r={outerRingRadius + 2} fill="rgba(255,255,255,0.4)" />
          {Array.from({ length: RADIAL_ACTIVITY_SCALE.length + 1 }, (_, index) => (
            <circle
              key={`grid-ring-${index}`}
              cx={center}
              cy={center}
              r={innerChartRadius + index * (bandWidth + bandGap)}
              fill="none"
              stroke="rgba(31,41,55,0.08)"
              strokeWidth="1.4"
            />
          ))}

          {summary.months.map((month, index) => {
            const startAngle = -90 + index * 30 + sectorGap / 2;
            const endAngle = -90 + (index + 1) * 30 - sectorGap / 2;
            const midAngle = (startAngle + endAngle) / 2;
            const monthRatio = month.commitCount / maxMonthlyCommits;
            const labelPosition = polarToCartesian(center, labelRadius, midAngle);
            const valuePosition = polarToCartesian(center, innerChartRadius - 14, midAngle);
            const dividerEnd = polarToCartesian(
              center,
              outerRingRadius,
              midAngle,
            );
            const textAnchor = getOuterLabelAnchor(labelPosition.x, center);

            return (
              <g key={`${month.label}-${month.commitCount}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={dividerEnd.x}
                  y2={dividerEnd.y}
                  stroke="rgba(31,41,55,0.06)"
                  strokeWidth="1.2"
                />
                {RADIAL_ACTIVITY_SCALE.map((bandColor, bandIndex) => {
                  const bandStart = bandIndex / RADIAL_ACTIVITY_SCALE.length;
                  const bandEnd = (bandIndex + 1) / RADIAL_ACTIVITY_SCALE.length;
                  const bandFill =
                    Math.min(Math.max((monthRatio - bandStart) / (bandEnd - bandStart), 0), 1);
                  const innerRadius = innerChartRadius + bandIndex * (bandWidth + bandGap);
                  const trackOuterRadius = innerRadius + bandWidth;

                  return (
                    <g key={`${month.label}-band-${bandIndex}`}>
                      <path
                        d={describeDonutSlice(
                          center,
                          innerRadius,
                          trackOuterRadius,
                          startAngle,
                          endAngle,
                        )}
                        fill={EMPTY_ACTIVITY_CELL_COLOR}
                      />
                      {bandFill > 0 ? (
                        <path
                          d={describeDonutSlice(
                            center,
                            innerRadius,
                            innerRadius + bandWidth * bandFill,
                            startAngle,
                            endAngle,
                          )}
                          fill={bandColor}
                          opacity={bandIndex === RADIAL_ACTIVITY_SCALE.length - 1 ? 1 : 0.95}
                        />
                      ) : null}
                    </g>
                  );
                })}
                <text
                  x={valuePosition.x}
                  y={valuePosition.y}
                  fill="rgba(31,41,55,0.74)"
                  fontSize="11.5"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {month.commitCount}
                </text>
                <text
                  x={labelPosition.x}
                  y={labelPosition.y}
                  fill="rgba(17,24,39,0.74)"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.22em"
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                >
                  {month.shortLabel}
                </text>
              </g>
            );
          })}

          <circle
            cx={center}
            cy={center}
            r={58}
            fill="url(#commitOrbitCenter)"
            stroke="rgba(31,41,55,0.12)"
            strokeWidth="2"
          />
          <circle
            cx={center}
            cy={center}
            r={41}
            fill="rgba(255,255,255,0.88)"
            stroke="rgba(31,41,55,0.08)"
            strokeWidth="1.5"
          />
          <text
            x={center}
            y={center - 3}
            fill="#111827"
            fontSize="34"
            fontWeight="800"
            textAnchor="middle"
          >
            {summary.totalCommits}
          </text>
          <text
            x={center}
            y={center + 16}
            fill="rgba(31,41,55,0.72)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.22em"
            textAnchor="middle"
          >
            COMMITS
          </text>
          <text
            x={center}
            y={center + 30}
            fill="rgba(31,41,55,0.72)"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            in {summary.year}
          </text>
        </svg>
      </div>

    </div>
  );
}

export default function RecentCommitsSection() {
  const [data, setData] = useState<GitHubActivityDashboardData | null>(null);
  const [status, setStatus] = useState<ActivityStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivity() {
      try {
        const response = await fetch(`/api/github/activity?year=${ACTIVITY_YEAR}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`GitHub activity responded with ${response.status}`);
        }

        const parsed = (await response.json()) as GitHubActivityDashboardData;

        if (
          !parsed ||
          typeof parsed !== "object" ||
          !Array.isArray(parsed.recentCommits) ||
          !parsed.yearlySummary
        ) {
          throw new Error("Unexpected GitHub activity response");
        }

        setData(parsed);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load GitHub activity", error);
        setStatus("error");
      }
    }

    loadActivity();

    return () => {
      controller.abort();
    };
  }, []);

  const fallbackSummary: GitHubYearlyCommitSummary = {
    year: ACTIVITY_YEAR,
    totalCommits: 0,
    maxMonthlyCommits: 0,
    source: "public_events",
    months: [
      { month: 0, label: "January", shortLabel: "JAN", commitCount: 0 },
      { month: 1, label: "February", shortLabel: "FEB", commitCount: 0 },
      { month: 2, label: "March", shortLabel: "MAR", commitCount: 0 },
      { month: 3, label: "April", shortLabel: "APR", commitCount: 0 },
      { month: 4, label: "May", shortLabel: "MAY", commitCount: 0 },
      { month: 5, label: "June", shortLabel: "JUN", commitCount: 0 },
      { month: 6, label: "July", shortLabel: "JUL", commitCount: 0 },
      { month: 7, label: "August", shortLabel: "AUG", commitCount: 0 },
      { month: 8, label: "September", shortLabel: "SEP", commitCount: 0 },
      { month: 9, label: "October", shortLabel: "OCT", commitCount: 0 },
      { month: 10, label: "November", shortLabel: "NOV", commitCount: 0 },
      { month: 11, label: "December", shortLabel: "DEC", commitCount: 0 },
    ],
  };

  const commits = data?.recentCommits ?? [];
  const summary = data?.yearlySummary ?? fallbackSummary;

  return (
    <section id="recent-commits" className="mx-auto mt-24 max-w-[1280px] scroll-mt-28">
      <div className="relative min-w-0">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">GitHub</p>
          <h3 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
            Recent and Yearly commits.
          </h3>
          <p className="mt-3 text-base leading-8 text-neutral-500 md:text-lg">
            Live push activity stays in the timeline while the chart summarizes commit volume
            month by month across {ACTIVITY_YEAR}.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(232,80,10,0.25)] bg-[rgba(232,80,10,0.08)] px-3 py-1.5 text-xs font-medium text-[#E8500A]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgba(232,80,10,0.45)]" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E8500A]" />
            </span>
            <span className="uppercase tracking-[0.14em]">live from GitHub</span>
          </div>
        </div>

        <div className="relative mt-10 pl-8 md:pl-10 xl:min-h-[560px] xl:pr-[500px]">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[4px] top-2 w-px bg-[linear-gradient(180deg,#E8500A_0%,#E8500A_76%,rgba(232,80,10,0)_100%)] md:left-[5px]"
          />

          <div className="space-y-5">
            {status === "loading"
              ? Array.from({ length: MAX_COMMITS }).map((_, index) => (
                  <div key={`commit-skeleton-${index}`} className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute left-[-26px] top-5 h-[10px] w-[10px] rounded-full bg-[#E8500A] shadow-[0_0_0_4px_rgba(232,80,10,0.14)] md:left-[-35px]"
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
                      className="absolute left-[-26px] top-5 h-[10px] w-[10px] rounded-full bg-[#E8500A] shadow-[0_0_0_4px_rgba(232,80,10,0.14)] md:left-[-35px]"
                    />
                    <CommitCard commit={commit} />
                  </div>
                ))
              : null}

            {status === "ready" && commits.length === 0 ? (
              <div className="rounded-[18px] border border-[rgba(232,80,10,0.1)] bg-[rgba(255,255,255,0.78)] px-5 py-4 text-sm text-neutral-500 shadow-[0_10px_36px_rgba(232,80,10,0.05)] backdrop-blur-[16px]">
                No recent public push activity is available right now.
              </div>
            ) : null}

            {status === "error" ? (
              <div className="rounded-[18px] border border-[rgba(232,80,10,0.1)] bg-[rgba(255,255,255,0.78)] px-5 py-4 text-sm text-neutral-500 shadow-[0_10px_36px_rgba(232,80,10,0.05)] backdrop-blur-[16px]">
                Could not load GitHub activity right now.
              </div>
            ) : null}
          </div>

          <div className="mt-10 xl:absolute xl:right-0 xl:top-0 xl:mt-0 xl:w-[470px]">
            {status === "loading" ? <ChartSkeleton /> : <YearlyCommitRadialChart summary={summary} />}
          </div>
        </div>
      </div>
    </section>
  );
}
