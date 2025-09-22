import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../../api_request";

export const fetchUsers = createAsyncThunk(
  "roles/fetchUsers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getUsers(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);
