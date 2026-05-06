"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type AnimatedNameProps = {
  text: string;
  className?: string;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.18,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    rotateX: -80,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function AnimatedName({ text, className }: AnimatedNameProps) {
  const reducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const letters = Array.from(text);

  useEffect(() => {
    if (reducedMotion || hasStarted) {
      return;
    }

    const heading = headingRef.current;
    if (!heading) {
      return;
    }

    const startIfVisible = () => {
      const rect = heading.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / Math.max(rect.height, 1);

      if (visibilityRatio >= 0.55) {
        setHasStarted(true);
        return true;
      }

      return false;
    };

    if (startIfVisible()) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.intersectionRatio >= 0.55) {
          setHasStarted(true);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.55, 0.75, 1],
      }
    );

    observer.observe(heading);
    window.addEventListener("resize", startIfVisible);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", startIfVisible);
    };
  }, [hasStarted, reducedMotion]);

  if (reducedMotion) {
    return <h2 className={className}>{text}</h2>;
  }

  return (
    <h2 ref={headingRef} className={`${className ?? ""} relative block`}>
      <span className={hasSettled ? "opacity-100" : "opacity-0"}>{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        animate={hasStarted ? "visible" : "hidden"}
        variants={containerVariants}
        className={`pointer-events-none absolute inset-0 block whitespace-nowrap ${
          hasSettled ? "opacity-0" : "opacity-100"
        }`}
        style={{ perspective: 1000 }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            variants={letterVariants}
            className="inline-block will-change-transform"
            onAnimationComplete={
              index === letters.length - 1 && hasStarted
                ? () => setHasSettled(true)
                : undefined
            }
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    </h2>
  );
}
