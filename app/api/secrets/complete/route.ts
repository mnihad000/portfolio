import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type SecretMessage = {
  number: number;
  name: string;
  message: string;
};

let redis: Redis | null = null;

function getRedis() {
  if (!redis) {
    redis = Redis.fromEnv();
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
    const rawMessages = await client.lrange("messages", 0, -1);
    const messages = rawMessages
      .map((message) => parseMessage(message))
      .filter((message): message is SecretMessage => message !== null);

    return NextResponse.json({ number, messages });
  } catch {
    return NextResponse.json(
      { error: "Unable to unlock classified dossier." },
      { status: 500 }
    );
  }
}
