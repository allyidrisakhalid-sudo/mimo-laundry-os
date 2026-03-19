import { P2AdminOrderDetail } from "../../../_components/p2AdminPortal";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <P2AdminOrderDetail orderId={id} />;
}
