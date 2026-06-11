import { SolutionDetailPage } from "@/components/solution-detail-page";

export default async function PublicSolutionDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SolutionDetailPage id={id} />;
}
