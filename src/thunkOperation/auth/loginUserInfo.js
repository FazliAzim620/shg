import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const fetchUserInfo = createAsyncThunk(
  "loginUser/fetchUserInfo",
  async () => {
    const response = await API.get(`/api/get-user-detail`);
    if (response.error) {
      throw new Error("Failed to fetch user data");
    }
    const data = response?.data?.data;
    return data;
  }
);
