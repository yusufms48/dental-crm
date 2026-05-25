import { describe, it, expect } from "vitest";
import reducer, {
  addPatient,
  updatePatient,
  deletePatient,
} from "../features/patients/patientsSlice";

const testPatient = {
  id: "1",
  name: "Иван Иванов",
  phone: "+994 50 123 45 67",
  birthDate: "1990-01-01",
  allergies: "",
  chronicDiseases: "",
  medications: "",
  bloodType: "I+",
};

describe("patientsSlice", () => {
  it("начальное состояние — пустой массив", () => {
    const state = reducer(undefined, { type: "" });
    expect(Array.isArray(state.patients)).toBe(true);
  });

  it("добавляет пациента", () => {
    const state = reducer({ patients: [] }, addPatient(testPatient));
    expect(state.patients).toHaveLength(1);
    expect(state.patients[0].name).toBe("Иван Иванов");
  });

  it("обновляет пациента", () => {
    const initial = { patients: [testPatient] };
    const updated = { ...testPatient, name: "Пётр Петров" };
    const state = reducer(initial, updatePatient(updated));
    expect(state.patients[0].name).toBe("Пётр Петров");
  });

  it("удаляет пациента", () => {
    const initial = { patients: [testPatient] };
    const state = reducer(initial, deletePatient("1"));
    expect(state.patients).toHaveLength(0);
  });
});
