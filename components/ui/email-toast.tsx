"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Check, X } from "lucide-react";
import { lightModeContent } from "@/lib/light-mode-content";

const EMAIL_TOAST_EVENT = "email-toast";
const TOAST_DURATION_MS = 9000;

export const EMAIL_ADDRESS = lightModeContent.email;
export const MAILTO_HREF = `mailto:${EMAIL_ADDRESS}`;

const GMAIL_COMPOSE_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}`;
const OUTLOOK_COMPOSE_HREF = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(EMAIL_ADDRESS)}`;

// mailto: silently does nothing when the visitor has no working mail app (common with Windows' Outlook default),
// so every email action also copies the address and shows web-compose fallbacks.
// The copy must finish before handing off to the mail app: once the app takes focus, clipboard writes are refused.
export async function openEmailDraft() {
  window.dispatchEvent(new CustomEvent(EMAIL_TOAST_EVENT));

  try {
    await navigator.clipboard?.writeText(EMAIL_ADDRESS);
  } catch {
    // The toast still shows the address and the web-compose links.
  }

  window.location.href = MAILTO_HREF;
}

// For <a href={MAILTO_HREF}> links: run the copy-then-open flow, but leave modified clicks
// (new tab, middle click) to the browser.
export function handleEmailLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  void openEmailDraft();
}

export default function EmailToast() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const show = () => {
      setVisible(true);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => setVisible(false), TOAST_DURATION_MS);
    };

    window.addEventListener(EMAIL_TOAST_EVENT, show);

    return () => {
      window.removeEventListener(EMAIL_TOAST_EVENT, show);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`email-toast${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
    >
      {visible ? (
        <>
          <span className="email-toast__check" aria-hidden="true">
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
          </span>
          <div className="min-w-0">
            <p className="email-toast__title">
              Email copied: <span className="email-toast__address">{EMAIL_ADDRESS}</span>
            </p>
            <p className="email-toast__hint">
              Mail app didn&apos;t open? Write from{" "}
              <a href={GMAIL_COMPOSE_HREF} target="_blank" rel="noreferrer">
                Gmail
              </a>{" "}
              or{" "}
              <a href={OUTLOOK_COMPOSE_HREF} target="_blank" rel="noreferrer">
                Outlook
              </a>
              .
            </p>
          </div>
          <button
            type="button"
            className="email-toast__close"
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </>
      ) : null}
    </div>
  );
}
