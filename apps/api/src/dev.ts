import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import http from "node:http";

const repoRootEnvPath = path.resolve(process.cwd(), ".env");
const serviceEnvPath = path.resolve(process.cwd(), "apps/api/.env");
const localServiceEnvPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(serviceEnvPath)) {
  dotenv.config({ path: serviceEnvPath, override: true });
} else if (fs.existsSync(localServiceEnvPath)) {
  dotenv.config({ path: localServiceEnvPath, override: true });
} else if (fs.existsSync(repoRootEnvPath)) {
  dotenv.config({ path: repoRootEnvPath, override: true });
}

import crypto from "node:crypto";
import { URL } from "node:url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/mimo_laundry_os?schema=public";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const DATABASE_URL_SAFE = DATABASE_URL.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
console.log("[mimo-api] DATABASE_URL =", DATABASE_URL_SAFE);

type PricingBreakdownInput = {
  orderId: string;
  channel: "DOOR" | "SHOP_DROP" | "HYBRID";
  tier: "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY";
  zoneId: string;
  pricingPlanId: string;
  estimatedWeightKg?: number | null;
  actualWeightKg?: number | null;
  itemEntries?: Array<{ itemCode: string; quantity: number }> | null;
};

type ComputedLineItem = {
  type: "CHARGE" | "DISCOUNT";
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  metaJson: Record<string, unknown>;
};

