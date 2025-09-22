import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLeadsData } from "../../thunkOperation/leads/LeadsThunk";
 
const initialState = {
    isLoading:false,
    leadsTableData:[]
 
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchLeadsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeadsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadsTableData = action.payload;
      })
      .addCase(fetchLeadsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
  },
});

export const {
   
} = leadsSlice.actions;

export default leadsSlice.reducer;