import { RolePortal } from "@/components/RolePortal";

export default function AffiliatePortalPage() {
  return (
    <RolePortal
      title="Affiliate Portal"
      description="Affiliate portal live route for Phase 2 verification."
      expectedRole="AFFILIATE_STAFF"
      dataPath="/affiliate/orders"
    />
  );
}
