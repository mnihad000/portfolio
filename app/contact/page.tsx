import { Mail } from "lucide-react";
import PortfolioSectionPage from "@/components/ui/portfolio-section-page";

export default function ContactPage() {
  return (
    <PortfolioSectionPage
      eyebrow="Open Channel"
      title="Contact"
      description="Primary contact and collaboration channels. This page can be upgraded with a form handler or scheduling integration without changing the nav structure."
      icon={Mail}
      features={[
        {
          title: "Direct Email",
          description:
            "Use this block for your preferred inbox and expected response window.",
        },
        {
          title: "Professional Networks",
          description:
            "Link out to GitHub, LinkedIn, and other relevant technical profiles.",
        },
        {
          title: "Project Inquiries",
          description:
            "Scope definitions for freelance, internship, and collaboration requests.",
        },
        {
          title: "Availability",
          description:
            "Timezone, current commitments, and best channels for fast coordination.",
        },
      ]}
    />
  );
}
