import { describe, it, expect } from "vitest";
import reducer, {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  deletePatientAppointments,
} from "../features/appointments/appointmentsSlice";

const testAppointment = {
  id: "1",
  patientId: "p1",
  date: "2026-06-01",
  time: "10:00",
  reason: "Осмотр",
  status: "upcoming",
  doctorId: "1",
};

describe("appointmentsSlice", () => {
  it("начальное состояние — пустой массив", () => {
    const state = reducer(undefined, { type: "" });
    expect(Array.isArray(state.appointments)).toBe(true);
  });

  it("добавляет запись", () => {
    const state = reducer(
      { appointments: [] },
      addAppointment(testAppointment),
    );
    expect(state.appointments).toHaveLength(1);
    expect(state.appointments[0].reason).toBe("Осмотр");
  });

  it("обновляет запись", () => {
    const initial = { appointments: [testAppointment] };
    const updated = { ...testAppointment, status: "completed" };
    const state = reducer(initial, updateAppointment(updated));
    expect(state.appointments[0].status).toBe("completed");
  });

  it("удаляет запись", () => {
    const initial = { appointments: [testAppointment] };
    const state = reducer(initial, deleteAppointment("1"));
    expect(state.appointments).toHaveLength(0);
  });

  it("удаляет все записи пациента", () => {
    const initial = {
      appointments: [
        testAppointment,
        { ...testAppointment, id: "2", patientId: "p2" },
      ],
    };
    const state = reducer(initial, deletePatientAppointments("p1"));
    expect(state.appointments).toHaveLength(1);
    expect(state.appointments[0].patientId).toBe("p2");
  });
});
