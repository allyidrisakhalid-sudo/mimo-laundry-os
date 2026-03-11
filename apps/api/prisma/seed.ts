import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Client } = pg;

async function main() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/mimo_laundry_os?schema=public";

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const password = "Pass123!";
    const passwordHash = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    await client.query('DELETE FROM "AuditLog"');
    await client.query('DELETE FROM "RefreshToken"');
    await client.query('DELETE FROM "TripStop"');
    await client.query('DELETE FROM "Trip"');
    await client.query('DELETE FROM "OrderIssue"');
    await client.query('DELETE FROM "OrderEvent"');
    await client.query('DELETE FROM "Bag"');
    await client.query('DELETE FROM "Order"');
    await client.query('DELETE FROM "CustomerAddress"');
    await client.query('DELETE FROM "DriverProfile"');
    await client.query('DELETE FROM "AffiliateStaffProfile"');
    await client.query('DELETE FROM "HubStaffProfile"');
    await client.query('DELETE FROM "User"');
    await client.query('DELETE FROM "AffiliateShop"');
    await client.query('DELETE FROM "CommissionPlan"');
    await client.query('DELETE FROM "Hub"');
    await client.query('DELETE FROM "Zone"');

    await client.query(
      `
      INSERT INTO "Zone" ("id", "name", "boundaries", "metadata", "createdAt", "updatedAt")
      VALUES
        ('zone_a', 'Zone A', $1::jsonb, $2::jsonb, NOW(), NOW()),
        ('zone_b', 'Zone B', $3::jsonb, $4::jsonb, NOW(), NOW())
      `,
      [
        JSON.stringify({ type: "Polygon", label: "Zone A" }),
        JSON.stringify({ city: "Dar es Salaam", area: "Kigamboni" }),
        JSON.stringify({ type: "Polygon", label: "Zone B" }),
        JSON.stringify({ city: "Dar es Salaam", area: "Mbagala" }),
      ]
    );

    await client.query(
      `
      INSERT INTO "CommissionPlan" ("id", "name", "fixedAmountTzs", "isActive", "createdAt", "updatedAt", "kind", "notes", "percentageBps")
      VALUES
        ('plan_shop_pct_10', 'Shop 10 Percent', NULL, TRUE, NOW(), NOW(), 'PERCENTAGE', 'Default affiliate plan', 1000),
        ('plan_shop_pct_12', 'Shop 12 Percent', NULL, TRUE, NOW(), NOW(), 'PERCENTAGE', 'Secondary affiliate plan', 1200)
      `
    );

    await client.query(
      `
      INSERT INTO "Hub" (
        "id", "name", "zoneId", "isActive", "createdAt", "updatedAt",
        "addressLabel", "capacityKgPerDay", "capacityOrdersPerDay", "locationLat", "locationLng", "supportsTiers"
      )
      VALUES
        (
          'hub_kigamboni', 'Kigamboni Hub', 'zone_a', TRUE, NOW(), NOW(),
          'Kigamboni, Dar es Salaam', 500, 120, NULL, NULL, $1::jsonb
        ),
        (
          'hub_mbagala', 'Mbagala Hub', 'zone_b', TRUE, NOW(), NOW(),
          'Mbagala, Dar es Salaam', 450, 100, NULL, NULL, $1::jsonb
        )
      `,
      [JSON.stringify(["STANDARD_48H", "EXPRESS_24H", "SAME_DAY"])]
    );

    await client.query(
      `
      INSERT INTO "AffiliateShop" (
        "id", "name", "code", "zoneId", "createdAt", "updatedAt",
        "addressLabel", "commissionPlanId", "contactPhone", "isActive", "locationLat", "locationLng"
      )
      VALUES
        (
          'shop_mikocheni', 'Mikocheni Affiliate', 'SHOP_MIKOCHENI', 'zone_a', NOW(), NOW(),
          'Mikocheni, Dar es Salaam', 'plan_shop_pct_10', '+255700000004', TRUE, NULL, NULL
        ),
        (
          'shop_mbagala', 'Mbagala Affiliate', 'SHOP_MBAGALA', 'zone_b', NOW(), NOW(),
          'Mbagala, Dar es Salaam', 'plan_shop_pct_12', '+255700000009', TRUE, NULL, NULL
        )
      `
    );

    await client.query(
      `
      INSERT INTO "User" ("id", "email", "phone", "fullName", "passwordHash", "role", "status", "createdAt", "updatedAt")
      VALUES
        ('user_admin', 'admin@mimo.local', '+255700000001', 'Admin User', $1, 'ADMIN', 'ACTIVE', NOW(), NOW()),
        ('user_hub', 'hub@mimo.local', '+255700000002', 'Hub Staff User', $1, 'HUB_STAFF', 'ACTIVE', NOW(), NOW()),
        ('user_driver', 'driver@mimo.local', '+255700000003', 'Driver User', $1, 'DRIVER', 'ACTIVE', NOW(), NOW()),
        ('user_affiliate', 'affiliate@mimo.local', '+255700000004', 'Affiliate Staff User', $1, 'AFFILIATE_STAFF', 'ACTIVE', NOW(), NOW()),
        ('user_customer', 'customer@mimo.local', '+255700000005', 'Seed Customer A', $1, 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
        ('user_devadmin', 'devadmin@mimo.local', '+255700000006', 'DevAdmin User', $1, 'DEV_ADMIN', 'ACTIVE', NOW(), NOW()),
        ('user_customer_b', 'customerb@mimo.local', '+255700000007', 'Seed Customer B', $1, 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
        ('user_driver_b', 'driverb@mimo.local', '+255700000008', 'Driver User B', $1, 'DRIVER', 'ACTIVE', NOW(), NOW())
      `,
      [passwordHash]
    );

    await client.query(
      `
      INSERT INTO "HubStaffProfile" ("id", "userId", "hubId", "jobTitle", "isActive", "createdAt", "updatedAt")
      VALUES ('hubstaff_user_hub', 'user_hub', 'hub_kigamboni', 'Hub Operations', TRUE, NOW(), NOW())
      `
    );

    await client.query(
      `
      INSERT INTO "DriverProfile" (
        "id", "userId", "homeZoneId", "phone", "vehicleType", "vehiclePlate",
        "isActive", "availabilityStatus", "lastStatusAt", "createdAt", "updatedAt"
      )
      VALUES
        (
          'driver_user_driver', 'user_driver', 'zone_a', '+255700000003', 'MOTORBIKE', 'MC-001',
          TRUE, 'AVAILABLE', NOW(), NOW(), NOW()
        ),
        (
          'driver_user_driver_b', 'user_driver_b', 'zone_b', '+255700000008', 'MOTORBIKE', 'MC-002',
          TRUE, 'AVAILABLE', NOW(), NOW(), NOW()
        )
      `
    );

    await client.query(
      `
      INSERT INTO "AffiliateStaffProfile" ("id", "userId", "affiliateShopId", "jobTitle", "isActive", "createdAt", "updatedAt")
      VALUES ('affiliate_user_affiliate', 'user_affiliate', 'shop_mikocheni', 'Counter Staff', TRUE, NOW(), NOW())
      `
    );

    await client.query(
      `
      INSERT INTO "CustomerAddress" (
        "id", "userId", "label", "contactName", "phone", "addressLine1", "addressLine2",
        "zoneId", "locationLat", "locationLng", "notes", "createdAt", "updatedAt"
      )
      VALUES
        (
          'addr_customer_home_a', 'user_customer', 'Home', 'Seed Customer A', '+255700000005', 'Kigamboni, Dar es Salaam', NULL,
          'zone_a', NULL, NULL, NULL, NOW(), NOW()
        ),
        (
          'addr_customer_home_b', 'user_customer_b', 'Home', 'Seed Customer B', '+255700000007', 'Mbagala, Dar es Salaam', NULL,
          'zone_b', NULL, NULL, NULL, NOW(), NOW()
        )
      `
    );

    await client.query(
      `
      INSERT INTO "Order" (
        "id", "orderNumber", "sourceType", "affiliateShopId", "channel", "customerName", "customerPhone", "notes",
        "createdAt", "updatedAt", "customerUserId", "tier", "zoneId", "hubId",
        "pickupAddressId", "dropoffAddressId", "statusCurrent"
      )
      VALUES
        (
          'order_customer_a', 'ORD-0001', 'DIRECT', NULL, 'DOOR', 'Seed Customer A', '+255700000005', 'Customer A order',
          NOW(), NOW(), 'user_customer', 'STANDARD_48H', 'zone_a', 'hub_kigamboni',
          'addr_customer_home_a', 'addr_customer_home_a', 'CREATED'
        ),
        (
          'order_scope_b', 'ORD-0002', 'AFFILIATE', 'shop_mbagala', 'SHOP_DROP', 'Seed Customer B', '+255700000007', 'Zone B scoped order',
          NOW(), NOW(), 'user_customer_b', 'EXPRESS_24H', 'zone_b', 'hub_mbagala',
          'addr_customer_home_b', 'addr_customer_home_b', 'CREATED'
        )
      `
    );

    await client.query(
      `
      INSERT INTO "Bag" ("id", "orderId", "tagCode", "bagStatus", "createdAt", "updatedAt")
      VALUES
        ('bag_0001', 'order_customer_a', 'BAG-0001', 'CREATED', NOW(), NOW()),
        ('bag_0002', 'order_scope_b', 'BAG-0002', 'CREATED', NOW(), NOW())
      `
    );

    await client.query(
      `
      INSERT INTO "OrderEvent" (
        "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
      )
      VALUES
        (
          'event_0001', 'order_customer_a', 'ORDER_CREATED', NOW(), 'user_admin', 'ADMIN', 'Seed order A created', $1::jsonb, NOW()
        ),
        (
          'event_0002', 'order_scope_b', 'ORDER_CREATED', NOW(), 'user_admin', 'ADMIN', 'Seed order B created', $2::jsonb, NOW()
        )
      `,
      [JSON.stringify({ source: "seed_a" }), JSON.stringify({ source: "seed_b" })]
    );

    await client.query(
      `
      INSERT INTO "Trip" (
        "id", "type", "zoneId", "hubId", "driverId", "status", "scheduledFor", "startedAt", "completedAt", "createdAt", "updatedAt"
      )
      VALUES
        (
          'trip_driver_a', 'PICKUP', 'zone_a', 'hub_kigamboni', 'driver_user_driver', 'PLANNED', NOW(), NULL, NULL, NOW(), NOW()
        ),
        (
          'trip_driver_b', 'DELIVERY', 'zone_b', 'hub_mbagala', 'driver_user_driver_b', 'PLANNED', NOW(), NULL, NULL, NOW(), NOW()
        )
      `
    );

    await client.query(
      `
      INSERT INTO "TripStop" (
        "id", "tripId", "orderId", "stopType", "sequence", "status", "notes", "createdAt", "updatedAt"
      )
      VALUES
        (
          'tripstop_0001', 'trip_driver_a', 'order_customer_a', 'PICKUP', 1, 'PENDING', 'Driver A stop', NOW(), NOW()
        ),
        (
          'tripstop_0002', 'trip_driver_b', 'order_scope_b', 'DROPOFF', 1, 'PENDING', 'Driver B stop', NOW(), NOW()
        )
      `
    );

    await client.query("COMMIT");

    console.log("Seed complete");
    console.log("Default password for seeded users: Pass123!");
    console.log("ADMIN +255700000001");
    console.log("HUB_STAFF +255700000002");
    console.log("DRIVER_A +255700000003");
    console.log("AFFILIATE_STAFF_A +255700000004");
    console.log("CUSTOMER_A +255700000005");
    console.log("DEV_ADMIN +255700000006");
    console.log("CUSTOMER_B +255700000007");
    console.log("DRIVER_B +255700000008");
    console.log("Scoped order for forbidden access tests: order_scope_b");
    console.log("Scoped trip for forbidden access tests: trip_driver_b");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
