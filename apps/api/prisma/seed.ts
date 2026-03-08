import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Client } = pg;

async function main() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/vintage_laundry?schema=public";

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const password = "Pass123!";
    const passwordHash = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

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

    const zoneRes = await client.query(
      `
      INSERT INTO "Zone" ("id", "name", "boundaries", "metadata", "createdAt", "updatedAt")
      VALUES ('zone_a', 'Zone A', $1::jsonb, $2::jsonb, NOW(), NOW())
      RETURNING "id"
      `,
      [
        JSON.stringify({ type: "Polygon", label: "Zone A" }),
        JSON.stringify({ city: "Dar es Salaam" }),
      ]
    );
    const zoneId = zoneRes.rows[0].id;

    const commissionPlanRes = await client.query(
      `
      INSERT INTO "CommissionPlan" ("id", "name", "fixedAmountTzs", "isActive", "createdAt", "updatedAt", "kind", "notes", "percentageBps")
      VALUES ('plan_shop_pct_10', 'Shop 10 Percent', NULL, TRUE, NOW(), NOW(), 'PERCENTAGE', 'Default affiliate plan', 1000)
      RETURNING "id"
      `
    );
    const commissionPlanId = commissionPlanRes.rows[0].id;

    const hubRes = await client.query(
      `
      INSERT INTO "Hub" (
        "id", "name", "zoneId", "isActive", "createdAt", "updatedAt",
        "addressLabel", "capacityKgPerDay", "capacityOrdersPerDay", "locationLat", "locationLng", "supportsTiers"
      )
      VALUES (
        'hub_kigamboni', 'Kigamboni Hub', $1, TRUE, NOW(), NOW(),
        'Kigamboni, Dar es Salaam', 500, 120, NULL, NULL, $2::jsonb
      )
      RETURNING "id"
      `,
      [zoneId, JSON.stringify(["STANDARD_48H", "EXPRESS_24H", "SAME_DAY"])]
    );
    const hubId = hubRes.rows[0].id;

    const affiliateShopRes = await client.query(
      `
      INSERT INTO "AffiliateShop" (
        "id", "name", "code", "zoneId", "createdAt", "updatedAt",
        "addressLabel", "commissionPlanId", "contactPhone", "isActive", "locationLat", "locationLng"
      )
      VALUES (
        'shop_mikocheni', 'Mikocheni Affiliate', 'SHOP_MIKOCHENI', $1, NOW(), NOW(),
        'Mikocheni, Dar es Salaam', $2, '+255700000004', TRUE, NULL, NULL
      )
      RETURNING "id"
      `,
      [zoneId, commissionPlanId]
    );
    const affiliateShopId = affiliateShopRes.rows[0].id;

    await client.query(
      `
      INSERT INTO "User" ("id", "email", "phone", "fullName", "passwordHash", "role", "status", "createdAt", "updatedAt")
      VALUES
        ('user_admin', 'admin@mimo.local', '+255700000001', 'Admin User', $1, 'ADMIN', 'ACTIVE', NOW(), NOW()),
        ('user_hub', 'hub@mimo.local', '+255700000002', 'Hub Staff User', $1, 'HUB_STAFF', 'ACTIVE', NOW(), NOW()),
        ('user_driver', 'driver@mimo.local', '+255700000003', 'Driver User', $1, 'DRIVER', 'ACTIVE', NOW(), NOW()),
        ('user_affiliate', 'affiliate@mimo.local', '+255700000004', 'Affiliate Staff User', $1, 'AFFILIATE_STAFF', 'ACTIVE', NOW(), NOW()),
        ('user_customer', 'customer@mimo.local', '+255700000005', 'Seed Customer', $1, 'CUSTOMER', 'ACTIVE', NOW(), NOW())
      `,
      [passwordHash]
    );

    await client.query(
      `
      INSERT INTO "HubStaffProfile" ("id", "userId", "hubId", "jobTitle", "isActive", "createdAt", "updatedAt")
      VALUES ('hubstaff_user_hub', 'user_hub', $1, 'Hub Operations', TRUE, NOW(), NOW())
      `,
      [hubId]
    );

    await client.query(
      `
      INSERT INTO "DriverProfile" (
        "id", "userId", "homeZoneId", "phone", "vehicleType", "vehiclePlate",
        "isActive", "availabilityStatus", "lastStatusAt", "createdAt", "updatedAt"
      )
      VALUES (
        'driver_user_driver', 'user_driver', $1, '+255700000003', 'MOTORBIKE', 'MC-001',
        TRUE, 'AVAILABLE', NOW(), NOW(), NOW()
      )
      `,
      [zoneId]
    );

    await client.query(
      `
      INSERT INTO "AffiliateStaffProfile" ("id", "userId", "affiliateShopId", "jobTitle", "isActive", "createdAt", "updatedAt")
      VALUES ('affiliate_user_affiliate', 'user_affiliate', $1, 'Counter Staff', TRUE, NOW(), NOW())
      `,
      [affiliateShopId]
    );

    await client.query(
      `
      INSERT INTO "CustomerAddress" (
        "id", "userId", "label", "contactName", "phone", "addressLine1", "addressLine2",
        "zoneId", "locationLat", "locationLng", "notes", "createdAt", "updatedAt"
      )
      VALUES (
        'addr_customer_home', 'user_customer', 'Home', 'Seed Customer', '+255700000005', 'Dar es Salaam', NULL,
        $1, NULL, NULL, NULL, NOW(), NOW()
      )
      `,
      [zoneId]
    );

    await client.query(
      `
      INSERT INTO "Order" (
        "id", "orderNumber", "sourceType", "affiliateShopId", "channel", "customerName", "customerPhone", "notes",
        "createdAt", "updatedAt", "customerUserId", "tier", "zoneId", "hubId",
        "pickupAddressId", "dropoffAddressId", "statusCurrent"
      )
      VALUES (
        'order_0001', 'ORD-0001', 'DIRECT', NULL, 'DOOR', 'Seed Customer', '+255700000005', 'Seed order',
        NOW(), NOW(), 'user_customer', 'STANDARD_48H', $1, $2,
        'addr_customer_home', 'addr_customer_home', 'CREATED'
      )
      `,
      [zoneId, hubId]
    );

    await client.query(
      `
      INSERT INTO "Bag" ("id", "orderId", "tagCode", "bagStatus", "createdAt", "updatedAt")
      VALUES ('bag_0001', 'order_0001', 'BAG-0001', 'CREATED', NOW(), NOW())
      `
    );

    await client.query(
      `
      INSERT INTO "OrderEvent" (
        "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
      )
      VALUES (
        'event_0001', 'order_0001', 'ORDER_CREATED', NOW(), 'user_admin', 'ADMIN', 'Seed order created', $1::jsonb, NOW()
      )
      `,
      [JSON.stringify({ source: "seed" })]
    );

    await client.query("COMMIT");

    console.log("Seed complete");
    console.log("Default password for seeded users: Pass123!");
    console.log("ADMIN +255700000001");
    console.log("HUB_STAFF +255700000002");
    console.log("DRIVER +255700000003");
    console.log("AFFILIATE_STAFF +255700000004");
    console.log("CUSTOMER +255700000005");
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
