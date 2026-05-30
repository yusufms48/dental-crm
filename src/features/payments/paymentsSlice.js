import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage, saveToStorage } from "../../utils/localStorage";

const initialState = {
  payments: loadFromStorage("payments") || [],
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.payments.push(action.payload);
      saveToStorage("payments", state.payments);
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
        saveToStorage("payments", state.payments);
      }
    },
    deletePayment: (state, action) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload);
      saveToStorage("payments", state.payments);
    },
  },
});

export const { addPayment, updatePayment, deletePayment } =
  paymentsSlice.actions;
export default paymentsSlice.reducer;
