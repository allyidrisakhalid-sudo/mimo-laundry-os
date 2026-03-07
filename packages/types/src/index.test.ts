import { describe, expect, it } from "vitest";
import { isOrderChannel } from "./index";

describe("shared order channel guard", () => {
  it("accepts valid channels", () => {
    expect(isOrderChannel("DOOR")).toBe(true);
    expect(isOrderChannel("SHOP")).toBe(true);
    expect(isOrderChannel("HYBRID")).toBe(true);
  });

  it("rejects invalid channels", () => {
    expect(isOrderChannel("INVALID")).toBe(false);
  });
});
