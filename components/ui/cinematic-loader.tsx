'use client';

import { useEffect, useMemo, useState } from 'react';

const BOOT_DURATION_MS = 6000;
const REDUCED_MOTION_DURATION_MS = 400;
const EXIT_DURATION_MS = 300;

const diagnosticLogs = [
  'mount /usr/ni/adapters',
  'trace: ccny.node handshake accepted',
  'scan: portfolio.surface integrity 99.91%',
  'resolve: sisyphus.loop background channel',
  'inject: monochrome terminal panels',
  'vector: ascent retry policy armed',
  'hash: myth.kernel stable',
  'sync: nav routes + project index',
  'probe: contact endpoint listening',
  'finalize: NIHAD.PROTOCOL',
];

const matrixRows = [
  '00:1F  41.7128N 074.0060W  01001110',
  '02:A7  SIG/TRACE  A8 1C 7E F0 88 04',
  '05:C3  X=088 Y=144 Z=001  // ASCENT',
  '08:4D  ROUTE /projects  CHECKSUM 7F91',
  '0D:B9  ORBIT 12  FEED 09  GRID 4412',
  '13:E2  MEM 00FF  STACK 12K  PUSH',
  '21:AA  COORD 19.20.24  VEC 0101',
  '34:F1  NOISE 8X8  PHASE LOCK',
];

const sisyphusArt = [
  '             .',
  '            /|\\',
  '           /_|_\\',
  '        o  / | \\',
  '       /|\\/  |  \\',
  '      / |    |   \\',
  '_____/__|____|____\\____',
  '    push > fall > retry',
];

