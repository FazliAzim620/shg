import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTimesheet:null,
 
};

const getCurrentTimesheet = createSlice({
  name: "currentTimesheet",
  initialState,
  reducers: {
    setCurrentTimesheet: (state, action) => {
     state.currentTimesheet = action.payload;
    },
    updateCurrentTimesheet: (state, action) => {
      console.log('action payload',action.payload)
      const {timesheet_status, 
        admin_status,client_status }=action.payload
      state.currentTimesheet = {
        ...state.currentTimesheet,timesheet_status,client_status,admin_status
      };
    },
    clearCurrentTimesheet: (state) => {
      state.currentTimesheet =""
    },
   
  },
});

export const { setCurrentTimesheet,clearCurrentTimesheet,updateCurrentTimesheet } =
getCurrentTimesheet.actions;

export default getCurrentTimesheet.reducer;
