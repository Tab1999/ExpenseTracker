import { createSlice } from '@reduxjs/toolkit';

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: [],
  reducers: {
    setExpenses(state, action) {
      return action.payload;
    },
    addExpense(state, action) {
      return [...state, action.payload];
    },
    updateExpense(state, action) {
      const updatedIndex = state.findIndex((expense) => expense.id === action.payload.id);
      if (updatedIndex !== -1) {
        state[updatedIndex] = action.payload;
      }
    },
    deleteExpense(state, action) {
      return state.filter((expense) => expense.id !== action.payload);
    },
  },
});

export const { setExpenses, addExpense, updateExpense, deleteExpense } = expenseSlice.actions;
export const expenseAction = expenseSlice.actions;
export default expenseSlice.reducer;
