import AboutSection from "@/components/ui/about-section";
import ContactSection from "@/components/ui/contact-section";
import ExperiencesSection from "@/components/ui/experiences-section";
import HeroAsciiOne from "@/components/ui/hero-ascii-one";
import ProjectsSection from "@/components/ui/projects-section";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <HeroAsciiOne />
      <AboutSection />
      <ProjectsSection />
      <ExperiencesSection />
      <ContactSection />
    </main>
  );
}
