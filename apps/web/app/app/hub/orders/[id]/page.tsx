import { HubOrderDetailView } from "../../../_components/p2HubPortal";

type HubOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function HubOrderDetailPage({ params }: HubOrderDetailPageProps) {
  const { id } = await params;
  return <HubOrderDetailView orderId={id} />;
}
