import { NextResponse } from "next/server";
import { getGitHubActivityDashboardData } from "@/lib/github-activity";

function getRequestedYear(request: Request): number {
  const { searchParams } = new URL(request.url);
  const rawYear = Number(searchParams.get("year"));

  if (Number.isInteger(rawYear) && rawYear >= 2008 && rawYear <= 2100) {
    return rawYear;
  }

  return new Date().getUTCFullYear();
}

export async function GET(request: Request) {
  try {
    const year = getRequestedYear(request);
    const data = await getGitHubActivityDashboardData(year, 5);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve GitHub activity right now." },
      { status: 500 },
    );
  }
}
