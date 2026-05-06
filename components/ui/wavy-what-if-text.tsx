"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "@/components/ui/wavy-what-if-text.module.css";

type WavyWhatIfTextProps = {
  text: string;
};

export function WavyWhatIfText({ text }: WavyWhatIfTextProps) {
  const reducedMotion = useReducedMotion();
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const filterId = useId().replace(/:/gu, "");

  useEffect(() => {
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;

    if (!turbulence || !displacement) {
      return;
    }

    if (reducedMotion) {
      turbulence.setAttribute("baseFrequency", "0.008 0.022");
      displacement.setAttribute("scale", "18");
      return;
    }

    let frameId = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (startTime === 0) {
        startTime = timestamp;
      }

      const elapsed = (timestamp - startTime) / 1000;
      const freqX = 0.008 + Math.sin(elapsed * 0.7) * 0.0025;
      const freqY = 0.02 + Math.cos(elapsed * 1.1) * 0.008;
      const displacementScale = 20 + Math.sin(elapsed * 1.35) * 7;

      turbulence.setAttribute("baseFrequency", `${freqX.toFixed(4)} ${freqY.toFixed(4)}`);
      displacement.setAttribute("scale", displacementScale.toFixed(2));

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [reducedMotion]);

  return (
    <div className={styles.shell}>
      <svg aria-hidden="true" width="0" height="0" className={styles.defs}>
        <defs>
          <filter id={filterId} x="-20%" y="-40%" width="140%" height="180%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.008 0.022"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className={styles.stage}>
        {["A", "B", "C"].map((layer) => (
          <svg
            key={layer}
            viewBox="0 0 1200 360"
            className={`${styles.layer} ${styles[`layer${layer}` as keyof typeof styles]}`}
            style={{ ["--filter-id" as string]: `url(#${filterId})` }}
            aria-hidden="true"
          >
            <text x="50%" y="50%" className={styles.word}>
              {text}
            </text>
          </svg>
        ))}
        <span className="sr-only">{text}</span>
      </div>
    </div>
  );
}
