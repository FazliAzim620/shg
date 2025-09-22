import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentJob: null,
  currentJobBudgetPreference:null,
  week: null,
  allWeeks: null,
  submitted: null,
  loadingData: false,
  jobStatus: 'my_jobs',
  error: null,
};

const getCurrentJob = createSlice({
  name: "currentJob",
  initialState,
  reducers: {
    setJobStatus: (state, action) => {
      state.jobStatus = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
      state.submitted =null
    },
    setCurrentJobBudgetPreference: (state, action) => {
      state.currentJobBudgetPreference = action.payload;
      
    },
    setCurrentJobNull: (state) => {
      state.currentJob = null,
      state.currentJobBudgetPreference=null
    },
    setJobWeeks: (state, action) => {
      state.week = action.payload;
    },
    setAllWeeksHandler: (state, action) => {
      state.allWeeks = action.payload;
    },
    updateStatus: (state, action) => {
      state.submitted = action.payload;
    },
  },
});

export const { setCurrentJob, setJobWeeks,setJobStatus, setCurrentJobBudgetPreference,setCurrentJobNull,setAllWeeksHandler, updateStatus } =
  getCurrentJob.actions;

export default getCurrentJob.reducer;
