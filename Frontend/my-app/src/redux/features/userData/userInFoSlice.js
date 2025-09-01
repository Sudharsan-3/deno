import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "./userInfo";
import api from "@/lib/axios";

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const getUserInfo = createAsyncThunk("userInfo/fetch", async (_, thunkAPI) => {
    try {
      const response = await api.get("/userInfo"); // Axios instance call
      return response.data; // ✅ Extract actual data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user info");
    }
  });
  

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        console.log("Fetched user info:", action.payload); // ✅ Debug log
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })      
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
      
  },
});

export default userInfoSlice.reducer;
