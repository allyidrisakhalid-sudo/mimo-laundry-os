import { RolePortal } from "@/components/RolePortal";

export default function CustomerPortalPage() {
  return (
    <RolePortal
      title="Customer Portal"
      description="Customer portal live route for Phase 2 verification."
      expectedRole="CUSTOMER"
      dataPath="/customers/me"
    />
  );
}
