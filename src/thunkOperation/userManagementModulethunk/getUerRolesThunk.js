import { createAsyncThunk } from "@reduxjs/toolkit";
import { getroles } from "../../api_request";
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (val, { rejectWithValue }) => {
    try {
      const response = await getroles(val);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch roles");
    }
  }
);
