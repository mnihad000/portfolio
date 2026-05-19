import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type SecretMessage = {
  number: number;
  name: string;
  message: string;
};

const PUBLIC_VISITOR_COUNT_KEY = "public_visitor_count";
const PUBLIC_VISITOR_COUNT_START = 300;

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

function parseMessage(value: unknown): SecretMessage | null {
  if (typeof value !== "string" && (!value || typeof value !== "object")) {
    return null;
  }

  try {
    const parsed = (
      typeof value === "string" ? JSON.parse(value) : value
    ) as Partial<SecretMessage>;
    const number = Number(parsed.number);

    if (
      !Number.isInteger(number) ||
      typeof parsed.name !== "string" ||
      typeof parsed.message !== "string"
    ) {
      return null;
    }

    return {
      number,
      name: parsed.name,
      message: parsed.message,
    };
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    const client = getRedis();
    const number = await client.incr("visitor_count");
    await client.setnx(PUBLIC_VISITOR_COUNT_KEY, PUBLIC_VISITOR_COUNT_START);
    const visitorTotal = Number(await client.get(PUBLIC_VISITOR_COUNT_KEY));
    const rawMessages = await client.lrange("messages", 0, -1);
    const messages = rawMessages
      .map((message) => parseMessage(message))
      .filter((message): message is SecretMessage => message !== null);

    return NextResponse.json({
      number,
      visitorTotal: Number.isInteger(visitorTotal)
        ? Math.max(visitorTotal, PUBLIC_VISITOR_COUNT_START)
        : PUBLIC_VISITOR_COUNT_START,
      messages,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to unlock classified dossier." },
      { status: 500 }
    );
  }
}
