'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const UNICORN_PROJECT_ID = 'OMzqyUv6M3kSnv0JeAtC';
const UNICORN_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js';
const UNICORN_RUNTIME_SCRIPT_ID = 'unicorn-runtime-script';
const UNICORN_STYLE_ID = 'hero-ascii-one-style';
const BOOT_SESSION_KEY = 'nihad-portfolio-home-boot-complete';
const BOOT_MIN_DURATION_MS = 2400;
const BOOT_SAFETY_TIMEOUT_MS = 3800;
const BOOT_EXIT_DURATION_MS = 650;

const BOOT_LINES = [
  'mount /dev/sisyphus',
  'handshake: unicorn.render',
  'calibrating crt phosphor',
  'injecting portfolio shell',
  'nihad.protocol online',
];

let unicornScriptPromise: Promise<void> | null = null;

declare global {
  interface Window {
    UnicornStudio?: {
      init?: () => void;
    };
  }
}

function ensureUnicornMountStyles() {
  if (document.getElementById(UNICORN_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = UNICORN_STYLE_ID;
  style.textContent = `
    [data-us-project] {
      position: relative !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    [data-us-project] canvas {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
}

function loadUnicornStudioScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
    return Promise.resolve();
  }

  if (unicornScriptPromise) {
    return unicornScriptPromise;
  }

  unicornScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      UNICORN_RUNTIME_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const handleLoad = () => resolve();
    const handleError = () => {
      unicornScriptPromise = null;
      reject(new Error('Failed to load UnicornStudio.'));
    };

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = UNICORN_RUNTIME_SCRIPT_ID;
    script.src = UNICORN_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.head.appendChild(script);
  });

  return unicornScriptPromise;
}

export default function HeroAsciiOne() {
  const quote = "The struggle itself towards the heights is enough to fill a man's heart.- The Myth of Sisyphus";
  const [typedQuote, setTypedQuote] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [unicornLoaded, setUnicornLoaded] = useState(false);
  // Keep the first server and client render identical; sessionStorage is read after hydration.
  const [bootVisible, setBootVisible] = useState(true);
  const [bootExiting, setBootExiting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootTimedOut, setBootTimedOut] = useState(false);
  const unicornContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = unicornContainerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let loadCheck: number | null = null;
    let retryTimer: number | null = null;
    let initAttempts = 0;

    const stopTimers = () => {
      if (loadCheck) {
        window.clearInterval(loadCheck);
      }
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };

    const hasCanvas = () => Boolean(container.querySelector('canvas'));

    const markLoadedIfReady = () => {
      if (hasCanvas()) {
        setUnicornLoaded(true);
        stopTimers();
        return true;
      }
      return false;
    };

    const initializeCurrentMount = () => {
      if (cancelled || typeof window.UnicornStudio?.init !== 'function') return;
      window.UnicornStudio.init();
      initAttempts += 1;
    };

    ensureUnicornMountStyles();
    setUnicornLoaded(hasCanvas());

    loadUnicornStudioScript()
      .then(() => {
        if (cancelled) return;

        container.replaceChildren();
        setUnicornLoaded(false);
        initializeCurrentMount();

        if (markLoadedIfReady()) return;

        loadCheck = window.setInterval(() => {
          if (cancelled) return;
          markLoadedIfReady();
        }, 150);

        const queueRetry = () => {
          if (cancelled || initAttempts >= 4 || hasCanvas()) return;
          retryTimer = window.setTimeout(() => {
            retryTimer = null;
            initializeCurrentMount();
            if (!markLoadedIfReady()) {
              queueRetry();
            }
          }, 400);
        };

        queueRetry();
      })
      .catch(() => {
        if (!cancelled) {
          setUnicornLoaded(false);
        }
      });

    return () => {
      cancelled = true;
      stopTimers();
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedQuote(quote.slice(0, index));
      if (index >= quote.length) {
        setTypingDone(true);
        window.clearInterval(timer);
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [quote]);

  useEffect(() => {
    if (!bootVisible) return undefined;

    try {
      if (window.sessionStorage.getItem(BOOT_SESSION_KEY) === 'true') {
        const skipTimer = window.setTimeout(() => {
          setBootProgress(100);
          setBootVisible(false);
        }, 0);

        return () => window.clearTimeout(skipTimer);
      }
    } catch {
      // Storage may be unavailable in private contexts; the safety timeout still applies.
    }

    const startedAt = window.performance.now();
    const progressTimer = window.setInterval(() => {
      const elapsed = window.performance.now() - startedAt;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / BOOT_MIN_DURATION_MS, 1), 2.2);
      const nextProgress = Math.min(99, Math.max(7, Math.round(eased * 99)));
      setBootProgress((currentProgress) =>
        Math.max(currentProgress, nextProgress)
      );
    }, 42);

    const completeTimer = window.setTimeout(() => {
      setBootProgress(100);
    }, BOOT_MIN_DURATION_MS);

    const safetyTimer = window.setTimeout(() => {
      setBootTimedOut(true);
    }, BOOT_SAFETY_TIMEOUT_MS);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(completeTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [bootVisible]);

  useEffect(() => {
    if (!bootVisible || bootProgress < 100) return undefined;
    if (!unicornLoaded && !bootTimedOut) return undefined;

    try {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
    } catch {
      // Non-critical: if storage fails, the loader will simply replay next visit.
    }

    setBootExiting(true);

    const exitTimer = window.setTimeout(() => {
      setBootVisible(false);
    }, BOOT_EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
    };
  }, [bootProgress, bootTimedOut, bootVisible, unicornLoaded]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 h-full w-full -translate-y-[3.5vh]">
        <div
          ref={unicornContainerRef}
          data-us-project={UNICORN_PROJECT_ID}
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>

      {!unicornLoaded ? (
        <div className="absolute inset-0 h-full w-full stars-bg" />
      ) : null}

      {bootVisible ? (
        <div
          className={`boot-loader fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black px-5 text-white ${
            bootExiting ? 'boot-loader-exit pointer-events-none' : ''
          }`}
          aria-label="Loading homepage"
          aria-live="polite"
        >
          <div className="boot-grid absolute inset-0" />
          <div className="boot-scanlines absolute inset-0" />
          <div className="boot-noise absolute inset-0" />
          <div className="boot-corner boot-corner-tl" />
          <div className="boot-corner boot-corner-tr" />
          <div className="boot-corner boot-corner-bl" />
          <div className="boot-corner boot-corner-br" />

          <section className="boot-terminal relative w-full max-w-3xl border border-white/25 bg-black/[0.82] p-4 shadow-[0_0_60px_rgba(255,255,255,0.08)] backdrop-blur-sm sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
              <span>SISYPHUS.BOOT</span>
              <span>{bootTimedOut && !unicornLoaded ? 'FALLBACK' : 'SYNC'}</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="mb-3 font-mono text-xs tracking-[0.18em] text-white/50 uppercase">
                  {'> launching portfolio kernel'}
                </p>
                <h2 className="boot-title font-heading text-5xl leading-none tracking-[0.18em] text-white sm:text-6xl lg:text-7xl">
                  NIHAD
                </h2>
                <p className="mt-2 font-mono text-xs tracking-[0.34em] text-white/65 uppercase sm:text-sm">
                  protocol online
                </p>

                <div className="mt-6 space-y-2 font-mono text-[11px] text-white/72 sm:text-xs">
                  {BOOT_LINES.map((line, index) => (
                    <p
                      key={line}
                      className="boot-line"
                      style={{ animationDelay: `${index * 95}ms` }}
                    >
                      <span className="text-white/35">[{String(index + 1).padStart(2, '0')}]</span>{' '}
                      {line}
                      <span className="boot-ok ml-2 text-white/45">OK</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="boot-ascii font-mono text-[10px] leading-[1.05] text-white/45 sm:text-xs">
                <pre aria-hidden="true">{`    ____
   / __ \\__
  / /_/ / /_
 / ____/ __/
/_/   /_/

push rock
render sky
repeat`}</pre>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                <span>render gate</span>
                <span>{String(bootProgress).padStart(3, '0')}%</span>
              </div>
              <div className="boot-progress-shell flex h-7 gap-1 border border-white/20 bg-white/[0.03] p-1">
                {Array.from({ length: 28 }).map((_, index) => {
                  const activeBlocks = Math.round((bootProgress / 100) * 28);
                  return (
                    <span
                      key={index}
                      className={`boot-progress-block ${
                        index < activeBlocks ? 'boot-progress-block-active' : ''
                      }`}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/38">
                <span>canvas: {unicornLoaded ? 'locked' : 'pending'}</span>
                <span>exit: {bootProgress >= 100 ? 'armed' : 'waiting'}</span>
              </div>
            </div>
          </section>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 retro-crt-overlay" />
      <div className="pointer-events-none absolute inset-0 retro-noise" />

      <div className="absolute top-0 left-0 z-20 h-8 w-8 border-t-2 border-l-2 border-white/30 lg:h-12 lg:w-12" />
      <div className="absolute top-0 right-0 z-20 h-8 w-8 border-t-2 border-r-2 border-white/30 lg:h-12 lg:w-12" />
      <div
        className="absolute left-0 z-20 h-8 w-8 border-b-2 border-l-2 border-white/30 lg:h-12 lg:w-12"
        style={{ bottom: '5vh' }}
      />
      <div
        className="absolute right-0 z-20 h-8 w-8 border-b-2 border-r-2 border-white/30 lg:h-12 lg:w-12"
        style={{ bottom: '5vh' }}
      />

      <div
        className="relative z-10 flex min-h-screen items-center justify-end pt-16 lg:pt-8"
        style={{ marginTop: '3vh' }}
      >
        <div className="w-full px-6 lg:w-1/2 lg:px-16 lg:pr-[15%]">
          <div className="relative max-w-lg lg:ml-auto">
            <div className="mb-3 flex items-center gap-2 opacity-60">
              <div className="h-px w-8 bg-white" />
              <span className="font-mono text-[10px] tracking-wider text-white">
                SYS
              </span>
              <div className="h-px flex-1 bg-white" />
            </div>

            <div className="relative">
              <div className="dither-pattern absolute top-0 right-[-0.75rem] bottom-0 hidden w-1 opacity-40 lg:block" />
              <h1
                className="font-heading mb-3 whitespace-nowrap text-5xl leading-tight tracking-[0.1em] text-white lg:-ml-[2%] lg:mb-4 lg:text-8xl"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.15)' }}
              >
                MOHAMMED NIHAD
              </h1>
              <p className="mb-3 font-mono text-xs tracking-[0.22em] text-white/85 uppercase lg:mb-4 lg:text-sm">
                Computer Engineering Major at CCNY
              </p>
            </div>

            <div className="mb-3 hidden gap-1 opacity-40 lg:flex">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="h-0.5 w-0.5 rounded-full bg-white" />
              ))}
            </div>

            <div className="relative">
              <p className="mb-5 font-mono text-sm leading-relaxed text-white/95 lg:mb-6 lg:text-lg">
                {typedQuote}
                {!typingDone ? (
                  <span className="quote-cursor" aria-hidden="true">
                    _
                  </span>
                ) : null}
              </p>

              <p className="mb-5 font-mono text-xs tracking-[0.12em] text-white/60 lg:mb-7 lg:text-sm">
                {'> iterating fast on fullstack and AI products_'}
              </p>

              <div
                className="absolute top-1/2 left-[-1rem] hidden h-3 w-3 border border-white opacity-30 lg:block"
                style={{ transform: 'translateY(-50%)' }}
              >
                <div
                  className="absolute top-1/2 left-1/2 h-1 w-1 bg-white"
                  style={{ transform: 'translate(-50%, -50%)' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              <Link
                href="/projects"
                className="group relative border border-white bg-transparent px-5 py-2 text-xs font-mono text-white transition-all duration-200 hover:bg-white hover:text-black lg:px-6 lg:py-2.5 lg:text-sm"
              >
                <span className="absolute top-[-0.25rem] left-[-0.25rem] hidden h-2 w-2 border-t border-l border-white opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
                <span className="absolute right-[-0.25rem] bottom-[-0.25rem] hidden h-2 w-2 border-r border-b border-white opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
                VIEW PROJECTS
              </Link>

              <Link
                href="/contact"
                className="relative border border-white bg-transparent px-5 py-2 text-xs font-mono text-white transition-all duration-200 hover:bg-white hover:text-black lg:px-6 lg:py-2.5 lg:text-sm"
              >
                CONTACT ME
              </Link>
            </div>

            <div className="mt-6 hidden items-center gap-2 opacity-40 lg:flex">
              <span className="font-mono text-[9px] text-white">RUN</span>
              <div className="h-px flex-1 bg-white" />
              <span className="font-mono text-[9px] text-white">
                NIHAD.PROTOCOL
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 left-0 z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm"
        style={{ bottom: '5vh' }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-2 lg:px-8 lg:py-3">
          <div className="flex items-center gap-3 font-mono text-[8px] text-white/50 lg:gap-6 lg:text-[9px]">
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden gap-1 lg:flex">
              {[5, 8, 11, 7, 13, 9, 6, 10].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/30"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[8px] text-white/50 lg:gap-4 lg:text-[9px]">
            <span className="hidden lg:inline">RENDERING</span>
            <div className="flex gap-1">
              <div className="h-1 w-1 animate-pulse rounded-full bg-white/60" />
              <div
                className="h-1 w-1 animate-pulse rounded-full bg-white/40"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="h-1 w-1 animate-pulse rounded-full bg-white/20"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
            <span className="hidden lg:inline">FRAME: INF</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-[15px] left-1/2 z-[2147483647] h-[80px] w-[230px] -translate-x-1/2 rounded-[20px] bg-black" />

      <style jsx>{`
        .dither-pattern {
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 1px,
              white 1px,
              white 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 1px,
              white 1px,
              white 2px
            );
          background-size: 3px 3px;
        }

        .stars-bg {
          background-image:
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 60%, white, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent);
          background-size:
            200% 200%,
            180% 180%,
            250% 250%,
            220% 220%,
            190% 190%,
            240% 240%,
            210% 210%,
            230% 230%;
          background-position:
            0% 0%,
            40% 40%,
            60% 60%,
            20% 20%,
            80% 80%,
            30% 30%,
            70% 70%,
            50% 50%;
          opacity: 0.3;
          animation: stars-drift 20s linear infinite;
        }

        .retro-crt-overlay {
          background-image: linear-gradient(
            rgba(255, 255, 255, 0.04) 1px,
            transparent 1px
          );
          background-size: 100% 3px;
          mix-blend-mode: screen;
          opacity: 0.16;
          animation: crt-flicker 0.18s steps(2) infinite;
        }

        .retro-noise {
          opacity: 0.06;
          background-image: radial-gradient(
              circle at 20% 20%,
              rgba(255, 255, 255, 0.7) 0.5px,
              transparent 0.6px
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(255, 255, 255, 0.7) 0.5px,
              transparent 0.6px
            );
          background-size: 4px 4px, 5px 5px;
          animation: noise-shift 0.6s steps(3) infinite;
        }

        @keyframes stars-drift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-2%, 2%, 0);
          }
        }

        @keyframes crt-flicker {
          0% {
            opacity: 0.1;
          }
          100% {
            opacity: 0.18;
          }
        }

        @keyframes noise-shift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(1px, -1px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .quote-cursor {
          display: inline-block;
          margin-left: 0.2rem;
          animation: quote-caret 0.8s steps(1) infinite;
        }

        @keyframes quote-caret {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .boot-loader {
          isolation: isolate;
        }

        .boot-loader::before {
          content: "";
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(circle at 22% 20%, rgba(255, 255, 255, 0.12), transparent 28%),
            radial-gradient(circle at 80% 72%, rgba(255, 255, 255, 0.08), transparent 32%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 38%, rgba(255, 255, 255, 0.05));
          opacity: 0.7;
          animation: boot-ambient 1.8s ease-in-out infinite alternate;
        }

        .boot-loader-exit {
          animation: boot-handoff 430ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .boot-loader-exit .boot-terminal {
          animation: boot-terminal-collapse 430ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .boot-grid {
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
          background-size: 42px 42px;
          animation: boot-grid-drift 12s linear infinite;
        }

        .boot-scanlines {
          opacity: 0.22;
          background-image: linear-gradient(
            rgba(255, 255, 255, 0.16) 1px,
            transparent 1px
          );
          background-size: 100% 4px;
          mix-blend-mode: screen;
          animation: boot-scanline-drift 0.34s steps(2) infinite;
        }

        .boot-noise {
          opacity: 0.08;
          background-image:
            radial-gradient(circle at 15% 24%, white 0.6px, transparent 0.8px),
            radial-gradient(circle at 78% 62%, white 0.5px, transparent 0.8px);
          background-size: 5px 5px, 7px 7px;
          animation: boot-noise-shift 0.3s steps(2) infinite;
        }

        .boot-terminal::before {
          content: "";
          position: absolute;
          inset: -1px;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow:
            inset 0 0 24px rgba(255, 255, 255, 0.06),
            0 0 32px rgba(255, 255, 255, 0.07);
          animation: boot-terminal-flicker 0.9s steps(2) infinite;
        }

        .boot-terminal::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.16),
            transparent
          );
          opacity: 0;
          transform: translateX(-110%) skewX(-14deg);
          animation: boot-terminal-sweep 1.12s ease-out 180ms forwards;
        }

        .boot-title {
          text-shadow:
            0 0 18px rgba(255, 255, 255, 0.18),
            2px 0 rgba(255, 255, 255, 0.08),
            -2px 0 rgba(255, 255, 255, 0.04);
          animation: boot-title-glitch 1.1s steps(2) infinite;
        }

        .boot-line {
          opacity: 0;
          transform: translate3d(-8px, 0, 0);
          animation: boot-line-in 260ms steps(4) forwards;
        }

        .boot-ok {
          animation: boot-ok-blink 0.64s steps(1) infinite;
        }

        .boot-ascii {
          justify-self: end;
          text-shadow: 0 0 14px rgba(255, 255, 255, 0.12);
        }

        .boot-progress-shell {
          box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.06);
        }

        .boot-progress-block {
          flex: 1;
          background: rgba(255, 255, 255, 0.08);
          transition: background-color 80ms linear, box-shadow 80ms linear;
        }

        .boot-progress-block-active {
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.22);
        }

        .boot-corner {
          position: absolute;
          z-index: 1;
          width: 2.25rem;
          height: 2.25rem;
          opacity: 0.42;
        }

        .boot-corner-tl {
          top: 1.25rem;
          left: 1.25rem;
          border-top: 1px solid white;
          border-left: 1px solid white;
        }

        .boot-corner-tr {
          top: 1.25rem;
          right: 1.25rem;
          border-top: 1px solid white;
          border-right: 1px solid white;
        }

        .boot-corner-bl {
          bottom: 1.25rem;
          left: 1.25rem;
          border-bottom: 1px solid white;
          border-left: 1px solid white;
        }

        .boot-corner-br {
          right: 1.25rem;
          bottom: 1.25rem;
          border-right: 1px solid white;
          border-bottom: 1px solid white;
        }

        @keyframes boot-ambient {
          from {
            transform: translate3d(-1%, 0, 0) scale(1);
          }
          to {
            transform: translate3d(1%, -1%, 0) scale(1.04);
          }
        }

        @keyframes boot-grid-drift {
          to {
            transform: translate3d(-42px, 42px, 0);
          }
        }

        @keyframes boot-scanline-drift {
          to {
            transform: translate3d(0, 4px, 0);
          }
        }

        @keyframes boot-noise-shift {
          50% {
            transform: translate3d(1px, -1px, 0);
          }
        }

        @keyframes boot-terminal-flicker {
          0% {
            opacity: 0.65;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes boot-terminal-sweep {
          18% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(120%) skewX(-14deg);
          }
        }

        @keyframes boot-title-glitch {
          0%,
          88%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          90% {
            transform: translate3d(2px, 0, 0);
          }
          92% {
            transform: translate3d(-1px, 0, 0);
          }
        }

        @keyframes boot-line-in {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes boot-ok-blink {
          50% {
            opacity: 0.28;
          }
        }

        @keyframes boot-handoff {
          0% {
            opacity: 1;
            filter: contrast(1);
          }
          42% {
            opacity: 1;
            filter: contrast(1.8);
            transform: translate3d(0, 0, 0) scaleY(0.98);
          }
          100% {
            opacity: 0;
            filter: contrast(2.2);
            transform: translate3d(0, -8px, 0) scaleY(1.02);
          }
        }

        @keyframes boot-terminal-collapse {
          to {
            transform: scale(0.985);
            opacity: 0;
          }
        }

        @media (max-width: 640px) {
          .boot-terminal {
            max-height: calc(100svh - 2rem);
            overflow: hidden;
          }

          .boot-ascii {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .boot-loader::before,
          .boot-loader-exit,
          .boot-loader-exit .boot-terminal,
          .boot-grid,
          .boot-scanlines,
          .boot-noise,
          .boot-terminal::before,
          .boot-terminal::after,
          .boot-title,
          .boot-line,
          .boot-ok {
            animation: none !important;
          }

          .boot-line {
            opacity: 1;
            transform: none;
          }

          .boot-progress-block {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
