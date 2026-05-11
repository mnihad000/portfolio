import { redirect } from "next/navigation";

type LegacyLightModeProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyLightModeProjectDetailPage({
  params,
}: LegacyLightModeProjectDetailPageProps) {
  const { slug } = await params;
  redirect(`/projects/${slug}`);
}
