"use client";

import { useEffect, useState } from "react";

const visitorStart = 300;
let visitorCountRequest: Promise<number> | null = null;
let resolvedVisitorCount: number | null = null;

function getVisitorCount() {
  if (!visitorCountRequest) {
    visitorCountRequest = fetch("/api/visitors", {
      method: "POST",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Visitor count request failed.");
        }

        const payload = (await response.json()) as { visitors?: unknown };
        const visitors = Number(payload.visitors);

        return Number.isInteger(visitors) && visitors >= visitorStart
          ? visitors
          : visitorStart;
      })
      .catch(() => visitorStart);
  }

  return visitorCountRequest;
}

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(resolvedVisitorCount);

  useEffect(() => {
    let active = true;

    void getVisitorCount().then((nextVisitors) => {
      resolvedVisitorCount = nextVisitors;

      if (active) {
        setVisitors(nextVisitors);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (visitors === null) {
    return null;
  }

  return (
    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
      Visitors: {visitors.toLocaleString()}
    </p>
  );
}
