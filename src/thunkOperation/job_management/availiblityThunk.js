import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProviderAvailability } from "../../api_request";

// Create an asynchronous thunk to fetch provider availability with provider_id
export const fetchProviderAvailability = createAsyncThunk(
  "providerAvailability/fetchProviderAvailability",
  async (provider_id, { rejectWithValue }) => {
    try {
      // Pass provider_id to the API function
      const response = await getProviderAvailability(provider_id);
      return response.data; // Adjust based on the API response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch provider availability"
      );
    }
  }
);
