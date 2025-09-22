// travelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveTravelItinerary } from "../thunkOperation/job_management/providerInfoStep";

const initialState = {
  itinerary: {
    id: "",
    job_id: "",
    airline: "",
    attachment: "",
    isNewAttachmentUpload:false,
    ticket_number: "",
    flyer_number: "",
    booking_number: "",
    trip_type: "round",
    total_fare_amount: 0,
    details: [
      {
        flight_number: "",
        flight_from: "",
        flight_to: "",
        aircraft_number: "",
        seat_class: "c",
        seat_status: "Confirmed",
        departure_time: "",
        arrival_time: "",
      },
    ],
    createdItinerary: {},
  },
  status: "idle",
  error: null,
};

const travelSlice = createSlice({
  name: "travel",
  initialState,
  reducers: {
    updateItinerary: (state, action) => {
      state.itinerary = { ...state.itinerary, ...action.payload };
      if(action.payload.attachment){
        state.itinerary.isNewAttachmentUpload=true
      } 
    },
    addDestination: (state) => {
      state.itinerary.details.push({
        flight_number: "",
        flight_from: "",
        flight_to: "",
        aircraft_number: "",
        seat_class: "c",
        seat_status: "Confirmed",
        departure_time: "",
        arrival_time: "",
      });
    },
    deleteDestination: (state, action) => {
      const { index } = action.payload;
      if (index >= 0 && index < state.itinerary.details.length) {
        state.itinerary.details.splice(index, 1); // Remove the destination at the specified index
      }
    },
    updateDestination: (state, action) => {
      const { index, data } = action.payload;
      state.itinerary.details[index] = {
        ...state.itinerary.details[index],
        ...data,
      };
    },
    resetTravelFields: (state) => {
      return {
        ...initialState,
        createdItinerary: state.createdItinerary,
      };
    },
    getBookingItinerary: (state, action) => {
      state.createdItinerary = action.payload;
    },
    deleteAirlineAttachment: (state) => {
      state.itinerary.attachment = "";
      state.itinerary.isNewAttachmentUpload = false;

    },
    editItinerary: (state, action) => {
     
      state.itinerary = {
        id: action.payload.id,
        job_id: action.payload.job_id,
        airline: action.payload.airline,
        attachment: action.payload.attachment,
        ticket_number: action.payload.ticket_number,
       
        flyer_number: action.payload.flyer_number,
        booking_number: action.payload.booking_number,
        trip_type: action.payload.trip_type,
        total_fare_amount: parseFloat(action.payload.total_fare_amount),
        details: action.payload.details,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveTravelItinerary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveTravelItinerary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.createdItinerary = action.payload.data;
        
      state.itinerary.isNewAttachmentUpload = false;
      })
      .addCase(saveTravelItinerary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  updateItinerary,
  resetTravelFields,
  addDestination,
  deleteDestination,
  updateDestination,
  editItinerary,
  deleteAirlineAttachment,
  getBookingItinerary,
} = travelSlice.actions;
export default travelSlice.reducer;
