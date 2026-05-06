import type { SiteTheme } from "@/components/providers/site-theme-provider";

export const LIGHTMODE_HOME_ROUTE = "/lightmode";
export const LIGHTMODE_PROJECTS_ROUTE = "/lightmode/projects";

export function isLightModeRoute(pathname: string) {
  return pathname === LIGHTMODE_HOME_ROUTE || pathname.startsWith(`${LIGHTMODE_HOME_ROUTE}/`);
}

export function getCanonicalPathForTheme(
  pathname: string,
  theme: SiteTheme
): string {
  if (theme === "light") {
    if (pathname === "/") {
      return LIGHTMODE_HOME_ROUTE;
    }

    if (pathname === "/projects") {
      return LIGHTMODE_PROJECTS_ROUTE;
    }

    if (pathname.startsWith("/projects/")) {
      return `${LIGHTMODE_HOME_ROUTE}${pathname}`;
    }

    if (isLightModeRoute(pathname)) {
      return pathname;
    }

    return LIGHTMODE_HOME_ROUTE;
  }

  if (pathname === LIGHTMODE_HOME_ROUTE) {
    return "/";
  }

  if (pathname === LIGHTMODE_PROJECTS_ROUTE) {
    return "/projects";
  }

  if (pathname.startsWith(`${LIGHTMODE_PROJECTS_ROUTE}/`)) {
    return pathname.replace(LIGHTMODE_HOME_ROUTE, "");
  }

  if (isLightModeRoute(pathname)) {
    return "/";
  }

  return pathname;
}
