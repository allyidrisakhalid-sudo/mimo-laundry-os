import { P2AffiliateOrderDetail } from "../../../_components/p2AffiliatePortal";

export default function AffiliateOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <P2AffiliateOrderDetail orderId={params.id} />;
}
