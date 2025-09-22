import { createSlice } from "@reduxjs/toolkit";
import {
  fetchJobsData,
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchStates,
  saveJobHandler,
} from "../thunkOperation/job_management/states";

const initialState = {
  status: "",
  provider: "",
  providerFullName: "",
  provider_sub_role:"",
  email: "",
  phone: "",
  providerRole: "",
  medicalSpecialty: "",
  provider_specialities: [],
  date_of_birth: "",
  social_security_number: "",
  nip: "",
  file: "",
  recruiter_id: "",
  boardCertification: {
    BC: false,
    BE: false,
    BCE: false,
    NA:false,
    IMLC:false
  },
  stateLicense: [],
  pendingStateLicense: [],
  nonActiveStateLicense: [],
  regularHourlyRate: "",
  holidayHourlyRate: "",
  overtimeHourlyRate: "",
  regularRateType: "hourly", // new for regular rate type
  holidayRateType: "hourly", // new for holiday rate type
  overtimeRateType: "hourly", // new for overtime rate type
  isLoading: false,
  error: false,
  successMessage: "",
  statesList: [],
  providerRolesList: [],
  medicalSpecialities: [],
  jobsTableData: [],
  newUserData: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    updateCertificate: (state, action) => {
      const { field, value } = action.payload;
      state.boardCertification[field] = value;
    },
    setField: (state, action) => {
      const { field, value } = action.payload;
      if (field === "boardCertification") {
        if (value === "NA") {
          state.boardCertification.BC = false;
          state.boardCertification.BE = false;
          state.boardCertification.BCE = false;
        }else{  state.boardCertification.NA = false;}
    
        state.boardCertification[value] = !state.boardCertification[value];
      } else {
        state[field] = value;
      }
      state.successMessage = "";
    },
    resetField: (state) => {
      state.provider = "";
      state.id = "";
      state.status = "";
      state.providerFullName = "";
      state.provider_sub_role = "";
      state.email = "";
      state.recruiter_id = "";
      state.phone = "";
      state.providerRole = "";
      state.date_of_birth = "";
      state.nip = "";
      state.social_security_number = "";
      state.file = "";
      state.medicalSpecialty = "";
      state.provider_specialities = [];
      state.boardCertification = {
        BC: false,
        BE: false,
        BCE:false,
        NA:false,
        IMLC:false
      };
      state.stateLicense = [];
      state.pendingStateLicense = [];
      state.nonActiveStateLicense = []; 
      state.regularHourlyRate = "";
      state.holidayHourlyRate = "";
      state.overtimeHourlyRate = "";
      state.regularRateType = "hourly";
      state.holidayRateType = "hourly";
      state.overtimeRateType = "hourly";
      state.isLoading = false;
      state.error = false;
    },
    addNewUser: (state, action) => {
      state.newUserData = action.payload;
    },
    removeNewUser: (state) => {
      state.newUserData = null;
    },
    updateNewUserData: (state, action) => {
      if (state.newUserData) {
        state.newUserData = {
          ...action.payload,  
        };
      }
    },
    
    updateNewUserDataField: (state, action) => {
      const { field, value } = action.payload;
      if (state.newUserData) {
        state.newUserData[field] = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStates thunk
      .addCase(fetchStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.statesList = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle fetchProviderRoles thunk
      .addCase(fetchProviderRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProviderRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.providerRolesList = action.payload;
      })
      .addCase(fetchProviderRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle fetchMedicalSpecialities thunk
      .addCase(fetchMedicalSpecialities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMedicalSpecialities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.medicalSpecialities = action.payload;
      })
      .addCase(fetchMedicalSpecialities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle saveJobHandler thunk
      .addCase(saveJobHandler.pending, (state) => {
        state.isLoading = true;
        state.status = "saving";
        state.error = false;
      })
      .addCase(saveJobHandler.fulfilled, (state, action) => {
       
        state.provider = "";
        state.status = "success";
        state.providerFullName = ""; 
        state.provider_sub_role = ""; 
        state.email = "";
        state.recruiter_id = "";
        state.phone = "";
        state.providerRole = "";
        state.medicalSpecialty = "";
        state.provider_specialities = [];
        state.boardCertification = {
          BC: false,
          BE: false,
          BCE: false,
          IMLC: false,
          NA:false
        };
        state.date_of_birth = "";
        state.nip = "";
        state.social_security_number = "";
        state.file = "";
        state.stateLicense = [];
        state.pendingStateLicense = [];
        state.nonActiveStateLicense = [];
        state.regularHourlyRate = "";
        state.holidayHourlyRate = "";
        state.isLoading = false;
        state.error = false;
        state.successMessage = "Provider added successfully";
        state.newUserData = action.payload.job;
      })
      .addCase(saveJobHandler.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action?.payload?.data?.message || action.error.message;
      })
      // Handle fetchjobsdata thunk
      .addCase(fetchJobsData.pending, (state) => {
        state.isLoading = true;
        state.status = "Loading";
        state.error = false;
      })
      .addCase(fetchJobsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "success";
        state.jobsTableData = action.payload;
      })
      .addCase(fetchJobsData.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setField,
  resetField,
  removeNewUser,
  addNewUser,
  updateCertificate,
  updateNewUserDataField,updateNewUserData
} = jobSlice.actions;
export default jobSlice.reducer;
