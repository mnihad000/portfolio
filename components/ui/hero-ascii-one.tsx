'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const UNICORN_PROJECT_ID = 'OMzqyUv6M3kSnv0JeAtC';
const UNICORN_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js';
const UNICORN_RUNTIME_SCRIPT_ID = 'unicorn-runtime-script';
const UNICORN_STYLE_ID = 'hero-ascii-one-style';

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
  const quote =
    "The struggle itself toward the heights is enough to fill a man's heart. - The Myth of Sisyphus";
  const [typedQuote, setTypedQuote] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [unicornLoaded, setUnicornLoaded] = useState(false);
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 h-full w-full -translate-y-[6.5vh]">
        <div
          ref={unicornContainerRef}
          data-us-project={UNICORN_PROJECT_ID}
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>

      {!unicornLoaded ? (
        <div className="absolute inset-0 h-full w-full stars-bg" />
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
        <aside className="pointer-events-none absolute left-[11%] top-[82%] z-10 hidden w-[30vw] max-w-[420px] -translate-y-1/2 border-l border-white/30 pl-5 lg:block">
          <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">
            SISYPHUS NOTE
          </p>
          <blockquote className="font-mono text-sm leading-relaxed text-white/85">
            {typedQuote}
            {!typingDone ? (
              <span className="quote-cursor" aria-hidden="true">
                _
              </span>
            ) : null}
          </blockquote>
        </aside>

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
              <p className="mb-5 font-mono text-sm leading-relaxed text-gray-300 opacity-85 lg:mb-6 lg:text-lg">
                The future has never been more exciting.
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

      <div className="pointer-events-none fixed bottom-[40px] left-1/2 z-[2147483647] h-[80px] w-[320px] -translate-x-1/2 rounded-[20px] bg-black" />

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
      `}</style>
    </main>
  );
}
