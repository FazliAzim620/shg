import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  clientInfoForm,
  fetchCountries,
  fetchJobDetail,
  fetchSiteStates,
  fetchStates,
} from "../thunkOperation/job_management/providerInfoStep";

const initialState = {
  isLoading: false,
  existingClient: "",
  id: "",
  client_id: "",
  job_id: "",
  clientName: "",
  email: "",
  phone: "",
  billingAddress: "",
  billingState: "",
  billingCity: "",
  billingAddress1: "",
  billingAddress2: "",
  billingZipCode: "",
  siteName: "",
  siteAddress: "",
  siteAddress1: "",
  siteAddress2: "",
  siteState: "",
  siteCity: "",
  siteZipCode: "",
  sitePhone: "",
  regularRate: "",
  holidayRate: "",
  overTimeRate: "",
  regularRateType: "hourly", // new for regular rate type
  holidayRateType: "hourly", // new for holiday rate type
  overTimeRateType: "hourly", // new for overtime rate type
  status: "idle",
  error: null,
  sameAsBilling: false,
  countries: [],
  states: [],
  siteStates: [],
  siteAddressId: "",
  billingAddressId: "",
  newClientData: null,
  startDate: null,
  endDate: null,
  contract_duration_start_date: "",
  contract_duration_end_date: "",
  privilege_start_date: null,
  privilege_end_date: null,
};
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    removeData: (state) => {
      return {
        ...initialState,
        countries: state.countries,
        states: state.states,
      };
    },
    resetField: (state) => {
      return {
        ...initialState,
        countries: state.countries,
        states: state.states,
        client_id: state.client_id,
        job_id: state.job_id,
        newClientData: state.newClientData,
      };
    },
    resetClientId: (state) => {
      return {
        ...initialState,
        countries: state.countries,
        states: state.states,
        job_id: state.job_id,
        newClientData: state.newClientData,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clientInfoForm.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(clientInfoForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.client_id = action?.payload?.data?.id;
        state.newClientData = action?.payload?.data;
        // Optionally, reset the form or handle the submitted data
      })
      .addCase(clientInfoForm.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries = action.payload;
        // Optionally, reset the form or handle the submitted data
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.states = action.payload;

        // Optionally, reset the form or handle the submitted data
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ===================site address=====================
      .addCase(fetchSiteStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSiteStates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.siteStates = action.payload;

        // Optionally, reset the form or handle the submitted data
      })
      .addCase(fetchSiteStates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // ===================job details======================
      .addCase(fetchJobDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newClientData = action.payload;
        state.client_id = action.payload?.client?.id || "";
        // Optionally, reset the form or handle the submitted data
      })
      .addCase(fetchJobDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateField, resetField, resetClientId, removeData } =
  clientSlice.actions;

export default clientSlice.reducer;
