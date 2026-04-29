'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { THEME_CHANGE_EVENT, getDocumentTheme } from '@/lib/theme';

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
  const quote =
    "The struggle itself toward the heights is enough to fill a man's heart. - The Myth of Sisyphus";
  const [typedQuote, setTypedQuote] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => getDocumentTheme() === 'dark');
  const [unicornLoaded, setUnicornLoaded] = useState(false);
  const unicornContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkTheme(getDocumentTheme() === 'dark');
    };

    window.addEventListener(THEME_CHANGE_EVENT, syncTheme as EventListener);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme as EventListener);
    };
  }, []);

  useEffect(() => {
    const container = unicornContainerRef.current;
    if (!container) return undefined;

    if (!isDarkTheme) {
      container.replaceChildren();
      return undefined;
    }

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
  }, [isDarkTheme]);

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
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'var(--portfolio-page-bg)',
        color: 'var(--portfolio-ink)',
      }}
    >
      {isDarkTheme ? (
        <div className="pointer-events-none absolute inset-0 h-full w-full">
          <div
            ref={unicornContainerRef}
            data-us-project={UNICORN_PROJECT_ID}
            style={{ width: '100%', height: '100%', minHeight: '100vh' }}
          />
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 light-hero-atmosphere" />
          <div className="pointer-events-none absolute inset-0 light-hero-grid" />
          <div className="pointer-events-none absolute inset-0 light-hero-scan" />
          <div className="pointer-events-none absolute inset-0 light-hero-noise" />
          <div className="pointer-events-none absolute left-[8%] top-[14%] h-[24rem] w-[24rem] rounded-full light-hero-orb" />
          <div className="pointer-events-none absolute right-[10%] bottom-[20%] h-[18rem] w-[18rem] rounded-full light-hero-orb-soft" />
        </>
      )}

      {isDarkTheme && !unicornLoaded ? (
        <div className="absolute inset-0 h-full w-full stars-bg" />
      ) : null}
      {isDarkTheme ? (
        <>
          <div className="pointer-events-none absolute inset-0 retro-crt-overlay" />
          <div className="pointer-events-none absolute inset-0 retro-noise" />
        </>
      ) : null}

      <div
        className="absolute left-0 top-0 z-20 h-8 w-8 border-l-2 border-t-2 lg:h-12 lg:w-12"
        style={{ borderColor: 'var(--portfolio-frame-line)' }}
      />
      <div
        className="absolute right-0 top-0 z-20 h-8 w-8 border-r-2 border-t-2 lg:h-12 lg:w-12"
        style={{ borderColor: 'var(--portfolio-frame-line)' }}
      />
      <div
        className="absolute left-0 z-20 h-8 w-8 border-b-2 border-l-2 lg:h-12 lg:w-12"
        style={{ bottom: '5vh', borderColor: 'var(--portfolio-frame-line)' }}
      />
      <div
        className="absolute right-0 z-20 h-8 w-8 border-b-2 border-r-2 lg:h-12 lg:w-12"
        style={{ bottom: '5vh', borderColor: 'var(--portfolio-frame-line)' }}
      />

      <div
        className="relative z-10 flex min-h-screen items-center justify-end pt-16 lg:pt-8"
        style={{ marginTop: '3vh' }}
      >
        <aside
          className="pointer-events-none absolute left-[11%] top-[85%] z-10 hidden w-[30vw] max-w-[420px] -translate-y-1/2 border-l pl-5 lg:block"
          style={{ borderColor: 'var(--portfolio-frame-line)' }}
        >
          <p
            className="mb-2 font-mono text-[10px] tracking-[0.16em] uppercase"
            style={{ color: 'var(--portfolio-ink-faint)' }}
          >
            SISYPHUS NOTE
          </p>
          <blockquote
            className="font-mono text-sm leading-relaxed"
            style={{ color: 'var(--portfolio-ink-soft)' }}
          >
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
            <div className="mb-3 flex items-center gap-2 opacity-70">
              <div
                className="h-px w-8"
                style={{ background: 'var(--portfolio-frame-fill)' }}
              />
              <span
                className="font-mono text-[10px] tracking-wider"
                style={{ color: 'var(--portfolio-ink-soft)' }}
              >
                SYS
              </span>
              <div
                className="h-px flex-1"
                style={{ background: 'var(--portfolio-frame-fill)' }}
              />
            </div>

            <div className="relative">
              <div className="dither-pattern absolute bottom-0 right-[-0.75rem] top-0 hidden w-1 opacity-40 lg:block" />
              <h1
                className="font-heading mb-3 whitespace-nowrap text-5xl leading-tight tracking-[0.1em] lg:-ml-[2%] lg:mb-4 lg:text-8xl"
                style={{
                  color: 'var(--portfolio-ink)',
                  textShadow: '0 0 20px var(--portfolio-hero-title-shadow)',
                }}
              >
                MOHAMMED NIHAD
              </h1>
              <p
                className="mb-3 font-mono text-xs tracking-[0.22em] uppercase lg:mb-4 lg:text-sm"
                style={{ color: 'var(--portfolio-ink-soft)' }}
              >
                Computer Engineering Major at CCNY
              </p>
            </div>

            <div className="mb-3 hidden gap-1 opacity-40 lg:flex">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 w-0.5 rounded-full"
                  style={{ background: 'var(--portfolio-frame-fill)' }}
                />
              ))}
            </div>

            <div className="relative">
              <p
                className="mb-5 font-mono text-sm leading-relaxed opacity-85 lg:mb-6 lg:text-lg"
                style={{ color: 'var(--portfolio-ink-muted)' }}
              >
                The future has never been more exciting.
              </p>

              <p
                className="mb-5 font-mono text-xs tracking-[0.12em] lg:mb-7 lg:text-sm"
                style={{ color: 'var(--portfolio-ink-faint)' }}
              >
                {'> iterating fast on fullstack and AI products_'}
              </p>

              <div
                className="absolute left-[-1rem] top-1/2 hidden h-3 w-3 border opacity-50 lg:block"
                style={{
                  transform: 'translateY(-50%)',
                  borderColor: 'var(--portfolio-frame-line)',
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 h-1 w-1"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--portfolio-frame-fill)',
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              <Link
                href="/projects"
                className="portfolio-button-outline group relative px-5 py-2 text-xs font-mono transition-all duration-200 lg:px-6 lg:py-2.5 lg:text-sm"
              >
                <span
                  className="absolute left-[-0.25rem] top-[-0.25rem] hidden h-2 w-2 border-l border-t opacity-0 transition-opacity group-hover:opacity-100 lg:block"
                  style={{ borderColor: 'var(--portfolio-frame-line)' }}
                />
                <span
                  className="absolute bottom-[-0.25rem] right-[-0.25rem] hidden h-2 w-2 border-b border-r opacity-0 transition-opacity group-hover:opacity-100 lg:block"
                  style={{ borderColor: 'var(--portfolio-frame-line)' }}
                />
                VIEW PROJECTS
              </Link>

              <Link
                href="/contact"
                className="portfolio-button-outline px-5 py-2 text-xs font-mono transition-all duration-200 lg:px-6 lg:py-2.5 lg:text-sm"
              >
                CONTACT ME
              </Link>
            </div>

            <div className="mt-6 hidden items-center gap-2 opacity-45 lg:flex">
              <span
                className="font-mono text-[9px]"
                style={{ color: 'var(--portfolio-ink-soft)' }}
              >
                RUN
              </span>
              <div
                className="h-px flex-1"
                style={{ background: 'var(--portfolio-frame-fill)' }}
              />
              <span
                className="font-mono text-[9px]"
                style={{ color: 'var(--portfolio-ink-soft)' }}
              >
                NIHAD.PROTOCOL
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute left-0 right-0 z-20 border-t backdrop-blur-sm"
        style={{
          bottom: '5vh',
          borderColor: 'var(--portfolio-border)',
          background: 'var(--portfolio-panel-bg)',
        }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-2 lg:px-8 lg:py-3">
          <div
            className="flex items-center gap-3 font-mono text-[8px] lg:gap-6 lg:text-[9px]"
            style={{ color: 'var(--portfolio-ink-faint)' }}
          >
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden gap-1 lg:flex">
              {[5, 8, 11, 7, 13, 9, 6, 10].map((height, i) => (
                <div
                  key={i}
                  className="w-1"
                  style={{
                    height: `${height}px`,
                    background: 'var(--portfolio-frame-line)',
                  }}
                />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>

          <div
            className="flex items-center gap-2 font-mono text-[8px] lg:gap-4 lg:text-[9px]"
            style={{ color: 'var(--portfolio-ink-faint)' }}
          >
            <span className="hidden lg:inline">RENDERING</span>
            <div className="flex gap-1">
              <div
                className="h-1 w-1 animate-pulse rounded-full"
                style={{ background: 'var(--portfolio-accent-strong)' }}
              />
              <div
                className="h-1 w-1 animate-pulse rounded-full"
                style={{
                  animationDelay: '0.2s',
                  background: 'var(--portfolio-frame-fill)',
                  opacity: 0.65,
                }}
              />
              <div
                className="h-1 w-1 animate-pulse rounded-full"
                style={{
                  animationDelay: '0.4s',
                  background: 'var(--portfolio-frame-fill)',
                  opacity: 0.35,
                }}
              />
            </div>
            <span className="hidden lg:inline">FRAME: INF</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none fixed bottom-[0.3px] left-1/2 z-[2147483647] h-[72px] w-[320px] -translate-x-1/2 rounded-[20px]"
        style={{ background: 'var(--portfolio-mask)' }}
      />

      <style jsx>{`
        .dither-pattern {
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 1px,
              var(--portfolio-frame-fill) 1px,
              var(--portfolio-frame-fill) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 1px,
              var(--portfolio-frame-fill) 1px,
              var(--portfolio-frame-fill) 2px
            );
          background-size: 3px 3px;
        }

        .stars-bg {
          background-image:
            radial-gradient(1px 1px at 20% 30%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 60% 70%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 50% 50%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 80% 10%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 90% 60%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 33% 80%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 15% 60%, var(--portfolio-frame-fill), transparent),
            radial-gradient(1px 1px at 70% 40%, var(--portfolio-frame-fill), transparent);
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

        .light-hero-atmosphere {
          background:
            radial-gradient(circle at top, rgba(143, 245, 199, 0.18), transparent 38%),
            radial-gradient(circle at 72% 16%, rgba(255, 255, 255, 0.55), transparent 32%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.24), transparent 48%);
        }

        .light-hero-grid {
          background-image:
            linear-gradient(rgba(95, 108, 120, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(95, 108, 120, 0.08) 1px, transparent 1px);
          background-size: 84px 84px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.92), transparent 92%);
        }

        .light-hero-scan {
          background-image: linear-gradient(
            rgba(255, 255, 255, 0.28) 1px,
            transparent 1px
          );
          background-size: 100% 4px;
          opacity: 0.35;
        }

        .light-hero-noise {
          background-image:
            radial-gradient(circle at 18% 24%, rgba(22, 27, 34, 0.12) 0.5px, transparent 0.6px),
            radial-gradient(circle at 76% 74%, rgba(22, 27, 34, 0.08) 0.5px, transparent 0.6px);
          background-size: 4px 4px, 5px 5px;
          opacity: 0.18;
        }

        .light-hero-orb {
          background: radial-gradient(
            circle,
            rgba(143, 245, 199, 0.4) 0%,
            rgba(143, 245, 199, 0.08) 46%,
            transparent 74%
          );
          filter: blur(10px);
        }

        .light-hero-orb-soft {
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.74) 0%,
            rgba(255, 255, 255, 0.12) 44%,
            transparent 74%
          );
          filter: blur(12px);
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
