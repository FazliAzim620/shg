import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addHotelBooking } from '../thunkOperation/job_management/providerInfoStep';

const  initialState={
    bookings: [],
    status: 'idle',
    error: null,
  }
const hotelBookingSlice = createSlice({
  name: 'hotelBooking',
  initialState,
  reducers: {
    clearHotelBooking:()=>{
        return initialState
    },
    getBookingHotels:(state,action)=>{
    
      state.bookings=action.payload
    },
    deleteHotelBookingAttachment: (state, action) => {
    const bookingId = action.payload; 
      const booking = state.bookings.find(
        (booking) => booking.id === bookingId
      );
    if (booking) {
        booking.attachment = ''; 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addHotelBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addHotelBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings=[action.payload.data]
      })
      .addCase(addHotelBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearHotelBooking,getBookingHotels,deleteHotelBookingAttachment} = hotelBookingSlice.actions;
export default hotelBookingSlice.reducer;