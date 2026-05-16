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

export async function GET() {
  try {
    const rawMessages = await getRedis().lrange("messages", 0, -1);
    const messages = rawMessages
      .map((message) => parseMessage(message))
      .filter((message): message is SecretMessage => message !== null);

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve classified messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SecretMessage>;
    const number = Number(body.number);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!Number.isInteger(number) || number < 1 || !message) {
      return NextResponse.json(
        { error: "Invalid classified message payload." },
        { status: 400 }
      );
    }

    const entry: SecretMessage = {
      number,
      name: name || "Anonymous",
      message,
    };

    await getRedis().rpush("messages", JSON.stringify(entry));

    return NextResponse.json({ message: entry });
  } catch {
    return NextResponse.json(
      { error: "Unable to store classified message." },
      { status: 500 }
    );
  }
}
