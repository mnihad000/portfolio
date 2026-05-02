"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  sectionId: string;
  routeMatch?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/#home", sectionId: "home" },
  {
    label: "About",
    href: "/#about",
    sectionId: "about",
    routeMatch: (pathname) => pathname === "/about",
  },
  {
    label: "Projects",
    href: "/#projects",
    sectionId: "projects",
    routeMatch: (pathname) => pathname === "/projects" || pathname.startsWith("/projects/"),
  },
  {
    label: "Experiences",
    href: "/#experiences",
    sectionId: "experiences",
    routeMatch: (pathname) => pathname === "/experiences",
  },
  {
    label: "Contact",
    href: "/#contact",
    sectionId: "contact",
    routeMatch: (pathname) => pathname === "/contact",
  },
];

function NavHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSectionHref, setActiveSectionHref] = useState("/#home");

  const routeActiveHref = useMemo(() => {
    if (pathname === "/") return null;

    return (
      NAV_ITEMS.find((item) => item.routeMatch?.(pathname))?.href ?? "/#home"
    );
  }, [pathname]);

  const activeHref = pathname === "/" ? activeSectionHref : routeActiveHref;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return undefined;

    const sectionElements = NAV_ITEMS.map((item) =>
      document.getElementById(item.sectionId)
    ).filter((element): element is HTMLElement => Boolean(element));

    const syncActiveFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const hashItem = NAV_ITEMS.find((item) => item.sectionId === hash);

      if (hashItem) {
        setActiveSectionHref(hashItem.href);
      }
    };

    const selectActiveSection = () => {
      const viewportAnchor = window.innerHeight * 0.35;
      const activeSection =
        sectionElements.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= viewportAnchor && rect.bottom > viewportAnchor;
        }) ?? sectionElements[0];

      const activeItem = NAV_ITEMS.find(
        (item) => item.sectionId === activeSection?.id
      );

      if (activeItem) {
        setActiveSectionHref(activeItem.href);
      }
    };

    const observer = new IntersectionObserver(selectActiveSection, {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    sectionElements.forEach((section) => observer.observe(section));
    syncActiveFromHash();
    const frame = window.requestAnimationFrame(selectActiveSection);
    window.addEventListener("hashchange", syncActiveFromHash);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("hashchange", syncActiveFromHash);
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed top-3 inset-x-0 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
      <nav
        className={`no-scrollbar pointer-events-auto relative max-w-full overflow-x-auto rounded-full border px-1.5 py-1.5 backdrop-blur-md transition-all duration-300 sm:px-2 ${
          scrolled
            ? "border-white/20 bg-black/70 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            : "border-white/10 bg-black/45"
        }`}
        aria-label="Primary"
      >
        <ul className="relative flex w-fit items-center">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="relative">
              {/*
                Static active pill is intentionally more reliable than a moving cursor.
              */}
              <Link
                href={item.href}
                className={`group relative z-10 flex min-h-10 items-center overflow-hidden rounded-full px-3 py-2.5 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap uppercase transition-colors sm:min-h-11 sm:px-4 sm:text-xs sm:tracking-[0.12em] md:px-6 md:text-sm ${
                  activeHref === item.href
                    ? "text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {activeHref === item.href ? (
                  <span className="pointer-events-none absolute inset-0 rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.06)_100%)] shadow-[inset_0_0_12px_rgba(255,255,255,0.08)]" />
                ) : null}
                <span className="relative z-10">{item.label}</span>
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08)_0,transparent_30%,transparent_70%,rgba(255,255,255,0.06)_100%)]" />
                  <span className="absolute inset-0 rounded-full bg-[length:100%_3px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] mix-blend-screen" />
                  <span className="absolute inset-0 rounded-full shadow-[0_0_14px_rgba(255,255,255,0.14)]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default NavHeader;
