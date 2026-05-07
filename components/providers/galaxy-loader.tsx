"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLightModeRoute } from "@/lib/theme-routes";

declare global {
  interface Window {
    GalaxyPortfolioNavigator?: {
      init: () => void;
      destroy: () => void;
    };
  }
}

const GALAXY_STYLESHEET_ID = "galaxy-portfolio-styles";

function ensureStylesheet(id: string, href: string) {
  if (document.getElementById(id)) {
    return;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      const handleLoad = () => {
        resolve();
      };
      const handleError = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };

      existing.addEventListener("load", handleLoad, { once: true });
      existing.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false;
    script.dataset.loaded = "false";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.body.appendChild(script);
  });
}

async function loadGalaxyAssets() {
  ensureStylesheet(GALAXY_STYLESHEET_ID, "/galaxy/galaxy.css");

  await loadScript(
    "galaxy-three-core",
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
  );
  await loadScript("galaxy-orbit-controls", "/galaxy/OrbitControls.r128.js");
  await loadScript("galaxy-portfolio-data", "/galaxy/portfolio-data.js");
  await loadScript("galaxy-runtime", "/galaxy/galaxy.js");
}

export default function GalaxyLoader() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function mountGalaxy() {
      try {
        await loadGalaxyAssets();
        if (!cancelled) {
          window.GalaxyPortfolioNavigator?.init();
        }
      } catch (error) {
        console.error("Galaxy loader failed to initialize.", error);
      }
    }

    if (isLightModeRoute(pathname)) {
      mountGalaxy();
      return () => {
        cancelled = true;
      };
    }

    window.GalaxyPortfolioNavigator?.destroy();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      window.GalaxyPortfolioNavigator?.destroy();
    };
  }, []);

  return null;
}
