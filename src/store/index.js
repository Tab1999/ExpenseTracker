import { configureStore } from '@reduxjs/toolkit';


import authReducer from './auth';
import expenseReducer from './expense'



const store = configureStore({
    reducer: {expenses: expenseReducer,
          auth: authReducer}
});

export default store;

