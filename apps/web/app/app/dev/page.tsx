import { RolePortal } from "@/components/RolePortal";

export default function DevAdminPortalPage() {
  return (
    <RolePortal
      title="DevAdmin Portal"
      description="DevAdmin portal live route for Phase 2 verification."
      expectedRole="DEV_ADMIN"
      dataPath="/dev/health"
    />
  );
}
