import { RolePortal } from "@/components/RolePortal";

export default function DriverPortalPage() {
  return (
    <RolePortal
      title="Driver Portal"
      description="Driver portal live route for Phase 2 verification."
      expectedRole="DRIVER"
      dataPath="/drivers/me"
    />
  );
}
