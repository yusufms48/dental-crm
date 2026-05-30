import { configureStore } from "@reduxjs/toolkit";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import paymentsReducer from "../features/payments/paymentsSlice";

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    appointments: appointmentsReducer,
    payments: paymentsReducer,
  },
});
