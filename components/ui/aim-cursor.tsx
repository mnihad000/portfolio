"use client";

import { useEffect, useRef } from "react";

const BASE_SIZE = 28;
const ARM = 8;
const LOCK_PADDING_X = 6;
const LOCK_PADDING_Y = 4;
// Lock on within LOCK_IN px of a target, but only let go beyond LOCK_OUT px so the edge doesn't flicker.
const LOCK_IN = 32;
const LOCK_OUT = 52;
// Free reticle spin, degrees per second.
const SPIN_SPEED = 60;

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[role='button']",
  "[role='link']",
  "[tabindex]:not([tabindex='-1'])",
  "[data-aim-cursor-target]",
].join(",");

const TEXT_CURSOR_SELECTOR =
  "input, textarea, select, [contenteditable='true'], [contenteditable=''], [contenteditable='plaintext-only']";
const IGNORE_SELECTOR = "[data-aim-cursor-ignore]";
const GALAXY_ACTIVE_SELECTOR = ".galaxy-overlay.is-open, .galaxy-overlay.is-closing";

type Point = {
  x: number;
  y: number;
};

type CursorState = Point & {
  width: number;
  height: number;
  angle: number;
};

// Fraction of the remaining gap to close this frame, independent of frame rate.
function ease(rate: number, dt: number) {
  return 1 - Math.exp(-rate * dt);
}

function getDistanceToRect(point: Point, rect: DOMRect) {
  const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
  const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

function isDisabledElement(element: HTMLElement) {
  return (
    element.matches(":disabled") ||
    element.getAttribute("aria-disabled") === "true"
  );
}

function hasNonNegativeTabIndex(element: HTMLElement) {
  if (!element.hasAttribute("tabindex")) {
    return true;
  }

  const value = Number(element.getAttribute("tabindex"));
  return Number.isFinite(value) && value >= 0;
}

function isVisibleTarget(element: HTMLElement, rect: DOMRect) {
  if (rect.width < 2 || rect.height < 2) {
    return false;
  }

  if (
    rect.bottom < 0 ||
    rect.right < 0 ||
    rect.top > window.innerHeight ||
    rect.left > window.innerWidth
  ) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return (
    style.visibility !== "hidden" &&
    style.display !== "none" &&
    style.pointerEvents !== "none"
  );
}

function isValidTarget(element: HTMLElement, rect: DOMRect) {
  return (
    element.isConnected &&
    !element.closest(IGNORE_SELECTOR) &&
    !isDisabledElement(element) &&
    hasNonNegativeTabIndex(element) &&
    isVisibleTarget(element, rect)
  );
}

function getNearestTarget(point: Point): HTMLElement | null {
  const elements = document.querySelectorAll<HTMLElement>(CLICKABLE_SELECTOR);
  let nearest: HTMLElement | null = null;
  let nearestScore = Number.POSITIVE_INFINITY;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (!isValidTarget(element, rect)) {
      return;
    }

    const distance = getDistanceToRect(point, rect);

    if (distance > LOCK_IN) {
      return;
    }

    // Prefer the smaller element when targets overlap (e.g. a button inside a card link).
    const areaBias = Math.min(Math.sqrt(rect.width * rect.height) * 0.02, 20);
    const score = distance + areaBias;

    if (score < nearestScore) {
      nearestScore = score;
      nearest = element;
    }
  });

  return nearest;
}

function isTextCursorTarget(point: Point) {
  return document
    .elementsFromPoint(point.x, point.y)
    .some(
      (element) =>
        element instanceof HTMLElement &&
        !element.closest(IGNORE_SELECTOR) &&
        Boolean(element.closest(TEXT_CURSOR_SELECTOR))
    );
}

function isGalaxyOverlayActive() {
  return Boolean(document.querySelector(GALAXY_ACTIVE_SELECTOR));
}

