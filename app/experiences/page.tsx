import { BriefcaseBusiness } from "lucide-react";
import PortfolioSectionPage from "@/components/ui/portfolio-section-page";

export default function ExperiencesPage() {
  return (
    <PortfolioSectionPage
      eyebrow="Career Timeline"
      title="Experiences"
      description="Professional experience, leadership roles, and engineering contributions across teams. This route is optimized for depth: full role breakdowns, outcomes, and technical context."
      icon={BriefcaseBusiness}
      features={[
        {
          title: "Engineering Roles",
          description:
            "End-to-end ownership across product delivery, architecture, and reliability improvements.",
        },
        {
          title: "Leadership + Mentorship",
          description:
            "Collaboration patterns, mentoring impact, and team-level process improvements.",
        },
        {
          title: "Outcomes",
          description:
            "Measurable results tied to performance, maintainability, and user experience.",
        },
        {
          title: "Tech Stack",
          description:
            "Key technologies, design patterns, and operational tooling used in each role.",
        },
      ]}
    />
  );
}
