"use client";

import DemoOne from "@/components/ui/demo";
import LightExperience from "@/components/ui/light-experience";
import { useSiteTheme } from "@/components/providers/site-theme-provider";

export default function HomeExperienceSwitcher() {
  const { theme } = useSiteTheme();

  if (theme === "light") {
    return <LightExperience />;
  }

  return <DemoOne />;
}
