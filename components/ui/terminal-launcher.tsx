"use client";

import { useEffect, useState } from "react";

const GALAXY_ACTIVE_SELECTOR = ".galaxy-overlay.is-open, .galaxy-overlay.is-closing";

export default function TerminalLauncher({
  hidden,
  onOpen,
}: {
  hidden: boolean;
  onOpen: () => void;
}) {
  const [galaxyActive, setGalaxyActive] = useState(false);

  // The galaxy overlay is injected by public/galaxy/galaxy.js, so watch its classes from the outside.
  useEffect(() => {
    const sync = () => {
      setGalaxyActive(Boolean(document.querySelector(GALAXY_ACTIVE_SELECTOR)));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  const isHidden = hidden || galaxyActive;

  return (
    <button
      id="terminal-launcher"
      type="button"
      onClick={onOpen}
      className={`terminal-launcher${isHidden ? " is-hidden" : ""}`}
      aria-label="Open the NIHAD_OS terminal"
      aria-hidden={isHidden || undefined}
      tabIndex={isHidden ? -1 : undefined}
    >
      <span className="terminal-launcher__glyph" aria-hidden="true">
        &gt;_
      </span>
      <span className="terminal-launcher__copy" aria-hidden="true">
        <span className="terminal-launcher__copy-default">Terminal</span>
        <span className="terminal-launcher__copy-hover">Boot NIHAD_OS -&gt;</span>
      </span>
      <span className="terminal-launcher__caret" aria-hidden="true" />
    </button>
  );
}
