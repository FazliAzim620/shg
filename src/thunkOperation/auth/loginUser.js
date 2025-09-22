import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import API from "../../API";

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await API.post("/api/login", credentials);
      const data = response.data;
      // Cookies.set("token", data.token, { expires: 1 / 24 });
      Cookies.set("token", data.token, { expires: 0.375});
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      } else {
        return thunkAPI.rejectWithValue({
          message: "An unknown error occurred",
        });
      }
    }
  }
);
