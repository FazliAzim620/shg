import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPermissions } from "../../api_request";

export const fetchUsersPermissions = createAsyncThunk(
  "roles/fetchUsersPermissions",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPermissions(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch permissions"
      );
    }
  }
);