function parseNumeric(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function roundMoney(value: number): number {
  return Math.round(value);
}

async function _getActivePricingPlanForChannel(
  channel: "DOOR" | "SHOP_DROP" | "HYBRID"
): Promise<{ id: string; effectiveFrom: string | null }> {
  const result = await pool.query(
    `
    SELECT
      p."id",
      p."effectiveFrom"
    FROM "PricingPlan" p
    INNER JOIN "PricingPlanChannel" pc ON pc."planId" = p."id"
    WHERE p."status" = 'ACTIVE'
      AND pc."channel" = $1::"OrderChannel"
      AND (p."effectiveFrom" IS NULL OR p."effectiveFrom" <= NOW())
      AND (p."effectiveTo" IS NULL OR p."effectiveTo" > NOW())
    ORDER BY p."effectiveFrom" DESC NULLS LAST, p."createdAt" DESC
    LIMIT 1
    `,
    [channel]
  );

  if (result.rows.length === 0) {
    throw new Error(`No active pricing plan found for channel ${channel}`);
  }

  return {
    id: String(result.rows[0].id),
    effectiveFrom: result.rows[0].effectiveFrom ?? null,
  };
}

async function getKgRate(
  planId: string,
  tier: string,
  serviceType: string
): Promise<number | null> {
  const result = await pool.query(
    `
    SELECT "pricePerKgTzs"
    FROM "KgRate"
    WHERE "planId" = $1
      AND "tier" = $2::"OrderTier"
      AND "serviceType" = $3::"PricingServiceType"
    LIMIT 1
    `,
    [planId, tier, serviceType]
  );

  if (result.rows.length === 0) return null;
  return Number(result.rows[0].pricePerKgTzs ?? 0);
}

async function getItemRatesMap(planId: string, tier: string): Promise<Map<string, number>> {
  const result = await pool.query(
    `
    SELECT "itemCode", "priceTzs"
    FROM "ItemRate"
    WHERE "planId" = $1
      AND "tier" = $2::"OrderTier"
    `,
    [planId, tier]
  );

  const map = new Map<string, number>();
  for (const row of result.rows) {
    const itemCode = getString(row, "itemCode", "itemcode");
    if (itemCode) {
      map.set(itemCode, Number(row.priceTzs ?? 0));
    }
  }
  return map;
}

async function getDeliveryZoneFee(
  planId: string,
  zoneId: string
): Promise<{ doorFeeTzs: number; freeThresholdTzs: number | null } | null> {
  const result = await pool.query(
    `
    SELECT "doorFeeTzs", "freeThresholdTzs"
    FROM "DeliveryZoneFee"
    WHERE "planId" = $1
      AND "zoneId" = $2
    LIMIT 1
    `,
    [planId, zoneId]
  );

  if (result.rows.length === 0) return null;

  return {
    doorFeeTzs: Number(result.rows[0].doorFeeTzs ?? 0),
    freeThresholdTzs:
      result.rows[0].freeThresholdTzs === null || result.rows[0].freeThresholdTzs === undefined
        ? null
        : Number(result.rows[0].freeThresholdTzs),
  };
}

async function getMinimumChargeRule(
  planId: string,
  tier: string,
  channel: "DOOR" | "SHOP_DROP" | "HYBRID"
): Promise<number | null> {
  const specific = await pool.query(
    `
    SELECT "minimumTzs"
    FROM "MinimumChargeRule"
    WHERE "planId" = $1
      AND "tier" = $2::"OrderTier"
      AND "channel" = $3::"OrderChannel"
    LIMIT 1
    `,
    [planId, tier, channel]
  );

  if (specific.rows.length > 0) {
    return Number(specific.rows[0].minimumTzs ?? 0);
  }

  const generic = await pool.query(
    `
    SELECT "minimumTzs"
    FROM "MinimumChargeRule"
    WHERE "planId" = $1
      AND "tier" = $2::"OrderTier"
      AND "channel" IS NULL
    LIMIT 1
    `,
    [planId, tier]
  );

  if (generic.rows.length > 0) {
    return Number(generic.rows[0].minimumTzs ?? 0);
  }

  return null;
}

async function computeOrderPricingBreakdown(input: PricingBreakdownInput): Promise<{
  lineItems: ComputedLineItem[];
  subtotal: number;
  deliveryTotal: number;
  discountTotal: number;
  grandTotal: number;
  balanceDue: number;
  inputsJson: Record<string, unknown>;
}> {
  const lineItems: ComputedLineItem[] = [];
  const itemEntries = Array.isArray(input.itemEntries) ? input.itemEntries : [];
  const chargeWeightKg =
    input.actualWeightKg !== null && input.actualWeightKg !== undefined
      ? Number(input.actualWeightKg)
      : input.estimatedWeightKg !== null && input.estimatedWeightKg !== undefined
        ? Number(input.estimatedWeightKg)
        : 1;

  const normalizedWeightKg = chargeWeightKg > 0 ? chargeWeightKg : 1;

  const washRate = await getKgRate(input.pricingPlanId, input.tier, "WASH_DRY_FOLD");
  if (washRate !== null) {
    lineItems.push({
      type: "CHARGE",
      description: "Wash + Dry + Fold",
      quantity: normalizedWeightKg,
      unitPrice: washRate,
      amount: roundMoney(normalizedWeightKg * washRate),
      metaJson: {
        pricingPlanId: input.pricingPlanId,
        tier: input.tier,
        serviceType: "WASH_DRY_FOLD",
        pricingBasis:
          input.actualWeightKg !== null && input.actualWeightKg !== undefined
            ? "ACTUAL_KG"
            : "ESTIMATED_KG",
      },
    });
  }

  const itemRateMap = await getItemRatesMap(input.pricingPlanId, input.tier);
  for (const entry of itemEntries) {
    const itemCode = String(entry.itemCode ?? "").trim();
    const quantity = Number(entry.quantity ?? 0);
    const unitPrice = itemRateMap.get(itemCode);

    if (!itemCode || !Number.isFinite(quantity) || quantity <= 0 || unitPrice === undefined) {
      continue;
    }

    lineItems.push({
      type: "CHARGE",
      description: itemCode.replace(/_/g, " "),
      quantity,
      unitPrice,
      amount: roundMoney(quantity * unitPrice),
      metaJson: {
        pricingPlanId: input.pricingPlanId,
        tier: input.tier,
        itemCode,
      },
    });
  }

  let subtotal = lineItems
    .filter((item) => item.type === "CHARGE")
    .reduce((sum, item) => sum + item.amount, 0);

  const minimumCharge = await getMinimumChargeRule(input.pricingPlanId, input.tier, input.channel);
  if (minimumCharge !== null && subtotal < minimumCharge) {
    const adjustment = minimumCharge - subtotal;
    lineItems.push({
      type: "CHARGE",
      description: "Minimum order adjustment",
      quantity: 1,
      unitPrice: adjustment,
      amount: adjustment,
      metaJson: {
        pricingPlanId: input.pricingPlanId,
        tier: input.tier,
        channel: input.channel,
        ruleType: "MINIMUM_CHARGE",
      },
    });
    subtotal += adjustment;
  }

  let deliveryTotal = 0;
  if (input.channel === "DOOR" || input.channel === "HYBRID") {
    const deliveryRule = await getDeliveryZoneFee(input.pricingPlanId, input.zoneId);
    if (deliveryRule) {
      const threshold = deliveryRule.freeThresholdTzs;
      const fee = threshold !== null && subtotal >= threshold ? 0 : deliveryRule.doorFeeTzs;

      if (fee > 0) {
        lineItems.push({
          type: "CHARGE",
          description: input.channel === "DOOR" ? "Door delivery fee" : "Return delivery fee",
          quantity: 1,
          unitPrice: fee,
          amount: fee,
          metaJson: {
            pricingPlanId: input.pricingPlanId,
            zoneId: input.zoneId,
            channel: input.channel,
            ruleType: "DELIVERY_ZONE_FEE",
          },
        });
      }

      deliveryTotal = fee;
    }
  }

  const discountTotal = lineItems
    .filter((item) => item.type === "DISCOUNT")
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const grandTotal = subtotal + deliveryTotal - discountTotal;
  const balanceDue = grandTotal;

  return {
    lineItems,
    subtotal,
    deliveryTotal,
    discountTotal,
    grandTotal,
    balanceDue,
    inputsJson: {
      estimatedWeightKg: input.estimatedWeightKg ?? null,
      actualWeightKg: input.actualWeightKg ?? null,
      itemEntries,
      channel: input.channel,
      tier: input.tier,
      zoneId: input.zoneId,
      pricingPlanId: input.pricingPlanId,
    },
  };
}

async function replaceOrderPricingState(params: {
  orderId: string;
  pricingPlanId: string;
  pricingPlanEffectiveFrom: string | null;
  quoteStatus: "ESTIMATED" | "FINALIZED";
  quotedAt?: boolean;
  finalizedAt?: boolean;
  inputsJson: Record<string, unknown>;
  lineItems: ComputedLineItem[];
  subtotal: number;
  deliveryTotal: number;
  discountTotal: number;
  grandTotal: number;
  balanceDue: number;
}): Promise<void> {
  await pool.query(`DELETE FROM "OrderLineItem" WHERE "orderId" = $1`, [params.orderId]);

  for (const item of params.lineItems) {
    await pool.query(
      `
      INSERT INTO "OrderLineItem" (
        "id", "orderId", "type", "description", "quantity", "unitPrice", "amount", "metaJson", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3::"OrderLineItemType", $4, $5, $6, $7, $8::jsonb, NOW(), NOW())
      `,
      [
        crypto.randomUUID(),
        params.orderId,
        item.type,
        item.description,
        item.quantity,
        item.unitPrice,
        item.amount,
        JSON.stringify(item.metaJson),
      ]
    );
  }

  await pool.query(
    `
    INSERT INTO "OrderPricingSnapshot" (
      "id", "orderId", "pricingPlanId", "pricingPlanEffectiveFrom", "quoteStatus",
      "quotedAt", "finalizedAt", "inputsJson", "createdAt", "updatedAt"
    )
    VALUES (
      $1, $2, $3, $4, $5::"OrderPricingQuoteStatus",
      CASE WHEN $6 THEN NOW() ELSE NULL END,
      CASE WHEN $7 THEN NOW() ELSE NULL END,
      $8::jsonb, NOW(), NOW()
    )
    ON CONFLICT ("orderId")
    DO UPDATE SET
      "pricingPlanId" = EXCLUDED."pricingPlanId",
      "pricingPlanEffectiveFrom" = EXCLUDED."pricingPlanEffectiveFrom",
      "quoteStatus" = EXCLUDED."quoteStatus",
      "quotedAt" = CASE
        WHEN EXCLUDED."quoteStatus" = 'ESTIMATED' THEN COALESCE("OrderPricingSnapshot"."quotedAt", NOW())
        ELSE COALESCE("OrderPricingSnapshot"."quotedAt", EXCLUDED."quotedAt", NOW())
      END,
      "finalizedAt" = CASE
        WHEN EXCLUDED."quoteStatus" = 'FINALIZED' THEN NOW()
        ELSE "OrderPricingSnapshot"."finalizedAt"
      END,
      "inputsJson" = EXCLUDED."inputsJson",
      "updatedAt" = NOW()
    `,
    [
      crypto.randomUUID(),
      params.orderId,
      params.pricingPlanId,
      params.pricingPlanEffectiveFrom,
      params.quoteStatus,
      params.quotedAt === true,
      params.finalizedAt === true,
      JSON.stringify(params.inputsJson),
    ]
  );

  await pool.query(
    `
    INSERT INTO "OrderTotals" (
      "id", "orderId", "subtotal", "deliveryTotal", "discountTotal", "grandTotal", "balanceDue", "createdAt", "updatedAt"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    ON CONFLICT ("orderId")
    DO UPDATE SET
      "subtotal" = EXCLUDED."subtotal",
      "deliveryTotal" = EXCLUDED."deliveryTotal",
      "discountTotal" = EXCLUDED."discountTotal",
      "grandTotal" = EXCLUDED."grandTotal",
      "balanceDue" = EXCLUDED."balanceDue",
      "updatedAt" = NOW()
    `,
    [
      crypto.randomUUID(),
      params.orderId,
      params.subtotal,
      params.deliveryTotal,
      params.discountTotal,
      params.grandTotal,
      params.balanceDue,
    ]
  );
}
const PORT = Number(process.env.PORT ?? 3001);
const APP_VERSION = process.env.npm_package_version ?? "0.0.1";
const RAW_ENVIRONMENT = process.env.APP_ENV ?? process.env.NODE_ENV ?? "local";
const ENVIRONMENT = RAW_ENVIRONMENT === "development" ? "local" : RAW_ENVIRONMENT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "dev-access-secret-change-me";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "dev-refresh-secret-change-me";
const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

type Role = "CUSTOMER" | "AFFILIATE_STAFF" | "DRIVER" | "HUB_STAFF" | "ADMIN" | "DEV_ADMIN";

type AuthenticatedUser = {
  id: string;
  phone: string;
  email: string | null;
  fullName: string;
  role: Role;
  status: string;
};

type ScopeContext = {
  userId: string;
  role: Role;
  affiliateShopId: string | null;
  driverId: string | null;
  hubId: string | null;
};

function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

function json(res: http.ServerResponse, statusCode: number, payload: unknown) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function maskPhone(phone: string | null | undefined) {
  if (!phone) return null;
  if (phone.length <= 4) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

function maskBagTagCode(tagCode: string | null | undefined) {
  if (!tagCode) return null;
  if (tagCode.length <= 4) return tagCode;
  return `${tagCode.slice(0, 4)}***${tagCode.slice(-2)}`;
}

function hashDeliveryOtp(otp: string) {
  return crypto.createHash("sha256").update(`delivery-otp:${otp}`).digest("hex");
}

function generateDeliveryOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sendError(
  res: http.ServerResponse,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) {
  json(res, statusCode, {
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (!/^\+255\d{9}$/.test(trimmed)) {
    throw new Error("Phone number must be in +255XXXXXXXXX format");
  }
  return trimmed;
}

function assertOrderChannel(value: string) {
  const allowed = ["DOOR", "SHOP_DROP", "HYBRID"];
  if (!allowed.includes(value)) {
    throw new Error("channel must be one of DOOR, SHOP_DROP, HYBRID");
  }
  return value as "DOOR" | "SHOP_DROP" | "HYBRID";
}

function assertTripType(value: string) {
  const allowed = ["PICKUP", "DELIVERY"];
  if (!allowed.includes(value)) {
    throw new Error("type must be one of PICKUP, DELIVERY");
  }
  return value as "PICKUP" | "DELIVERY";
}

function assertTripStopType(value: string) {
  const allowed = ["PICKUP", "DROPOFF"];
  if (!allowed.includes(value)) {
    throw new Error("stopType must be one of PICKUP, DROPOFF");
  }
  return value as "PICKUP" | "DROPOFF";
}

function assertOrderTier(value: string) {
  const allowed = ["STANDARD_48H", "EXPRESS_24H", "SAME_DAY"];
  if (!allowed.includes(value)) {
    throw new Error("tier must be one of STANDARD_48H, EXPRESS_24H, SAME_DAY");
  }
  return value as "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY";
}

function nextOrderNumber() {
  return `ORD-${Date.now()}`;
}

function nextBagTagCode() {
  return `BAG-${Date.now()}`;
}

async function seedChartOfAccounts() {
  const accounts = [
    { id: "acct_1000_cash_on_hand", code: "1000", name: "Cash on Hand", type: "ASSET" },
    {
      id: "acct_1010_mobile_money_clearing",
      code: "1010",
      name: "Mobile Money Clearing",
      type: "ASSET",
    },
    {
      id: "acct_1100_accounts_receivable",
      code: "1100",
      name: "Accounts Receivable",
      type: "ASSET",
    },
    {
      id: "acct_2000_affiliate_commissions_payable",
      code: "2000",
      name: "Affiliate Commissions Payable",
      type: "LIABILITY",
    },
    {
      id: "acct_2010_customer_credits_payable",
      code: "2010",
      name: "Customer Credits Payable",
      type: "LIABILITY",
    },
    {
      id: "acct_4000_laundry_service_revenue",
      code: "4000",
      name: "Laundry Service Revenue",
      type: "REVENUE",
    },
    { id: "acct_4010_delivery_revenue", code: "4010", name: "Delivery Revenue", type: "REVENUE" },
    { id: "acct_4020_addons_revenue", code: "4020", name: "Add-ons Revenue", type: "REVENUE" },
    {
      id: "acct_4900_discounts_promotions",
      code: "4900",
      name: "Discounts / Promotions",
      type: "EXPENSE",
    },
    { id: "acct_5000_payment_fees", code: "5000", name: "Payment Fees", type: "EXPENSE" },
    { id: "acct_5100_refund_expense", code: "5100", name: "Refund Expense", type: "EXPENSE" },
    {
      id: "acct_5200_affiliate_commission_expense",
      code: "5200",
      name: "Affiliate Commission Expense",
      type: "EXPENSE",
    },
  ];

  for (const account of accounts) {
    await pool.query(
      `
      INSERT INTO "Account" ("id", "code", "name", "type", "isActive", "createdAt")
      VALUES ($1, $2, $3, $4::"AccountType", TRUE, NOW())
      ON CONFLICT ("code")
      DO UPDATE SET
        "name" = EXCLUDED."name",
        "type" = EXCLUDED."type",
        "isActive" = TRUE
      `,
      [account.id, account.code, account.name, account.type]
    );
  }
}
function formatMoneyTzs(amount: number) {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getOrderLedgerSummary(orderId: string): Promise<{
  grandTotal: number;
  paymentsRecorded: number;
  refundsIssued: number;
  creditsNet: number;
  balanceDue: number;
}> {
  const totalsResult = await pool.query(
    `
    SELECT "grandTotal"
    FROM "OrderTotals"
    WHERE "orderId" = $1
    LIMIT 1
    `,
    [orderId]
  );

  const grandTotal = Number(totalsResult.rows[0]?.grandTotal ?? 0);

  const paymentResult = await pool.query(
    `
    SELECT COALESCE(SUM("amountTzs"), 0) AS total
    FROM "Payment"
    WHERE "orderId" = $1
      AND "status" = 'RECORDED'
    `,
    [orderId]
  );

  const refundResult = await pool.query(
    `
    SELECT COALESCE(SUM("amountTzs"), 0) AS total
    FROM "Refund"
    WHERE "orderId" = $1
      AND "status" = 'ISSUED'
    `,
    [orderId]
  );

  const creditResult = await pool.query(
    `
    SELECT COALESCE(SUM("amountTzs"), 0) AS total
    FROM "CustomerCreditLedger"
    WHERE "orderId" = $1
    `,
    [orderId]
  );

  const paymentsRecorded = Number(paymentResult.rows[0]?.total ?? 0);
  const refundsIssued = Number(refundResult.rows[0]?.total ?? 0);
  const creditsNet = Number(creditResult.rows[0]?.total ?? 0);
  const balanceDue = grandTotal - paymentsRecorded + refundsIssued - creditsNet;

  return {
    grandTotal,
    paymentsRecorded,
    refundsIssued,
    creditsNet,
    balanceDue,
  };
}

async function syncOrderBalanceDue(orderId: string): Promise<number> {
  const ledger = await getOrderLedgerSummary(orderId);

  await pool.query(
    `
    UPDATE "OrderTotals"
    SET "balanceDue" = $2,
        "updatedAt" = NOW()
    WHERE "orderId" = $1
    `,
    [orderId, ledger.balanceDue]
  );

  return ledger.balanceDue;
}

async function evaluateCommissionEligibility(params: {
  orderId: string;
  actorUserId?: string | null;
  actorRole?: string | null;
  requestMeta?: {
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}) {
  const orderResult = await pool.query(
    `
    SELECT
      o."id",
      o."orderNumber",
      o."sourceType",
      o."affiliateShopId",
      o."statusCurrent",
      o."channel",
      o."tier",
      o."zoneId",
      ot."subtotal",
      ot."deliveryTotal",
      ot."discountTotal",
      ot."grandTotal",
      ot."balanceDue",
      s."commissionPlanId",
      cp."id" AS "planId",
      cp."type" AS "planType",
      cp."fixedAmountTzs",
      cp."percentRate",
      cp."percentageBps",
      cp."includeDeliveryInPercent"
    FROM "Order" o
    LEFT JOIN "OrderTotals" ot ON ot."orderId" = o."id"
    LEFT JOIN "AffiliateShop" s ON s."id" = o."affiliateShopId"
    LEFT JOIN "CommissionPlan" cp ON cp."id" = s."commissionPlanId"
    WHERE o."id" = $1
    LIMIT 1
    `,
    [params.orderId]
  );

  if (orderResult.rows.length === 0) {
    return { eligible: false, reason: "ORDER_NOT_FOUND" as const };
  }

  const order = orderResult.rows[0];
  const sourceType = getString(order, "sourceType", "sourcetype");
  const affiliateShopId = getString(order, "affiliateShopId", "affiliateshopid");
  const statusCurrent = getString(order, "statusCurrent", "statuscurrent");
  const planId = getString(order, "planId", "planid");
  const planType = getString(order, "planType", "plantype");

  if (sourceType !== "AFFILIATE" || !affiliateShopId) {
    return { eligible: false, reason: "NOT_AFFILIATE_ORDER" as const };
  }

  const ledger = await getOrderLedgerSummary(params.orderId);
  const isDelivered = statusCurrent === "DELIVERED";
  const isPaid = ledger.balanceDue <= 0 && ledger.paymentsRecorded > 0;

  if (!isDelivered || !isPaid) {
    return {
      eligible: false,
      reason: "NOT_DELIVERED_AND_PAID" as const,
      isDelivered,
      isPaid,
    };
  }

  if (!planId || !planType) {
    return { eligible: false, reason: "COMMISSION_PLAN_NOT_FOUND" as const };
  }

  const existingEntry = await pool.query(
    `
    SELECT "id", "status", "amountTzs"
    FROM "CommissionLedgerEntry"
    WHERE "orderId" = $1
    LIMIT 1
    `,
    [params.orderId]
  );

  if (existingEntry.rows.length > 0) {
    return {
      eligible: true,
      created: false,
      reason: "ALREADY_EXISTS" as const,
      ledgerEntry: existingEntry.rows[0],
    };
  }

  const subtotal = Number(order.subtotal ?? 0);
  const deliveryTotal = Number(order.deliveryTotal ?? 0);
  const fixedAmountTzs = order.fixedAmountTzs === null ? null : Number(order.fixedAmountTzs);
  const percentRate = order.percentRate === null ? null : Number(order.percentRate);
  const percentageBps = order.percentageBps === null ? null : Number(order.percentageBps);
  const includeDeliveryInPercent =
    order.includeDeliveryInPercent === true || order.includedeliveryinpercent === true;

  let baseAmountTzs: number | null = null;
  let rate: number | null = null;
  let amountTzs = 0;
  let calculationType: "FIXED_PER_ORDER" | "PERCENT_OF_SERVICE";

  if (planType === "FIXED_PER_ORDER") {
    calculationType = "FIXED_PER_ORDER";
    amountTzs = fixedAmountTzs ?? 0;
  } else {
    calculationType = "PERCENT_OF_SERVICE";
    baseAmountTzs = includeDeliveryInPercent ? subtotal + deliveryTotal : subtotal;
    rate = percentRate ?? percentageBps ?? 0;
    amountTzs = Math.round((baseAmountTzs * rate) / 10000);
  }

  await pool.query("BEGIN");
  try {
    const ledgerEntryId = crypto.randomUUID();

    await pool.query(
      `
      INSERT INTO "CommissionLedgerEntry" (
        "id",
        "affiliateShopId",
        "orderId",
        "planId",
        "calculationType",
        "baseAmountTzs",
        "rate",
        "amountTzs",
        "status",
        "earnedAt",
        "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5::"CommissionCalculationType", $6, $7, $8, 'EARNED', NOW(), NOW())
      ON CONFLICT ("orderId") DO NOTHING
      `,
      [
        ledgerEntryId,
        affiliateShopId,
        params.orderId,
        planId,
        calculationType,
        baseAmountTzs,
        rate,
        amountTzs,
      ]
    );

    const inserted = await pool.query(
      `
      SELECT "id", "amountTzs", "status"
      FROM "CommissionLedgerEntry"
      WHERE "orderId" = $1
      LIMIT 1
      `,
      [params.orderId]
    );

    const finalEntry = inserted.rows[0];

    await postCommissionJournalIfMissing({
      commissionLedgerEntryId: String(finalEntry?.id ?? ledgerEntryId),
      amountTzs: Number(finalEntry?.amountTzs ?? amountTzs),
      orderId: params.orderId,
      createdByUserId: params.actorUserId ?? null,
    });

    await pool.query(
      `
      INSERT INTO "OrderEvent" (
        "id", "orderId", "eventType", "occurredAt", "actorUserId",
        "actorRole", "notes", "payloadJson", "createdAt"
      )
      VALUES (
        $1, $2, 'PAYMENT_DUE', NOW(), $3, $4, $5, $6::jsonb, NOW()
      )
      `,
      [
        crypto.randomUUID(),
        params.orderId,
        params.actorUserId ?? null,
        params.actorRole ?? null,
        "Commission earned for affiliate order",
        JSON.stringify({
          actionCode: "COMMISSION_EARNED",
          commissionLedgerEntryId: finalEntry?.id ?? null,
          affiliateShopId,
          planId,
          calculationType,
          baseAmountTzs,
          rate,
          amountTzs: Number(finalEntry?.amountTzs ?? amountTzs),
        }),
      ]
    );

    await recordAudit({
      actorUserId: params.actorUserId ?? null,
      actorRole: params.actorRole ?? null,
      actionCode: "COMMISSION_EARNED_CREATED",
      targetType: "ORDER",
      targetId: params.orderId,
      after: {
        commissionLedgerEntryId: finalEntry?.id ?? null,
        affiliateShopId,
        planId,
        calculationType,
        baseAmountTzs,
        rate,
        amountTzs: Number(finalEntry?.amountTzs ?? amountTzs),
        status: finalEntry?.status ?? "EARNED",
      },
      ...(params.requestMeta ? { requestMeta: params.requestMeta } : {}),
    });

    await pool.query("COMMIT");

    return {
      eligible: true,
      created: true,
      ledgerEntry: finalEntry ?? null,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

type JournalLineInput = {
  accountCode: string;
  debitTzs: number;
  creditTzs: number;
  memo?: string | null;
};

async function getAccountIdByCode(code: string): Promise<string> {
  const result = await pool.query(
    `
    SELECT "id"
    FROM "Account"
    WHERE "code" = $1
      AND "isActive" = TRUE
    LIMIT 1
    `,
    [code]
  );

  if (result.rows.length === 0) {
    throw new Error(`Active account not found for code ${code}`);
  }

  return String(result.rows[0].id);
}

function nextJournalEntryNumber() {
  return `JRN-${Date.now()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
}

async function createJournalEntryIfMissing(params: {
  sourceType: "INVOICE" | "PAYMENT" | "REFUND" | "COMMISSION" | "PAYOUT" | "ADJUSTMENT";
  sourceId: string;
  description: string;
  occurredAt?: string | Date | null;
  createdByUserId?: string | null;
  lines: JournalLineInput[];
}) {
  const existing = await pool.query(
    `
    SELECT "id", "entryNumber"
    FROM "JournalEntry"
    WHERE "sourceType" = $1::"JournalSourceType"
      AND "sourceId" = $2
    LIMIT 1
    `,
    [params.sourceType, params.sourceId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const normalizedLines = params.lines.filter(
    (line) => Number(line.debitTzs ?? 0) > 0 || Number(line.creditTzs ?? 0) > 0
  );

  const totalDebits = normalizedLines.reduce((sum, line) => sum + Number(line.debitTzs ?? 0), 0);
  const totalCredits = normalizedLines.reduce((sum, line) => sum + Number(line.creditTzs ?? 0), 0);

  if (normalizedLines.length === 0) {
    throw new Error(`Journal entry ${params.sourceType}/${params.sourceId} has no lines`);
  }

  if (totalDebits !== totalCredits) {
    throw new Error(
      `Journal entry ${params.sourceType}/${params.sourceId} is unbalanced: debits=${totalDebits} credits=${totalCredits}`
    );
  }

  const journalEntryId = crypto.randomUUID();
  const entryNumber = nextJournalEntryNumber();
  const occurredAt =
    params.occurredAt instanceof Date
      ? params.occurredAt.toISOString()
      : (params.occurredAt ?? new Date().toISOString());

  await pool.query(
    `
    INSERT INTO "JournalEntry" (
      "id", "entryNumber", "description", "sourceType", "sourceId",
      "occurredAt", "createdByUserId", "createdAt"
    )
    VALUES ($1, $2, $3, $4::"JournalSourceType", $5, $6::timestamptz, $7, NOW())
    `,
    [
      journalEntryId,
      entryNumber,
      params.description,
      params.sourceType,
      params.sourceId,
      occurredAt,
      params.createdByUserId ?? null,
    ]
  );

  for (const line of normalizedLines) {
    const accountId = await getAccountIdByCode(line.accountCode);
    await pool.query(
      `
      INSERT INTO "JournalLine" (
        "id", "journalEntryId", "accountId", "debitTzs", "creditTzs", "memo", "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        crypto.randomUUID(),
        journalEntryId,
        accountId,
        Number(line.debitTzs ?? 0),
        Number(line.creditTzs ?? 0),
        line.memo ?? null,
      ]
    );
  }

  return { id: journalEntryId, entryNumber };
}

function classifyInvoiceLineAccount(row: Record<string, unknown>) {
  const description = String(row.description ?? "").toLowerCase();
  const meta =
    row.metaJson && typeof row.metaJson === "object"
      ? (row.metaJson as Record<string, unknown>)
      : {};
  const itemCode = typeof meta.itemCode === "string" ? meta.itemCode : null;
  const ruleType = typeof meta.ruleType === "string" ? meta.ruleType : null;

  if (itemCode) return "4020";
  if (ruleType === "DELIVERY_ZONE_FEE") return "4010";
  if (description.includes("delivery fee")) return "4010";
  return "4000";
}

async function postInvoiceJournalIfMissing(params: {
  orderId: string;
  createdByUserId?: string | null;
}) {
  const orderResult = await pool.query(
    `
    SELECT
      o."id",
      o."orderNumber",
      ot."grandTotal"
    FROM "Order" o
    INNER JOIN "OrderTotals" ot ON ot."orderId" = o."id"
    WHERE o."id" = $1
    LIMIT 1
    `,
    [params.orderId]
  );

  if (orderResult.rows.length === 0) {
    throw new Error("Order not found for invoice journal");
  }

  const lineItemsResult = await pool.query(
    `
    SELECT
      "id",
      "type",
      "description",
      "amount",
      "metaJson"
    FROM "OrderLineItem"
    WHERE "orderId" = $1
    ORDER BY "createdAt" ASC
    `,
    [params.orderId]
  );

  const grandTotal = Number(orderResult.rows[0].grandTotal ?? 0);
  const revenueCredits = new Map<string, number>();
  let discountDebit = 0;

  for (const row of lineItemsResult.rows as Array<Record<string, unknown>>) {
    const type = String(row.type ?? "");
    const amount = Number(row.amount ?? 0);

    if (type === "DISCOUNT") {
      discountDebit += Math.abs(amount);
      continue;
    }

    const accountCode = classifyInvoiceLineAccount(row);
    revenueCredits.set(accountCode, (revenueCredits.get(accountCode) ?? 0) + amount);
  }

  const lines: JournalLineInput[] = [
    {
      accountCode: "1100",
      debitTzs: grandTotal,
      creditTzs: 0,
      memo: `Invoice finalized for order ${String(orderResult.rows[0].orderNumber ?? params.orderId)}`,
    },
  ];

  for (const [accountCode, amount] of revenueCredits.entries()) {
    lines.push({
      accountCode,
      debitTzs: 0,
      creditTzs: amount,
      memo: `Revenue recognition for order ${String(orderResult.rows[0].orderNumber ?? params.orderId)}`,
    });
  }

  if (discountDebit > 0) {
    lines.push({
      accountCode: "4900",
      debitTzs: discountDebit,
      creditTzs: 0,
      memo: `Discounts applied for order ${String(orderResult.rows[0].orderNumber ?? params.orderId)}`,
    });
  }

  return createJournalEntryIfMissing({
    sourceType: "INVOICE",
    sourceId: params.orderId,
    description: `Invoice journal for order ${String(orderResult.rows[0].orderNumber ?? params.orderId)}`,
    createdByUserId: params.createdByUserId ?? null,
    lines,
  });
}

async function postPaymentJournalIfMissing(params: {
  paymentId: string;
  method: "CASH" | "MOBILE_MONEY" | "CARD";
  amountTzs: number;
  orderId: string;
  createdByUserId?: string | null;
}) {
  const debitAccountCode = params.method === "CASH" ? "1000" : "1010";

  return createJournalEntryIfMissing({
    sourceType: "PAYMENT",
    sourceId: params.paymentId,
    description: `Payment journal for order ${params.orderId}`,
    createdByUserId: params.createdByUserId ?? null,
    lines: [
      {
        accountCode: debitAccountCode,
        debitTzs: params.amountTzs,
        creditTzs: 0,
        memo: `${params.method} payment received`,
      },
      {
        accountCode: "1100",
        debitTzs: 0,
        creditTzs: params.amountTzs,
        memo: "Accounts receivable settled",
      },
    ],
  });
}

async function postRefundJournalIfMissing(params: {
  refundId: string;
  method: "CASH" | "MOBILE_MONEY" | "CREDIT";
  amountTzs: number;
  orderId: string;
  createdByUserId?: string | null;
}) {
  const creditAccountCode =
    params.method === "CASH" ? "1000" : params.method === "MOBILE_MONEY" ? "1010" : "2010";

  return createJournalEntryIfMissing({
    sourceType: "REFUND",
    sourceId: params.refundId,
    description: `Refund journal for order ${params.orderId}`,
    createdByUserId: params.createdByUserId ?? null,
    lines: [
      {
        accountCode: "5100",
        debitTzs: params.amountTzs,
        creditTzs: 0,
        memo: "Refund expense recognized",
      },
      {
        accountCode: creditAccountCode,
        debitTzs: 0,
        creditTzs: params.amountTzs,
        memo: `Refund issued via ${params.method}`,
      },
    ],
  });
}

async function postCommissionJournalIfMissing(params: {
  commissionLedgerEntryId: string;
  amountTzs: number;
  orderId: string;
  createdByUserId?: string | null;
}) {
  return createJournalEntryIfMissing({
    sourceType: "COMMISSION",
    sourceId: params.commissionLedgerEntryId,
    description: `Commission accrual for order ${params.orderId}`,
    createdByUserId: params.createdByUserId ?? null,
    lines: [
      {
        accountCode: "5200",
        debitTzs: params.amountTzs,
        creditTzs: 0,
        memo: "Affiliate commission expense accrued",
      },
      {
        accountCode: "2000",
        debitTzs: 0,
        creditTzs: params.amountTzs,
        memo: "Affiliate commissions payable accrued",
      },
    ],
  });
}

async function postPayoutJournalIfMissing(params: {
  payoutId: string;
  paymentMethod: "MOBILE_MONEY" | "CASH" | "BANK";
  totalAmountTzs: number;
  createdByUserId?: string | null;
}) {
  const creditAccountCode = params.paymentMethod === "CASH" ? "1000" : "1010";

  return createJournalEntryIfMissing({
    sourceType: "PAYOUT",
    sourceId: params.payoutId,
    description: `Affiliate payout settlement ${params.payoutId}`,
    createdByUserId: params.createdByUserId ?? null,
    lines: [
      {
        accountCode: "2000",
        debitTzs: params.totalAmountTzs,
        creditTzs: 0,
        memo: "Affiliate commissions payable settled",
      },
      {
        accountCode: creditAccountCode,
        debitTzs: 0,
        creditTzs: params.totalAmountTzs,
        memo: `Payout disbursed via ${params.paymentMethod}`,
      },
    ],
  });
}

function getTodayDateUtcString() {
  return new Date().toISOString().slice(0, 10);
}
function nextReceiptNumber(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const stamp = `${year}${month}${day}`;
  return `RCP-${stamp}-${String(Date.now()).slice(-4)}`;
}
function parseAuthHeader(req: http.IncomingMessage) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}

function getString(row: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string") return value;
  }
  return null;
}

async function readJsonBody(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function signAccessToken(user: { id: string; phone: string; role: Role }) {
  return jwt.sign(
    {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      typ: "access",
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
}

function signRefreshToken(user: { id: string }) {
  return jwt.sign(
    {
      sub: user.id,
      typ: "refresh",
      jti: crypto.randomUUID(),
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL_SECONDS }
  );
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function toUserDto(user: Record<string, unknown>) {
  return {
    id: getString(user, "id"),
    phone: getString(user, "phone"),
    email: getString(user, "email"),
    fullName: getString(user, "fullName", "fullname"),
    role: getString(user, "role"),
    status: getString(user, "status"),
  };
}

async function issueTokens(
  user: { id: string; phone: string; role: Role },
  req: http.IncomingMessage
) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken({ id: user.id });

  await pool.query(
    `
    INSERT INTO "RefreshToken" ("id", "userId", "tokenHash", "createdAt", "expiresAt", "revokedAt", "replacedByTokenId", "userAgent", "ipAddress")
    VALUES ($1, $2, $3, NOW(), $4, NULL, NULL, $5, $6)
    `,
    [
      crypto.randomUUID(),
      user.id,
      hashToken(refreshToken),
      new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
      req.headers["user-agent"]?.toString() ?? null,
      req.socket.remoteAddress ?? null,
    ]
  );

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenExpiresInSeconds: REFRESH_TOKEN_TTL_SECONDS,
  };
}

async function authenticate(req: http.IncomingMessage): Promise<AuthenticatedUser | null> {
  const token = parseAuthHeader(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    if (
      payload.typ !== "access" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    const result = await pool.query(
      `
      SELECT "id", "phone", "email", "fullName", "role", "status"
      FROM public."User"
      WHERE "id" = $1
      LIMIT 1
      `,
      [payload.sub]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as Record<string, unknown>;
    const role = getString(row, "role");
    const status = getString(row, "status");
    const fullName = getString(row, "fullName", "fullname");
    const phone = getString(row, "phone");

    if (!role || !status || !fullName || !phone) return null;
    if (status !== "ACTIVE") return null;
    if (role !== payload.role) return null;

    return {
      id: getString(row, "id") ?? "",
      phone,
      email: getString(row, "email"),
      fullName,
      role: role as Role,
      status,
    };
  } catch {
    return null;
  }
}

async function requireAuth(req: http.IncomingMessage, res: http.ServerResponse) {
  const user = await authenticate(req);
  if (!user) {
    sendError(res, 401, "UNAUTHORIZED", "Bearer access token is required");
    return null;
  }
  return user;
}

function hasAnyRole(user: AuthenticatedUser, roles: Role[]) {
  return roles.includes(user.role);
}

function requireRoles(
  user: AuthenticatedUser,
  res: http.ServerResponse,
  roles: Role[],
  action = "perform this action"
) {
  if (!hasAnyRole(user, roles)) {
    sendError(res, 403, "FORBIDDEN", `Role ${user.role} is not allowed to ${action}`);
    return false;
  }
  return true;
}

async function resolveScope(user: AuthenticatedUser): Promise<ScopeContext> {
  const scope: ScopeContext = {
    userId: user.id,
    role: user.role,
    affiliateShopId: null,
    driverId: null,
    hubId: null,
  };

  if (user.role === "AFFILIATE_STAFF") {
    const result = await pool.query(
      `
      SELECT "affiliateShopId"
      FROM "AffiliateStaffProfile"
      WHERE "userId" = $1 AND "isActive" = TRUE
      LIMIT 1
      `,
      [user.id]
    );
    scope.affiliateShopId = getString(result.rows[0] ?? {}, "affiliateShopId", "affiliateshopid");
  }

  if (user.role === "DRIVER") {
    const result = await pool.query(
      `
      SELECT "id"
      FROM "DriverProfile"
      WHERE "userId" = $1 AND "isActive" = TRUE
      LIMIT 1
      `,
      [user.id]
    );
    scope.driverId = getString(result.rows[0] ?? {}, "id");
  }

  if (user.role === "HUB_STAFF") {
    const result = await pool.query(
      `
      SELECT "hubId"
      FROM "HubStaffProfile"
      WHERE "userId" = $1 AND "isActive" = TRUE
      LIMIT 1
      `,
      [user.id]
    );
    scope.hubId = getString(result.rows[0] ?? {}, "hubId", "hubid");
  }

  return scope;
}

function getRequestMeta(req: http.IncomingMessage) {
  return {
    ipAddress: req.socket.remoteAddress ?? null,
    userAgent: req.headers["user-agent"]?.toString() ?? null,
  };
}

async function recordAudit(input: {
  actorUserId?: string | null;
  actorRole?: string | null;
  actionCode: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  before?: unknown;
  after?: unknown;
  requestMeta?: {
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}) {
  await pool.query(
    `
    INSERT INTO "AuditLog" (
      "id",
      "actorUserId",
      "actorRole",
      "actionCode",
      "targetType",
      "targetId",
      "reason",
      "beforeJson",
      "afterJson",
      "ipAddress",
      "userAgent",
      "occurredAt"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11, NOW())
    `,
    [
      crypto.randomUUID(),
      input.actorUserId ?? null,
      input.actorRole ?? null,
      input.actionCode,
      input.targetType,
      input.targetId,
      input.reason ?? null,
      input.before === undefined ? null : JSON.stringify(input.before),
      input.after === undefined ? null : JSON.stringify(input.after),
      input.requestMeta?.ipAddress ?? null,
      input.requestMeta?.userAgent ?? null,
    ]
  );
}

async function fetchOrderById(orderId: string) {
  const result = await pool.query(
    `
    SELECT
      o."id",
      o."orderNumber",
      o."sourceType",
      o."affiliateShopId",
      o."channel",
      o."customerName",
      o."customerPhone",
      o."notes",
      o."createdAt",
      o."updatedAt",
      o."customerUserId",
      o."tier",
      o."zoneId",
      o."hubId",
      o."pickupAddressId",
      o."dropoffAddressId",
      o."statusCurrent"
    FROM "Order" o
    WHERE o."id" = $1
    LIMIT 1
    `,
    [orderId]
  );

  return result.rows[0] ?? null;
}

async function fetchTripById(tripId: string) {
  const result = await pool.query(
    `
    SELECT
      t."id",
      t."type",
      t."zoneId",
      t."hubId",
      t."driverId",
      t."status",
      t."scheduledFor",
      t."startedAt",
      t."completedAt",
      t."createdAt",
      t."updatedAt"
    FROM "Trip" t
    WHERE t."id" = $1
    LIMIT 1
    `,
    [tripId]
  );

  return result.rows[0] ?? null;
}

async function canReadOrder(user: AuthenticatedUser, scope: ScopeContext, orderId: string) {
  const order = await fetchOrderById(orderId);
  if (!order) {
    return { order: null, allowed: false, reason: "NOT_FOUND" as const };
  }

  if (user.role === "ADMIN" || user.role === "DEV_ADMIN") {
    return { order, allowed: true, reason: "ALLOWED" as const };
  }

  const affiliateShopId = getString(order, "affiliateShopId", "affiliateshopid");
  const customerUserId = getString(order, "customerUserId", "customeruserid");
  const hubId = getString(order, "hubId", "hubid");

  if (user.role === "CUSTOMER") {
    return { order, allowed: customerUserId === user.id, reason: "SCOPED" as const };
  }

  if (user.role === "AFFILIATE_STAFF") {
    return {
      order,
      allowed: !!scope.affiliateShopId && affiliateShopId === scope.affiliateShopId,
      reason: "SCOPED" as const,
    };
  }

  if (user.role === "HUB_STAFF") {
    return { order, allowed: !!scope.hubId && hubId === scope.hubId, reason: "SCOPED" as const };
  }

  if (user.role === "DRIVER") {
    const stopResult = await pool.query(
      `
      SELECT ts."id"
      FROM "TripStop" ts
      INNER JOIN "Trip" t ON t."id" = ts."tripId"
      WHERE ts."orderId" = $1
        AND t."driverId" = $2
      LIMIT 1
      `,
      [orderId, scope.driverId]
    );

    return { order, allowed: stopResult.rows.length > 0, reason: "SCOPED" as const };
  }

  return { order, allowed: false, reason: "SCOPED" as const };
}

async function canReadTrip(user: AuthenticatedUser, scope: ScopeContext, tripId: string) {
  const trip = await fetchTripById(tripId);
  if (!trip) {
    return { trip: null, allowed: false, reason: "NOT_FOUND" as const };
  }

  if (user.role === "ADMIN" || user.role === "DEV_ADMIN") {
    return { trip, allowed: true, reason: "ALLOWED" as const };
  }

  if (user.role === "DRIVER") {
    return {
      trip,
      allowed: !!scope.driverId && getString(trip, "driverId", "driverid") === scope.driverId,
      reason: "SCOPED" as const,
    };
  }

  return { trip, allowed: false, reason: "SCOPED" as const };
}

function pathParam(pathname: string, expression: RegExp) {
  const match = pathname.match(expression);
  return match ? match[1] : null;
}

const server = http.createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (method === "OPTIONS") {
      setCorsHeaders(res);
      res.writeHead(204);
      return res.end();
    }

    if (method === "GET" && url.pathname === "/health") {
      console.log("[login] tokens issued");

      return json(res, 200, { ok: true });
    }

    if (method === "GET" && url.pathname === "/v1/health") {
      try {
        await pool.query("SELECT 1");
        console.log("[login] tokens issued");

        return json(res, 200, {
          status: "ok",
          version: APP_VERSION,
          timestamp: new Date().toISOString(),
          environment: ENVIRONMENT,
          db: "ok",
        });
      } catch {
        console.log("[login] tokens issued");

        return json(res, 200, {
          status: "ok",
          version: APP_VERSION,
          timestamp: new Date().toISOString(),
          environment: ENVIRONMENT,
          db: "down",
        });
      }
    }

    if (method === "GET" && url.pathname === "/v1/health/db") {
      try {
        await pool.query("SELECT 1 AS result");
        console.log("[login] tokens issued");

        return json(res, 200, {
          status: "ok",
          db: "ok",
          timestamp: new Date().toISOString(),
          check: "SELECT 1",
        });
      } catch (error) {
        return sendError(
          res,
          500,
          "DB_DOWN",
          error instanceof Error ? error.message : "Database check failed"
        );
      }
    }

    if (method === "GET" && url.pathname === "/api") {
      setCorsHeaders(res);
      res.writeHead(302, { location: "/api/" });
      return res.end();
    }

    if (method === "GET" && url.pathname === "/api/openapi.json") {
      console.log("[login] tokens issued");

      return json(res, 200, {
        openapi: "3.1.0",
        info: { title: "Mimo API", version: "v1" },
        paths: {
          "/health": {
            get: {
              summary: "Health check",
              responses: {
                200: {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          ok: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "/v1/health": {
            get: {
              summary: "App health",
              responses: {
                200: {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          status: { type: "string", example: "ok" },
                          version: { type: "string", example: "0.0.1" },
                          timestamp: { type: "string", format: "date-time" },
                          environment: { type: "string", example: "local" },
                          db: { type: "string", enum: ["ok", "down"] },
                        },
                        required: ["status", "version", "timestamp", "environment", "db"],
                      },
                    },
                  },
                },
              },
            },
          },
          "/v1/health/db": {
            get: {
              summary: "Database health",
              responses: {
                200: {
                  description: "DB OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          status: { type: "string", example: "ok" },
                          db: { type: "string", example: "ok" },
                          timestamp: { type: "string", format: "date-time" },
                          check: { type: "string", example: "SELECT 1" },
                        },
                        required: ["status", "db", "timestamp", "check"],
                      },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/register": {
            post: {
              summary: "Register customer",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RegisterRequest" },
                  },
                },
              },
              responses: {
                201: {
                  description: "Created",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AuthResponse" },
                    },
                  },
                },
                400: {
                  description: "Validation error",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/StandardError" },
                    },
                  },
                },
                409: {
                  description: "Conflict",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/StandardError" },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/login": {
            post: {
              summary: "Login",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginRequest" },
                  },
                },
              },
              responses: {
                200: {
                  description: "Authenticated",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AuthResponse" },
                    },
                  },
                },
                401: {
                  description: "Invalid credentials",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/StandardError" },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/refresh": {
            post: {
              summary: "Refresh token",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RefreshRequest" },
                  },
                },
              },
              responses: {
                200: {
                  description: "Refreshed",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AuthResponse" },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/logout": {
            post: {
              summary: "Logout",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RefreshRequest" },
                  },
                },
              },
              responses: {
                200: {
                  description: "Logged out",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              loggedOut: { type: "boolean", example: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            LoginRequest: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+255712345678" },
                password: { type: "string", example: "secret123" },
              },
              required: ["phone", "password"],
            },
            RegisterRequest: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+255712345678" },
                fullName: { type: "string", example: "Walking Skeleton Customer" },
                email: {
                  type: "string",
                  format: "email",
                  nullable: true,
                  example: "customer@mimo.local",
                },
                password: { type: "string", example: "secret123" },
              },
              required: ["phone", "fullName", "password"],
            },
            RefreshRequest: {
              type: "object",
              properties: {
                refreshToken: { type: "string", example: "refresh-token" },
              },
              required: ["refreshToken"],
            },
            AuthUser: {
              type: "object",
              properties: {
                id: { type: "string" },
                phone: { type: "string" },
                email: { type: "string", nullable: true },
                fullName: { type: "string" },
                role: { type: "string" },
                status: { type: "string" },
              },
              required: ["id", "phone", "fullName", "role", "status"],
            },
            AuthTokens: {
              type: "object",
              properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
                accessTokenExpiresInSeconds: { type: "number" },
                refreshTokenExpiresInSeconds: { type: "number" },
              },
              required: [
                "accessToken",
                "refreshToken",
                "accessTokenExpiresInSeconds",
                "refreshTokenExpiresInSeconds",
              ],
            },
            AuthResponse: {
              type: "object",
              properties: {
                data: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/AuthUser" },
                    tokens: { $ref: "#/components/schemas/AuthTokens" },
                  },
                  required: ["user", "tokens"],
                },
              },
              required: ["data"],
            },
            StandardError: {
              type: "object",
              properties: {
                error: {
                  type: "object",
                  properties: {
                    code: { type: "string" },
                    message: { type: "string" },
                  },
                  required: ["code", "message"],
                },
              },
              required: ["error"],
            },
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/auth/register") {
      const body = await readJsonBody(req);
      const phone = normalizePhone(String(body.phone ?? ""));
      const fullName = String(body.fullName ?? "").trim();
      const password = String(body.password ?? "");
      const email = body.email ? String(body.email).trim() : null;

      if (!fullName || password.length < 6) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "fullName is required and password must be at least 6 characters"
        );
      }

      const existing = await pool.query(
        `
        SELECT "id"
        FROM public."User"
        WHERE "phone" = $1 OR ($2::text IS NOT NULL AND "email" = $2)
        LIMIT 1
        `,
        [phone, email]
      );

      if (existing.rows.length > 0) {
        return sendError(
          res,
          409,
          "IDENTITY_ALREADY_EXISTS",
          "A user with that phone or email already exists"
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = crypto.randomUUID();

      const created = await pool.query(
        `
        INSERT INTO public."User" ("id", "email", "phone", "fullName", "passwordHash", "role", "status", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, 'CUSTOMER', 'ACTIVE', NOW(), NOW())
        RETURNING "id", "phone", "email", "fullName", "role", "status"
        `,
        [id, email, phone, fullName, passwordHash]
      );

      return json(res, 201, { data: { user: created.rows[0] } });
    }

    if (method === "POST" && url.pathname === "/v1/auth/login") {
      try {
        const body = await readJsonBody(req);
        const phone = normalizePhone(String(body.phone ?? ""));
        const password = String(body.password ?? "");

        let result;
        try {
          result = await pool.query(
            `
            SELECT "id", "phone", "email", "fullName", "passwordHash", "role", "status"
            FROM public."User"
            ORDER BY "createdAt" ASC
            `
          );
        } catch (error) {
          return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_USER_QUERY_FAILED", {
            stage: "user_query",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        const user = result.rows.find((row) => getString(row, "phone") === phone) ?? null;

        if (!user) {
          return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid phone or password");
        }

        if (getString(user, "status") !== "ACTIVE") {
          return sendError(res, 403, "ACCOUNT_DISABLED", "User account is disabled");
        }

        let ok = false;
        try {
          ok = await bcrypt.compare(
            password,
            getString(user, "passwordhash", "passwordHash") ?? ""
          );
        } catch (error) {
          return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_PASSWORD_COMPARE_FAILED", {
            stage: "password_compare",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        if (!ok) {
          return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid phone or password");
        }

        let tokens;
        try {
          tokens = await issueTokens(
            {
              id: getString(user, "id") ?? "",
              phone: getString(user, "phone") ?? "",
              role: (getString(user, "role") ?? "CUSTOMER") as Role,
            },
            req
          );
        } catch (error) {
          return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_ISSUE_TOKENS_FAILED", {
            stage: "issue_tokens",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        return json(res, 200, {
          data: {
            user: {
              id: getString(user, "id"),
              phone: getString(user, "phone"),
              email: getString(user, "email"),
              fullName: getString(user, "fullName", "fullname"),
              role: getString(user, "role"),
              status: getString(user, "status"),
            },
            tokens,
          },
        });
      } catch (error) {
        return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_TOP_LEVEL_FAILED", {
          stage: "top_level",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    if (method === "POST" && url.pathname === "/v1/auth/refresh") {
      const body = await readJsonBody(req);
      const refreshToken = String(body.refreshToken ?? "");

      if (!refreshToken) {
        return sendError(res, 400, "VALIDATION_ERROR", "refreshToken is required");
      }

      let payload: jwt.JwtPayload;
      try {
        payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
      } catch {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
      }

      if (payload.typ !== "refresh" || typeof payload.sub !== "string") {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid");
      }

      const tokenHash = hashToken(refreshToken);

      const existingResult = await pool.query(
        `
        SELECT "id", "userId", "expiresAt", "revokedAt"
        FROM "RefreshToken"
        WHERE "tokenHash" = $1
        LIMIT 1
        `,
        [tokenHash]
      );

      if (existingResult.rows.length === 0) {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "Refresh token was not recognized");
      }

      const existing = existingResult.rows[0];

      if (existing.revokedAt) {
        return sendError(res, 401, "REFRESH_TOKEN_REVOKED", "Refresh token has been revoked");
      }

      if (new Date(existing.expiresAt).getTime() <= Date.now()) {
        return sendError(res, 401, "REFRESH_TOKEN_EXPIRED", "Refresh token has expired");
      }

      const userResult = await pool.query(
        `
        SELECT "id", "phone", "email", "fullName", "role", "status"
        FROM public."User"
        WHERE "id" = $1
        LIMIT 1
        `,
        [payload.sub]
      );

      if (userResult.rows.length === 0 || getString(userResult.rows[0], "status") !== "ACTIVE") {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "User is not active");
      }

      const user = userResult.rows[0];
      const newRefreshToken = signRefreshToken({ id: getString(user, "id") ?? "" });
      const replacementId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "RefreshToken" ("id", "userId", "tokenHash", "createdAt", "expiresAt", "revokedAt", "replacedByTokenId", "userAgent", "ipAddress")
        VALUES ($1, $2, $3, NOW(), $4, NULL, NULL, $5, $6)
        `,
        [
          replacementId,
          getString(user, "id"),
          hashToken(newRefreshToken),
          new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
          req.headers["user-agent"]?.toString() ?? null,
          req.socket.remoteAddress ?? null,
        ]
      );

      await pool.query(
        `
        UPDATE "RefreshToken"
        SET "revokedAt" = NOW(), "replacedByTokenId" = $2
        WHERE "id" = $1
        `,
        [existing.id, replacementId]
      );

      const accessToken = signAccessToken({
        id: getString(user, "id") ?? "",
        phone: getString(user, "phone") ?? "",
        role: (getString(user, "role") ?? "CUSTOMER") as Role,
      });

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          user: {
            id: getString(user, "id"),
            phone: getString(user, "phone"),
            email: getString(user, "email"),
            fullName: getString(user, "fullName", "fullname"),
            role: getString(user, "role"),
            status: getString(user, "status"),
          },
          tokens: {
            accessToken,
            refreshToken: newRefreshToken,
            accessTokenExpiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
            refreshTokenExpiresInSeconds: REFRESH_TOKEN_TTL_SECONDS,
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/orders") {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "CUSTOMER") {
        return sendError(res, 403, "FORBIDDEN", "Only customers can create customer orders");
      }

      const body = await readJsonBody(req);

      let channel: "DOOR" | "SHOP_DROP" | "HYBRID";
      let tier: "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY";

      try {
        channel = assertOrderChannel(String(body.channel ?? "").trim());
        tier = assertOrderTier(String(body.tier ?? "").trim());
      } catch (error) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          error instanceof Error ? error.message : "Invalid order input"
        );
      }

      const affiliateShopId =
        body.affiliateShopId === null || body.affiliateShopId === undefined
          ? null
          : String(body.affiliateShopId).trim() || null;

      const pickupAddressId =
        body.pickupAddressId === null || body.pickupAddressId === undefined
          ? null
          : String(body.pickupAddressId).trim() || null;

      const dropoffAddressId =
        body.dropoffAddressId === null || body.dropoffAddressId === undefined
          ? null
          : String(body.dropoffAddressId).trim() || null;

      if (channel === "DOOR") {
        if (!pickupAddressId) {
          return sendError(res, 400, "VALIDATION_ERROR", "pickupAddressId is required for DOOR");
        }
        if (affiliateShopId) {
          return sendError(res, 400, "VALIDATION_ERROR", "affiliateShopId must be null for DOOR");
        }
      }

      if (channel === "SHOP_DROP") {
        if (!affiliateShopId) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "affiliateShopId is required for SHOP_DROP"
          );
        }
      }

      if (channel === "HYBRID") {
        if (!affiliateShopId) {
          return sendError(res, 400, "VALIDATION_ERROR", "affiliateShopId is required for HYBRID");
        }
        if (!dropoffAddressId) {
          return sendError(res, 400, "VALIDATION_ERROR", "dropoffAddressId is required for HYBRID");
        }
      }

      const userResult = await pool.query(
        `
        SELECT "id", "phone", "fullName", "status"
        FROM public."User"
        WHERE "id" = $1
        LIMIT 1
        `,
        [authUser.id]
      );

      if (userResult.rows.length === 0) {
        return sendError(res, 404, "USER_NOT_FOUND", "Customer user was not found");
      }

      const customerUser = userResult.rows[0];

      let zoneId: string | null = null;
      let resolvedPickupAddressId: string | null = pickupAddressId;
      let resolvedDropoffAddressId: string | null = dropoffAddressId;
      let sourceType: "DIRECT" | "AFFILIATE" = "DIRECT";

      if (channel === "DOOR") {
        const addressResult = await pool.query(
          `
          SELECT "id", "zoneId", "userId"
          FROM "CustomerAddress"
          WHERE "id" = $1
          LIMIT 1
          `,
          [pickupAddressId]
        );

        if (addressResult.rows.length === 0) {
          return sendError(res, 404, "ADDRESS_NOT_FOUND", "Pickup address was not found");
        }

        const address = addressResult.rows[0];
        if (getString(address, "userId", "userid") !== authUser.id) {
          return sendError(res, 403, "FORBIDDEN", "Pickup address does not belong to customer");
        }

        zoneId = getString(address, "zoneId", "zoneid");
        resolvedDropoffAddressId = pickupAddressId;
      }

      if (channel === "SHOP_DROP" || channel === "HYBRID") {
        const selectedZoneId =
          body.zoneId === null || body.zoneId === undefined
            ? null
            : String(body.zoneId).trim() || null;

        const shopResult = await pool.query(
          `
          SELECT "id", "zoneId", "isActive"
          FROM "AffiliateShop"
          WHERE "id" = $1
          LIMIT 1
          `,
          [affiliateShopId]
        );

        if (shopResult.rows.length === 0) {
          return sendError(res, 404, "AFFILIATE_SHOP_NOT_FOUND", "Affiliate shop was not found");
        }

        const shop = shopResult.rows[0];
        const shopZoneId = getString(shop, "zoneId", "zoneid");

        if (selectedZoneId && shopZoneId !== selectedZoneId) {
          return sendError(
            res,
            409,
            "AFFILIATE_SHOP_ZONE_MISMATCH",
            "Affiliate shop does not belong to the selected zone"
          );
        }

        zoneId = shopZoneId;
        sourceType = "AFFILIATE";

        if (channel === "SHOP_DROP") {
          const defaultAddressResult = await pool.query(
            `
            SELECT "id"
            FROM "CustomerAddress"
            WHERE "userId" = $1
            ORDER BY "createdAt" ASC
            LIMIT 1
            `,
            [authUser.id]
          );

          if (defaultAddressResult.rows.length > 0) {
            resolvedPickupAddressId = getString(defaultAddressResult.rows[0], "id");
            resolvedDropoffAddressId = getString(defaultAddressResult.rows[0], "id");
          } else {
            resolvedPickupAddressId = null;
            resolvedDropoffAddressId = null;
          }
        }
      }

      if (channel === "HYBRID") {
        const addressResult = await pool.query(
          `
          SELECT "id", "userId"
          FROM "CustomerAddress"
          WHERE "id" = $1
          LIMIT 1
          `,
          [dropoffAddressId]
        );

        if (addressResult.rows.length === 0) {
          return sendError(res, 404, "ADDRESS_NOT_FOUND", "Dropoff address was not found");
        }

        const address = addressResult.rows[0];
        if (getString(address, "userId", "userid") !== authUser.id) {
          return sendError(res, 403, "FORBIDDEN", "Dropoff address does not belong to customer");
        }

        resolvedDropoffAddressId = getString(address, "id");
      }

      if (!zoneId) {
        return sendError(res, 400, "ZONE_DERIVATION_FAILED", "Could not derive zone for order");
      }

      const hubResult = await pool.query(
        `
        SELECT "id"
        FROM "Hub"
        WHERE "zoneId" = $1
          AND "isActive" = true
        ORDER BY "createdAt" ASC
        LIMIT 1
        `,
        [zoneId]
      );

      if (hubResult.rows.length === 0) {
        return sendError(
          res,
          409,
          "HUB_NOT_AVAILABLE_IN_ZONE",
          "No active hub is available in the derived zone"
        );
      }

      const hubId = getString(hubResult.rows[0], "id");
      const orderId = crypto.randomUUID();
      const bagId = crypto.randomUUID();
      const orderCreatedEventId = crypto.randomUUID();
      const hubAssignedEventId = crypto.randomUUID();
      const orderNumber = nextOrderNumber();
      const tagCode = nextBagTagCode();

      await pool.query("BEGIN");

      try {
        await pool.query(
          `
          INSERT INTO "Order" (
            "id", "orderNumber", "sourceType", "affiliateShopId", "channel",
            "customerName", "customerPhone", "notes", "createdAt", "updatedAt",
            "customerUserId", "tier", "zoneId", "hubId", "pickupAddressId",
            "dropoffAddressId", "statusCurrent"
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, NULL, NOW(), NOW(),
            $8, $9, $10, $11, $12,
            $13, 'CREATED'
          )
          `,
          [
            orderId,
            orderNumber,
            sourceType,
            affiliateShopId,
            channel,
            getString(customerUser, "fullName", "fullname"),
            getString(customerUser, "phone"),
            authUser.id,
            tier,
            zoneId,
            hubId,
            resolvedPickupAddressId,
            resolvedDropoffAddressId,
          ]
        );

        await pool.query(
          `
          INSERT INTO "Bag" ("id", "orderId", "tagCode", "bagStatus", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, 'CREATED', NOW(), NOW())
          `,
          [bagId, orderId, tagCode]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'ORDER_CREATED', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            orderCreatedEventId,
            orderId,
            authUser.id,
            authUser.role,
            "Customer order created",
            JSON.stringify({
              channel,
              tier,
              zoneId,
              hubId,
              affiliateShopId,
              pickupAddressId: resolvedPickupAddressId,
              dropoffAddressId: resolvedDropoffAddressId,
              tagCode,
            }),
          ]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'HUB_ASSIGNED', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            hubAssignedEventId,
            orderId,
            authUser.id,
            authUser.role,
            "Hub assigned automatically from order zone",
            JSON.stringify({
              zoneId,
              hubId,
              rule: "FIRST_ACTIVE_HUB_IN_ZONE_BY_CREATED_AT_ASC",
            }),
          ]
        );

        const activePlanResult = await pool.query(
          `
          SELECT
            p."id",
            p."effectiveFrom"
          FROM "PricingPlan" p
          INNER JOIN "PricingPlanChannel" pc ON pc."planId" = p."id"
          WHERE p."status" = 'ACTIVE'
            AND pc."channel" = $1::"OrderChannel"
            AND (p."effectiveFrom" IS NULL OR p."effectiveFrom" <= NOW())
            AND (p."effectiveTo" IS NULL OR p."effectiveTo" > NOW())
          ORDER BY p."effectiveFrom" DESC NULLS LAST, p."createdAt" DESC
          LIMIT 1
          `,
          [channel]
        );

        if (activePlanResult.rows.length === 0) {
          throw new Error(`No active pricing plan found for channel ${channel}`);
        }

        const activePlanId = String(activePlanResult.rows[0].id);
        const activePlanEffectiveFrom = activePlanResult.rows[0].effectiveFrom ?? null;

        const quoteBreakdown = await computeOrderPricingBreakdown({
          orderId,
          channel,
          tier,
          zoneId,
          pricingPlanId: activePlanId,
          estimatedWeightKg: 1,
          actualWeightKg: null,
          itemEntries: [],
        });

        await replaceOrderPricingState({
          orderId,
          pricingPlanId: activePlanId,
          pricingPlanEffectiveFrom: activePlanEffectiveFrom,
          quoteStatus: "ESTIMATED",
          quotedAt: true,
          finalizedAt: false,
          inputsJson: quoteBreakdown.inputsJson,
          lineItems: quoteBreakdown.lineItems,
          subtotal: quoteBreakdown.subtotal,
          deliveryTotal: quoteBreakdown.deliveryTotal,
          discountTotal: quoteBreakdown.discountTotal,
          grandTotal: quoteBreakdown.grandTotal,
          balanceDue: quoteBreakdown.balanceDue,
        });

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'PAYMENT_DUE', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            crypto.randomUUID(),
            orderId,
            authUser.id,
            authUser.role,
            "Estimated quote generated at order creation",
            JSON.stringify({
              actionCode: "ORDER_QUOTE_GENERATED",
              pricingPlanId: activePlanId,
              pricingPlanEffectiveFrom: activePlanEffectiveFrom,
              quoteStatus: "ESTIMATED",
              grandTotal: quoteBreakdown.grandTotal,
            }),
          ]
        );
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return sendError(
          res,
          500,
          "ORDER_CREATE_FAILED",
          error instanceof Error ? error.message : "Order creation failed"
        );
      }

      return json(res, 201, {
        data: {
          order: {
            id: orderId,
            orderNumber,
            statusCurrent: "CREATED",
            createdAt: new Date().toISOString(),
            zoneId,
            hubId,
            bagTagCode: tagCode,
          },
        },
      });
    }
    if (method === "POST" && url.pathname === "/v1/auth/logout") {
      const body = await readJsonBody(req);
      const refreshToken = String(body.refreshToken ?? "");

      if (!refreshToken) {
        return sendError(res, 400, "VALIDATION_ERROR", "refreshToken is required");
      }

      const tokenHash = hashToken(refreshToken);

      const existingResult = await pool.query(
        `
        SELECT "id", "revokedAt"
        FROM "RefreshToken"
        WHERE "tokenHash" = $1
        LIMIT 1
        `,
        [tokenHash]
      );

      if (existingResult.rows.length === 0 || existingResult.rows[0].revokedAt) {
        return sendError(
          res,
          401,
          "INVALID_REFRESH_TOKEN",
          "Refresh token is invalid or already revoked"
        );
      }

      await pool.query(
        `
        UPDATE "RefreshToken"
        SET "revokedAt" = NOW()
        WHERE "id" = $1
        `,
        [existingResult.rows[0].id]
      );

      console.log("[login] tokens issued");

      return json(res, 200, { data: { loggedOut: true } });
    }

    if (method === "GET" && url.pathname === "/v1/affiliate-shops") {
      const zoneId = String(url.searchParams.get("zoneId") ?? "").trim();

      if (!zoneId) {
        return sendError(res, 400, "VALIDATION_ERROR", "zoneId query parameter is required");
      }

      const result = await pool.query(
        `
        SELECT "id", "name", "zoneId"
        FROM "AffiliateShop"
        WHERE "zoneId" = $1
          AND "isActive" = TRUE
        ORDER BY "createdAt" ASC
        `,
        [zoneId]
      );

      return json(res, 200, {
        data: {
          affiliateShops: result.rows,
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/affiliate/orders") {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "AFFILIATE_STAFF") {
        return sendError(res, 403, "FORBIDDEN", "Only affiliate staff can create affiliate orders");
      }

      const body = await readJsonBody(req);

      const customerPhoneRaw = String(body.customerPhone ?? "").trim();
      const returnMethodRaw = String(body.returnMethod ?? "").trim();
      const customerNameRaw =
        body.customerName === null || body.customerName === undefined
          ? "Walk-in Customer"
          : String(body.customerName).trim() || "Walk-in Customer";
      const notesRaw =
        body.notes === null || body.notes === undefined ? null : String(body.notes).trim() || null;

      let tier: "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY";
      try {
        tier = assertOrderTier(String(body.tier ?? "").trim());
      } catch (error) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          error instanceof Error ? error.message : "Invalid affiliate order tier"
        );
      }

      if (!customerPhoneRaw) {
        return sendError(res, 400, "VALIDATION_ERROR", "customerPhone is required");
      }

      let customerPhone: string;
      try {
        customerPhone = normalizePhone(customerPhoneRaw);
      } catch (error) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          error instanceof Error ? error.message : "Invalid customer phone"
        );
      }

      if (!["PICKUP_AT_SHOP", "DELIVER_TO_DOOR"].includes(returnMethodRaw)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "returnMethod must be one of PICKUP_AT_SHOP, DELIVER_TO_DOOR"
        );
      }

      const returnMethod = returnMethodRaw as "PICKUP_AT_SHOP" | "DELIVER_TO_DOOR";
      const channel: "SHOP_DROP" | "HYBRID" =
        returnMethod === "PICKUP_AT_SHOP" ? "SHOP_DROP" : "HYBRID";

      const affiliateScopeResult = await pool.query(
        `
        SELECT asp."affiliateShopId", s."zoneId", s."isActive"
        FROM "AffiliateStaffProfile" asp
        INNER JOIN "AffiliateShop" s ON s."id" = asp."affiliateShopId"
        WHERE asp."userId" = $1
          AND asp."isActive" = TRUE
        LIMIT 1
        `,
        [authUser.id]
      );

      if (affiliateScopeResult.rows.length === 0) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate staff profile was not found or inactive"
        );
      }

      const affiliateScope = affiliateScopeResult.rows[0];
      const affiliateShopId = getString(affiliateScope, "affiliateShopId", "affiliateshopid");
      const zoneId = getString(affiliateScope, "zoneId", "zoneid");
      const shopIsActive =
        affiliateScope["isActive"] === true || affiliateScope["isactive"] === true;

      if (!affiliateShopId || !zoneId || !shopIsActive) {
        return sendError(
          res,
          409,
          "AFFILIATE_SHOP_NOT_ACTIVE",
          "Affiliate shop is not active or not properly configured"
        );
      }

      let dropoffAddressId: string | null = null;
      if (returnMethod === "DELIVER_TO_DOOR") {
        const line1 = String(body.dropoffAddressLine1 ?? "").trim();
        const area = String(body.dropoffAddressArea ?? "").trim();
        const city = String(body.dropoffAddressCity ?? "").trim();
        const notes =
          body.dropoffAddressNotes === null || body.dropoffAddressNotes === undefined
            ? null
            : String(body.dropoffAddressNotes).trim() || null;

        if (!line1 || !area || !city) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "dropoffAddressLine1, dropoffAddressArea, and dropoffAddressCity are required for DELIVER_TO_DOOR"
          );
        }

        dropoffAddressId = crypto.randomUUID();

        await pool.query(
          `
          INSERT INTO "CustomerAddress" (
            "id", "userId", "label", "contactName", "phone", "addressLine1",
            "zoneId", "locationLat", "locationLng", "notes", "createdAt", "updatedAt"
          )
          VALUES (
            $1, NULL, 'Affiliate Return Address', $2, $3, $4,
            $5, NULL, NULL, $6, NOW(), NOW()
          )
          `,
          [
            dropoffAddressId,
            customerNameRaw,
            customerPhone,
            line1,
            zoneId,
            [notes, `Area: ${area}`, `City: ${city}`].filter(Boolean).join(" | "),
          ]
        );
      }

      const hubResult = await pool.query(
        `
        SELECT "id"
        FROM "Hub"
        WHERE "zoneId" = $1
          AND "isActive" = TRUE
        ORDER BY "createdAt" ASC
        LIMIT 1
        `,
        [zoneId]
      );

      if (hubResult.rows.length === 0) {
        return sendError(
          res,
          409,
          "HUB_NOT_AVAILABLE_IN_ZONE",
          "No active hub is available for the affiliate shop zone"
        );
      }

      const hubId = getString(hubResult.rows[0], "id");
      const orderId = crypto.randomUUID();
      const orderNumber = nextOrderNumber();
      const bagId = crypto.randomUUID();
      const tagCode = nextBagTagCode();

      await pool.query("BEGIN");

      try {
        await pool.query(
          `
          INSERT INTO "Order" (
            "id", "orderNumber", "sourceType", "affiliateShopId", "channel", "customerName", "customerPhone",
            "notes", "createdAt", "updatedAt", "customerUserId", "tier", "zoneId", "hubId",
            "pickupAddressId", "dropoffAddressId", "statusCurrent"
          )
          VALUES (
            $1, $2, 'AFFILIATE', $3, $4, $5, $6,
            $7, NOW(), NOW(), NULL, $8, $9, $10,
            NULL, $11, 'CREATED'
          )
          `,
          [
            orderId,
            orderNumber,
            affiliateShopId,
            channel,
            customerNameRaw,
            customerPhone,
            notesRaw,
            tier,
            zoneId,
            hubId,
            dropoffAddressId,
          ]
        );

        await pool.query(
          `
          INSERT INTO "Bag" ("id", "orderId", "tagCode", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, NOW(), NOW())
          `,
          [bagId, orderId, tagCode]
        );

        const activePlan = await _getActivePricingPlanForChannel(channel);

        const quoteBreakdown = await computeOrderPricingBreakdown({
          orderId,
          channel,
          tier,
          zoneId,
          pricingPlanId: activePlan.id,
          estimatedWeightKg: 1,
          actualWeightKg: null,
          itemEntries: [],
        });

        await replaceOrderPricingState({
          orderId,
          pricingPlanId: activePlan.id,
          pricingPlanEffectiveFrom: activePlan.effectiveFrom,
          quoteStatus: "ESTIMATED",
          quotedAt: true,
          finalizedAt: false,
          inputsJson: quoteBreakdown.inputsJson,
          lineItems: quoteBreakdown.lineItems,
          subtotal: quoteBreakdown.subtotal,
          deliveryTotal: quoteBreakdown.deliveryTotal,
          discountTotal: quoteBreakdown.discountTotal,
          grandTotal: quoteBreakdown.grandTotal,
          balanceDue: quoteBreakdown.balanceDue,
        });

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES
            ($1, $2, 'ORDER_CREATED', NOW(), $3, 'AFFILIATE_STAFF', $4, $5::jsonb, NOW()),
            ($6, $2, 'HUB_ASSIGNED', NOW(), $3, 'AFFILIATE_STAFF', $7, $8::jsonb, NOW()),
            ($9, $2, 'PAYMENT_DUE', NOW(), $3, 'AFFILIATE_STAFF', $10, $11::jsonb, NOW())
          `,
          [
            crypto.randomUUID(),
            orderId,
            authUser.id,
            "Affiliate walk-in order created",
            JSON.stringify({
              tier,
              hubId,
              zoneId,
              channel,
              tagCode,
              affiliateShopId,
              returnMethod,
              dropoffAddressId,
            }),
            crypto.randomUUID(),
            "Hub assigned automatically from affiliate shop zone",
            JSON.stringify({
              rule: "FIRST_ACTIVE_HUB_IN_ZONE_BY_CREATED_AT_ASC",
              hubId,
              zoneId,
              receivedAtShop: true,
              affiliateShopId,
              customerPhone,
            }),
            crypto.randomUUID(),
            "Estimated quote generated at affiliate order creation",
            JSON.stringify({
              actionCode: "ORDER_QUOTE_GENERATED",
              pricingPlanId: activePlan.id,
              pricingPlanEffectiveFrom: activePlan.effectiveFrom,
              quoteStatus: "ESTIMATED",
              grandTotal: quoteBreakdown.grandTotal,
              affiliateShopId,
              channel,
            }),
          ]
        );
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      return json(res, 201, {
        data: {
          order: {
            id: orderId,
            orderNumber,
            sourceType: "AFFILIATE",
            affiliateShopId,
            channel,
            customerName: customerNameRaw,
            customerPhone,
            tier,
            zoneId,
            hubId,
            statusCurrent: "CREATED",
            bagTagCode: tagCode,
            returnMethod,
            dropoffAddressId,
          },
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/affiliate/orders") {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "AFFILIATE_STAFF") {
        return sendError(res, 403, "FORBIDDEN", "Only affiliate staff can list affiliate orders");
      }

      const affiliateScopeResult = await pool.query(
        `
        SELECT asp."affiliateShopId"
        FROM "AffiliateStaffProfile" asp
        WHERE asp."userId" = $1
          AND asp."isActive" = TRUE
        LIMIT 1
        `,
        [authUser.id]
      );

      if (affiliateScopeResult.rows.length === 0) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate staff profile was not found"
        );
      }

      const affiliateShopId = getString(
        affiliateScopeResult.rows[0],
        "affiliateShopId",
        "affiliateshopid"
      );
      if (!affiliateShopId) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate shop scope was not found"
        );
      }

      const statusFilter = String(url.searchParams.get("status") ?? "").trim();

      const values: unknown[] = [affiliateShopId];
      let whereSql = `WHERE o."affiliateShopId" = $1`;

      if (statusFilter) {
        values.push(statusFilter);
        whereSql += ` AND o."statusCurrent" = $2`;
      }

      const result = await pool.query(
        `
        SELECT
          o."id",
          o."orderNumber",
          o."sourceType",
          o."affiliateShopId",
          o."channel",
          o."customerName",
          o."customerPhone",
          o."tier",
          o."zoneId",
          o."hubId",
          o."statusCurrent",
          o."createdAt",
          o."updatedAt"
        FROM "Order" o
        ${whereSql}
        ORDER BY o."createdAt" DESC
        `,
        values
      );

      return json(res, 200, {
        data: {
          orders: result.rows,
        },
      });
    }

    const affiliateOrderReadyId = pathParam(
      url.pathname,
      /^\/v1\/affiliate\/orders\/([^/]+)\/mark-ready-for-pickup$/
    );
    if (method === "POST" && affiliateOrderReadyId) {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "AFFILIATE_STAFF") {
        return sendError(
          res,
          403,
          "FORBIDDEN",
          "Only affiliate staff can mark affiliate orders ready"
        );
      }

      const affiliateScopeResult = await pool.query(
        `
        SELECT asp."affiliateShopId"
        FROM "AffiliateStaffProfile" asp
        WHERE asp."userId" = $1
          AND asp."isActive" = TRUE
        LIMIT 1
        `,
        [authUser.id]
      );

      if (affiliateScopeResult.rows.length === 0) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate staff profile was not found"
        );
      }

      const affiliateShopId = getString(
        affiliateScopeResult.rows[0],
        "affiliateShopId",
        "affiliateshopid"
      );

      const orderResult = await pool.query(
        `
        SELECT "id", "affiliateShopId", "statusCurrent", "channel"
        FROM "Order"
        WHERE "id" = $1
        LIMIT 1
        `,
        [affiliateOrderReadyId]
      );

      if (orderResult.rows.length === 0) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const order = orderResult.rows[0];
      const orderAffiliateShopId = getString(order, "affiliateShopId", "affiliateshopid");

      if (!affiliateShopId || orderAffiliateShopId !== affiliateShopId) {
        return sendError(res, 403, "FORBIDDEN", "Order does not belong to affiliate shop");
      }

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          UPDATE "Order"
          SET "statusCurrent" = 'PACKED', "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [affiliateOrderReadyId]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES ($1, $2, 'PACKED', NOW(), $3, 'AFFILIATE_STAFF', $4, $5::jsonb, NOW())
          `,
          [
            crypto.randomUUID(),
            affiliateOrderReadyId,
            authUser.id,
            "Ready for pickup at affiliate shop",
            JSON.stringify({
              affiliateShopId,
              state: "READY_FOR_PICKUP_AT_SHOP",
            }),
          ]
        );
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      return json(res, 200, {
        data: {
          orderId: affiliateOrderReadyId,
          readyForPickup: true,
          statusCurrent: "PACKED",
        },
      });
    }

    const affiliateOrderPickedUpId = pathParam(
      url.pathname,
      /^\/v1\/affiliate\/orders\/([^/]+)\/customer-picked-up$/
    );
    if (method === "POST" && affiliateOrderPickedUpId) {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "AFFILIATE_STAFF") {
        return sendError(
          res,
          403,
          "FORBIDDEN",
          "Only affiliate staff can complete affiliate pickups"
        );
      }

      const affiliateScopeResult = await pool.query(
        `
        SELECT asp."affiliateShopId"
        FROM "AffiliateStaffProfile" asp
        WHERE asp."userId" = $1
          AND asp."isActive" = TRUE
        LIMIT 1
        `,
        [authUser.id]
      );

      if (affiliateScopeResult.rows.length === 0) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate staff profile was not found"
        );
      }

      const affiliateShopId = getString(
        affiliateScopeResult.rows[0],
        "affiliateShopId",
        "affiliateshopid"
      );

      const orderResult = await pool.query(
        `
        SELECT "id", "affiliateShopId", "statusCurrent"
        FROM "Order"
        WHERE "id" = $1
        LIMIT 1
        `,
        [affiliateOrderPickedUpId]
      );

      if (orderResult.rows.length === 0) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const order = orderResult.rows[0];
      const orderAffiliateShopId = getString(order, "affiliateShopId", "affiliateshopid");

      if (!affiliateShopId || orderAffiliateShopId !== affiliateShopId) {
        return sendError(res, 403, "FORBIDDEN", "Order does not belong to affiliate shop");
      }

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          UPDATE "Order"
          SET "statusCurrent" = 'DELIVERED', "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [affiliateOrderPickedUpId]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES ($1, $2, 'DELIVERED', NOW(), $3, 'AFFILIATE_STAFF', $4, $5::jsonb, NOW())
          `,
          [
            crypto.randomUUID(),
            affiliateOrderPickedUpId,
            authUser.id,
            "Customer picked up order from affiliate shop",
            JSON.stringify({
              affiliateShopId,
              state: "SHOP_PICKUP_COMPLETED",
            }),
          ]
        );
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      await evaluateCommissionEligibility({
        orderId: affiliateOrderPickedUpId,
        actorUserId: authUser.id,
        actorRole: authUser.role,
        requestMeta: getRequestMeta(req),
      });

      return json(res, 200, {
        data: {
          orderId: affiliateOrderPickedUpId,
          pickedUpByCustomer: true,
          statusCurrent: "DELIVERED",
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/affiliate/commissions") {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "AFFILIATE_STAFF") {
        return sendError(
          res,
          403,
          "FORBIDDEN",
          "Only affiliate staff can view affiliate commissions"
        );
      }

      const affiliateScopeResult = await pool.query(
        `
        SELECT asp."affiliateShopId"
        FROM "AffiliateStaffProfile" asp
        WHERE asp."userId" = $1
          AND asp."isActive" = TRUE
        LIMIT 1
        `,
        [authUser.id]
      );

      const affiliateShopId = getString(
        affiliateScopeResult.rows[0] ?? {},
        "affiliateShopId",
        "affiliateshopid"
      );
      if (!affiliateShopId) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate shop scope was not found"
        );
      }

      const from = String(url.searchParams.get("from") ?? "").trim();
      const to = String(url.searchParams.get("to") ?? "").trim();

      const params: unknown[] = [affiliateShopId];
      let whereSql = `WHERE cle."affiliateShopId" = $1`;

      if (from) {
        params.push(from);
        whereSql += ` AND cle."earnedAt" >= $${params.length}::timestamptz`;
      }

      if (to) {
        params.push(to);
        whereSql += ` AND cle."earnedAt" <= $${params.length}::timestamptz`;
      }

      const result = await pool.query(
        `
        SELECT
          cle."id",
          cle."affiliateShopId",
          cle."orderId",
          cle."planId",
          cle."calculationType",
          cle."baseAmountTzs",
          cle."rate",
          cle."amountTzs",
          cle."status",
          cle."earnedAt",
          cle."approvedAt",
          cle."paidAt",
          cle."payoutId",
          o."orderNumber"
        FROM "CommissionLedgerEntry" cle
        INNER JOIN "Order" o ON o."id" = cle."orderId"
        ${whereSql}
        ORDER BY cle."earnedAt" DESC, cle."createdAt" DESC
        `,
        params
      );

      return json(res, 200, {
        data: {
          commissions: result.rows,
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/affiliate/payouts") {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "AFFILIATE_STAFF") {
        return sendError(res, 403, "FORBIDDEN", "Only affiliate staff can view affiliate payouts");
      }

      const affiliateScopeResult = await pool.query(
        `
        SELECT asp."affiliateShopId"
        FROM "AffiliateStaffProfile" asp
        WHERE asp."userId" = $1
          AND asp."isActive" = TRUE
        LIMIT 1
        `,
        [authUser.id]
      );

      const affiliateShopId = getString(
        affiliateScopeResult.rows[0] ?? {},
        "affiliateShopId",
        "affiliateshopid"
      );
      if (!affiliateShopId) {
        return sendError(
          res,
          403,
          "AFFILIATE_SCOPE_NOT_FOUND",
          "Affiliate shop scope was not found"
        );
      }

      const result = await pool.query(
        `
        SELECT
          p."id",
          p."affiliateShopId",
          p."periodStart",
          p."periodEnd",
          p."totalAmountTzs",
          p."status",
          p."approvedByUserId",
          p."approvedAt",
          p."paidByUserId",
          p."paidAt",
          p."paymentMethod",
          p."paymentReference",
          p."createdAt",
          p."updatedAt"
        FROM "Payout" p
        WHERE p."affiliateShopId" = $1
        ORDER BY p."createdAt" DESC
        `,
        [affiliateShopId]
      );

      return json(res, 200, {
        data: {
          payouts: result.rows,
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/auth/me") {
      const user = await requireAuth(req, res);
      if (!user) return;
      console.log("[login] tokens issued");

      return json(res, 200, { data: { user } });
    }

    if (method === "POST" && url.pathname === "/v1/admin/trips") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "create admin trips")) return;

      const body = await readJsonBody(req);

      let tripType: "PICKUP" | "DELIVERY";
      try {
        tripType = assertTripType(String(body.type ?? "").trim());
      } catch (error) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          error instanceof Error ? error.message : "Invalid trip type"
        );
      }

      const driverId = String(body.driverId ?? "").trim();
      const zoneId = String(body.zoneId ?? "").trim();

      if (!driverId || !zoneId) {
        return sendError(res, 400, "VALIDATION_ERROR", "driverId and zoneId are required");
      }

      const driverResult = await pool.query(
        `
        SELECT "id", "homeZoneId", "isActive"
        FROM "DriverProfile"
        WHERE "id" = $1
        LIMIT 1
        `,
        [driverId]
      );

      if (driverResult.rows.length === 0) {
        return sendError(res, 404, "DRIVER_NOT_FOUND", "Driver was not found");
      }

      const driver = driverResult.rows[0];
      const homeZoneId = getString(driver, "homeZoneId", "homezoneid");

      if (homeZoneId !== zoneId) {
        return sendError(
          res,
          409,
          "ZONE_ASSIGNMENT_MISMATCH",
          "Driver home zone does not match trip zone"
        );
      }

      const zoneResult = await pool.query(
        `
        SELECT "id"
        FROM "Zone"
        WHERE "id" = $1
        LIMIT 1
        `,
        [zoneId]
      );

      if (zoneResult.rows.length === 0) {
        return sendError(res, 404, "ZONE_NOT_FOUND", "Zone was not found");
      }

      const hubResult = await pool.query(
        `
        SELECT "id"
        FROM "Hub"
        WHERE "zoneId" = $1
          AND "isActive" = TRUE
        ORDER BY "createdAt" ASC
        LIMIT 1
        `,
        [zoneId]
      );

      const tripId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "Trip" (
          "id", "type", "zoneId", "hubId", "driverId", "status",
          "scheduledFor", "startedAt", "completedAt", "createdAt", "updatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, 'PLANNED',
          NOW(), NULL, NULL, NOW(), NOW()
        )
        `,
        [tripId, tripType, zoneId, getString(hubResult.rows[0] ?? {}, "id"), driverId]
      );

      const trip = await fetchTripById(tripId);

      return json(res, 201, {
        data: {
          trip,
        },
      });
    }

    const adminTripIdForStop = pathParam(url.pathname, /^\/v1\/admin\/trips\/([^/]+)\/stops$/);
    if (method === "POST" && adminTripIdForStop) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "add admin trip stops")) return;

      const body = await readJsonBody(req);

      let stopType: "PICKUP" | "DROPOFF";
      try {
        stopType = assertTripStopType(String(body.stopType ?? "").trim());
      } catch (error) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          error instanceof Error ? error.message : "Invalid stop type"
        );
      }

      const orderId = String(body.orderId ?? "").trim();
      const sequence = Number(body.sequence);

      if (!orderId || !Number.isInteger(sequence) || sequence < 1) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "orderId and positive integer sequence are required"
        );
      }

      const trip = await fetchTripById(adminTripIdForStop);
      if (!trip) {
        return sendError(res, 404, "TRIP_NOT_FOUND", "Trip was not found");
      }

      const order = await fetchOrderById(orderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const tripZoneId = getString(trip, "zoneId", "zoneid");
      const orderZoneId = getString(order, "zoneId", "zoneid");
      const tripDriverId = getString(trip, "driverId", "driverid");

      const driverResult = await pool.query(
        `
        SELECT "id", "homeZoneId"
        FROM "DriverProfile"
        WHERE "id" = $1
        LIMIT 1
        `,
        [tripDriverId]
      );

      if (driverResult.rows.length === 0) {
        return sendError(res, 404, "DRIVER_NOT_FOUND", "Trip driver was not found");
      }

      const driverHomeZoneId = getString(driverResult.rows[0], "homeZoneId", "homezoneid");

      if (tripZoneId !== orderZoneId || driverHomeZoneId !== orderZoneId) {
        return sendError(
          res,
          409,
          "ZONE_ASSIGNMENT_MISMATCH",
          "Trip zone, driver home zone, and order zone must match"
        );
      }

      const tripStopId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "TripStop" (
          "id", "tripId", "orderId", "stopType", "sequence", "status", "notes", "createdAt", "updatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, 'PENDING', NULL, NOW(), NOW()
        )
        `,
        [tripStopId, adminTripIdForStop, orderId, stopType, sequence]
      );

      return json(res, 201, {
        data: {
          tripStop: {
            id: tripStopId,
            tripId: adminTripIdForStop,
            orderId,
            stopType,
            sequence,
            status: "PENDING",
          },
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/admin/users") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "access admin-only users list")) return;

      const result = await pool.query(
        `
        SELECT "id", "phone", "email", "fullName", "role", "status"
        FROM public."User"
        ORDER BY "createdAt" ASC
        `
      );

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          users: result.rows.map((row) => toUserDto(row)),
        },
      });
    }

    const orderTimelineId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)\/timeline$/);
    if (method === "GET" && orderTimelineId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const scope = await resolveScope(user);
      const decision = await canReadOrder(user, scope, orderTimelineId);

      if (!decision.order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (!decision.allowed) {
        return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this order");
      }

      const eventsResult = await pool.query(
        `
        SELECT
          "id",
          "orderId",
          "eventType",
          "occurredAt",
          "actorUserId",
          "actorRole",
          "notes",
          "payloadJson",
          "createdAt"
        FROM "OrderEvent"
        WHERE "orderId" = $1
        ORDER BY "occurredAt" ASC, "createdAt" ASC
        `,
        [orderTimelineId]
      );

      return json(res, 200, {
        data: {
          order: {
            id: getString(decision.order, "id"),
            orderNumber: getString(decision.order, "orderNumber", "ordernumber"),
            statusCurrent: getString(decision.order, "statusCurrent", "statuscurrent"),
            zoneId: getString(decision.order, "zoneId", "zoneid"),
            hubId: getString(decision.order, "hubId", "hubid"),
          },
          timeline: eventsResult.rows,
        },
      });
    }
    const orderId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)$/);
    if (method === "GET" && orderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const scope = await resolveScope(user);
      const decision = await canReadOrder(user, scope, orderId);

      if (!decision.order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (!decision.allowed) {
        return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this order");
      }

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          order: decision.order,
          scope: {
            role: scope.role,
            affiliateShopId: scope.affiliateShopId,
            driverId: scope.driverId,
            hubId: scope.hubId,
          },
        },
      });
    }

    const tripId = pathParam(url.pathname, /^\/v1\/trips\/([^/]+)$/);
    if (method === "GET" && tripId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const scope = await resolveScope(user);
      const decision = await canReadTrip(user, scope, tripId);

      if (!decision.trip) {
        return sendError(res, 404, "TRIP_NOT_FOUND", "Trip was not found");
      }

      if (!decision.allowed) {
        return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this trip");
      }

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          trip: decision.trip,
          scope: {
            role: scope.role,
            driverId: scope.driverId,
          },
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/driver/tasks") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DRIVER"], "access driver tasks")) return;

      const scope = await resolveScope(user);
      if (!scope.driverId) {
        return sendError(res, 404, "DRIVER_PROFILE_NOT_FOUND", "Driver profile was not found");
      }

      const result = await pool.query(
        `
        SELECT
          ts."id",
          ts."tripId",
          ts."orderId",
          ts."stopType",
          ts."sequence",
          ts."status",
          ts."notes",
          ts."createdAt",
          ts."updatedAt",
          t."type" AS "tripType",
          t."zoneId",
          t."hubId",
          t."driverId",
          o."orderNumber",
          o."channel",
          o."statusCurrent",
          o."customerName",
          o."customerPhone",
          z."name" AS "zoneName"
        FROM "TripStop" ts
        INNER JOIN "Trip" t ON t."id" = ts."tripId"
        INNER JOIN "Order" o ON o."id" = ts."orderId"
        LEFT JOIN "Zone" z ON z."id" = t."zoneId"
        WHERE t."driverId" = $1
          AND ts."status" <> 'DONE'
        ORDER BY
          CASE WHEN ts."stopType" = 'PICKUP' THEN 0 ELSE 1 END ASC,
          t."scheduledFor" ASC,
          ts."sequence" ASC,
          ts."createdAt" ASC
        `,
        [scope.driverId]
      );

      const tasks = result.rows.map((row) => ({
        id: getString(row, "id"),
        tripId: getString(row, "tripId", "tripid"),
        orderId: getString(row, "orderId", "orderid"),
        tripType: getString(row, "tripType", "triptype"),
        stopType: getString(row, "stopType", "stoptype"),
        sequence: Number(row.sequence ?? 0),
        status: getString(row, "status"),
        notes: row.notes ?? null,
        zoneId: getString(row, "zoneId", "zoneid"),
        zoneLabel: getString(row, "zoneName", "zonename"),
        hubId: getString(row, "hubId", "hubid"),
        orderNumber: getString(row, "orderNumber", "ordernumber"),
        channel: getString(row, "channel"),
        orderStatus: getString(row, "statusCurrent", "statuscurrent"),
        customerName: getString(row, "customerName", "customername"),
        customerPhoneMasked: maskPhone(getString(row, "customerPhone", "customerphone")),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      return json(res, 200, {
        data: {
          tasks,
        },
      });
    }

    const driverStopId = pathParam(url.pathname, /^\/v1\/driver\/stops\/([^/]+)$/);
    if (method === "GET" && driverStopId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DRIVER"], "access driver stop detail")) return;

      const scope = await resolveScope(user);
      if (!scope.driverId) {
        return sendError(res, 404, "DRIVER_PROFILE_NOT_FOUND", "Driver profile was not found");
      }

      const result = await pool.query(
        `
        SELECT
          ts."id",
          ts."tripId",
          ts."orderId",
          ts."stopType",
          ts."sequence",
          ts."status",
          ts."notes" AS "stopNotes",
          t."type" AS "tripType",
          t."zoneId",
          t."hubId",
          t."driverId",
          o."orderNumber",
          o."channel",
          o."statusCurrent",
          o."customerName",
          o."customerPhone",
          o."pickupAddressId",
          o."dropoffAddressId",
          o."affiliateShopId",
          z."name" AS "zoneName",
          b."tagCode",
          ca_pick."label" AS "pickupAddressLabel",
          ca_pick."addressLine1" AS "pickupAddressLine1",
          ca_drop."label" AS "dropoffAddressLabel",
          ca_drop."addressLine1" AS "dropoffAddressLine1",
          shop."name" AS "affiliateShopName",
          shop."addressLabel" AS "affiliateShopAddressLabel",
          shop."contactPhone" AS "affiliateShopPhone"
        FROM "TripStop" ts
        INNER JOIN "Trip" t ON t."id" = ts."tripId"
        INNER JOIN "Order" o ON o."id" = ts."orderId"
        LEFT JOIN "Zone" z ON z."id" = t."zoneId"
        LEFT JOIN "Bag" b ON b."orderId" = o."id"
        LEFT JOIN "CustomerAddress" ca_pick ON ca_pick."id" = o."pickupAddressId"
        LEFT JOIN "CustomerAddress" ca_drop ON ca_drop."id" = o."dropoffAddressId"
        LEFT JOIN "AffiliateShop" shop ON shop."id" = o."affiliateShopId"
        WHERE ts."id" = $1
          AND t."driverId" = $2
        LIMIT 1
        `,
        [driverStopId, scope.driverId]
      );

      if (result.rows.length === 0) {
        return sendError(res, 404, "STOP_NOT_FOUND", "Stop was not found");
      }

      const row = result.rows[0];
      const stopType = getString(row, "stopType", "stoptype");
      const channel = getString(row, "channel");
      const rawTagCode = getString(row, "tagCode", "tagcode");

      let locationLabel: string | null = null;
      if (stopType === "PICKUP") {
        if (channel === "DOOR") {
          locationLabel =
            getString(row, "pickupAddressLabel", "pickupaddresslabel") ??
            getString(row, "pickupAddressLine1", "pickupaddressline1");
        } else {
          locationLabel =
            getString(row, "affiliateShopName", "affiliateshopname") ??
            getString(row, "affiliateShopAddressLabel", "affiliateshopaddresslabel");
        }
      } else {
        if (channel === "HYBRID" || channel === "DOOR") {
          locationLabel =
            getString(row, "dropoffAddressLabel", "dropoffaddresslabel") ??
            getString(row, "dropoffAddressLine1", "dropoffaddressline1");
        } else {
          locationLabel =
            getString(row, "affiliateShopName", "affiliateshopname") ??
            getString(row, "affiliateShopAddressLabel", "affiliateshopaddresslabel");
        }
      }

      const actionLabel = stopType === "PICKUP" ? "Confirm Pickup" : "Confirm Delivery";

      return json(res, 200, {
        data: {
          stop: {
            id: getString(row, "id"),
            tripId: getString(row, "tripId", "tripid"),
            orderId: getString(row, "orderId", "orderid"),
            tripType: getString(row, "tripType", "triptype"),
            stopType,
            sequence: Number(row.sequence ?? 0),
            status: getString(row, "status"),
            zoneId: getString(row, "zoneId", "zoneid"),
            zoneLabel: getString(row, "zoneName", "zonename"),
            hubId: getString(row, "hubId", "hubid"),
            orderNumber: getString(row, "orderNumber", "ordernumber"),
            channel,
            orderStatus: getString(row, "statusCurrent", "statuscurrent"),
            customer: {
              name: getString(row, "customerName", "customername"),
              phoneMasked: maskPhone(getString(row, "customerPhone", "customerphone")),
            },
            location: {
              label: locationLabel,
              affiliateShopPhoneMasked: maskPhone(
                getString(row, "affiliateShopPhone", "affiliateshopphone")
              ),
            },
            bag: {
              tagCodeMasked: rawTagCode ? maskBagTagCode(rawTagCode) : null,
              tagCode: rawTagCode,
            },
            notes: row.stopNotes ?? null,
            actionLabel,
          },
        },
      });
    }

    const driverPickupStopId = pathParam(url.pathname, /^\/v1\/driver\/stops\/([^/]+)\/pickup$/);
    if (method === "POST" && driverPickupStopId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DRIVER"], "confirm pickup")) return;

      const scope = await resolveScope(user);
      if (!scope.driverId) {
        return sendError(res, 404, "DRIVER_PROFILE_NOT_FOUND", "Driver profile was not found");
      }

      const body = await readJsonBody(req);
      const tagCode = String(body.tagCode ?? "").trim();
      const photoRef =
        body.photoRef === null || body.photoRef === undefined
          ? null
          : String(body.photoRef).trim() || null;
      const notes =
        body.notes === null || body.notes === undefined ? null : String(body.notes).trim() || null;

      if (!tagCode) {
        return sendError(res, 400, "VALIDATION_ERROR", "tagCode is required");
      }

      const stopResult = await pool.query(
        `
        SELECT
          ts."id",
          ts."tripId",
          ts."orderId",
          ts."stopType",
          ts."status",
          t."driverId",
          o."orderNumber",
          b."tagCode"
        FROM "TripStop" ts
        INNER JOIN "Trip" t ON t."id" = ts."tripId"
        INNER JOIN "Order" o ON o."id" = ts."orderId"
        LEFT JOIN "Bag" b ON b."orderId" = o."id"
        WHERE ts."id" = $1
          AND t."driverId" = $2
        LIMIT 1
        `,
        [driverPickupStopId, scope.driverId]
      );

      if (stopResult.rows.length === 0) {
        return sendError(res, 404, "STOP_NOT_FOUND", "Stop was not found");
      }

      const stop = stopResult.rows[0];
      const stopType = getString(stop, "stopType", "stoptype");
      const stopStatus = getString(stop, "status");
      const orderId = getString(stop, "orderId", "orderid");
      const expectedTagCode = getString(stop, "tagCode", "tagcode");
      const eventId = crypto.randomUUID();

      if (stopType !== "PICKUP") {
        return sendError(res, 409, "STOP_TYPE_INVALID", "Stop is not a pickup stop");
      }

      if (stopStatus === "DONE") {
        return sendError(res, 409, "STOP_ALREADY_COMPLETED", "Stop has already been completed");
      }

      if (!expectedTagCode || expectedTagCode !== tagCode) {
        return sendError(res, 409, "BAG_TAG_MISMATCH", "Bag tag code does not match the order bag");
      }

      await pool.query("BEGIN");

      try {
        await pool.query(
          `
          UPDATE "TripStop"
          SET "status" = 'DONE', "notes" = COALESCE($2, "notes"), "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [driverPickupStopId, notes]
        );

        await pool.query(
          `
          UPDATE "Order"
          SET "statusCurrent" = 'PICKED_UP', "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [orderId]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'PICKED_UP', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            eventId,
            orderId,
            user.id,
            user.role,
            notes ?? "Pickup confirmed by driver",
            JSON.stringify({
              stopId: driverPickupStopId,
              driverId: scope.driverId,
              tagCode,
              photoRef,
              notes,
            }),
          ]
        );
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      return json(res, 200, {
        data: {
          pickupConfirmed: true,
          stopId: driverPickupStopId,
          orderId,
          statusCurrent: "PICKED_UP",
        },
      });
    }

    const devGenerateOtpOrderId = pathParam(
      url.pathname,
      /^\/v1\/dev\/orders\/([^/]+)\/delivery-otp$/
    );
    if (method === "POST" && devGenerateOtpOrderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "generate delivery otp")) return;

      const body = await readJsonBody(req);
      const expiresInHoursRaw = Number(body.expiresInHours ?? 6);
      const expiresInHours = Number.isFinite(expiresInHoursRaw) ? expiresInHoursRaw : 6;

      const orderResult = await pool.query(
        `
        SELECT "id"
        FROM "Order"
        WHERE "id" = $1
        LIMIT 1
        `,
        [devGenerateOtpOrderId]
      );

      if (orderResult.rows.length === 0) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const otp = generateDeliveryOtpCode();
      const otpHash = hashDeliveryOtp(otp);

      await pool.query(
        `
        INSERT INTO "OrderDeliveryOtp" ("id", "orderId", "otpHash", "expiresAt", "usedAt", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW() + ($4 * INTERVAL '1 hour'), NULL, NOW(), NOW())
        ON CONFLICT ("orderId")
        DO UPDATE SET
          "otpHash" = EXCLUDED."otpHash",
          "expiresAt" = EXCLUDED."expiresAt",
          "usedAt" = NULL,
          "updatedAt" = NOW()
        `,
        [crypto.randomUUID(), devGenerateOtpOrderId, otpHash, expiresInHours]
      );

      return json(res, 200, {
        data: {
          orderId: devGenerateOtpOrderId,
          otp,
          expiresInHours,
        },
      });
    }

    const driverDeliverStopId = pathParam(url.pathname, /^\/v1\/driver\/stops\/([^/]+)\/deliver$/);
    if (method === "POST" && driverDeliverStopId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DRIVER"], "confirm delivery")) return;

      const scope = await resolveScope(user);
      if (!scope.driverId) {
        return sendError(res, 404, "DRIVER_PROFILE_NOT_FOUND", "Driver profile was not found");
      }

      const body = await readJsonBody(req);
      const otp = String(body.otp ?? "").trim();
      const photoRef =
        body.photoRef === null || body.photoRef === undefined
          ? null
          : String(body.photoRef).trim() || null;
      const signatureName =
        body.signatureName === null || body.signatureName === undefined
          ? null
          : String(body.signatureName).trim() || null;
      const signatureRef =
        body.signatureRef === null || body.signatureRef === undefined
          ? null
          : String(body.signatureRef).trim() || null;
      const notes =
        body.notes === null || body.notes === undefined ? null : String(body.notes).trim() || null;

      if (!otp) {
        return sendError(res, 400, "VALIDATION_ERROR", "otp is required");
      }

      const stopResult = await pool.query(
        `
        SELECT
          ts."id",
          ts."tripId",
          ts."orderId",
          ts."stopType",
          ts."status",
          t."driverId"
        FROM "TripStop" ts
        INNER JOIN "Trip" t ON t."id" = ts."tripId"
        WHERE ts."id" = $1
          AND t."driverId" = $2
        LIMIT 1
        `,
        [driverDeliverStopId, scope.driverId]
      );

      if (stopResult.rows.length === 0) {
        return sendError(res, 404, "STOP_NOT_FOUND", "Stop was not found");
      }

      const stop = stopResult.rows[0];
      const stopType = getString(stop, "stopType", "stoptype");
      const stopStatus = getString(stop, "status");
      const orderId = getString(stop, "orderId", "orderid");

      if (stopType !== "DROPOFF") {
        return sendError(res, 409, "STOP_TYPE_INVALID", "Stop is not a delivery stop");
      }

      if (stopStatus === "DONE") {
        return sendError(res, 409, "STOP_ALREADY_COMPLETED", "Stop has already been completed");
      }

      const otpResult = await pool.query(
        `
        SELECT "id", "otpHash", "expiresAt", "usedAt"
        FROM "OrderDeliveryOtp"
        WHERE "orderId" = $1
        LIMIT 1
        `,
        [orderId]
      );

      if (otpResult.rows.length === 0) {
        return sendError(res, 409, "OTP_INVALID", "Delivery OTP is invalid");
      }

      const otpRow = otpResult.rows[0];
      const now = Date.now();
      const expiresAtMs = new Date(otpRow.expiresAt).getTime();

      if (otpRow.usedAt) {
        return sendError(res, 409, "OTP_INVALID", "Delivery OTP is invalid");
      }

      if (expiresAtMs <= now) {
        return sendError(res, 409, "OTP_EXPIRED", "Delivery OTP has expired");
      }

      if (getString(otpRow, "otpHash", "otphash") !== hashDeliveryOtp(otp)) {
        return sendError(res, 409, "OTP_INVALID", "Delivery OTP is invalid");
      }

      const eventId = crypto.randomUUID();

      await pool.query("BEGIN");

      try {
        await pool.query(
          `
          UPDATE "TripStop"
          SET "status" = 'DONE', "notes" = COALESCE($2, "notes"), "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [driverDeliverStopId, notes]
        );

        await pool.query(
          `
          UPDATE "Order"
          SET "statusCurrent" = 'DELIVERED', "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [orderId]
        );

        await pool.query(
          `
          UPDATE "OrderDeliveryOtp"
          SET "usedAt" = NOW(), "updatedAt" = NOW()
          WHERE "orderId" = $1
          `,
          [orderId]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'DELIVERED', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            eventId,
            orderId,
            user.id,
            user.role,
            notes ?? "Delivery confirmed by driver",
            JSON.stringify({
              stopId: driverDeliverStopId,
              driverId: scope.driverId,
              otpVerified: true,
              photoRef,
              signatureName,
              signatureRef,
              notes,
            }),
          ]
        );
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      return json(res, 200, {
        data: {
          deliveryConfirmed: true,
          stopId: driverDeliverStopId,
          orderId,
          statusCurrent: "DELIVERED",
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/audit-logs") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "access audit logs")) return;

      const targetType =
        url.searchParams.get("targetType") ?? url.searchParams.get("targetResourceType");
      const targetId = url.searchParams.get("targetId") ?? url.searchParams.get("targetResourceId");

      let query = `
        SELECT
          "id",
          "actorUserId",
          "actorRole",
          "actionCode",
          "targetType",
          "targetId",
          "reason",
          "beforeJson",
          "afterJson",
          "ipAddress",
          "userAgent",
          "occurredAt"
        FROM "AuditLog"
      `;
      const params: string[] = [];

      if (targetType && targetId) {
        query += ` WHERE "targetType" = $1 AND "targetId" = $2`;
        params.push(targetType, targetId);
      }

      query += ` ORDER BY "occurredAt" DESC`;

      const result = await pool.query(query, params);
      console.log("[login] tokens issued");

      return json(res, 200, { data: { auditLogs: result.rows } });
    }

    if (method === "GET" && url.pathname === "/v1/admin/audit") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "access admin audit logs")) return;

      const actorUserId = url.searchParams.get("actorUserId");
      const targetType = url.searchParams.get("targetType");
      const targetId = url.searchParams.get("targetId");
      const occurredFrom = url.searchParams.get("occurredFrom");
      const occurredTo = url.searchParams.get("occurredTo");

      let query = `
        SELECT
          "id",
          "actorUserId",
          "actorRole",
          "actionCode",
          "targetType",
          "targetId",
          "reason",
          "beforeJson",
          "afterJson",
          "ipAddress",
          "userAgent",
          "occurredAt"
        FROM "AuditLog"
      `;

      const conditions: string[] = [];
      const params: string[] = [];

      if (actorUserId) {
        params.push(actorUserId);
        conditions.push(`"actorUserId" = $${params.length}`);
      }

      if (targetType) {
        params.push(targetType);
        conditions.push(`"targetType" = $${params.length}`);
      }

      if (targetId) {
        params.push(targetId);
        conditions.push(`"targetId" = $${params.length}`);
      }

      if (occurredFrom) {
        params.push(occurredFrom);
        conditions.push(`"occurredAt" >= $${params.length}::timestamptz`);
      }

      if (occurredTo) {
        params.push(occurredTo);
        conditions.push(`"occurredAt" <= $${params.length}::timestamptz`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }

      query += ` ORDER BY "occurredAt" DESC`;

      const result = await pool.query(query, params);
      console.log("[login] tokens issued");

      return json(res, 200, { data: { auditLogs: result.rows } });
    }

    const auditLogId = pathParam(url.pathname, /^\/v1\/admin\/audit\/([^/]+)$/);
    if (method === "GET" && auditLogId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "access admin audit log detail")) return;

      const result = await pool.query(
        `
        SELECT
          "id",
          "actorUserId",
          "actorRole",
          "actionCode",
          "targetType",
          "targetId",
          "reason",
          "beforeJson",
          "afterJson",
          "ipAddress",
          "userAgent",
          "occurredAt"
        FROM "AuditLog"
        WHERE "id" = $1
        LIMIT 1
        `,
        [auditLogId]
      );

      if (result.rows.length === 0) {
        return sendError(res, 404, "AUDIT_LOG_NOT_FOUND", "Audit log was not found");
      }

      console.log("[login] tokens issued");

      return json(res, 200, { data: { auditLog: result.rows[0] } });
    }

    const assignHubOrderId = pathParam(
      url.pathname,
      /^\/v1\/dev\/override\/orders\/([^/]+)\/assign-hub$/
    );
    if (method === "POST" && assignHubOrderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DEV_ADMIN"], "use DevAdmin override assign-hub")) return;

      const body = await readJsonBody(req);
      const hubId = String(body.hubId ?? "").trim();
      const reason = String(body.reason ?? "").trim();

      if (!hubId || !reason) {
        return sendError(res, 400, "VALIDATION_ERROR", "hubId and reason are required");
      }

      const order = await fetchOrderById(assignHubOrderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const hubCheck = await pool.query(`SELECT "id" FROM "Hub" WHERE "id" = $1 LIMIT 1`, [hubId]);
      if (hubCheck.rows.length === 0) {
        return sendError(res, 404, "HUB_NOT_FOUND", "Hub was not found");
      }

      const beforeHubId = getString(order, "hubId", "hubid");

      await pool.query(
        `
        UPDATE "Order"
        SET "hubId" = $2, "updatedAt" = NOW()
        WHERE "id" = $1
        `,
        [assignHubOrderId, hubId]
      );

      await recordAudit({
        actorUserId: user.id,
        actorRole: user.role,
        actionCode: "DEV_OVERRIDE_ASSIGN_HUB",
        targetType: "ORDER",
        targetId: assignHubOrderId,
        reason,
        before: { hubId: beforeHubId },
        after: { hubId },
        requestMeta: getRequestMeta(req),
      });

      const updatedOrder = await fetchOrderById(assignHubOrderId);

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          order: updatedOrder,
          override: {
            actionCode: "DEV_OVERRIDE_ASSIGN_HUB",
            reason,
          },
        },
      });
    }

    const appendEventOrderId = pathParam(
      url.pathname,
      /^\/v1\/dev\/override\/orders\/([^/]+)\/append-event$/
    );
    if (method === "POST" && appendEventOrderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DEV_ADMIN"], "use DevAdmin override append-event")) return;

      const body = await readJsonBody(req);
      const eventType = String(body.eventType ?? "").trim();
      const notes = String(body.notes ?? "").trim();
      const reason = String(body.reason ?? "").trim();

      if (!eventType || !reason) {
        return sendError(res, 400, "VALIDATION_ERROR", "eventType and reason are required");
      }

      const validEventTypes = new Set([
        "ORDER_CREATED",
        "HUB_ASSIGNED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "RECEIVED_AT_HUB",
        "WASHING_STARTED",
        "DRYING_STARTED",
        "IRONING_STARTED",
        "PACKED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "PAYMENT_DUE",
        "PAID",
        "ISSUE_OPENED",
        "ISSUE_UPDATED",
        "ISSUE_RESOLVED",
      ]);

      if (!validEventTypes.has(eventType)) {
        return sendError(res, 400, "VALIDATION_ERROR", "eventType is not supported");
      }

      const order = await fetchOrderById(appendEventOrderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const eventId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "OrderEvent" (
          "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
        )
        VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7::jsonb, NOW())
        `,
        [
          eventId,
          appendEventOrderId,
          eventType,
          user.id,
          user.role,
          notes || null,
          JSON.stringify({ source: "dev_override", reason }),
        ]
      );

      await recordAudit({
        actorUserId: user.id,
        actorRole: user.role,
        actionCode: "DEV_OVERRIDE_APPEND_EVENT",
        targetType: "ORDER",
        targetId: appendEventOrderId,
        reason,
        before: { appendedEvent: null },
        after: { appendedEvent: { id: eventId, eventType, notes: notes || null } },
        requestMeta: getRequestMeta(req),
      });

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          appendedEvent: {
            id: eventId,
            orderId: appendEventOrderId,
            eventType,
            notes: notes || null,
          },
          override: {
            actionCode: "DEV_OVERRIDE_APPEND_EVENT",
            reason,
          },
        },
      });
    }

    const pricingPlanActivateId = pathParam(
      url.pathname,
      /^\/v1\/admin\/pricing\/plans\/([^/]+)\/activate$/
    );

    if (method === "GET" && url.pathname === "/v1/admin/pricing/plans") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "list pricing plans")) return;

      const result = await pool.query(
        `
        SELECT
          p."id",
          p."name",
          p."status",
          p."effectiveFrom",
          p."effectiveTo",
          p."createdAt",
          p."updatedAt"
        FROM "PricingPlan" p
        ORDER BY p."createdAt" DESC
        `
      );

      const channelResult = await pool.query(
        `
        SELECT
          pc."id",
          pc."planId",
          pc."channel",
          pc."createdAt"
        FROM "PricingPlanChannel" pc
        ORDER BY pc."createdAt" ASC
        `
      );

      const groupedChannels = new Map<string, Array<Record<string, unknown>>>();
      for (const row of channelResult.rows) {
        const existing = groupedChannels.get(row.planId) ?? [];
        existing.push({
          id: row.id,
          planId: row.planId,
          channel: row.channel,
          createdAt: row.createdAt,
        });
        groupedChannels.set(row.planId, existing);
      }

      return json(res, 200, {
        data: {
          plans: result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            status: row.status,
            effectiveFrom: row.effectiveFrom,
            effectiveTo: row.effectiveTo,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            channels: groupedChannels.get(row.id) ?? [],
          })),
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/admin/pricing/plans") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "create pricing plan")) return;

      const body = await readJsonBody(req);
      const name = String(body.name ?? "").trim();
      const channels =
        Array.isArray(body.channels) && body.channels.length > 0
          ? body.channels.map((value: unknown) => String(value))
          : ["DOOR", "SHOP_DROP", "HYBRID"];

      if (!name) {
        return sendError(res, 400, "VALIDATION_ERROR", "name is required");
      }

      const validChannels = new Set(["DOOR", "SHOP_DROP", "HYBRID"]);
      for (const channel of channels) {
        if (!validChannels.has(channel)) {
          return sendError(res, 400, "VALIDATION_ERROR", "channel is not supported");
        }
      }

      const dedupedChannels = [...new Set(channels)];
      const planId = crypto.randomUUID();

      await pool.query("BEGIN");

      try {
        await pool.query(
          `
          INSERT INTO "PricingPlan" (
            "id", "name", "status", "effectiveFrom", "effectiveTo", "createdAt", "updatedAt"
          )
          VALUES ($1, $2, 'DRAFT', NULL, NULL, NOW(), NOW())
          `,
          [planId, name]
        );

        for (const channel of dedupedChannels) {
          await pool.query(
            `
            INSERT INTO "PricingPlanChannel" (
              "id", "planId", "channel", "createdAt"
            )
            VALUES ($1, $2, $3::"OrderChannel", NOW())
            `,
            [crypto.randomUUID(), planId, channel]
          );
        }

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PRICING_PLAN_CREATED",
          targetType: "PRICING_PLAN",
          targetId: planId,
          reason: null,
          before: null,
          after: {
            id: planId,
            name,
            status: "DRAFT",
            channels: dedupedChannels,
          },
          requestMeta: getRequestMeta(req),
        });
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const createdPlan = await pool.query(
        `
        SELECT
          p."id",
          p."name",
          p."status",
          p."effectiveFrom",
          p."effectiveTo",
          p."createdAt",
          p."updatedAt"
        FROM "PricingPlan" p
        WHERE p."id" = $1
        `,
        [planId]
      );

      const createdChannels = await pool.query(
        `
        SELECT
          pc."id",
          pc."planId",
          pc."channel",
          pc."createdAt"
        FROM "PricingPlanChannel" pc
        WHERE pc."planId" = $1
        ORDER BY pc."createdAt" ASC
        `,
        [planId]
      );

      return json(res, 201, {
        data: {
          plan: {
            ...createdPlan.rows[0],
            channels: createdChannels.rows,
          },
        },
      });
    }

    if (method === "POST" && pricingPlanActivateId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "activate pricing plan")) return;

      const body = await readJsonBody(req);
      const effectiveFrom = body.effectiveFrom ? new Date(String(body.effectiveFrom)) : new Date();
      const effectiveTo = body.effectiveTo ? new Date(String(body.effectiveTo)) : null;

      if (Number.isNaN(effectiveFrom.getTime())) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "effectiveFrom must be a valid ISO datetime"
        );
      }

      if (effectiveTo && Number.isNaN(effectiveTo.getTime())) {
        return sendError(res, 400, "VALIDATION_ERROR", "effectiveTo must be a valid ISO datetime");
      }

      const existingPlan = await pool.query(
        `
        SELECT
          p."id",
          p."name",
          p."status",
          p."effectiveFrom",
          p."effectiveTo",
          p."createdAt",
          p."updatedAt"
        FROM "PricingPlan" p
        WHERE p."id" = $1
        `,
        [pricingPlanActivateId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      await pool.query(
        `
        UPDATE "PricingPlan"
        SET
          "status" = 'ACTIVE',
          "effectiveFrom" = $2,
          "effectiveTo" = $3,
          "updatedAt" = NOW()
        WHERE "id" = $1
        `,
        [
          pricingPlanActivateId,
          effectiveFrom.toISOString(),
          effectiveTo ? effectiveTo.toISOString() : null,
        ]
      );

      const updatedPlan = await pool.query(
        `
        SELECT
          p."id",
          p."name",
          p."status",
          p."effectiveFrom",
          p."effectiveTo",
          p."createdAt",
          p."updatedAt"
        FROM "PricingPlan" p
        WHERE p."id" = $1
        `,
        [pricingPlanActivateId]
      );

      const updatedChannels = await pool.query(
        `
        SELECT
          pc."id",
          pc."planId",
          pc."channel",
          pc."createdAt"
        FROM "PricingPlanChannel" pc
        WHERE pc."planId" = $1
        ORDER BY pc."createdAt" ASC
        `,
        [pricingPlanActivateId]
      );

      await recordAudit({
        actorUserId: user.id,
        actorRole: user.role,
        actionCode: "PRICING_PLAN_ACTIVATED",
        targetType: "PRICING_PLAN",
        targetId: pricingPlanActivateId,
        reason: null,
        before: existingPlan.rows[0],
        after: updatedPlan.rows[0],
        requestMeta: getRequestMeta(req),
      });

      return json(res, 200, {
        data: {
          plan: {
            ...updatedPlan.rows[0],
            channels: updatedChannels.rows,
          },
        },
      });
    }

    const pricingPlanRatesId = pathParam(
      url.pathname,
      /^\/v1\/admin\/pricing\/plans\/([^/]+)\/rates$/
    );

    if (method === "POST" && pricingPlanRatesId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "set pricing rates")) return;

      const body = await readJsonBody(req);
      const kgRates = Array.isArray(body.kgRates) ? body.kgRates : [];
      const itemRates = Array.isArray(body.itemRates) ? body.itemRates : [];

      const validTiers = new Set(["STANDARD_48H", "EXPRESS_24H", "SAME_DAY"]);
      const validServiceTypes = new Set(["WASH_DRY_FOLD", "IRONING", "ADDON_SCENT"]);
      const validItemCodes = new Set(["DUVET", "SUIT", "CURTAIN_HEAVY"]);

      const existingPlan = await pool.query(
        `
        SELECT "id", "name", "status"
        FROM "PricingPlan"
        WHERE "id" = $1
        `,
        [pricingPlanRatesId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      for (const rate of kgRates) {
        const tier = String(rate.tier ?? "");
        const serviceType = String(rate.serviceType ?? "");
        const pricePerKgTzs = Number(rate.pricePerKgTzs);

        if (!validTiers.has(tier)) {
          return sendError(res, 400, "VALIDATION_ERROR", "kgRates tier is invalid");
        }
        if (!validServiceTypes.has(serviceType)) {
          return sendError(res, 400, "VALIDATION_ERROR", "kgRates serviceType is invalid");
        }
        if (!Number.isInteger(pricePerKgTzs) || pricePerKgTzs < 0) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "kgRates pricePerKgTzs must be a non-negative integer"
          );
        }
      }

      for (const rate of itemRates) {
        const tier = String(rate.tier ?? "");
        const itemCode = String(rate.itemCode ?? "");
        const priceTzs = Number(rate.priceTzs);

        if (!validTiers.has(tier)) {
          return sendError(res, 400, "VALIDATION_ERROR", "itemRates tier is invalid");
        }
        if (!validItemCodes.has(itemCode)) {
          return sendError(res, 400, "VALIDATION_ERROR", "itemRates itemCode is invalid");
        }
        if (!Number.isInteger(priceTzs) || priceTzs < 0) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "itemRates priceTzs must be a non-negative integer"
          );
        }
      }

      await pool.query("BEGIN");

      try {
        for (const rate of kgRates) {
          await pool.query(
            `
            INSERT INTO "KgRate" (
              "id", "planId", "tier", "serviceType", "pricePerKgTzs", "createdAt", "updatedAt"
            )
            VALUES ($1, $2, $3::"OrderTier", $4::"PricingServiceType", $5, NOW(), NOW())
            ON CONFLICT ("planId", "tier", "serviceType")
            DO UPDATE SET
              "pricePerKgTzs" = EXCLUDED."pricePerKgTzs",
              "updatedAt" = NOW()
            `,
            [
              crypto.randomUUID(),
              pricingPlanRatesId,
              String(rate.tier),
              String(rate.serviceType),
              Number(rate.pricePerKgTzs),
            ]
          );
        }

        for (const rate of itemRates) {
          await pool.query(
            `
            INSERT INTO "ItemRate" (
              "id", "planId", "tier", "itemCode", "priceTzs", "createdAt", "updatedAt"
            )
            VALUES ($1, $2, $3::"OrderTier", $4::"PricingItemCode", $5, NOW(), NOW())
            ON CONFLICT ("planId", "tier", "itemCode")
            DO UPDATE SET
              "priceTzs" = EXCLUDED."priceTzs",
              "updatedAt" = NOW()
            `,
            [
              crypto.randomUUID(),
              pricingPlanRatesId,
              String(rate.tier),
              String(rate.itemCode),
              Number(rate.priceTzs),
            ]
          );
        }

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PRICING_RATES_UPSERTED",
          targetType: "PRICING_PLAN",
          targetId: pricingPlanRatesId,
          reason: null,
          before: null,
          after: {
            kgRatesCount: kgRates.length,
            itemRatesCount: itemRates.length,
          },
          requestMeta: getRequestMeta(req),
        });
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const savedKgRates = await pool.query(
        `
        SELECT
          "id",
          "planId",
          "tier",
          "serviceType",
          "pricePerKgTzs",
          "createdAt",
          "updatedAt"
        FROM "KgRate"
        WHERE "planId" = $1
        ORDER BY "tier" ASC, "serviceType" ASC
        `,
        [pricingPlanRatesId]
      );

      const savedItemRates = await pool.query(
        `
        SELECT
          "id",
          "planId",
          "tier",
          "itemCode",
          "priceTzs",
          "createdAt",
          "updatedAt"
        FROM "ItemRate"
        WHERE "planId" = $1
        ORDER BY "tier" ASC, "itemCode" ASC
        `,
        [pricingPlanRatesId]
      );

      return json(res, 200, {
        data: {
          planId: pricingPlanRatesId,
          kgRates: savedKgRates.rows,
          itemRates: savedItemRates.rows,
        },
      });
    }

    if (method === "GET" && pricingPlanRatesId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "read pricing rates")) return;

      const tier = String(url.searchParams.get("tier") ?? "").trim();

      const existingPlan = await pool.query(
        `
        SELECT "id"
        FROM "PricingPlan"
        WHERE "id" = $1
        `,
        [pricingPlanRatesId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      const kgQuery =
        tier.length > 0
          ? pool.query(
              `
              SELECT
                "id",
                "planId",
                "tier",
                "serviceType",
                "pricePerKgTzs",
                "createdAt",
                "updatedAt"
              FROM "KgRate"
              WHERE "planId" = $1 AND "tier" = $2::"OrderTier"
              ORDER BY "serviceType" ASC
              `,
              [pricingPlanRatesId, tier]
            )
          : pool.query(
              `
              SELECT
                "id",
                "planId",
                "tier",
                "serviceType",
                "pricePerKgTzs",
                "createdAt",
                "updatedAt"
              FROM "KgRate"
              WHERE "planId" = $1
              ORDER BY "tier" ASC, "serviceType" ASC
              `,
              [pricingPlanRatesId]
            );

      const itemQuery =
        tier.length > 0
          ? pool.query(
              `
              SELECT
                "id",
                "planId",
                "tier",
                "itemCode",
                "priceTzs",
                "createdAt",
                "updatedAt"
              FROM "ItemRate"
              WHERE "planId" = $1 AND "tier" = $2::"OrderTier"
              ORDER BY "itemCode" ASC
              `,
              [pricingPlanRatesId, tier]
            )
          : pool.query(
              `
              SELECT
                "id",
                "planId",
                "tier",
                "itemCode",
                "priceTzs",
                "createdAt",
                "updatedAt"
              FROM "ItemRate"
              WHERE "planId" = $1
              ORDER BY "tier" ASC, "itemCode" ASC
              `,
              [pricingPlanRatesId]
            );

      const [kgRatesResult, itemRatesResult] = await Promise.all([kgQuery, itemQuery]);

      return json(res, 200, {
        data: {
          planId: pricingPlanRatesId,
          tier: tier || null,
          kgRates: kgRatesResult.rows,
          itemRates: itemRatesResult.rows,
        },
      });
    }

    const pricingPlanDeliveryFeesId = pathParam(
      url.pathname,
      /^\/v1\/admin\/pricing\/plans\/([^/]+)\/delivery-fees$/
    );

    if (method === "POST" && pricingPlanDeliveryFeesId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "set delivery zone fees")) return;

      const body = await readJsonBody(req);
      const fees = Array.isArray(body.fees) ? body.fees : [];

      const existingPlan = await pool.query(
        `
        SELECT "id", "name", "status"
        FROM "PricingPlan"
        WHERE "id" = $1
        `,
        [pricingPlanDeliveryFeesId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      for (const fee of fees) {
        const zoneId = String(fee.zoneId ?? "").trim();
        const doorFeeTzs = Number(fee.doorFeeTzs);
        const freeThresholdTzs =
          fee.freeThresholdTzs === null ||
          fee.freeThresholdTzs === undefined ||
          fee.freeThresholdTzs === ""
            ? null
            : Number(fee.freeThresholdTzs);

        if (!zoneId) {
          return sendError(res, 400, "VALIDATION_ERROR", "zoneId is required");
        }

        if (!Number.isInteger(doorFeeTzs) || doorFeeTzs < 0) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "doorFeeTzs must be a non-negative integer"
          );
        }

        if (
          freeThresholdTzs !== null &&
          (!Number.isInteger(freeThresholdTzs) || freeThresholdTzs < 0)
        ) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "freeThresholdTzs must be null or a non-negative integer"
          );
        }

        const zoneExists = await pool.query(
          `
          SELECT "id"
          FROM "Zone"
          WHERE "id" = $1
          `,
          [zoneId]
        );

        if (zoneExists.rowCount === 0) {
          return sendError(res, 400, "VALIDATION_ERROR", "zoneId was not found");
        }
      }

      await pool.query("BEGIN");

      try {
        for (const fee of fees) {
          const zoneId = String(fee.zoneId);
          const doorFeeTzs = Number(fee.doorFeeTzs);
          const freeThresholdTzs =
            fee.freeThresholdTzs === null ||
            fee.freeThresholdTzs === undefined ||
            fee.freeThresholdTzs === ""
              ? null
              : Number(fee.freeThresholdTzs);

          await pool.query(
            `
            INSERT INTO "DeliveryZoneFee" (
              "id", "planId", "zoneId", "doorFeeTzs", "freeThresholdTzs", "createdAt", "updatedAt"
            )
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            ON CONFLICT ("planId", "zoneId")
            DO UPDATE SET
              "doorFeeTzs" = EXCLUDED."doorFeeTzs",
              "freeThresholdTzs" = EXCLUDED."freeThresholdTzs",
              "updatedAt" = NOW()
            `,
            [crypto.randomUUID(), pricingPlanDeliveryFeesId, zoneId, doorFeeTzs, freeThresholdTzs]
          );
        }

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PRICING_DELIVERY_FEES_UPSERTED",
          targetType: "PRICING_PLAN",
          targetId: pricingPlanDeliveryFeesId,
          reason: null,
          before: null,
          after: {
            feeCount: fees.length,
          },
          requestMeta: getRequestMeta(req),
        });
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const savedFees = await pool.query(
        `
        SELECT
          dzf."id",
          dzf."planId",
          dzf."zoneId",
          z."name" AS "zoneName",
          dzf."doorFeeTzs",
          dzf."freeThresholdTzs",
          dzf."createdAt",
          dzf."updatedAt"
        FROM "DeliveryZoneFee" dzf
        INNER JOIN "Zone" z ON z."id" = dzf."zoneId"
        WHERE dzf."planId" = $1
        ORDER BY z."name" ASC
        `,
        [pricingPlanDeliveryFeesId]
      );

      return json(res, 200, {
        data: {
          planId: pricingPlanDeliveryFeesId,
          deliveryFees: savedFees.rows,
        },
      });
    }

    if (method === "GET" && pricingPlanDeliveryFeesId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "read delivery zone fees")) return;

      const existingPlan = await pool.query(
        `
        SELECT "id"
        FROM "PricingPlan"
        WHERE "id" = $1
        `,
        [pricingPlanDeliveryFeesId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      const savedFees = await pool.query(
        `
        SELECT
          dzf."id",
          dzf."planId",
          dzf."zoneId",
          z."name" AS "zoneName",
          dzf."doorFeeTzs",
          dzf."freeThresholdTzs",
          dzf."createdAt",
          dzf."updatedAt"
        FROM "DeliveryZoneFee" dzf
        INNER JOIN "Zone" z ON z."id" = dzf."zoneId"
        WHERE dzf."planId" = $1
        ORDER BY z."name" ASC
        `,
        [pricingPlanDeliveryFeesId]
      );

      return json(res, 200, {
        data: {
          planId: pricingPlanDeliveryFeesId,
          deliveryFees: savedFees.rows,
          ruleSummary: {
            DOOR: "zone fee applies",
            SHOP_DROP: "customer delivery fee is 0",
            HYBRID: "return-to-door fee applies during invoice computation",
          },
        },
      });
    }

    const pricingPlanMinimumChargesId = pathParam(
      url.pathname,
      /^\/v1\/admin\/pricing\/plans\/([^/]+)\/minimum-charges$/
    );

    if (method === "POST" && pricingPlanMinimumChargesId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "set minimum charge rules")) return;

      const body = await readJsonBody(req);
      const rules = Array.isArray(body.rules) ? body.rules : [];

      const validTiers = new Set(["STANDARD_48H", "EXPRESS_24H", "SAME_DAY"]);
      const validChannels = new Set(["DOOR", "SHOP_DROP", "HYBRID"]);

      const existingPlan = await pool.query(
        `
        SELECT "id", "name", "status"
        FROM "PricingPlan"
        WHERE "id" = $1
        `,
        [pricingPlanMinimumChargesId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      for (const rule of rules) {
        const tier = String(rule.tier ?? "").trim();
        const channelRaw = rule.channel;
        const channel =
          channelRaw === null || channelRaw === undefined || String(channelRaw).trim() === ""
            ? null
            : String(channelRaw).trim();
        const minimumTzs = Number(rule.minimumTzs);

        if (!validTiers.has(tier)) {
          return sendError(res, 400, "VALIDATION_ERROR", "minimum charge tier is invalid");
        }

        if (channel !== null && !validChannels.has(channel)) {
          return sendError(res, 400, "VALIDATION_ERROR", "minimum charge channel is invalid");
        }

        if (!Number.isInteger(minimumTzs) || minimumTzs < 0) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "minimumTzs must be a non-negative integer"
          );
        }
      }

      await pool.query("BEGIN");

      try {
        for (const rule of rules) {
          const tier = String(rule.tier);
          const channelRaw = rule.channel;
          const channel =
            channelRaw === null || channelRaw === undefined || String(channelRaw).trim() === ""
              ? null
              : String(channelRaw).trim();
          const minimumTzs = Number(rule.minimumTzs);

          await pool.query(
            `
            INSERT INTO "MinimumChargeRule" (
              "id", "planId", "tier", "channel", "minimumTzs", "createdAt", "updatedAt"
            )
            VALUES ($1, $2, $3::"OrderTier", $4::"OrderChannel", $5, NOW(), NOW())
            ON CONFLICT ("planId", "tier", "channel")
            DO UPDATE SET
              "minimumTzs" = EXCLUDED."minimumTzs",
              "updatedAt" = NOW()
            `,
            [crypto.randomUUID(), pricingPlanMinimumChargesId, tier, channel, minimumTzs]
          );
        }

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PRICING_MINIMUM_CHARGES_UPSERTED",
          targetType: "PRICING_PLAN",
          targetId: pricingPlanMinimumChargesId,
          reason: null,
          before: null,
          after: {
            ruleCount: rules.length,
          },
          requestMeta: getRequestMeta(req),
        });
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const savedRules = await pool.query(
        `
        SELECT
          "id",
          "planId",
          "tier",
          "channel",
          "minimumTzs",
          "createdAt",
          "updatedAt"
        FROM "MinimumChargeRule"
        WHERE "planId" = $1
        ORDER BY "tier" ASC, "channel" ASC NULLS FIRST
        `,
        [pricingPlanMinimumChargesId]
      );

      return json(res, 200, {
        data: {
          planId: pricingPlanMinimumChargesId,
          minimumChargeRules: savedRules.rows,
        },
      });
    }

    if (method === "GET" && pricingPlanMinimumChargesId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "read minimum charge rules")) return;

      const tier = String(url.searchParams.get("tier") ?? "").trim();
      const channel = String(url.searchParams.get("channel") ?? "").trim();

      const existingPlan = await pool.query(
        `
        SELECT "id"
        FROM "PricingPlan"
        WHERE "id" = $1
        `,
        [pricingPlanMinimumChargesId]
      );

      if (existingPlan.rowCount === 0) {
        return sendError(res, 404, "PRICING_PLAN_NOT_FOUND", "Pricing plan not found");
      }

      const filters = ['"planId" = $1'];
      const params: Array<string> = [pricingPlanMinimumChargesId];

      if (tier.length > 0) {
        filters.push(`"tier" = $${params.length + 1}::"OrderTier"`);
        params.push(tier);
      }

      if (channel.length > 0) {
        filters.push(`"channel" = $${params.length + 1}::"OrderChannel"`);
        params.push(channel);
      }

      const savedRules = await pool.query(
        `
        SELECT
          "id",
          "planId",
          "tier",
          "channel",
          "minimumTzs",
          "createdAt",
          "updatedAt"
        FROM "MinimumChargeRule"
        WHERE ${filters.join(" AND ")}
        ORDER BY "tier" ASC, "channel" ASC NULLS FIRST
        `,
        params
      );

      return json(res, 200, {
        data: {
          planId: pricingPlanMinimumChargesId,
          tier: tier || null,
          channel: channel || null,
          minimumChargeRules: savedRules.rows,
        },
      });
    }

    const orderInvoiceId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)\/invoice$/);
    if (method === "GET" && orderInvoiceId) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const orderResult = await pool.query(
        `
        SELECT
          o."id",
          o."orderNumber",
          o."customerUserId",
          o."affiliateShopId",
          o."channel",
          o."tier",
          o."zoneId",
          o."hubId",
          o."statusCurrent",
          ops."pricingPlanId",
          ops."pricingPlanEffectiveFrom",
          ops."quoteStatus",
          ops."quotedAt",
          ops."finalizedAt",
          ops."inputsJson",
          ot."subtotal",
          ot."deliveryTotal",
          ot."discountTotal",
          ot."grandTotal",
          ot."balanceDue"
        FROM "Order" o
        LEFT JOIN "OrderPricingSnapshot" ops ON ops."orderId" = o."id"
        LEFT JOIN "OrderTotals" ot ON ot."orderId" = o."id"
        WHERE o."id" = $1
        LIMIT 1
        `,
        [orderInvoiceId]
      );

      if (orderResult.rows.length === 0) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const order = orderResult.rows[0];
      const customerUserId = getString(order, "customerUserId", "customeruserid");
      const affiliateShopId = order.affiliateShopId ? String(order.affiliateShopId) : null;

      const scope = await resolveScope(user);
      const isAdmin = user.role === "ADMIN" || user.role === "DEV_ADMIN";
      const isOwner = user.role === "CUSTOMER" && customerUserId === user.id;
      const isAffiliateScoped =
        user.role === "AFFILIATE_STAFF" &&
        scope.affiliateShopId &&
        affiliateShopId &&
        scope.affiliateShopId === affiliateShopId;

      if (!isAdmin && !isOwner && !isAffiliateScoped) {
        return sendError(res, 403, "FORBIDDEN", "You cannot access this invoice");
      }

      const lineItemsResult = await pool.query(
        `
        SELECT
          "id",
          "type",
          "description",
          "quantity",
          "unitPrice",
          "amount",
          "metaJson",
          "createdAt",
          "updatedAt"
        FROM "OrderLineItem"
        WHERE "orderId" = $1
        ORDER BY "createdAt" ASC, "description" ASC
        `,
        [orderInvoiceId]
      );

      return json(res, 200, {
        data: {
          order: {
            id: getString(order, "id"),
            orderNumber: getString(order, "orderNumber", "ordernumber"),
            channel: getString(order, "channel"),
            tier: getString(order, "tier"),
            zoneId: getString(order, "zoneId", "zoneid"),
            hubId: getString(order, "hubId", "hubid"),
            statusCurrent: getString(order, "statusCurrent", "statuscurrent"),
          },
          pricingSnapshot: {
            pricingPlanId: order.pricingPlanId ?? null,
            pricingPlanEffectiveFrom: order.pricingPlanEffectiveFrom ?? null,
            quoteStatus: order.quoteStatus ?? null,
            quotedAt: order.quotedAt ?? null,
            finalizedAt: order.finalizedAt ?? null,
            inputsJson: order.inputsJson ?? null,
          },
          lineItems: lineItemsResult.rows,
          totals: {
            subtotal: Number(order.subtotal ?? 0),
            deliveryTotal: Number(order.deliveryTotal ?? 0),
            discountTotal: Number(order.discountTotal ?? 0),
            grandTotal: Number(order.grandTotal ?? 0),
            balanceDue: Number(order.balanceDue ?? 0),
          },
        },
      });
    }

    const orderPaymentsId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)\/payments$/);
    if (method === "GET" && orderPaymentsId) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const order = await fetchOrderById(orderPaymentsId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (
        user.role === "CUSTOMER" &&
        getString(order, "customerUserId", "customeruserid") !== user.id
      ) {
        return sendError(res, 403, "FORBIDDEN", "Order does not belong to customer");
      }

      const paymentsResult = await pool.query(
        `
        SELECT
          p."id",
          p."orderId",
          p."method",
          p."amountTzs",
          p."reference",
          p."receivedByUserId",
          p."receivedAt",
          p."status",
          p."provider",
          p."providerTxnId",
          p."verifiedAt",
          p."verifiedByUserId",
          p."collectedByUserId",
          p."collectedAt",
          p."collectedFrom",
          p."receivedAtHubByUserId",
          p."receivedAtHubAt",
          p."cashBatchId",
          p."createdAt",
          p."updatedAt"
        FROM "Payment" p
        WHERE p."orderId" = $1
        ORDER BY p."receivedAt" ASC, p."createdAt" ASC
        `,
        [orderPaymentsId]
      );

      const refundsResult = await pool.query(
        `
        SELECT
          r."id",
          r."orderId",
          r."paymentId",
          r."amountTzs",
          r."method",
          r."reference",
          r."reason",
          r."createdByUserId",
          r."createdAt",
          r."status"
        FROM "Refund" r
        WHERE r."orderId" = $1
        ORDER BY r."createdAt" ASC
        `,
        [orderPaymentsId]
      );

      const ledger = await getOrderLedgerSummary(orderPaymentsId);

      return json(res, 200, {
        data: {
          orderId: orderPaymentsId,
          payments: paymentsResult.rows.map((row) => ({
            ...row,
            amountFormatted: formatMoneyTzs(Number(row.amountTzs ?? 0)),
          })),
          refunds: refundsResult.rows.map((row) => ({
            ...row,
            amountFormatted: formatMoneyTzs(Number(row.amountTzs ?? 0)),
          })),
          ledger: {
            ...ledger,
            grandTotalFormatted: formatMoneyTzs(ledger.grandTotal),
            paymentsRecordedFormatted: formatMoneyTzs(ledger.paymentsRecorded),
            refundsIssuedFormatted: formatMoneyTzs(ledger.refundsIssued),
            creditsNetFormatted: formatMoneyTzs(ledger.creditsNet),
            balanceDueFormatted: formatMoneyTzs(ledger.balanceDue),
          },
        },
      });
    }
    const orderBalanceId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)\/balance$/);
    if (method === "GET" && orderBalanceId) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const order = await fetchOrderById(orderBalanceId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (
        user.role === "CUSTOMER" &&
        getString(order, "customerUserId", "customeruserid") !== user.id
      ) {
        return sendError(res, 403, "FORBIDDEN", "Order does not belong to customer");
      }

      const ledger = await getOrderLedgerSummary(orderBalanceId);
      await syncOrderBalanceDue(orderBalanceId);

      return json(res, 200, {
        data: {
          orderId: orderBalanceId,
          ...ledger,
          grandTotalFormatted: formatMoneyTzs(ledger.grandTotal),
          paymentsRecordedFormatted: formatMoneyTzs(ledger.paymentsRecorded),
          refundsIssuedFormatted: formatMoneyTzs(ledger.refundsIssued),
          creditsNetFormatted: formatMoneyTzs(ledger.creditsNet),
          balanceDueFormatted: formatMoneyTzs(ledger.balanceDue),
        },
      });
    }
    const orderReceiptId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)\/receipt$/);
    if (method === "GET" && orderReceiptId) {
      const user = await requireAuth(req, res);
      if (!user) return;

      const order = await fetchOrderById(orderReceiptId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (
        user.role === "CUSTOMER" &&
        getString(order, "customerUserId", "customeruserid") !== user.id
      ) {
        return sendError(res, 403, "FORBIDDEN", "Order does not belong to customer");
      }

      if (!orderId) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      await evaluateCommissionEligibility({
        orderId,
        actorUserId: user.id,
        actorRole: user.role,
        requestMeta: getRequestMeta(req),
      });

      const receiptResult = await pool.query(
        `
        SELECT
          r."id",
          r."receiptNumber",
          r."orderId",
          r."paymentId",
          r."amountTzs",
          r."reference",
          r."issuedAt",
          r."issuedByUserId",
          p."method" AS "paymentMethod",
          p."status" AS "paymentStatus"
        FROM "Receipt" r
        INNER JOIN "Payment" p ON p."id" = r."paymentId"
        WHERE r."orderId" = $1
        ORDER BY r."issuedAt" DESC
        LIMIT 1
        `,
        [orderReceiptId]
      );

      if (receiptResult.rows.length === 0) {
        return sendError(res, 404, "RECEIPT_NOT_FOUND", "Receipt was not found");
      }

      const receipt = receiptResult.rows[0];
      return json(res, 200, {
        data: {
          receipt: {
            ...receipt,
            amountFormatted: formatMoneyTzs(Number(receipt.amountTzs ?? 0)),
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/payments/cash") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (
        !requireRoles(
          user,
          res,
          ["ADMIN", "DEV_ADMIN", "HUB_STAFF", "DRIVER"],
          "record cash payment"
        )
      )
        return;

      const body = await readJsonBody(req);
      const orderId = String(body.orderId ?? "").trim();
      const amountTzs = Number.isInteger(Number(body.amountTzs)) ? Number(body.amountTzs) : null;
      const collectedFromValue = String(body.collectedFrom ?? "").trim();
      const referenceRaw =
        body.reference === null || body.reference === undefined
          ? null
          : String(body.reference).trim() || null;
      const collectedByUserId = String(body.collectedByUserId ?? user.id).trim();
      const receivedAtHubByUserId =
        body.receivedAtHubByUserId === null || body.receivedAtHubByUserId === undefined
          ? null
          : String(body.receivedAtHubByUserId).trim() || null;
      const cashBatchId =
        body.cashBatchId === null || body.cashBatchId === undefined
          ? null
          : String(body.cashBatchId).trim() || null;

      if (!orderId || amountTzs === null || amountTzs <= 0) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "orderId and positive integer amountTzs are required"
        );
      }

      if (!["CUSTOMER", "AFFILIATE", "OTHER"].includes(collectedFromValue)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "collectedFrom must be CUSTOMER, AFFILIATE, or OTHER"
        );
      }

      const order = await fetchOrderById(orderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const ledgerBefore = await getOrderLedgerSummary(orderId);
      if (ledgerBefore.grandTotal <= 0) {
        return sendError(res, 409, "INVOICE_NOT_READY", "Invoice totals are not ready for payment");
      }
      if (amountTzs > ledgerBefore.balanceDue) {
        return sendError(
          res,
          409,
          "PAYMENT_EXCEEDS_BALANCE",
          `amountTzs cannot exceed current balanceDue (${ledgerBefore.balanceDue})`
        );
      }

      const paymentId = crypto.randomUUID();
      const receiptId = crypto.randomUUID();
      const receiptNumber = nextReceiptNumber();
      const paymentReference = referenceRaw ?? `CASH-${String(Date.now()).slice(-6)}`;

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          INSERT INTO "Payment" (
            "id", "orderId", "method", "amountTzs", "reference",
            "receivedByUserId", "receivedAt", "status",
            "collectedByUserId", "collectedAt", "collectedFrom",
            "receivedAtHubByUserId", "receivedAtHubAt", "cashBatchId",
            "createdAt", "updatedAt"
          )
          VALUES (
            $1, $2, 'CASH', $3, $4,
            $5, NOW(), 'RECORDED',
            $6, NOW(), $7::"CashCollectedFrom",
            $8, CASE WHEN $8::text IS NULL THEN NULL ELSE NOW() END, $9,
            NOW(), NOW()
          )
          `,
          [
            paymentId,
            orderId,
            amountTzs,
            paymentReference,
            user.id,
            collectedByUserId,
            collectedFromValue,
            receivedAtHubByUserId,
            cashBatchId,
          ]
        );

        await pool.query(
          `
          INSERT INTO "Receipt" (
            "id", "receiptNumber", "orderId", "paymentId", "amountTzs",
            "reference", "issuedAt", "issuedByUserId", "createdAt", "updatedAt"
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), NOW())
          `,
          [receiptId, receiptNumber, orderId, paymentId, amountTzs, paymentReference, user.id]
        );

        const newBalance = await syncOrderBalanceDue(orderId);

        await postPaymentJournalIfMissing({
          paymentId,
          method: "CASH",
          amountTzs,
          orderId,
          createdByUserId: user.id,
        });

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'PAID', NOW(), $3, $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            crypto.randomUUID(),
            orderId,
            user.id,
            user.role,
            "Cash payment recorded and receipt issued",
            JSON.stringify({
              actionCode: "ORDER_PAYMENT_RECORDED",
              paymentId,
              receiptId,
              receiptNumber,
              method: "CASH",
              amountTzs,
              reference: paymentReference,
              collectedFrom: collectedFromValue,
              balanceDueAfter: newBalance,
            }),
          ]
        );

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PAYMENT_RECORD",
          targetType: "ORDER",
          targetId: orderId,
          after: {
            paymentId,
            receiptId,
            receiptNumber,
            method: "CASH",
            amountTzs,
            reference: paymentReference,
            collectedFrom: collectedFromValue,
            collectedByUserId,
            receivedAtHubByUserId,
            cashBatchId,
            balanceDueAfter: newBalance,
          },
          requestMeta: getRequestMeta(req),
        });

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return sendError(
          res,
          500,
          "PAYMENT_RECORD_FAILED",
          error instanceof Error ? error.message : "Cash payment recording failed"
        );
      }

      await evaluateCommissionEligibility({
        orderId,
        actorUserId: user.id,
        actorRole: user.role,
        requestMeta: getRequestMeta(req),
      });

      const receiptResult = await pool.query(
        `
        SELECT
          r."id",
          r."receiptNumber",
          r."orderId",
          r."paymentId",
          r."amountTzs",
          r."reference",
          r."issuedAt",
          p."method" AS "paymentMethod"
        FROM "Receipt" r
        INNER JOIN "Payment" p ON p."id" = r."paymentId"
        WHERE r."id" = $1
        LIMIT 1
        `,
        [receiptId]
      );

      return json(res, 201, {
        data: {
          payment: {
            id: paymentId,
            orderId,
            method: "CASH",
            amountTzs,
            amountFormatted: formatMoneyTzs(amountTzs),
            reference: paymentReference,
            status: "RECORDED",
          },
          receipt: {
            ...receiptResult.rows[0],
            amountFormatted: formatMoneyTzs(Number(receiptResult.rows[0]?.amountTzs ?? 0)),
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/payments/mobile-money") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (
        !requireRoles(
          user,
          res,
          ["ADMIN", "DEV_ADMIN", "HUB_STAFF", "DRIVER"],
          "record mobile money payment"
        )
      )
        return;

      const body = await readJsonBody(req);
      const orderId = String(body.orderId ?? "").trim();
      const amountTzs = Number.isInteger(Number(body.amountTzs)) ? Number(body.amountTzs) : null;
      const reference = String(body.reference ?? "").trim();
      const provider = String(body.provider ?? "").trim();
      const providerTxnId =
        body.providerTxnId === null || body.providerTxnId === undefined
          ? null
          : String(body.providerTxnId).trim() || null;

      if (!orderId || amountTzs === null || amountTzs <= 0) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "orderId and positive integer amountTzs are required"
        );
      }
      if (!reference) {
        return sendError(res, 400, "VALIDATION_ERROR", "reference is required for MOBILE_MONEY");
      }
      if (!["MPESA", "TIGO", "AIRTEL", "HALOPESA", "OTHER"].includes(provider)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "provider must be MPESA, TIGO, AIRTEL, HALOPESA, or OTHER"
        );
      }

      const order = await fetchOrderById(orderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const ledgerBefore = await getOrderLedgerSummary(orderId);
      if (ledgerBefore.grandTotal <= 0) {
        return sendError(res, 409, "INVOICE_NOT_READY", "Invoice totals are not ready for payment");
      }
      if (amountTzs > ledgerBefore.balanceDue) {
        return sendError(
          res,
          409,
          "PAYMENT_EXCEEDS_BALANCE",
          `amountTzs cannot exceed current balanceDue (${ledgerBefore.balanceDue})`
        );
      }

      const paymentId = crypto.randomUUID();
      const receiptId = crypto.randomUUID();
      const receiptNumber = nextReceiptNumber();

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          INSERT INTO "Payment" (
            "id", "orderId", "method", "amountTzs", "reference",
            "receivedByUserId", "receivedAt", "status",
            "provider", "providerTxnId", "verifiedAt", "verifiedByUserId",
            "createdAt", "updatedAt"
          )
          VALUES (
            $1, $2, 'MOBILE_MONEY', $3, $4,
            $5, NOW(), 'RECORDED',
            $6::"MobileMoneyProvider", $7, NOW(), $5,
            NOW(), NOW()
          )
          `,
          [paymentId, orderId, amountTzs, reference, user.id, provider, providerTxnId]
        );

        await pool.query(
          `
          INSERT INTO "Receipt" (
            "id", "receiptNumber", "orderId", "paymentId", "amountTzs",
            "reference", "issuedAt", "issuedByUserId", "createdAt", "updatedAt"
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), NOW())
          `,
          [receiptId, receiptNumber, orderId, paymentId, amountTzs, reference, user.id]
        );

        const newBalance = await syncOrderBalanceDue(orderId);

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'PAID', NOW(), $3, $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            crypto.randomUUID(),
            orderId,
            user.id,
            user.role,
            "Mobile money payment recorded",
            JSON.stringify({
              actionCode: "ORDER_PAYMENT_RECORDED",
              paymentId,
              receiptId,
              receiptNumber,
              method: "MOBILE_MONEY",
              amountTzs,
              reference,
              provider,
              providerTxnId,
              balanceDueAfter: newBalance,
            }),
          ]
        );

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PAYMENT_RECORD",
          targetType: "ORDER",
          targetId: orderId,
          after: {
            paymentId,
            receiptId,
            receiptNumber,
            method: "MOBILE_MONEY",
            amountTzs,
            reference,
            provider,
            providerTxnId,
            balanceDueAfter: newBalance,
          },
          requestMeta: getRequestMeta(req),
        });

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return sendError(
          res,
          500,
          "PAYMENT_RECORD_FAILED",
          error instanceof Error ? error.message : "Mobile money payment recording failed"
        );
      }

      await evaluateCommissionEligibility({
        orderId,
        actorUserId: user.id,
        actorRole: user.role,
        requestMeta: getRequestMeta(req),
      });

      const receiptResult = await pool.query(
        `
        SELECT
          r."id",
          r."receiptNumber",
          r."orderId",
          r."paymentId",
          r."amountTzs",
          r."reference",
          r."issuedAt",
          p."method" AS "paymentMethod"
        FROM "Receipt" r
        INNER JOIN "Payment" p ON p."id" = r."paymentId"
        WHERE r."id" = $1
        LIMIT 1
        `,
        [receiptId]
      );

      return json(res, 201, {
        data: {
          payment: {
            id: paymentId,
            orderId,
            method: "MOBILE_MONEY",
            amountTzs,
            amountFormatted: formatMoneyTzs(amountTzs),
            reference,
            provider,
            providerTxnId,
            status: "RECORDED",
          },
          receipt: {
            ...receiptResult.rows[0],
            amountFormatted: formatMoneyTzs(Number(receiptResult.rows[0]?.amountTzs ?? 0)),
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/driver/reconciliation/submit") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DRIVER"], "submit reconciliation")) return;

      const body = await readJsonBody(req);
      const dateValue = String(body.date ?? getTodayDateUtcString()).trim();
      const declaredCashTzs = Number.isInteger(Number(body.declaredCashTzs))
        ? Number(body.declaredCashTzs)
        : null;

      if (declaredCashTzs === null || declaredCashTzs < 0) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "declaredCashTzs must be a non-negative integer"
        );
      }

      const driverResult = await pool.query(
        `
        SELECT "id"
        FROM "DriverProfile"
        WHERE "userId" = $1
        LIMIT 1
        `,
        [user.id]
      );

      if (driverResult.rows.length === 0) {
        return sendError(res, 404, "DRIVER_PROFILE_NOT_FOUND", "Driver profile was not found");
      }

      const driverId = String(driverResult.rows[0].id);

      const expectedResult = await pool.query(
        `
        SELECT COALESCE(SUM(p."amountTzs"), 0) AS total
        FROM "Payment" p
        WHERE p."method" = 'CASH'
          AND p."status" = 'RECORDED'
          AND p."collectedByUserId" = $1
          AND p."collectedAt"::date = $2::date
        `,
        [user.id, dateValue]
      );

      const expectedCashTzs = Number(expectedResult.rows[0]?.total ?? 0);
      const differenceTzs = declaredCashTzs - expectedCashTzs;
      const reconciliationId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "CashReconciliation" (
          "id", "driverId", "date", "expectedCashTzs", "declaredCashTzs",
          "differenceTzs", "status", "submittedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, 'SUBMITTED', NOW()
        )
        ON CONFLICT ("driverId", "date")
        DO UPDATE SET
          "expectedCashTzs" = EXCLUDED."expectedCashTzs",
          "declaredCashTzs" = EXCLUDED."declaredCashTzs",
          "differenceTzs" = EXCLUDED."differenceTzs",
          "status" = 'SUBMITTED',
          "submittedAt" = NOW(),
          "approvedAt" = NULL,
          "approvedByUserId" = NULL
        `,
        [reconciliationId, driverId, dateValue, expectedCashTzs, declaredCashTzs, differenceTzs]
      );

      return json(res, 200, {
        data: {
          driverId,
          date: dateValue,
          expectedCashTzs,
          declaredCashTzs,
          differenceTzs,
          status: "SUBMITTED",
        },
      });
    }

    const adminReconciliationApproveId = pathParam(
      url.pathname,
      /^\/v1\/admin\/reconciliation\/([^/]+)\/approve$/
    );
    if (method === "POST" && adminReconciliationApproveId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "approve reconciliation")) return;

      const existing = await pool.query(
        `
        SELECT *
        FROM "CashReconciliation"
        WHERE "id" = $1
        LIMIT 1
        `,
        [adminReconciliationApproveId]
      );

      if (existing.rows.length === 0) {
        return sendError(res, 404, "RECONCILIATION_NOT_FOUND", "Reconciliation was not found");
      }

      await pool.query(
        `
        UPDATE "CashReconciliation"
        SET "status" = 'APPROVED',
            "approvedAt" = NOW(),
            "approvedByUserId" = $2
        WHERE "id" = $1
        `,
        [adminReconciliationApproveId, user.id]
      );

      return json(res, 200, {
        data: {
          reconciliationId: adminReconciliationApproveId,
          status: "APPROVED",
          approvedByUserId: user.id,
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/admin/reconciliation/drivers") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "view reconciliation summary")) return;

      const dateValue = String(url.searchParams.get("date") ?? getTodayDateUtcString()).trim();

      const result = await pool.query(
        `
        SELECT
          cr."id",
          cr."date",
          cr."expectedCashTzs",
          cr."declaredCashTzs",
          cr."differenceTzs",
          cr."status",
          cr."submittedAt",
          cr."approvedAt",
          cr."approvedByUserId",
          dp."id" AS "driverId",
          dp."userId" AS "driverUserId",
          u."fullName" AS "driverName",
          u."phone" AS "driverPhone"
        FROM "CashReconciliation" cr
        INNER JOIN "DriverProfile" dp ON dp."id" = cr."driverId"
        INNER JOIN "User" u ON u."id" = dp."userId"
        WHERE cr."date" = $1
        ORDER BY u."fullName" ASC
        `,
        [dateValue]
      );

      return json(res, 200, {
        data: {
          date: dateValue,
          reconciliations: result.rows,
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/admin/reports/driver-cash") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "view driver cash report")) return;

      const dateValue = String(url.searchParams.get("date") ?? getTodayDateUtcString()).trim();

      const result = await pool.query(
        `
        SELECT
          dp."id" AS "driverId",
          dp."userId" AS "driverUserId",
          u."fullName" AS "driverName",
          u."phone" AS "driverPhone",
          COALESCE(expected.expected_cash_tzs, 0) AS "expectedCashTzs",
          cr."id" AS "reconciliationId",
          cr."declaredCashTzs",
          cr."differenceTzs",
          cr."status",
          cr."submittedAt",
          cr."approvedAt",
          cr."approvedByUserId"
        FROM "DriverProfile" dp
        INNER JOIN "User" u ON u."id" = dp."userId"
        LEFT JOIN (
          SELECT
            p."collectedByUserId" AS "driverUserId",
            COALESCE(SUM(p."amountTzs"), 0) AS expected_cash_tzs
          FROM "Payment" p
          WHERE p."method" = 'CASH'
            AND p."status" = 'RECORDED'
            AND p."collectedByUserId" IS NOT NULL
            AND p."collectedAt"::date = $1::date
          GROUP BY p."collectedByUserId"
        ) expected ON expected."driverUserId" = dp."userId"
        LEFT JOIN "CashReconciliation" cr
          ON cr."driverId" = dp."id"
         AND cr."date" = $2
        WHERE dp."isActive" = TRUE
        ORDER BY u."fullName" ASC
        `,
        [dateValue, dateValue]
      );

      const rows = result.rows.map((row) => {
        const expectedCashTzs = Number(row.expectedCashTzs ?? 0);
        const declaredCashTzs =
          row.declaredCashTzs === null || row.declaredCashTzs === undefined
            ? null
            : Number(row.declaredCashTzs);
        const differenceTzs =
          row.differenceTzs === null || row.differenceTzs === undefined
            ? declaredCashTzs === null
              ? null
              : declaredCashTzs - expectedCashTzs
            : Number(row.differenceTzs);

        const status =
          getString(row, "status") ?? (declaredCashTzs === null ? "OPEN" : "SUBMITTED");

        const mismatchFlag =
          declaredCashTzs !== null && differenceTzs !== null && differenceTzs !== 0;

        return {
          driverId: getString(row, "driverId", "driverid"),
          driverUserId: getString(row, "driverUserId", "driveruserid"),
          driverName: getString(row, "driverName", "drivername"),
          driverPhone: getString(row, "driverPhone", "driverphone"),
          expectedCashTzs,
          declaredCashTzs,
          differenceTzs,
          mismatchFlag,
          status,
          reconciliationId: getString(row, "reconciliationId", "reconciliationid"),
          submittedAt: row.submittedAt ?? null,
          approvedAt: row.approvedAt ?? null,
          approvedByUserId: getString(row, "approvedByUserId", "approvedbyuserid"),
        };
      });

      return json(res, 200, {
        data: {
          date: dateValue,
          drivers: rows,
          summary: {
            driverCount: rows.length,
            submittedCount: rows.filter((row) => row.status === "SUBMITTED").length,
            approvedCount: rows.filter((row) => row.status === "APPROVED").length,
            mismatchCount: rows.filter((row) => row.mismatchFlag).length,
            expectedCashTzs: rows.reduce((sum, row) => sum + row.expectedCashTzs, 0),
            declaredCashTzs: rows.reduce((sum, row) => sum + (row.declaredCashTzs ?? 0), 0),
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/admin/refunds") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN", "HUB_STAFF"], "issue refund")) return;

      const body = await readJsonBody(req);
      const orderId = String(body.orderId ?? "").trim();
      const paymentId =
        body.paymentId === null || body.paymentId === undefined
          ? null
          : String(body.paymentId).trim() || null;
      const amountTzs = Number.isInteger(Number(body.amountTzs)) ? Number(body.amountTzs) : null;
      const methodValue = String(body.method ?? "").trim();
      const reference =
        body.reference === null || body.reference === undefined
          ? null
          : String(body.reference).trim() || null;
      const reason = String(body.reason ?? "").trim();

      if (!orderId || amountTzs === null || amountTzs <= 0 || !reason) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "orderId, positive integer amountTzs, and reason are required"
        );
      }
      if (!["CASH", "MOBILE_MONEY", "CREDIT"].includes(methodValue)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "method must be CASH, MOBILE_MONEY, or CREDIT"
        );
      }

      const order = await fetchOrderById(orderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const customerUserId = getString(order, "customerUserId", "customeruserid");
      if (!customerUserId) {
        return sendError(res, 409, "CUSTOMER_NOT_FOUND", "Order has no customer user");
      }

      const refundId = crypto.randomUUID();

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          INSERT INTO "Refund" (
            "id", "orderId", "paymentId", "amountTzs", "method",
            "reference", "reason", "createdByUserId", "createdAt", "status"
          )
          VALUES (
            $1, $2, $3, $4, $5::"RefundMethod",
            $6, $7, $8, NOW(), 'ISSUED'
          )
          `,
          [refundId, orderId, paymentId, amountTzs, methodValue, reference, reason, user.id]
        );

        if (methodValue === "CREDIT") {
          await pool.query(
            `
            INSERT INTO "CustomerCreditLedger" (
              "id", "customerUserId", "orderId", "amountTzs", "reason", "createdAt"
            )
            VALUES ($1, $2, $3, $4, $5, NOW())
            `,
            [crypto.randomUUID(), customerUserId, orderId, amountTzs, reason]
          );
        }

        const newBalance = await syncOrderBalanceDue(orderId);

        await postRefundJournalIfMissing({
          refundId,
          method: methodValue as "CASH" | "MOBILE_MONEY" | "CREDIT",
          amountTzs,
          orderId,
          createdByUserId: user.id,
        });

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES
          ($1, $2, 'REFUND_REQUESTED', NOW(), $3, $4, $5, $6::jsonb, NOW()),
          ($7, $2, 'REFUND_ISSUED', NOW(), $3, $4, $8, $9::jsonb, NOW())
          `,
          [
            crypto.randomUUID(),
            orderId,
            user.id,
            user.role,
            "Refund requested",
            JSON.stringify({
              actionCode: "REFUND_REQUESTED",
              amountTzs,
              method: methodValue,
              reason,
            }),
            crypto.randomUUID(),
            "Refund issued",
            JSON.stringify({
              actionCode: "REFUND_ISSUED",
              refundId,
              paymentId,
              amountTzs,
              method: methodValue,
              reference,
              reason,
              balanceDueAfter: newBalance,
            }),
          ]
        );

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "REFUND_ISSUE",
          targetType: "ORDER",
          targetId: orderId,
          after: {
            refundId,
            paymentId,
            amountTzs,
            method: methodValue,
            reference,
            reason,
            balanceDueAfter: newBalance,
          },
          requestMeta: getRequestMeta(req),
        });

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return sendError(
          res,
          500,
          "REFUND_ISSUE_FAILED",
          error instanceof Error ? error.message : "Refund issuance failed"
        );
      }

      return json(res, 201, {
        data: {
          refund: {
            id: refundId,
            orderId,
            paymentId,
            amountTzs,
            amountFormatted: formatMoneyTzs(amountTzs),
            method: methodValue,
            reference,
            reason,
            status: "ISSUED",
          },
        },
      });
    }
    const adminIntakeOrderId = pathParam(url.pathname, /^\/v1\/admin\/orders\/([^/]+)\/intake$/);
    if (method === "POST" && adminIntakeOrderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (
        !requireRoles(
          user,
          res,
          ["ADMIN", "DEV_ADMIN", "HUB_STAFF"],
          "finalize order intake pricing"
        )
      )
        return;

      const body = await readJsonBody(req);
      const actualWeightKg = parseNumeric(body.actualWeightKg);
      const itemEntries = Array.isArray(body.itemEntries) ? body.itemEntries : [];
      const notes =
        body.notes === null || body.notes === undefined ? null : String(body.notes).trim() || null;

      if (actualWeightKg === null || actualWeightKg <= 0) {
        return sendError(res, 400, "VALIDATION_ERROR", "actualWeightKg must be a positive number");
      }

      const orderResult = await pool.query(
        `
        SELECT
          o."id",
          o."orderNumber",
          o."channel",
          o."tier",
          o."zoneId",
          o."hubId",
          o."statusCurrent",
          ops."pricingPlanId",
          ops."pricingPlanEffectiveFrom",
          ops."quotedAt"
        FROM "Order" o
        LEFT JOIN "OrderPricingSnapshot" ops ON ops."orderId" = o."id"
        WHERE o."id" = $1
        LIMIT 1
        `,
        [adminIntakeOrderId]
      );

      if (orderResult.rows.length === 0) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const order = orderResult.rows[0];
      const pricingPlanId = order.pricingPlanId ? String(order.pricingPlanId) : null;

      if (!pricingPlanId) {
        return sendError(
          res,
          409,
          "PRICING_SNAPSHOT_NOT_FOUND",
          "Order pricing snapshot was not found"
        );
      }

      await pool.query("BEGIN");

      try {
        const orderChannel = getString(order, "channel");
        const orderTier = getString(order, "tier");
        const orderZoneId = getString(order, "zoneId", "zoneid");

        if (!orderChannel || !orderTier || !orderZoneId) {
          throw new Error("Order is missing pricing context for finalization");
        }

        const finalBreakdown = await computeOrderPricingBreakdown({
          orderId: adminIntakeOrderId,
          channel: orderChannel as "DOOR" | "SHOP_DROP" | "HYBRID",
          tier: orderTier as "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY",
          zoneId: orderZoneId,
          pricingPlanId,
          estimatedWeightKg: null,
          actualWeightKg,
          itemEntries,
        });

        await replaceOrderPricingState({
          orderId: adminIntakeOrderId,
          pricingPlanId,
          pricingPlanEffectiveFrom: order.pricingPlanEffectiveFrom ?? null,
          quoteStatus: "FINALIZED",
          quotedAt: true,
          finalizedAt: true,
          inputsJson: finalBreakdown.inputsJson,
          lineItems: finalBreakdown.lineItems,
          subtotal: finalBreakdown.subtotal,
          deliveryTotal: finalBreakdown.deliveryTotal,
          discountTotal: finalBreakdown.discountTotal,
          grandTotal: finalBreakdown.grandTotal,
          balanceDue: finalBreakdown.balanceDue,
        });

        await postInvoiceJournalIfMissing({
          orderId: adminIntakeOrderId,
          createdByUserId: user.id,
        });

        await pool.query(
          `
          UPDATE "Order"
          SET "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [adminIntakeOrderId]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'RECEIVED_AT_HUB', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            crypto.randomUUID(),
            adminIntakeOrderId,
            user.id,
            user.role,
            notes ?? "Order intake recorded and pricing finalized",
            JSON.stringify({
              actionCode: "ORDER_PRICING_FINALIZED",
              actualWeightKg,
              itemEntries,
              pricingPlanId,
              grandTotal: finalBreakdown.grandTotal,
            }),
          ]
        );

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const snapshotResult = await pool.query(
        `
        SELECT
          "pricingPlanId",
          "pricingPlanEffectiveFrom",
          "quoteStatus",
          "quotedAt",
          "finalizedAt",
          "inputsJson"
        FROM "OrderPricingSnapshot"
        WHERE "orderId" = $1
        LIMIT 1
        `,
        [adminIntakeOrderId]
      );

      const totalsResult = await pool.query(
        `
        SELECT
          "subtotal",
          "deliveryTotal",
          "discountTotal",
          "grandTotal",
          "balanceDue"
        FROM "OrderTotals"
        WHERE "orderId" = $1
        LIMIT 1
        `,
        [adminIntakeOrderId]
      );

      return json(res, 200, {
        data: {
          orderId: adminIntakeOrderId,
          pricingSnapshot: snapshotResult.rows[0] ?? null,
          totals: totalsResult.rows[0] ?? null,
        },
      });
    }
    if (method === "GET" && url.pathname === "/v1/admin/commissions") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "list commission ledger")) return;

      const shopId = String(url.searchParams.get("shopId") ?? "").trim();
      const from = String(url.searchParams.get("from") ?? "").trim();
      const to = String(url.searchParams.get("to") ?? "").trim();

      const params: unknown[] = [];
      const conditions: string[] = [];

      if (shopId) {
        params.push(shopId);
        conditions.push(`cle."affiliateShopId" = $${params.length}`);
      }
      if (from) {
        params.push(from);
        conditions.push(`cle."earnedAt" >= $${params.length}::timestamptz`);
      }
      if (to) {
        params.push(to);
        conditions.push(`cle."earnedAt" <= $${params.length}::timestamptz`);
      }

      const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const result = await pool.query(
        `
        SELECT
          cle."id",
          cle."affiliateShopId",
          s."name" AS "affiliateShopName",
          cle."orderId",
          o."orderNumber",
          cle."planId",
          cle."calculationType",
          cle."baseAmountTzs",
          cle."rate",
          cle."amountTzs",
          cle."status",
          cle."earnedAt",
          cle."approvedAt",
          cle."paidAt",
          cle."payoutId"
        FROM "CommissionLedgerEntry" cle
        INNER JOIN "AffiliateShop" s ON s."id" = cle."affiliateShopId"
        INNER JOIN "Order" o ON o."id" = cle."orderId"
        ${whereSql}
        ORDER BY cle."earnedAt" DESC, cle."createdAt" DESC
        `,
        params
      );

      return json(res, 200, {
        data: {
          commissions: result.rows,
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/admin/payouts") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "create payout draft")) return;

      const body = await readJsonBody(req);
      const affiliateShopId = String(body.affiliateShopId ?? "").trim();
      const periodStart = String(body.periodStart ?? "").trim();
      const periodEnd = String(body.periodEnd ?? "").trim();

      if (!affiliateShopId || !periodStart || !periodEnd) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "affiliateShopId, periodStart, and periodEnd are required"
        );
      }

      const eligibleEntries = await pool.query(
        `
        SELECT
          "id",
          "amountTzs"
        FROM "CommissionLedgerEntry"
        WHERE "affiliateShopId" = $1
          AND "status" = 'EARNED'
          AND "payoutId" IS NULL
          AND "earnedAt" >= $2::timestamptz
          AND "earnedAt" <= $3::timestamptz
        ORDER BY "earnedAt" ASC, "createdAt" ASC
        `,
        [affiliateShopId, periodStart, periodEnd]
      );

      if (eligibleEntries.rows.length === 0) {
        return sendError(
          res,
          409,
          "NO_ELIGIBLE_COMMISSIONS",
          "No earned commission entries found for the selected period"
        );
      }

      const totalAmountTzs = eligibleEntries.rows.reduce(
        (sum, row) => sum + Number(row.amountTzs ?? 0),
        0
      );
      const payoutId = crypto.randomUUID();

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          INSERT INTO "Payout" (
            "id", "affiliateShopId", "periodStart", "periodEnd", "totalAmountTzs",
            "status", "createdAt", "updatedAt"
          )
          VALUES ($1, $2, $3::timestamptz, $4::timestamptz, $5, 'DRAFT', NOW(), NOW())
          `,
          [payoutId, affiliateShopId, periodStart, periodEnd, totalAmountTzs]
        );

        const eligibleIds = eligibleEntries.rows.map((row) => String(row.id));
        for (const entryId of eligibleIds) {
          await pool.query(
            `
            UPDATE "CommissionLedgerEntry"
            SET "payoutId" = $2
            WHERE "id" = $1
              AND "status" = 'EARNED'
              AND "payoutId" IS NULL
            `,
            [entryId, payoutId]
          );
        }

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      return json(res, 201, {
        data: {
          payout: {
            id: payoutId,
            affiliateShopId,
            periodStart,
            periodEnd,
            totalAmountTzs,
            status: "DRAFT",
            commissionEntryCount: eligibleEntries.rows.length,
          },
        },
      });
    }

    const adminPayoutApproveId = pathParam(
      url.pathname,
      /^\/v1\/admin\/payouts\/([^/]+)\/approve$/
    );
    if (method === "POST" && adminPayoutApproveId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "approve payout")) return;

      const payoutResult = await pool.query(
        `
        SELECT "id", "affiliateShopId", "periodStart", "periodEnd", "status"
        FROM "Payout"
        WHERE "id" = $1
        LIMIT 1
        `,
        [adminPayoutApproveId]
      );

      if (payoutResult.rows.length === 0) {
        return sendError(res, 404, "PAYOUT_NOT_FOUND", "Payout was not found");
      }

      const payout = payoutResult.rows[0];
      const currentStatus = getString(payout, "status");
      if (currentStatus !== "DRAFT") {
        return sendError(res, 409, "PAYOUT_NOT_DRAFT", "Only draft payouts can be approved");
      }

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          UPDATE "CommissionLedgerEntry"
          SET "status" = 'APPROVED',
              "approvedAt" = NOW()
          WHERE "payoutId" = $1
            AND "status" = 'EARNED'
          `,
          [adminPayoutApproveId]
        );

        const totalsResult = await pool.query(
          `
          SELECT COALESCE(SUM("amountTzs"), 0) AS total, COUNT(*) AS count
          FROM "CommissionLedgerEntry"
          WHERE "payoutId" = $1
          `,
          [adminPayoutApproveId]
        );

        await pool.query(
          `
          UPDATE "Payout"
          SET "status" = 'APPROVED',
              "approvedByUserId" = $2,
              "approvedAt" = NOW(),
              "totalAmountTzs" = $3,
              "updatedAt" = NOW()
          WHERE "id" = $1
          `,
          [adminPayoutApproveId, user.id, Number(totalsResult.rows[0]?.total ?? 0)]
        );

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PAYOUT_APPROVED",
          targetType: "PAYOUT",
          targetId: adminPayoutApproveId,
          after: {
            includedCount: Number(totalsResult.rows[0]?.count ?? 0),
            totalAmountTzs: Number(totalsResult.rows[0]?.total ?? 0),
          },
          requestMeta: getRequestMeta(req),
        });

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const approvedPayout = await pool.query(
        `
        SELECT
          "id", "affiliateShopId", "periodStart", "periodEnd", "totalAmountTzs",
          "status", "approvedByUserId", "approvedAt", "paidByUserId", "paidAt",
          "paymentMethod", "paymentReference", "createdAt", "updatedAt"
        FROM "Payout"
        WHERE "id" = $1
        LIMIT 1
        `,
        [adminPayoutApproveId]
      );

      return json(res, 200, {
        data: {
          payout: approvedPayout.rows[0],
        },
      });
    }

    const adminPayoutMarkPaidId = pathParam(
      url.pathname,
      /^\/v1\/admin\/payouts\/([^/]+)\/mark-paid$/
    );
    if (method === "POST" && adminPayoutMarkPaidId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "mark payout paid")) return;

      const body = await readJsonBody(req);
      const paymentMethod = String(body.method ?? "").trim();
      const paymentReference =
        body.reference === null || body.reference === undefined
          ? null
          : String(body.reference).trim() || null;

      if (!["MOBILE_MONEY", "CASH", "BANK"].includes(paymentMethod)) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "method must be MOBILE_MONEY, CASH, or BANK"
        );
      }

      const payoutResult = await pool.query(
        `
        SELECT "id", "status"
        FROM "Payout"
        WHERE "id" = $1
        LIMIT 1
        `,
        [adminPayoutMarkPaidId]
      );

      if (payoutResult.rows.length === 0) {
        return sendError(res, 404, "PAYOUT_NOT_FOUND", "Payout was not found");
      }

      const currentStatus = getString(payoutResult.rows[0], "status");
      if (currentStatus !== "APPROVED") {
        return sendError(
          res,
          409,
          "PAYOUT_NOT_APPROVED",
          "Only approved payouts can be marked paid"
        );
      }

      await pool.query("BEGIN");
      try {
        await pool.query(
          `
          UPDATE "CommissionLedgerEntry"
          SET "status" = 'PAID',
              "paidAt" = NOW()
          WHERE "payoutId" = $1
            AND "status" = 'APPROVED'
          `,
          [adminPayoutMarkPaidId]
        );

        const totalsResult = await pool.query(
          `
          SELECT COALESCE(SUM("amountTzs"), 0) AS total, COUNT(*) AS count
          FROM "CommissionLedgerEntry"
          WHERE "payoutId" = $1
          `,
          [adminPayoutMarkPaidId]
        );

        await pool.query(
          `
          UPDATE "Payout"
          SET "status" = 'PAID',
              "paidByUserId" = $2,
              "paidAt" = NOW(),
              "paymentMethod" = $3::"PayoutMethod",
              "paymentReference" = $4,
              "updatedAt" = NOW(),
              "totalAmountTzs" = $5
          WHERE "id" = $1
          `,
          [
            adminPayoutMarkPaidId,
            user.id,
            paymentMethod,
            paymentReference,
            Number(totalsResult.rows[0]?.total ?? 0),
          ]
        );

        await postPayoutJournalIfMissing({
          payoutId: adminPayoutMarkPaidId,
          paymentMethod: paymentMethod as "MOBILE_MONEY" | "CASH" | "BANK",
          totalAmountTzs: Number(totalsResult.rows[0]?.total ?? 0),
          createdByUserId: user.id,
        });

        await recordAudit({
          actorUserId: user.id,
          actorRole: user.role,
          actionCode: "PAYOUT_PAID",
          targetType: "PAYOUT",
          targetId: adminPayoutMarkPaidId,
          after: {
            includedCount: Number(totalsResult.rows[0]?.count ?? 0),
            totalAmountTzs: Number(totalsResult.rows[0]?.total ?? 0),
            paymentMethod,
            paymentReference,
          },
          requestMeta: getRequestMeta(req),
        });

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }

      const paidPayout = await pool.query(
        `
        SELECT
          "id", "affiliateShopId", "periodStart", "periodEnd", "totalAmountTzs",
          "status", "approvedByUserId", "approvedAt", "paidByUserId", "paidAt",
          "paymentMethod", "paymentReference", "createdAt", "updatedAt"
        FROM "Payout"
        WHERE "id" = $1
        LIMIT 1
        `,
        [adminPayoutMarkPaidId]
      );

      return json(res, 200, {
        data: {
          payout: paidPayout.rows[0],
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/admin/payouts/report") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "view payout reports")) return;

      const shopId = String(url.searchParams.get("shopId") ?? "").trim();
      const from = String(url.searchParams.get("from") ?? "").trim();
      const to = String(url.searchParams.get("to") ?? "").trim();

      if (!shopId || !from || !to) {
        return sendError(res, 400, "VALIDATION_ERROR", "shopId, from, and to are required");
      }

      const totalsResult = await pool.query(
        `
        SELECT
          COALESCE(SUM(CASE WHEN "status" = 'EARNED' THEN "amountTzs" ELSE 0 END), 0) AS earned,
          COALESCE(SUM(CASE WHEN "status" = 'APPROVED' THEN "amountTzs" ELSE 0 END), 0) AS approved,
          COALESCE(SUM(CASE WHEN "status" = 'PAID' THEN "amountTzs" ELSE 0 END), 0) AS paid
        FROM "CommissionLedgerEntry"
        WHERE "affiliateShopId" = $1
          AND "earnedAt" >= $2::timestamptz
          AND "earnedAt" <= $3::timestamptz
        `,
        [shopId, from, to]
      );

      const payoutsResult = await pool.query(
        `
        SELECT
          "id", "affiliateShopId", "periodStart", "periodEnd", "totalAmountTzs",
          "status", "approvedByUserId", "approvedAt", "paidByUserId", "paidAt",
          "paymentMethod", "paymentReference", "createdAt", "updatedAt"
        FROM "Payout"
        WHERE "affiliateShopId" = $1
          AND "periodStart" >= $2::timestamptz
          AND "periodEnd" <= $3::timestamptz
        ORDER BY "createdAt" DESC
        `,
        [shopId, from, to]
      );

      const entriesResult = await pool.query(
        `
        SELECT
          cle."id",
          cle."orderId",
          o."orderNumber",
          cle."amountTzs",
          cle."status",
          cle."earnedAt",
          cle."approvedAt",
          cle."paidAt",
          cle."payoutId"
        FROM "CommissionLedgerEntry" cle
        INNER JOIN "Order" o ON o."id" = cle."orderId"
        WHERE cle."affiliateShopId" = $1
          AND cle."earnedAt" >= $2::timestamptz
          AND cle."earnedAt" <= $3::timestamptz
        ORDER BY cle."earnedAt" DESC
        `,
        [shopId, from, to]
      );

      return json(res, 200, {
        data: {
          totals: {
            earned: Number(totalsResult.rows[0]?.earned ?? 0),
            approved: Number(totalsResult.rows[0]?.approved ?? 0),
            paid: Number(totalsResult.rows[0]?.paid ?? 0),
          },
          payouts: payoutsResult.rows,
          entries: entriesResult.rows,
        },
      });
    }

    return sendError(res, 404, "NOT_FOUND", "Route not found");
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

(async () => {
  await seedChartOfAccounts();
})().catch((error) => {
  console.error("Failed to seed chart of accounts", error);
  process.exit(1);
});
server.listen(PORT, () => {
  console.log(`Mimo API running on http://localhost:${PORT}`);
  console.log(`Swagger UI running on http://localhost:${PORT}/api`);
  console.log(`OpenAPI JSON on http://localhost:${PORT}/api/openapi.json`);
});
