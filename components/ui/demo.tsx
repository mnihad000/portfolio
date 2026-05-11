import Home from "@/components/ui/hero-ascii-one";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";

export function SplineSceneBasic() {
  return (
    <Card className="relative min-h-[460px] w-full overflow-hidden border-black/8 bg-white md:h-[500px] md:min-h-0">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex h-full flex-col md:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-2 pt-8 md:p-8">
          <h1 className="max-w-[11rem] bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text text-4xl font-bold text-transparent sm:max-w-none md:text-5xl">
            Welcome to the Future
          </h1>
          <p className="mt-4 max-w-[14rem] text-sm leading-6 text-neutral-600 sm:max-w-lg sm:text-base">
            Come see what I&apos;ve been building.
          </p>
        </div>

        <div className="relative h-[280px] flex-1 md:h-auto">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>
    </Card>
  );
}

export default function DemoOne() {
  return (
    <div className="h-screen w-screen">
      <Home />
    </div>
  );
}
