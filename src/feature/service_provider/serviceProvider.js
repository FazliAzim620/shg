import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provider: null,
  loading: false,
  error: null,
};
const serviceProvider = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    providerDetails: (state, action) => {
      state.provider = action.payload;
    },
    removeProviderDetails: (state) => {
      return initialState;
    },
  },
});

export const { providerDetails, removeProviderDetails } =
  serviceProvider.actions;

export default serviceProvider.reducer;
