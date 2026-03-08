import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  DriverAvailabilityStatus,
  OrderChannel,
  OrderSourceType,
  OrderEventType,
  OrderIssueStatus,
  OrderIssueType,
  OrderStatusCurrent,
  OrderTier,
  TripStatus,
  TripStopStatus,
  TripStopType,
  TripType,
  UserRole,
  VehicleType,
} from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderIssue.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.bag.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driverProfile.deleteMany();
  await prisma.order.deleteMany();
  await prisma.affiliateStaffProfile.deleteMany();
  await prisma.affiliateShop.deleteMany();
  await prisma.commissionPlan.deleteMany();
  await prisma.hubStaffProfile.deleteMany();
  await prisma.hub.deleteMany();
  await prisma.user.deleteMany();
  await prisma.zone.deleteMany();

  const zoneA = await prisma.zone.create({
    data: {
      name: "Zone A",
      boundaries: { type: "manual", label: "Zone A boundary descriptor" },
      metadata: { seedKey: "zone-a" },
    },
  });

  const zoneB = await prisma.zone.create({
    data: {
      name: "Zone B",
      boundaries: { type: "manual", label: "Zone B boundary descriptor" },
      metadata: { seedKey: "zone-b" },
    },
  });

  const sinzaHub = await prisma.hub.create({
    data: {
      name: "Sinza Hub",
      zoneId: zoneA.id,
      addressLabel: "Sinza Mori Hub",
      capacityKgPerDay: 500,
      capacityOrdersPerDay: 120,
      supportsTiers: ["STANDARD", "EXPRESS"],
    },
  });

  const mbeziHub = await prisma.hub.create({
    data: {
      name: "Mbezi Hub",
      zoneId: zoneB.id,
      addressLabel: "Mbezi Beach Hub",
      capacityKgPerDay: 650,
      capacityOrdersPerDay: 150,
      supportsTiers: ["STANDARD", "EXPRESS", "SAME_DAY"],
    },
  });

  const hubStaffSinzaUser = await prisma.user.create({
    data: {
      email: "hub.staff.sinza@mimo.local",
      fullName: "Sinza Hub Staff",
      role: UserRole.HUB_STAFF,
    },
  });

  const hubStaffMbeziUser = await prisma.user.create({
    data: {
      email: "hub.staff.mbezi@mimo.local",
      fullName: "Mbezi Hub Staff",
      role: UserRole.HUB_STAFF,
    },
  });

  await prisma.hubStaffProfile.create({
    data: {
      userId: hubStaffSinzaUser.id,
      hubId: sinzaHub.id,
      jobTitle: "Hub Supervisor",
    },
  });

  await prisma.hubStaffProfile.create({
    data: {
      userId: hubStaffMbeziUser.id,
      hubId: mbeziHub.id,
      jobTitle: "Hub Supervisor",
    },
  });

  const fixedPlan = await prisma.commissionPlan.create({
    data: {
      name: "Shop Fixed TZS 1500",
      kind: "FIXED_PER_ORDER",
      fixedAmountTzs: 1500,
      notes: "Flat commission per eligible order",
    },
  });

  const percentPlan = await prisma.commissionPlan.create({
    data: {
      name: "Shop Service 12.5 Percent",
      kind: "PERCENT_OF_SERVICE_VALUE",
      percentageBps: 1250,
      notes: "12.5% service commission",
    },
  });

  const shopA = await prisma.affiliateShop.create({
    data: {
      code: "SHOP-A",
      name: "Affiliate Shop A",
      zoneId: zoneA.id,
      commissionPlanId: fixedPlan.id,
      addressLabel: "Msasani Affiliate Pickup Counter",
      contactPhone: "+255700000101",
    },
  });

  const shopB = await prisma.affiliateShop.create({
    data: {
      code: "SHOP-B",
      name: "Affiliate Shop B",
      zoneId: zoneB.id,
      commissionPlanId: percentPlan.id,
      addressLabel: "Mbezi Affiliate Collection Point",
      contactPhone: "+255700000202",
    },
  });

  const affiliateStaffAUser = await prisma.user.create({
    data: {
      email: "affiliate.staff.shopa@mimo.local",
      fullName: "Affiliate Shop A Staff",
      role: UserRole.AFFILIATE_STAFF,
    },
  });

  const affiliateStaffBUser = await prisma.user.create({
    data: {
      email: "affiliate.staff.shopb@mimo.local",
      fullName: "Affiliate Shop B Staff",
      role: UserRole.AFFILIATE_STAFF,
    },
  });

  await prisma.affiliateStaffProfile.create({
    data: {
      userId: affiliateStaffAUser.id,
      affiliateShopId: shopA.id,
      jobTitle: "Counter Staff",
    },
  });

  await prisma.affiliateStaffProfile.create({
    data: {
      userId: affiliateStaffBUser.id,
      affiliateShopId: shopB.id,
      jobTitle: "Counter Staff",
    },
  });

  const driverAUser = await prisma.user.create({
    data: {
      email: "driver.a@mimo.local",
      fullName: "Driver A",
      role: UserRole.DRIVER,
    },
  });

  const driverBUser = await prisma.user.create({
    data: {
      email: "driver.b@mimo.local",
      fullName: "Driver B",
      role: UserRole.DRIVER,
    },
  });

  const driverA = await prisma.driverProfile.create({
    data: {
      userId: driverAUser.id,
      homeZoneId: zoneA.id,
      phone: "+255700100001",
      vehicleType: VehicleType.MOTORBIKE,
      vehiclePlate: "T123 ABC",
      isActive: true,
      availabilityStatus: DriverAvailabilityStatus.AVAILABLE,
      lastStatusAt: new Date(),
    },
  });

  const driverB = await prisma.driverProfile.create({
    data: {
      userId: driverBUser.id,
      homeZoneId: zoneB.id,
      phone: "+255700100002",
      vehicleType: VehicleType.CAR,
      vehiclePlate: "T456 DEF",
      isActive: true,
      availabilityStatus: DriverAvailabilityStatus.ON_TRIP,
      lastStatusAt: new Date(),
    },
  });

  const apiOrderA = await prisma.order.create({
    data: {
      orderNumber: "AFF-SHOP-A-API-001",
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: shopA.id,
      channel: OrderChannel.SHOP_DROP,
      tier: OrderTier.STANDARD_48H,
      zoneId: zoneA.id,
      hubId: sinzaHub.id,
      statusCurrent: OrderStatusCurrent.CREATED,
      customerName: "API Customer A",
      customerPhone: "+255711100001",
      notes: "Created via affiliate API",
    },
  });

  const orderA = await prisma.order.create({
    data: {
      orderNumber: "AFF-SHOP-A-001",
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: shopA.id,
      channel: OrderChannel.SHOP_DROP,
      tier: OrderTier.STANDARD_48H,
      zoneId: zoneA.id,
      hubId: sinzaHub.id,
      statusCurrent: OrderStatusCurrent.CREATED,
      customerName: "Shop A Walk-in Customer",
      customerPhone: "+255711000001",
      notes: "Seeded affiliate order for SHOP-A",
    },
  });

  const orderB = await prisma.order.create({
    data: {
      orderNumber: "AFF-SHOP-B-001",
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: shopB.id,
      channel: OrderChannel.SHOP_DROP,
      tier: OrderTier.STANDARD_48H,
      zoneId: zoneB.id,
      hubId: mbeziHub.id,
      statusCurrent: OrderStatusCurrent.CREATED,
      customerName: "Shop B Walk-in Customer",
      customerPhone: "+255711000002",
      notes: "Seeded affiliate order for SHOP-B",
    },
  });

  const apiOrderABag = await prisma.bag.create({
    data: {
      orderId: apiOrderA.id,
      tagCode: "BAG-AFF-SHOP-A-API-001",
      bagStatus: "CREATED",
    },
  });

  const orderABag = await prisma.bag.create({
    data: {
      orderId: orderA.id,
      tagCode: "BAG-AFF-SHOP-A-001",
      bagStatus: "CREATED",
    },
  });

  const orderBBag = await prisma.bag.create({
    data: {
      orderId: orderB.id,
      tagCode: "BAG-AFF-SHOP-B-001",
      bagStatus: "CREATED",
    },
  });

  const apiOrderAEvent = await prisma.orderEvent.create({
    data: {
      orderId: apiOrderA.id,
      eventType: OrderEventType.ORDER_CREATED,
      actorRole: "SYSTEM",
      notes: "Initial order creation event",
      payloadJson: { source: "seed", orderNumber: apiOrderA.orderNumber },
    },
  });

  const orderAEvent = await prisma.orderEvent.create({
    data: {
      orderId: orderA.id,
      eventType: OrderEventType.ORDER_CREATED,
      actorRole: "AFFILIATE_STAFF",
      notes: "Affiliate shop created order",
      payloadJson: { source: "seed", orderNumber: orderA.orderNumber },
    },
  });

  const orderBEvent = await prisma.orderEvent.create({
    data: {
      orderId: orderB.id,
      eventType: OrderEventType.ORDER_CREATED,
      actorRole: "AFFILIATE_STAFF",
      notes: "Affiliate shop created order",
      payloadJson: { source: "seed", orderNumber: orderB.orderNumber },
    },
  });

  const orderAIssue = await prisma.orderIssue.create({
    data: {
      orderId: orderA.id,
      type: OrderIssueType.DELAY,
      status: OrderIssueStatus.OPEN,
      description: "Customer informed of expected delay for delivery window.",
    },
  });

  const tripA = await prisma.trip.create({
    data: {
      type: TripType.PICKUP,
      zoneId: zoneA.id,
      hubId: sinzaHub.id,
      driverId: driverA.id,
      status: TripStatus.PLANNED,
      scheduledFor: new Date(),
    },
  });

  const tripB = await prisma.trip.create({
    data: {
      type: TripType.DELIVERY,
      zoneId: zoneB.id,
      hubId: mbeziHub.id,
      driverId: driverB.id,
      status: TripStatus.IN_PROGRESS,
      scheduledFor: new Date(),
      startedAt: new Date(),
    },
  });

  await prisma.tripStop.create({
    data: {
      tripId: tripA.id,
      orderId: orderA.id,
      stopType: TripStopType.PICKUP,
      sequence: 1,
      status: TripStopStatus.PENDING,
      notes: "Pickup from Affiliate Shop A",
    },
  });

  await prisma.tripStop.create({
    data: {
      tripId: tripB.id,
      orderId: orderB.id,
      stopType: TripStopType.DROPOFF,
      sequence: 1,
      status: TripStopStatus.DONE,
      notes: "Deliver to customer in Zone B",
    },
  });

  console.log("Seed complete");
  console.log({
    zones: [zoneA.name, zoneB.name],
    hubs: [sinzaHub.name, mbeziHub.name],
    hubStaffUsers: [hubStaffSinzaUser.email, hubStaffMbeziUser.email],
    commissionPlans: [fixedPlan.name, percentPlan.name],
    affiliateShops: [shopA.code, shopB.code],
    affiliateStaffUsers: [affiliateStaffAUser.email, affiliateStaffBUser.email],
    orders: [apiOrderA.orderNumber, orderA.orderNumber, orderB.orderNumber],
    bags: [apiOrderABag.tagCode, orderABag.tagCode, orderBBag.tagCode],
    events: [apiOrderAEvent.eventType, orderAEvent.eventType, orderBEvent.eventType],
    issues: [orderAIssue.type],
    drivers: [driverAUser.email, driverBUser.email],
    trips: [tripA.id, tripB.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