export default function AimCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const corners = Array.from(cursor.querySelectorAll<SVGPolylineElement>("polyline"));
    const root = document.documentElement;
    const pointer: Point & { visible: boolean } = {
      x: -100,
      y: -100,
      visible: false,
    };
    const current: CursorState = {
      x: pointer.x,
      y: pointer.y,
      width: BASE_SIZE,
      height: BASE_SIZE,
      angle: 45,
    };

    let animationFrame = 0;
    let lastFrame = performance.now();
    let hasPlacedCursor = false;
    let hasFinePointer = false;
    let reduceMotion = false;
    let shouldResolveTarget = true;
    let lockedElement: HTMLElement | null = null;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMediaQueries = () => {
      hasFinePointer = pointerQuery.matches;
      reduceMotion = motionQuery.matches;
      shouldResolveTarget = true;

      if (!hasFinePointer) {
        pointer.visible = false;
        cursor.classList.remove("is-visible", "is-locked");
        root.classList.remove("aim-cursor-enabled");
      }
    };

    const hideCursor = () => {
      pointer.visible = false;
      lockedElement = null;
      shouldResolveTarget = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        hideCursor();
        return;
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.visible = true;
      shouldResolveTarget = true;
    };

    const markTargetDirty = () => {
      shouldResolveTarget = true;
    };

    const resolveTarget = () => {
      if (lockedElement) {
        const lockedRect = lockedElement.getBoundingClientRect();

        if (
          !isValidTarget(lockedElement, lockedRect) ||
          getDistanceToRect(pointer, lockedRect) > LOCK_OUT
        ) {
          lockedElement = null;
        }
      }

      const candidate = getNearestTarget(pointer);

      if (!lockedElement || !candidate || candidate === lockedElement) {
        lockedElement = lockedElement ?? candidate;
        return;
      }

      // While locked, only hand over to another target the pointer is actually on.
      const candidateRect = candidate.getBoundingClientRect();
      const lockedRect = lockedElement.getBoundingClientRect();
      const pointerOnCandidate = getDistanceToRect(pointer, candidateRect) === 0;
      const pointerOnLocked = getDistanceToRect(pointer, lockedRect) === 0;
      const candidateIsSmaller =
        candidateRect.width * candidateRect.height < lockedRect.width * lockedRect.height;

      if (pointerOnCandidate && (!pointerOnLocked || candidateIsSmaller)) {
        lockedElement = candidate;
      }
    };

    const drawCorners = (width: number, height: number) => {
      const armX = Math.min(ARM, width / 2 - 3);
      const armY = Math.min(ARM, height / 2 - 3);
      const points = [
        [[armX, 0], [0, 0], [0, armY]],
        [[width - armX, 0], [width, 0], [width, armY]],
        [[width, height - armY], [width, height], [width - armX, height]],
        [[armX, height], [0, height], [0, height - armY]],
      ];

      corners.forEach((corner, index) => {
        corner.setAttribute(
          "points",
          points[index].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")
        );
      });
    };

    const renderFrame = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      const active =
        hasFinePointer &&
        pointer.visible &&
        document.visibilityState === "visible" &&
        !isGalaxyOverlayActive();
      const shouldShowCursor = active && !isTextCursorTarget(pointer);

      root.classList.toggle("aim-cursor-enabled", shouldShowCursor);

      if (!shouldShowCursor) {
        cursor.classList.remove("is-visible", "is-locked");
        hasPlacedCursor = false;
        lockedElement = null;
        shouldResolveTarget = true;
        animationFrame = window.requestAnimationFrame(renderFrame);
        return;
      }

      if (shouldResolveTarget) {
        resolveTarget();
        shouldResolveTarget = false;
      }

      // Re-measure every frame so the frame follows the element's live size and position.
      const lockRect = lockedElement?.getBoundingClientRect() ?? null;
      const target = lockRect
        ? {
            x: lockRect.left + lockRect.width / 2,
            y: lockRect.top + lockRect.height / 2,
            width: lockRect.width + LOCK_PADDING_X * 2,
            height: lockRect.height + LOCK_PADDING_Y * 2,
          }
        : {
            x: pointer.x,
            y: pointer.y,
            width: BASE_SIZE,
            height: BASE_SIZE,
          };

      if (lockRect) {
        // Settle forward onto the next half turn so the frame always ends up horizontal.
        const upright = Math.ceil(current.angle / 180 - 0.001) * 180;
        current.angle += (upright - current.angle) * (reduceMotion ? 1 : ease(10, dt));
      } else if (!reduceMotion) {
        current.angle += SPIN_SPEED * dt;
      } else {
        current.angle = 45;
      }

      if (current.angle >= 360) {
        current.angle -= 360;
      }

      if (!hasPlacedCursor) {
        current.x = target.x;
        current.y = target.y;
        current.width = target.width;
        current.height = target.height;
        hasPlacedCursor = true;
      } else {
        const positionEase = ease(lockRect ? 14 : 30, dt);
        const shapeEase = ease(12, dt);
        current.x += (target.x - current.x) * positionEase;
        current.y += (target.y - current.y) * positionEase;
        current.width += (target.width - current.width) * shapeEase;
        current.height += (target.height - current.height) * shapeEase;
      }

      cursor.style.width = `${current.width}px`;
      cursor.style.height = `${current.height}px`;
      cursor.style.transform = `translate3d(${current.x - current.width / 2}px, ${
        current.y - current.height / 2
      }px, 0) rotate(${current.angle}deg)`;
      drawCorners(current.width, current.height);
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-locked", Boolean(lockRect));

      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    syncMediaQueries();
    pointerQuery.addEventListener("change", syncMediaQueries);
    motionQuery.addEventListener("change", syncMediaQueries);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);
    window.addEventListener("scroll", markTargetDirty, { passive: true, capture: true });
    window.addEventListener("resize", markTargetDirty);
    document.addEventListener("visibilitychange", markTargetDirty);
    animationFrame = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      pointerQuery.removeEventListener("change", syncMediaQueries);
      motionQuery.removeEventListener("change", syncMediaQueries);
      window.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      window.removeEventListener("scroll", markTargetDirty, { capture: true });
      window.removeEventListener("resize", markTargetDirty);
      document.removeEventListener("visibilitychange", markTargetDirty);
      root.classList.remove("aim-cursor-enabled");
    };
  }, []);

  return (
    <div ref={cursorRef} className="aim-cursor" aria-hidden="true">
      <svg className="aim-cursor__frame">
        <polyline />
        <polyline />
        <polyline />
        <polyline />
      </svg>
      <span className="aim-cursor__dot" />
    </div>
  );
}
