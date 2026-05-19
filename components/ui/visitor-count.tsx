"use client";

import { useEffect, useState } from "react";

const visitorStart = 300;
let hasTrackedVisit = false;

export default function VisitorCount() {
  const [visitors, setVisitors] = useState(visitorStart);

  useEffect(() => {
    if (hasTrackedVisit) {
      return;
    }

    hasTrackedVisit = true;

    async function updateVisitorCount() {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Visitor count request failed.");
        }

        const payload = (await response.json()) as { visitors?: unknown };
        const nextVisitors = Number(payload.visitors);

        if (Number.isInteger(nextVisitors) && nextVisitors >= visitorStart) {
          setVisitors(nextVisitors);
        }
      } catch {
        setVisitors(visitorStart);
      }
    }

    void updateVisitorCount();
  }, []);

  return (
    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
      Visitors: {visitors.toLocaleString()}
    </p>
  );
}
