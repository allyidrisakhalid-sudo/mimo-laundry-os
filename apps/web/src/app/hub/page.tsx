import { RolePortal } from "@/components/RolePortal";

export default function HubPage() {
  return (
    <RolePortal
      title="Hub Portal"
      expectedRole="HUB_STAFF"
      loginPhone="+255700000002"
      description="Production hub operations surface."
      dataPath="/v1/admin/reports/daily-close"
    />
  );
}
