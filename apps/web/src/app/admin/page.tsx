import { RolePortal } from "@/components/RolePortal";

export default function AdminPage() {
  return (
    <RolePortal
      title="Admin Portal"
      expectedRole="ADMIN"
      loginPhone="+255700000001"
      description="Production admin reporting and audit surface."
      dataPath="/v1/admin/reports/daily-close"
    />
  );
}
