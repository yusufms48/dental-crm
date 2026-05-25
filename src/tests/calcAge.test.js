import { describe, it, expect } from "vitest";
import { calcAge, ageLabel } from "../utils/calcAge";

describe("calcAge", () => {
  it("возвращает null если дата не передана", () => {
    expect(calcAge("")).toBeNull();
    expect(calcAge(null)).toBeNull();
  });

  it("правильно считает возраст", () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 25);
    const formatted = birthDate.toISOString().split("T")[0];
    expect(calcAge(formatted)).toBe(25);
  });
});

describe("ageLabel", () => {
  it('возвращает "год" для 1', () => {
    expect(ageLabel(1)).toBe("1 год");
  });

  it('возвращает "года" для 2, 3, 4', () => {
    expect(ageLabel(2)).toBe("2 года");
    expect(ageLabel(3)).toBe("3 года");
    expect(ageLabel(4)).toBe("4 года");
  });

  it('возвращает "лет" для 5 и больше', () => {
    expect(ageLabel(5)).toBe("5 лет");
    expect(ageLabel(11)).toBe("11 лет");
    expect(ageLabel(21)).toBe("21 год");
  });

  it("возвращает пустую строку если null", () => {
    expect(ageLabel(null)).toBe("");
  });
});
