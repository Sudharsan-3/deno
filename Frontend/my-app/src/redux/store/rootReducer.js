import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice";
import transactionReducer from "@/redux/features/transaction/transaactionSlice"
import  userInFoSliceReducer  from "../features/userData/userInFoSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transaction : transactionReducer,
  userInfo : userInFoSliceReducer,
});

export default rootReducer;
