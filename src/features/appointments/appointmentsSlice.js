import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage, saveToStorage } from "../../utils/localStorage";

const initialState = {
  appointments: loadFromStorage("appointments") || [],
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
      saveToStorage("appointments", state.appointments);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
        saveToStorage("appointments", state.appointments);
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (a) => a.id !== action.payload,
      );
      saveToStorage("appointments", state.appointments);
    },
    deletePatientAppointments: (state, action) => {
      state.appointments = state.appointments.filter(
        (a) => a.patientId !== action.payload,
      );
      saveToStorage("appointments", state.appointments);
    },
  },
});

export const {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  deletePatientAppointments,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
