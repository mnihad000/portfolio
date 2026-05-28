"use client";

import { useEffect, useRef } from "react";

const BASE_SIZE = 34;
const SNAP_DISTANCE = 48;
const MAX_LOCK_WIDTH = 112;
const MAX_LOCK_HEIGHT = 64;
const LOCK_PADDING_X = 18;
const LOCK_PADDING_Y = 14;

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
};

type LockTarget = {
  rect: DOMRect;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
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
    !element.closest(IGNORE_SELECTOR) &&
    !isDisabledElement(element) &&
    hasNonNegativeTabIndex(element) &&
    isVisibleTarget(element, rect)
  );
}

function getNearestLockTarget(point: Point): LockTarget | null {
  const elements = document.querySelectorAll<HTMLElement>(CLICKABLE_SELECTOR);
  let nearest: LockTarget | null = null;
  let nearestScore = Number.POSITIVE_INFINITY;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (!isValidTarget(element, rect)) {
      return;
    }

    const distance = getDistanceToRect(point, rect);

    if (distance > SNAP_DISTANCE) {
      return;
    }

    const areaBias = Math.min(Math.sqrt(rect.width * rect.height) * 0.02, 20);
    const score = distance + areaBias;

    if (score < nearestScore) {
      nearestScore = score;
      nearest = { rect };
    }
  });

  return nearest;
}

function getLockCursorState(point: Point, target: LockTarget): CursorState {
  const { rect } = target;
  const width = clamp(rect.width + LOCK_PADDING_X, BASE_SIZE, MAX_LOCK_WIDTH);
  const height = clamp(rect.height + LOCK_PADDING_Y, BASE_SIZE, MAX_LOCK_HEIGHT);
  const canFrameFullTarget =
    rect.width + LOCK_PADDING_X <= MAX_LOCK_WIDTH &&
    rect.height + LOCK_PADDING_Y <= MAX_LOCK_HEIGHT;

  if (canFrameFullTarget) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width,
      height,
    };
  }

  const minX = rect.left + width / 2;
  const maxX = rect.right - width / 2;
  const minY = rect.top + height / 2;
  const maxY = rect.bottom - height / 2;

  return {
    x: minX <= maxX ? clamp(point.x, minX, maxX) : rect.left + rect.width / 2,
    y: minY <= maxY ? clamp(point.y, minY, maxY) : rect.top + rect.height / 2,
    width,
    height,
  };
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
    };
    const targetState: CursorState = {
      x: pointer.x,
      y: pointer.y,
      width: BASE_SIZE,
      height: BASE_SIZE,
    };

    let animationFrame = 0;
    let hasPlacedCursor = false;
    let hasFinePointer = false;
    let shouldResolveTarget = true;
    let currentLockTarget: LockTarget | null = null;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncPointerSupport = () => {
      hasFinePointer = pointerQuery.matches;
      shouldResolveTarget = true;

      if (!hasFinePointer) {
        pointer.visible = false;
        cursor.classList.remove("is-visible", "is-locked");
        root.classList.remove("aim-cursor-enabled");
      }
    };

    const setNativeCursorHidden = (hidden: boolean) => {
      root.classList.toggle("aim-cursor-enabled", hidden);
    };

    const hideCursor = () => {
      pointer.visible = false;
      cursor.classList.remove("is-visible", "is-locked");
      setNativeCursorHidden(false);
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

    const renderFrame = () => {
      const galaxyActive = isGalaxyOverlayActive();
      const active =
        hasFinePointer &&
        pointer.visible &&
        document.visibilityState === "visible" &&
        !galaxyActive;
      const overTextTarget = active && isTextCursorTarget(pointer);
      const shouldShowCursor = active && !overTextTarget;

      setNativeCursorHidden(active);

      if (!shouldShowCursor) {
        cursor.classList.remove("is-visible", "is-locked");
        hasPlacedCursor = false;
        currentLockTarget = null;
        shouldResolveTarget = true;
        animationFrame = window.requestAnimationFrame(renderFrame);
        return;
      }

      if (shouldResolveTarget) {
        currentLockTarget = getNearestLockTarget(pointer);
        shouldResolveTarget = false;
      }

      const nextState = currentLockTarget
        ? getLockCursorState(pointer, currentLockTarget)
        : {
            x: pointer.x,
            y: pointer.y,
            width: BASE_SIZE,
            height: BASE_SIZE,
          };

      targetState.x = nextState.x;
      targetState.y = nextState.y;
      targetState.width = nextState.width;
      targetState.height = nextState.height;

      if (!hasPlacedCursor) {
        current.x = targetState.x;
        current.y = targetState.y;
        current.width = targetState.width;
        current.height = targetState.height;
        hasPlacedCursor = true;
      } else {
        const positionEase = currentLockTarget ? 0.28 : 0.48;
        current.x = lerp(current.x, targetState.x, positionEase);
        current.y = lerp(current.y, targetState.y, positionEase);
        current.width = lerp(current.width, targetState.width, 0.28);
        current.height = lerp(current.height, targetState.height, 0.28);
      }

      cursor.style.width = `${current.width}px`;
      cursor.style.height = `${current.height}px`;
      cursor.style.transform = `translate3d(${current.x - current.width / 2}px, ${
        current.y - current.height / 2
      }px, 0)`;
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-locked", Boolean(currentLockTarget));

      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    syncPointerSupport();
    pointerQuery.addEventListener("change", syncPointerSupport);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);
    window.addEventListener("scroll", markTargetDirty, { passive: true });
    window.addEventListener("resize", markTargetDirty);
    document.addEventListener("visibilitychange", markTargetDirty);
    animationFrame = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      pointerQuery.removeEventListener("change", syncPointerSupport);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      window.removeEventListener("scroll", markTargetDirty);
      window.removeEventListener("resize", markTargetDirty);
      document.removeEventListener("visibilitychange", markTargetDirty);
      root.classList.remove("aim-cursor-enabled");
    };
  }, []);

  return (
    <div ref={cursorRef} className="aim-cursor" aria-hidden="true">
      <div className="aim-cursor__box">
        <span className="aim-cursor__corner aim-cursor__corner--tl" />
        <span className="aim-cursor__corner aim-cursor__corner--tr" />
        <span className="aim-cursor__corner aim-cursor__corner--bl" />
        <span className="aim-cursor__corner aim-cursor__corner--br" />
      </div>
    </div>
  );
}
