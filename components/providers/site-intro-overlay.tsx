"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SITE_INTRO_EXIT_DURATION_MS,
  SITE_INTRO_SESSION_KEY,
  SITE_INTRO_VIDEO_SRC,
} from "@/lib/theme";

const SITE_INTRO_MAX_WAIT_MS = 20000;

export default function SiteIntroOverlay() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationFallbackTimerRef = useRef<number | null>(null);
  const hardFallbackTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const hasStartedExitRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const clearTimers = useCallback(() => {
    if (durationFallbackTimerRef.current) {
      window.clearTimeout(durationFallbackTimerRef.current);
      durationFallbackTimerRef.current = null;
    }

    if (hardFallbackTimerRef.current) {
      window.clearTimeout(hardFallbackTimerRef.current);
      hardFallbackTimerRef.current = null;
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const beginExit = useCallback(() => {
    if (hasStartedExitRef.current) {
      return;
    }

    hasStartedExitRef.current = true;
    clearTimers();
    setIsExiting(true);

    document.documentElement.dataset.siteIntro = "played";

    exitTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }, SITE_INTRO_EXIT_DURATION_MS);
  }, [clearTimers]);

  const scheduleDurationFallback = useCallback(
    (durationSeconds: number) => {
      if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        return;
      }

      if (durationFallbackTimerRef.current) {
        window.clearTimeout(durationFallbackTimerRef.current);
      }

      durationFallbackTimerRef.current = window.setTimeout(() => {
        beginExit();
      }, Math.ceil(durationSeconds * 1000) + 120);
    },
    [beginExit]
  );

  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.siteIntro === "played") {
      const skipFrame = window.requestAnimationFrame(() => {
        setIsVisible(false);
      });

      return () => {
        window.cancelAnimationFrame(skipFrame);
      };
    }

    root.dataset.siteIntro = "active";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    try {
      window.sessionStorage.setItem(SITE_INTRO_SESSION_KEY, "true");
    } catch {
      // If storage is unavailable, replaying the intro is acceptable.
    }

    const video = videoRef.current;
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      scheduleDurationFallback(video.duration);
    }

    hardFallbackTimerRef.current = window.setTimeout(() => {
      beginExit();
    }, SITE_INTRO_MAX_WAIT_MS);

    return () => {
      clearTimers();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [beginExit, clearTimers, scheduleDurationFallback]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`site-intro-overlay fixed inset-0 z-[20000] overflow-hidden bg-black transition-opacity duration-[400ms] ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${SITE_INTRO_EXIT_DURATION_MS}ms` }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={SITE_INTRO_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={beginExit}
        onError={() => {
          beginExit();
        }}
        onLoadedMetadata={(event) => {
          scheduleDurationFallback(event.currentTarget.duration);
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/8" />
    </div>
  );
}
