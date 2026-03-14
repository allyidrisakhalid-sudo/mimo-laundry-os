import { RolePortal } from "@/components/RolePortal";

export default function DriverPage() {
  return (
    <RolePortal
      title="Driver Portal"
      expectedRole="DRIVER"
      loginPhone="+255700000003"
      description="Production driver task surface."
      dataPath="/v1/driver/tasks"
    />
  );
}
