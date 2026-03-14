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

let devAdminToken = "";
let driverBToken = "";

beforeAll(async () => {
  await seedAndStartServer();

  devAdminToken = await loginByPhone(SeedPhones.devAdmin);
  driverBToken = await loginByPhone(SeedPhones.driverB);
});

afterAll(async () => {
  await stopServer();
});

describe.sequential("abuse protections", () => {
  test("brute-force login attempts are rate limited safely", async () => {
    const statuses: number[] = [];
    const codes: Array<string | null> = [];

    for (let i = 0; i < 6; i += 1) {
      const response = await apiRequest("/v1/auth/login", {
        method: "POST",
        body: {
          phone: SeedPhones.admin,
          password: "WrongPass123!",
        },
      });

      statuses.push(response.status);
      codes.push(errorCode(response.body));
    }

    expect(statuses.includes(500)).toBe(false);
    expect(statuses[statuses.length - 1]).toBe(429);
    expect(codes[codes.length - 1]).toBe("RATE_LIMITED");
  });

  test("OTP brute-force attempts are rate limited safely", async () => {
    const generateOtp = await apiRequest(`/v1/dev/orders/${SeedIds.orderScopeB}/delivery-otp`, {
      method: "POST",
      token: devAdminToken,
      body: {},
    });

    expect([200, 429]).toContain(generateOtp.status);
    expect([null, "RATE_LIMITED"]).toContain(errorCode(generateOtp.body));

    if (generateOtp.status === 429) {
      expect(errorCode(generateOtp.body)).toBe("RATE_LIMITED");
      return;
    }

    const statuses: number[] = [];
    const codes: Array<string | null> = [];

    for (let i = 0; i < 7; i += 1) {
      const response = await apiRequest(`/v1/driver/stops/${SeedIds.tripStopB}/deliver`, {
        method: "POST",
        token: driverBToken,
        body: {
          otp: "000000",
          photoRef: "upload://proofs/otp-abuse-photo-123456.jpg",
          signatureName: "Receiver Test",
          signatureRef: "upload://proofs/otp-abuse-signature-123456.png",
          notes: "intentional wrong otp for abuse test",
        },
      });

      statuses.push(response.status);
      codes.push(errorCode(response.body));
    }

    expect(statuses.includes(500)).toBe(false);
    expect(statuses[statuses.length - 1]).toBe(429);
    expect(codes[codes.length - 1]).toBe("RATE_LIMITED");
  });
});
