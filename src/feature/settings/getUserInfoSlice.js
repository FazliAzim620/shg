import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserInfo } from "../../thunkOperation/auth/loginUserInfo";

const initialState = {
  userData: null,
  loadingData: false,
  error: null,
};

const getUserInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearUserInfo: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loadingData = false;
        state.userData = action.payload;  
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserInfo } = getUserInfoSlice.actions;

export default getUserInfoSlice.reducer;
