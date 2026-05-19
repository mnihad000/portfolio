import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const VISITOR_COUNT_KEY = "public_visitor_count";
const VISITOR_COUNT_START = 300;

let redis: Redis | null = null;

function getRedis() {
  if (!redis) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      throw new Error("Missing KV_REST_API_URL or KV_REST_API_TOKEN.");
    }

    redis = new Redis({ url, token });
  }

  return redis;
}

export async function POST() {
  try {
    const client = getRedis();

    await client.setnx(VISITOR_COUNT_KEY, VISITOR_COUNT_START);
    const visitors = await client.incr(VISITOR_COUNT_KEY);

    return NextResponse.json(
      { visitors },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to update visitor count." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = getRedis();

    await client.setnx(VISITOR_COUNT_KEY, VISITOR_COUNT_START);
    const visitors = Number(await client.get(VISITOR_COUNT_KEY));

    return NextResponse.json(
      { visitors: Number.isInteger(visitors) ? visitors : VISITOR_COUNT_START },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve visitor count." },
      { status: 500 }
    );
  }
}
