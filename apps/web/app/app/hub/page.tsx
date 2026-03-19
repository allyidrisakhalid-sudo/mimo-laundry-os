import { RolePortal } from "@/components/RolePortal";

export default function HubPortalPage() {
  return (
    <RolePortal
      title="Hub Portal"
      description="Hub portal live route for Phase 2 verification."
      expectedRole="HUB_STAFF"
      dataPath="/hub/orders"
    />
  );
}
