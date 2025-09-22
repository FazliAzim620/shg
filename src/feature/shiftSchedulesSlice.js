// shiftScheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createShiftSchedule, fetchShiftSchedules } from '../thunkOperation/job_management/providerInfoStep';

const  initialState= {
    jobId:null,
    schedules: {},
    status: 'idle',
    error: null,
    loading:false
  }
const shiftScheduleSlice = createSlice({
  name: 'shiftSchedules',
  initialState ,
  reducers: {
    resetSchedules:(state)=>{
        return initialState
    },
    setJobId:(state,action)=>{
        state.jobId=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShiftSchedules.pending, (state) => {
        state.status = 'loading';
        state.loading=true
      })
      .addCase(fetchShiftSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = action.payload;
        state.loading=false
      })
      .addCase(fetchShiftSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading=false
      })
      .addCase(createShiftSchedule.fulfilled, (state, action) => {
    //     const newSchedule = action.payload;
        
    //  const newId = Object.keys(state.schedules).length;
        
    //    state.schedules[newId] = newSchedule;
        
    //    Object.entries(newSchedule).forEach(([key, value]) => {
    //       if (Array.isArray(value)) {
    //      if (state.schedules[key]) {
    //        state.schedules[key] = [...state.schedules[key], ...value];
    //         } else {
    //         state.schedules[key] = value;
    //         }
    //       }
    //     });
      });
  },
});
export const {setJobId,resetSchedules}=shiftScheduleSlice.actions;

export default shiftScheduleSlice.reducer;