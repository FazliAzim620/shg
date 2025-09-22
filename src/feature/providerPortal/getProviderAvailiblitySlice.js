import { createSlice } from "@reduxjs/toolkit";
import { fetchProviderAvailability } from "../../thunkOperation/job_management/availiblityThunk";

const initialState = {
  availability: [],
  loading: false,
  error: null,
};

// Create the slice
const providerAvailabilitySlice = createSlice({
  name: "providerAvailability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload; // Store the fetched availability data
      })
      .addCase(fetchProviderAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message in case of failure
      });
  },
});

// Export the reducer to be used in the store
export default providerAvailabilitySlice.reducer;
