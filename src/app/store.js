import { configureStore } from "@reduxjs/toolkit";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    appointments: appointmentsReducer,
  },
});
