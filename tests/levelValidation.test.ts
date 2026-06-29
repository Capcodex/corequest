import { describe, expect, it } from "vitest";
import { isExpectedOutput, normalizeOutput, validateExerciseResult } from "../src/lib/levels/levelValidation";

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

  it("validates exact stdout mode", () => {
    expect(
      validateExerciseResult("Noyau réveillé\n", {
        mode: "stdout_exact",
        expectedOutput: "Noyau réveillé",
      }),
    ).toEqual({ passed: true, expectedOutput: undefined });
  });

  it("validates inclusion mode", () => {
    expect(
      validateExerciseResult("Résultat: 42\nCalcul terminé", {
        mode: "stdout_includes",
        expectedOutput: "42",
      }),
    ).toEqual({ passed: true, expectedOutput: undefined });
  });

  it("validates success-only mode", () => {
    expect(
      validateExerciseResult("", {
        mode: "exit_success",
      }),
    ).toEqual({ passed: true });
  });
});