function getReducedMotionPreference() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function CinematicLoader() {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const displayedLogs = useMemo(() => {
    const visibleCount = Math.max(3, Math.ceil((progress / 100) * diagnosticLogs.length));
    return diagnosticLogs.slice(0, visibleCount);
  }, [progress]);

  useEffect(() => {
    const prefersReducedMotion = getReducedMotionPreference();
    setReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) {
      setProgress(100);
      const exitTimer = window.setTimeout(() => setIsExiting(true), REDUCED_MOTION_DURATION_MS);
      const mountTimer = window.setTimeout(
        () => setIsMounted(false),
        REDUCED_MOTION_DURATION_MS + EXIT_DURATION_MS
      );

      return () => {
        window.clearTimeout(exitTimer);
        window.clearTimeout(mountTimer);
      };
    }

    const startedAt = performance.now();
    let animationFrame = 0;

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const ratio = Math.min(elapsed / BOOT_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - ratio, 2.8);
      const nextProgress = Math.min(100, Math.floor(eased * 100));

      setProgress(nextProgress);

      if (ratio < 1) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      setProgress(100);
      setIsExiting(true);
      window.setTimeout(() => setIsMounted(false), EXIT_DURATION_MS);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`cinematic-loader ${isExiting ? 'cinematic-loader-exit' : ''} ${
        reducedMotion ? 'cinematic-loader-reduced' : ''
      }`}
      aria-label="NIHAD.PROTOCOL boot sequence"
      aria-live="polite"
    >
      <div className="loader-noise" aria-hidden="true" />
      <div className="loader-scanlines" aria-hidden="true" />
      <div className="loader-glitch loader-glitch-a" aria-hidden="true" />
      <div className="loader-glitch loader-glitch-b" aria-hidden="true" />

      <div className="loader-grid">
        <section className="loader-panel loader-panel-main">
          <div className="loader-panel-header">
            <span>NIHAD.PROTOCOL</span>
            <span>BOOT/INTRUSION</span>
          </div>

          <div className="loader-reveal">
            <span className="loader-kicker">CONTROL HANDOFF</span>
            <strong>NIHAD.PROTOCOL ONLINE</strong>
          </div>

          <div className="loader-meter" aria-hidden="true">
            <div className="loader-meter-readout">
              <span>SYSLOAD</span>
              <span>{progress.toString().padStart(3, '0')}%</span>
            </div>
            <div className="loader-meter-track">
              <div className="loader-meter-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="loader-meter-scale">
              <span>000</span>
              <span>025</span>
              <span>050</span>
              <span>075</span>
              <span>100</span>
            </div>
          </div>
        </section>

        <section className="loader-panel loader-panel-logs" aria-label="Diagnostic logs">
          <div className="loader-panel-header">
            <span>DIAGNOSTIC LOG</span>
            <span>FASTPATH</span>
          </div>
          <div className="loader-log-stack">
            {displayedLogs.map((line, index) => (
              <p key={line} style={{ '--loader-line': index } as React.CSSProperties}>
                <span>{`0${index}`.slice(-2)}</span>
                <code>{line}</code>
              </p>
            ))}
          </div>
        </section>

        <section className="loader-panel loader-panel-sisyphus" aria-label="ASCII Sisyphus boot glyph">
          <div className="loader-panel-header">
            <span>SISYPHUS.LOOP</span>
            <span>RETRY=INFINITE</span>
          </div>
          <pre>{sisyphusArt.join('\n')}</pre>
        </section>

        <section className="loader-panel loader-panel-noise" aria-label="Coordinate noise">
          <div className="loader-panel-header">
            <span>COORDINATE NOISE</span>
            <span>MATRIX BUS</span>
          </div>
          <div className="loader-matrix">
            {matrixRows.map((row, index) => (
              <span key={row} style={{ '--loader-row': index } as React.CSSProperties}>
                {row}
              </span>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .cinematic-loader {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(1rem, 3vw, 2.5rem);
          overflow: hidden;
          background: #000;
          color: #fff;
          font-family: var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
          isolation: isolate;
          opacity: 1;
          transition:
            opacity ${EXIT_DURATION_MS}ms ease,
            filter ${EXIT_DURATION_MS}ms ease,
            transform ${EXIT_DURATION_MS}ms ease;
        }

        .cinematic-loader::before {
          content: '';
          position: absolute;
          inset: -18%;
          z-index: -3;
          background:
            radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.14), transparent 26%),
            radial-gradient(circle at 76% 70%, rgba(255, 255, 255, 0.08), transparent 28%),
            linear-gradient(120deg, #000 0%, #070707 44%, #000 100%);
          animation: loader-light-sweep 1.2s ease-out both;
        }

        .cinematic-loader::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 0 80px rgba(255, 255, 255, 0.06);
        }

        .cinematic-loader-exit {
          opacity: 0;
          filter: contrast(1.25) brightness(1.25);
          transform: scale(1.012);
        }

        .loader-noise,
        .loader-scanlines,
        .loader-glitch {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .loader-noise {
          z-index: -1;
          opacity: 0.12;
          background-image:
            radial-gradient(circle at 18% 24%, rgba(255, 255, 255, 0.9) 0.5px, transparent 0.7px),
            radial-gradient(circle at 72% 44%, rgba(255, 255, 255, 0.65) 0.5px, transparent 0.7px),
            radial-gradient(circle at 42% 78%, rgba(255, 255, 255, 0.55) 0.5px, transparent 0.7px);
          background-size: 3px 3px, 5px 5px, 7px 7px;
          animation: loader-noise-shift 0.22s steps(2) infinite;
        }

        .loader-scanlines {
          z-index: 4;
          background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.12) 1px,
            transparent 1px
          );
          background-size: 100% 4px;
          mix-blend-mode: screen;
          opacity: 0.28;
          animation: loader-scan-drift 0.48s linear infinite;
        }

        .loader-glitch {
          z-index: 3;
          opacity: 0;
          mix-blend-mode: screen;
          background: rgba(255, 255, 255, 0.2);
          clip-path: inset(22% 0 70% 0);
          animation: loader-glitch-burst 1.2s steps(1) both;
        }

        .loader-glitch-b {
          clip-path: inset(68% 0 24% 0);
          animation-delay: 0.16s;
        }

        .loader-grid {
          position: relative;
          z-index: 2;
          display: grid;
          width: min(1120px, 100%);
          min-height: min(680px, calc(100vh - 2rem));
          grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.85fr);
          grid-template-rows: 1fr auto;
          gap: 0.75rem;
        }

        .loader-panel {
          position: relative;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 52%),
            rgba(0, 0, 0, 0.82);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 18px 60px rgba(0, 0, 0, 0.5);
        }

        .loader-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.45;
        }

        .loader-panel-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          padding: 0.65rem 0.75rem;
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(0.56rem, 1.2vw, 0.68rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .loader-panel-main {
          grid-row: span 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: clamp(1.25rem, 4vw, 2.5rem);
        }

        .loader-reveal {
          position: relative;
          z-index: 1;
          display: grid;
          align-content: center;
          gap: 0.75rem;
          min-height: 58%;
          padding: clamp(1.2rem, 5vw, 3.8rem);
        }

        .loader-kicker {
          color: rgba(255, 255, 255, 0.62);
          font-size: clamp(0.62rem, 1.6vw, 0.82rem);
          letter-spacing: 0.26em;
          text-transform: uppercase;
          animation: loader-type-fade 0.56s steps(2) both;
        }

        .loader-reveal strong {
          max-width: 13ch;
          color: #fff;
          font-family: var(--font-vt323), var(--font-ibm-plex-mono), monospace;
          font-size: clamp(3.1rem, 10.6vw, 8.6rem);
          font-weight: 400;
          line-height: 0.82;
          letter-spacing: 0;
          text-shadow:
            0 0 18px rgba(255, 255, 255, 0.2),
            3px 0 0 rgba(255, 255, 255, 0.08);
          animation: loader-title-lock 1.05s steps(3) both;
        }

        .loader-meter {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 0.55rem;
          padding: 0 clamp(1.2rem, 5vw, 3.8rem);
        }

        .loader-meter-readout,
        .loader-meter-scale {
          display: flex;
          justify-content: space-between;
          color: rgba(255, 255, 255, 0.68);
          font-size: clamp(0.62rem, 1.6vw, 0.82rem);
          letter-spacing: 0.12em;
        }

        .loader-meter-readout span:last-child {
          color: #fff;
          font-size: clamp(1.2rem, 4vw, 2.4rem);
          line-height: 0.8;
        }

        .loader-meter-track {
          position: relative;
          height: clamp(1rem, 3vw, 1.6rem);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.04);
        }

        .loader-meter-fill {
          height: 100%;
          background:
            repeating-linear-gradient(
              90deg,
              #fff 0,
              #fff 8px,
              rgba(255, 255, 255, 0.7) 8px,
              rgba(255, 255, 255, 0.7) 10px,
              transparent 10px,
              transparent 13px
            );
          transition: width 80ms linear;
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.28);
        }

        .loader-meter-scale {
          color: rgba(255, 255, 255, 0.42);
          font-size: clamp(0.5rem, 1.1vw, 0.6rem);
        }

        .loader-log-stack {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 0.4rem;
          padding: 0.85rem 0.75rem 1rem;
        }

        .loader-log-stack p {
          display: grid;
          grid-template-columns: 2.4rem minmax(0, 1fr);
          gap: 0.65rem;
          margin: 0;
          color: rgba(255, 255, 255, 0.75);
          font-size: clamp(0.62rem, 1.4vw, 0.78rem);
          line-height: 1.35;
          opacity: 0;
          transform: translate3d(0, 4px, 0);
          animation: loader-line-in 120ms steps(2) forwards;
          animation-delay: calc(var(--loader-line) * 28ms);
        }

        .loader-log-stack span {
          color: rgba(255, 255, 255, 0.38);
        }

        .loader-log-stack code {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: inherit;
        }

        .loader-panel-sisyphus pre {
          position: relative;
          z-index: 1;
          margin: 0;
          padding: 1rem 0.75rem 1.1rem;
          color: rgba(255, 255, 255, 0.74);
          font-size: clamp(0.58rem, 1.45vw, 0.78rem);
          line-height: 1.18;
          white-space: pre;
        }

        .loader-panel-noise {
          grid-column: 2;
        }

        .loader-matrix {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 0.35rem;
          padding: 0.85rem 0.75rem 1rem;
          color: rgba(255, 255, 255, 0.58);
          font-size: clamp(0.56rem, 1.35vw, 0.72rem);
          line-height: 1.25;
        }

        .loader-matrix span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.42;
          transform: translateX(calc((var(--loader-row) - 3) * 2px));
          animation: loader-matrix-pulse 0.42s steps(2) infinite;
          animation-delay: calc(var(--loader-row) * 40ms);
        }

        @keyframes loader-light-sweep {
          0% {
            transform: translate3d(-2%, -1%, 0) scale(1);
          }
          100% {
            transform: translate3d(2%, 1%, 0) scale(1.04);
          }
        }

        @keyframes loader-noise-shift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(1px, -1px, 0);
          }
          100% {
            transform: translate3d(-1px, 1px, 0);
          }
        }

        @keyframes loader-scan-drift {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(4px);
          }
        }

        @keyframes loader-glitch-burst {
          0%,
          18%,
          36%,
          55%,
          100% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
          19%,
          21% {
            opacity: 0.26;
            transform: translate3d(-18px, 0, 0);
          }
          37%,
          39% {
            opacity: 0.18;
            transform: translate3d(14px, 0, 0);
          }
          56%,
          58% {
            opacity: 0.22;
            transform: translate3d(9px, 0, 0);
          }
        }

        @keyframes loader-title-lock {
          0% {
            opacity: 0;
            transform: translate3d(-9px, 0, 0);
            filter: blur(3px);
          }
          14%,
          22% {
            opacity: 0.75;
            transform: translate3d(8px, 0, 0);
          }
          42% {
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }
        }

        @keyframes loader-type-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes loader-line-in {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes loader-matrix-pulse {
          0%,
          100% {
            opacity: 0.32;
          }
          50% {
            opacity: 0.78;
          }
        }

        @media (max-width: 760px) {
          .cinematic-loader {
            align-items: stretch;
            padding: 0.65rem;
          }

          .loader-grid {
            min-height: calc(100vh - 1.3rem);
            grid-template-columns: 1fr;
            grid-template-rows: minmax(0, 1fr) auto auto auto;
            gap: 0.5rem;
          }

          .loader-panel-main,
          .loader-panel-noise {
            grid-column: auto;
            grid-row: auto;
          }

          .loader-panel-main {
            min-height: 44vh;
          }

          .loader-panel-header {
            padding: 0.55rem 0.6rem;
          }

          .loader-reveal {
            min-height: 20rem;
            padding: 1rem;
          }

          .loader-meter {
            padding: 0 1rem 1rem;
          }

          .loader-panel-sisyphus pre,
          .loader-log-stack,
          .loader-matrix {
            padding: 0.7rem 0.6rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cinematic-loader,
          .cinematic-loader::before,
          .loader-noise,
          .loader-scanlines,
          .loader-glitch,
          .loader-kicker,
          .loader-reveal strong,
          .loader-log-stack p,
          .loader-matrix span {
            animation: none !important;
            transition: opacity ${EXIT_DURATION_MS}ms ease !important;
          }

          .loader-log-stack p {
            opacity: 1;
            transform: none;
          }

          .loader-matrix span {
            opacity: 0.58;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
