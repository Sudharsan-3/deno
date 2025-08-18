import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import transactionReducer from "@/redux/features/transaction/transaactionSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  transaction : transactionReducer
});

export default rootReducer;
