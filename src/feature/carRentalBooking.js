import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addCarRentalBooking } from '../thunkOperation/job_management/providerInfoStep';

const  initialState={
  carBookings: [],
    status: 'idle',
    error: null,
  }
const carBookingSlice = createSlice({
  name: 'carRentalBooking',
  initialState,
  reducers: {
    clearCarBooking:()=>{
        return initialState
    },
    getBookingCars:(state,action)=>{
      state.carBookings=action.payload
    },
    deleteCarBookingAttachment: (state, action) => {
      const bookingId = action.payload; 
      const booking = state.carBookings.find(
        (booking) => booking.id === bookingId
      );
      if (booking) {
        booking.attachment = ''; 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCarRentalBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCarRentalBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
      
        // state.carBookings.push(action.payload.data);
        state.carBookings=[action.payload.data]
      })
      .addCase(addCarRentalBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCarBooking,getBookingCars,deleteCarBookingAttachment} = carBookingSlice.actions;
export default carBookingSlice.reducer;