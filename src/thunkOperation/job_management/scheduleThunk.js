import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProviderSchedular } from "../../api_request";

// Create an asynchronous thunk to fetch provider schedules
export const fetchProviderSchedules = createAsyncThunk(
  "providerSchedules/fetchProviderSchedules",
  async ({ provider_id, client_id ,to_date,from_date}, { rejectWithValue }) => {
    try {
      const response = await getProviderSchedular(provider_id, client_id,from_date,to_date);
      return response.data; // Adjust based on the API response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch provider schedules"
      );
    }
  }
);
