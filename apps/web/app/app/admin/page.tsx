import { RolePortal } from "@/components/RolePortal";

export default function AdminPortalPage() {
  return (
    <RolePortal
      title="Admin Portal"
      description="Admin portal live route for Phase 2 verification."
      expectedRole="ADMIN"
      dataPath="/admin/overview"
    />
  );
}
