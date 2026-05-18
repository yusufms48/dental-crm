import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage, saveToStorage } from "../../utils/localStorage";

const initialState = {
  patients: loadFromStorage("patients") || [],
};

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    addPatient: (state, action) => {
      state.patients.push(action.payload);
      saveToStorage("patients", state.patients);
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
        saveToStorage("patients", state.patients);
      }
    },
    deletePatient: (state, action) => {
      state.patients = state.patients.filter((p) => p.id !== action.payload);
      saveToStorage("patients", state.patients);
    },
  },
});

export const { addPatient, updatePatient, deletePatient } =
  patientsSlice.actions;

export default patientsSlice.reducer;
