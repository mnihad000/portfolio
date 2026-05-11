import type { SiteTheme } from "@/lib/theme";

export const DARKMODE_HOME_ROUTE = "/darkmode";
export const DARKMODE_PROJECTS_ROUTE = "/darkmode/projects";

export function isDarkModeRoute(pathname: string) {
  return pathname === DARKMODE_HOME_ROUTE || pathname.startsWith(`${DARKMODE_HOME_ROUTE}/`);
}

export function getCanonicalPathForTheme(
  pathname: string,
  theme: SiteTheme
): string {
  if (theme === "dark") {
    if (pathname === "/") {
      return DARKMODE_HOME_ROUTE;
    }

    if (pathname === "/projects") {
      return DARKMODE_PROJECTS_ROUTE;
    }

    if (pathname.startsWith("/projects/")) {
      return `${DARKMODE_HOME_ROUTE}${pathname}`;
    }

    if (pathname === "/about") {
      return `${DARKMODE_HOME_ROUTE}/about`;
    }

    if (pathname === "/contact") {
      return `${DARKMODE_HOME_ROUTE}/contact`;
    }

    if (pathname === "/experiences") {
      return `${DARKMODE_HOME_ROUTE}/experiences`;
    }

    if (isDarkModeRoute(pathname)) {
      return pathname;
    }

    return DARKMODE_HOME_ROUTE;
  }

  if (pathname === DARKMODE_HOME_ROUTE) {
    return "/";
  }

  if (pathname === DARKMODE_PROJECTS_ROUTE) {
    return "/projects";
  }

  if (pathname.startsWith(`${DARKMODE_PROJECTS_ROUTE}/`)) {
    return pathname.replace(DARKMODE_HOME_ROUTE, "");
  }

  if (pathname === `${DARKMODE_HOME_ROUTE}/about`) {
    return "/#about";
  }

  if (pathname === `${DARKMODE_HOME_ROUTE}/contact`) {
    return "/#contact";
  }

  if (pathname === `${DARKMODE_HOME_ROUTE}/experiences`) {
    return "/#experiences";
  }

  if (isDarkModeRoute(pathname)) {
    return "/";
  }

  return pathname;
}
