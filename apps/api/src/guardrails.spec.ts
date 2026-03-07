import { describe, expect, it } from "vitest";

function chapterGuardrailsEnabled(): boolean {
  return true;
}

describe("chapter 2.2 api guardrails baseline", () => {
  it("keeps the test runner wired into the api workspace", () => {
    expect(chapterGuardrailsEnabled()).toBe(true);
  });
});
