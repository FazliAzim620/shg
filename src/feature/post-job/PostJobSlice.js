import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchStates,
} from "../../thunkOperation/job_management/states";
import { getClients, getCountries, getStates } from "../../api_request";
import {
  savePostJobHandler,
  fetchPostedJobsData,
} from "../../thunkOperation/postJob/postJobThunk";

export const fetchCountries = createAsyncThunk(
  "selectClient/fetchCountries",
  async () => {
    const response = await getCountries();
    return response.data.data;
  }
);

export const fetchClientStates = createAsyncThunk(
  "selectClient/fetchClientStates",
  async (countryId) => {
    const response = await getStates(countryId);
    return response.data.data;
  }
);

export const fetchClients = createAsyncThunk(
  "selectClient/fetchClients",
  async () => {
    const response = await getClients();
    return response.data.data;
  }
);

const initialState = {
  id: '',
  jobTitle: "",
  jobDescription: "",
  openPositions: "",
  providerRoleIds: [], // replaces providerRole
  payRateType: "hourly", // new for pay rate type
  holidayRateType: "hourly", // new for holiday rate type
  allied_health_clinician_type:'',
  specialty: "",
  boardCertification: {
    BC: false,
    BE: false,
    NA:false
  },
  stateLicense: "",
  regularHourlyRate: "",
  holidayHourlyRate: "",
  experienceRequired: "",
  lastDateToApply: "",
  isLoading: false,
  error: false,
  successMessage: "",
  statesList: [],
  providerRolesList: [],
  clientsList: [],
  medicalSpecialities: [],
  startDate: "",
  endDate: "",
  shiftDays: [],
  selectedDays: "",
  startTime: "",
  endTime: "",
  countries: [],
  states: [],
  selectedCountry: null,
  selectedState: null,
  selectedClient: null,
  client: {
    id: "",
    name: "",
    facilityName:"",
    email:'',
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
  },
  airfare: "no",
  hotel: "no",
  car: "no",
  mileage: "no",
  gas: "no",
  parking: "no",
  overbudget: "no",
  tolls: "no",
  postJobsTableData: [],
  newUserData: null,
};

const jobPostSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    updateBoardCertification: (state, action) => {
      const { field, value } = action.payload;
      state.boardCertification[field] = value;
    },
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      state.successMessage = "";
    },
    setShiftDetails: (state, action) => {
      const { startDate, endDate, shiftDays, startTime, endTime } = action.payload;
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
      if (shiftDays !== undefined) state.shiftDays = shiftDays;
      if (startTime !== undefined) state.startTime = startTime;
      if (endTime !== undefined) state.endTime = endTime;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setSelectedState: (state, action) => {
      state.selectedState = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    setClientField: (state, action) => { 
      state.client[action.payload.field] = action.payload.value;
    },
    updateBudgetPreferences: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    resetClientField: (state) => {
      state.selectedClient = null;
      state.selectedCountry = null;
      state.selectedState = null;
      state.client = {
        id: "",
        name: "",
        facilityName:"",
        email:"",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
      };
    },
    resetField: (state) => {
      state.id='';
      state.jobTitle = "";
      state.jobDescription = "";
      state.providerRoleIds = [];
      state.allied_health_clinician_type = "";
      state.specialty = "";
      state.boardCertification = {
        BC: false,
        BE: false,
        NA: false,
      };
      state.openPositions = "";
      state.stateLicense = "";
      state.regularHourlyRate = "";
      state.holidayHourlyRate = "";
      state.holidayRateType = "hourly";
      state.payRateType = "hourly";
      state.experienceRequired = "";
      state.lastDateToApply = "";
      state.isLoading = false;
      state.error = false;
      state.startDate = "";
      state.endDate = "";
      state.shiftDays = [];
      state.startTime = "";
      state.endTime = "";
      state.selectedClient = null;
      state.selectedCountry = null;
      state.selectedState = null;
      (state.client = {
        id: "",
        name: "",
        email:'',
        facilityName:"",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
      }),
        (state.airfare = "no");
      state.hotel = "no";
      state.car = "no";
      state.mileage = "no";
      state.gas = "no";
      state.parking = "no";
      state.overbudget = "no";
      state.tolls = "no";
    },
    setViewJob: (state, action) => {
      state.newUserData = action.payload;
    },
    removeNewUser: (state) => {
      state.newUserData = null;
    }, 
    updateJobStatus: (state, action) => {
      const { jobId, newStatus } = action.payload;
       
      const jobIndex = state.postJobsTableData?.data?.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        state.postJobsTableData.data[jobIndex].status = newStatus;
      }
    },
    deleteJob: (state, action) => {
      const jobId = action.payload;  
    const jobIndex = state.postJobsTableData?.data?.findIndex(job => job.id === jobId);  
      if (jobIndex !== -1) {
        state.postJobsTableData?.data.splice(jobIndex, 1);
      }
    },
    updateNewUserDataField: (state, action) => {
      const { field, value } = action.payload;
      if (state.newUserData) {
        state.newUserData[field] = value;
      }
    },
    editSelectedJob: (state, action) => {
      const job = action.payload; 
      // Update basic job details
      state.id = job.id;
      state.jobTitle = job.title;
      state.jobDescription = job.description;
      state.openPositions = job.open_positions;
      // Support both array and string for provider_roles
      if (Array.isArray(job.provider_roles)) {
        state.providerRoleIds = job.provider_roles.map(r => r.id);
      } else if (typeof job.provider_roles === 'string') {
        state.providerRoleIds = job.provider_roles.split(',').map(Number);
      } else {
        state.providerRoleIds = [];
      }
      state.allied_health_clinician_type = job.allied_health_clinician_type;
      state.specialty = job.speciality_id;
      state.experienceRequired = job.experience_required;
      state.lastDateToApply = job.last_date_to_apply;
      
      // Update board certification
      state.boardCertification = {
        BC: +job.board_certified === 1,
        BE: +job.board_eligible === 1,
        NA: +job.not_applicable_board_certification_and_eligibility === 1
      };
      
      // Update rates
      state.regularHourlyRate = job.regular_hourly_rate;
      state.holidayHourlyRate = job.holiday_hourly_rate;
      state.stateLicense = job.state_license_id;
      state.payRateType = job.pay_rate_type || "hourly";
      state.holidayRateType = job.holiday_rate_type || "hourly";
      
      // Update shift details
      state.startDate = job.shift_start_date&& job.shift_start_date;
      state.endDate = job.shift_end_date&&job.shift_end_date;
      state.shiftDays = job.shift_days &&job?.shift_days?.split(',');
      state.startTime = job.shift_start_time&&  job.shift_start_time;
      state.endTime = job.shift_end_time&& job.shift_end_time;
      
      // Update client details
      state.selectedClient = job.client_id;
      state.client = {
        id: job.client_id,
        name: job.client_name || job.client?.name,
        facilityName: job.facility_name || job.client?.name,
        email:job.client?.email, 
        // address1: job.client_address_line_1,
        address2: job.facility_address
,
        city: job.facility_city,
        state:+job.facility_state_id
        ,
        zipCode: job.client_zipcode
      };
      
      // Update travel preferences
      state.airfare = +job.airfare_covered === 1 ? "yes" : "no";
      state.hotel = +job.hotel_accommodation_covered === 1 ? "yes" : "no";
      state.car = +job.car_rental_covered === 1 ? "yes" : "no";
      state.mileage = +job.logged_miles_covered === 1 ? "yes" : "no";
      state.gas = +job.gas_expense_covered === 1 ? "yes" : "no";
      state.parking = +job.parking_fee_covered === 1 ? "yes" : "no";
      state.overbudget = +job.overbudget_travel_covered === 1 ? "yes" : "no";
      state.tolls = +job.toll_expense_covered === 1 ? "yes" : "no";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
      })
      .addCase(fetchClientStates.fulfilled, (state, action) => {
        state.states = action.payload;
      })
      .addCase(fetchStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statesList = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProviderRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProviderRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerRolesList = action.payload;
      })
      .addCase(fetchProviderRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMedicalSpecialities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMedicalSpecialities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalSpecialities = action.payload;
      })
      .addCase(fetchMedicalSpecialities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(savePostJobHandler.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(savePostJobHandler.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Provider added successfully";
        state.newUserData = action.payload.job;
      })
      .addCase(savePostJobHandler.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.data?.message || action.error.message;
      })
      .addCase(fetchPostedJobsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPostedJobsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postJobsTableData = action.payload;
      })
      .addCase(fetchPostedJobsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchClients.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientsList = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setField,
  setShiftDetails,
  resetField,
  resetClientField,
  removeNewUser,deleteJob,
  setViewJob,
  updateBoardCertification,updateJobStatus,
  updateNewUserDataField,
  setSelectedCountry,
  setSelectedState,
  setClientField,
  setSelectedClient,
  updateBudgetPreferences,
  editSelectedJob,
} = jobPostSlice.actions;

export default jobPostSlice.reducer;