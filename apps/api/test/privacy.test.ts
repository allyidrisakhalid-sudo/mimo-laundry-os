import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  SeedIds,
  SeedPhones,
  apiRequest,
  errorCode,
  loginByPhone,
  seedAndStartServer,
  stopServer,
} from "./helpers";

let adminToken = "";
let hubStaffToken = "";
let driverAToken = "";
let affiliateAToken = "";
let customerAToken = "";
let customerBToken = "";

beforeAll(async () => {
  await seedAndStartServer();

  adminToken = await loginByPhone(SeedPhones.admin);
  hubStaffToken = await loginByPhone(SeedPhones.hubStaffA);
  driverAToken = await loginByPhone(SeedPhones.driverA);
  affiliateAToken = await loginByPhone(SeedPhones.affiliateStaffA);
  customerAToken = await loginByPhone(SeedPhones.customerA);
  customerBToken = await loginByPhone(SeedPhones.customerB);
});

afterAll(async () => {
  await stopServer();
});

describe.sequential("privacy constraints", () => {
  test("affiliate A cannot read affiliate B order", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}`, {
      token: affiliateAToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("affiliate A cannot read affiliate B order timeline", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}/timeline`, {
      token: affiliateAToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("affiliate A cannot complete affiliate B customer pickup", async () => {
    const response = await apiRequest(
      `/v1/affiliate/orders/${SeedIds.orderScopeB}/customer-picked-up`,
      {
        method: "POST",
        token: affiliateAToken,
        body: {},
      }
    );

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("driver A cannot access driver B trip", async () => {
    const response = await apiRequest(`/v1/trips/${SeedIds.tripDriverB}`, {
      token: driverAToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("driver A cannot read order assigned to driver B scope", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}`, {
      token: driverAToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("hub staff A cannot access hub B order", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}`, {
      token: hubStaffToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("hub staff A cannot access hub B order timeline", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}/timeline`, {
      token: hubStaffToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("customer A cannot access customer B order", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}`, {
      token: customerAToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("customer A cannot access customer B balance", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}/balance`, {
      token: customerAToken,
    });

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });

  test("customer B can access own order", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}`, {
      token: customerBToken,
    });

    expect(response.status).toBe(200);
  });

  test("admin can access any order", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}`, {
      token: adminToken,
    });

    expect(response.status).toBe(200);
  });

  test("admin can access any order timeline", async () => {
    const response = await apiRequest(`/v1/orders/${SeedIds.orderScopeB}/timeline`, {
      token: adminToken,
    });

    expect(response.status).toBe(200);
  });

  test("non-devadmin cannot call dev override", async () => {
    const response = await apiRequest(
      `/v1/dev/override/orders/${SeedIds.orderCustomerA}/assign-hub`,
      {
        method: "POST",
        token: adminToken,
        body: {
          hubId: SeedIds.hubKigamboni,
          reason: "privacy test must stay forbidden",
        },
      }
    );

    expect(response.status).toBe(403);
    expect(errorCode(response.body)).toBe("FORBIDDEN");
  });
});
