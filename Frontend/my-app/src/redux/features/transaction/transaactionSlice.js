import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTransactions } from "./transactionApi";

const initialState = {
  transaction: [],   // Transactions list
  loading: false,    // Loading state
  error: null,       // Error message
  filter: "none",    // 'asc', 'desc', or 'none'
};

// Async thunk to fetch transactions
export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async () => {
    const res = await getAllTransactions();
    return res; // return API result
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    // Example filter reducer
    // setFilter: (state, action) => {
    //   state.filter = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong!";
      });
  },
});

export const { setFilter } = transactionSlice.actions;
export default transactionSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getAllTransactions } from "./transactionApi";

// const initialState = {
//   transaction: [],          // Toys shown on screen
//   // Backup of the original toys
//   loading: false,    // Is it still loading?
//   error: null,       // Any error message
//   filter: 'none',  // 'asc', 'desc', or 'none'
// }

// export const featchTransactions = createAsyncThunk("transactions", async () => {
//   const res = await getAllTransactions();
//   return  res
// })


// const transactionSlice = createSlice({
//   name: "transaction",
//   initialState,
//   reducers: {
//     // Example filter reducer
//     setFilter: (state, action) => {
//       state.filter = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(featchTransactions.pending, (state) => {
//       state.loading = true
//     })
//       .addCase(featchTransactions.fulfilled, (state, action) => {
//         state.transaction = action.payload
//       })
//       .addCase(featchTransactions.rejected, (state) => {
//         state.loading = false,
//           state.error = "something went wrong!"
//       })
//   }
// },

// )

// export const { transaction } = transactionSlice.actions
// export default transactionSlice.reducer