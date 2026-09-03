const {
  isValidAmount,
  isNonEmptyString,
  isValidDate,
} = require("../utils/validate");

describe("isValidAmount", () => {
  test("accepts a normal positive number", () => {
    expect(isValidAmount(500)).toBe(true);
  });

  test("accepts a positive number as a string", () => {
    expect(isValidAmount("500")).toBe(true);
  });

  test("rejects zero", () => {
    expect(isValidAmount(0)).toBe(false);
  });

  test("rejects negative numbers", () => {
    expect(isValidAmount(-100)).toBe(false);
  });

  test("rejects non-numeric text", () => {
    expect(isValidAmount("abc")).toBe(false);
  });

  test("rejects empty string", () => {
    expect(isValidAmount("")).toBe(false);
  });

  test("rejects null and undefined", () => {
    expect(isValidAmount(null)).toBe(false);
    expect(isValidAmount(undefined)).toBe(false);
  });

  test("rejects Infinity", () => {
    expect(isValidAmount(Infinity)).toBe(false);
  });
});

describe("isNonEmptyString", () => {
  test("accepts a normal string", () => {
    expect(isNonEmptyString("Rent")).toBe(true);
  });

  test("rejects an empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  test("rejects a whitespace-only string", () => {
    expect(isNonEmptyString("   ")).toBe(false);
  });

  test("rejects non-string values", () => {
    expect(isNonEmptyString(123)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(undefined)).toBe(false);
  });
});

describe("isValidDate", () => {
  test("accepts a normal ISO date string", () => {
    expect(isValidDate("2026-08-15")).toBe(true);
  });

  test("rejects garbage text", () => {
    expect(isValidDate("not-a-date")).toBe(false);
  });

  test("rejects empty/missing values", () => {
    expect(isValidDate("")).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });
});