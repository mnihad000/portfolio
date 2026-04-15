import type { SkillGroup } from "@/lib/about";

type AboutTechStackRailProps = {
  skillGroups: SkillGroup[];
};

export default function AboutTechStackRail({
  skillGroups,
}: AboutTechStackRailProps) {
  return (
    <section className="about-rail-panel relative overflow-hidden rounded-[20px] border border-white/12 bg-[rgba(14,14,14,0.88)] p-4">
      <span className="about-rail-intro-scan pointer-events-none absolute inset-y-0 -left-[34%] w-[32%]" />

      <h2 className="font-mono text-[1.65rem] tracking-[-0.03em] text-white">
        Tech Stack
      </h2>

      <div className="mt-5 space-y-4">
        {skillGroups.map((group) => (
          <div key={group.title} className="rounded-[14px] px-1 py-1.5">
            <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
              {group.title}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-[8px] border border-white/16 px-2.5 py-1 font-mono text-[0.82rem] text-white/86 transition-colors duration-200 hover:border-white/24 hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
