import { RolePortal } from "@/components/RolePortal";

export default function CustomerPage() {
  return (
    <RolePortal
      title="Customer Portal"
      expectedRole="CUSTOMER"
      loginPhone="+255700000005"
      description="Production customer tracking surface."
      dataPath="/v1/orders/order_customer_a"
    />
  );
}
