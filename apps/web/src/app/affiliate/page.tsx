import { RolePortal } from "@/components/RolePortal";

export default function AffiliatePage() {
  return (
    <RolePortal
      title="Affiliate Portal"
      expectedRole="AFFILIATE_STAFF"
      loginPhone="+255700000004"
      description="Production affiliate operations surface."
      dataPath="/v1/affiliate/orders"
    />
  );
}
