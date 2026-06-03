import { describe, expect, it } from "vitest";
import { isExpectedOutput, normalizeOutput } from "../src/lib/levels/levelValidation";

describe("levelValidation", () => {
  it("normalizes windows newlines and trims outer whitespace", () => {
    expect(normalizeOutput("hello\r\n")).toBe("hello");
  });

  it("matches equivalent outputs", () => {
    expect(isExpectedOutput("13\n", "13")).toBe(true);
  });

  it("rejects different outputs", () => {
    expect(isExpectedOutput("12\n", "13")).toBe(false);
  });
});

