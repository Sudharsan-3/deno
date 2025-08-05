import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "./authAPI";
import { safeParse } from "@/utils/parseJSON";

// Load data (token + user) from localStorage safely
const data =
  typeof window !== "undefined"
    ? safeParse(localStorage.getItem("authData"), null)
    : null;

const initialState = {
  data, // this includes user + token
  isAuthenticated: !!data?.token,
  loading: false,
  error: null,
};

// 🔐 LOGIN THUNK
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const res = await loginAPI(credentials); // res.data contains { user, token }
    const data = res.data;

    if (typeof window !== "undefined") {
      localStorage.setItem("authData", JSON.stringify(data));
    }

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

// 📝 REGISTER THUNK
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const res = await registerAPI(userData);
    const data = res.data;

    if (typeof window !== "undefined") {
      localStorage.setItem("authData", JSON.stringify(data));
    }

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Registration failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authData");
      }
      state.data = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
