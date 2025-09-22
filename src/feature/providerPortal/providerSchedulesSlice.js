import { createSlice } from "@reduxjs/toolkit";
import { fetchProviderSchedules } from "../../thunkOperation/job_management/scheduleThunk";

const initialState = {
  schedules: [],
  loading: false,
  error: null,
};

// Create the slice
const providerSchedulesSlice = createSlice({
  name: "providerSchedules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchProviderSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer to be used in the store
export default providerSchedulesSlice.reducer;
