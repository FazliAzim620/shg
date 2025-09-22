import { createSlice } from '@reduxjs/toolkit';
import { BudgetPreferenceForm, fetchJobDetail } from '../thunkOperation/job_management/providerInfoStep';

const initialState = {
  status:"idl",
  isLoading: false,
  id:'',
  clientId:'',
  jobId:'',
  sections: ['Airfare', 'Hotel', 'Car rental', 'Logged miles', 'Tolls',"Gas","Parking","Over Budget Travel"],
  airfare: {
    covered: false,
    reimbursementType: 'reimbursed_later',
    specificAirlines: false,
    preferredClass: '',
    airline:'',
    roundtripBudget: { min: 0, max: 0 },
    numRoundtrips: 1,
  },
  hotel: {
    covered: false,
    reimbursementType: 'reimbursed_later',
    preferredHotels: false,
    budgetPerNight: { min: 0, max: 0 },
    specificHotel:'',
    totalNights: 1,
  },
  carRental: {
    covered: false,
    ownCar: true,
    preferredCompanies: false,
    specificCompanies:'',
    rentalCarClasses: false,
    specificCarRentClasses:'',
    budgetPerDay: { min: 0, max: 0 },
    totalRentalDays: 1,
  },
  loggedMiles: {
    covered: false,
    reimbursementRate: true,
    ratePerMile: { min: 0, max: 0 },
    
    // totalRentalDays: 1,
  },
  tolls: {
    covered: false,
    reimbursementRate: true,
    ratePerMile: { min: 0, max: 0 },
    totalDays: 1,
  },
  gas: {
    covered: false,
    
  },
  parking: {
    covered: false,
   
  },
  overBudgetTravel: {
    covered: false,
 
  },
  budgetPreferenceData:''
  // Add other sections as needed
};

const budgetPreferencesSlice = createSlice({
  name: 'budgetPreferences',
  initialState,
  reducers: {
    updateSection: (state, action) => {
      const { section, field, value } = action.payload;
 
      if(section){
        state[section][field] = value;
      }else{
        state[field]=value
      }
      
    },
    resetFields:(state)=>{
      return initialState
    },
    reorderSections: (state, action) => {
      state.sections = action.payload;
    },
    setBudgetPreferenceData: (state, action) => {
      const data = action.payload;
      state.id = data?.id || "";
      if (data?.client_id) {
        state.clientId = data?.client_id;
      }

      if (data?.job_id) {
        state.jobId = data?.job_id;
      }
      state.airfare.covered = Boolean(data?.airfare_cost_covered);
      state.airfare.reimbursementType = data?.airfare_reimbursed_prepaid  ||"";
      state.airfare.preferredClass = data?.preferred_booking_class ||"";
      state.airfare.roundtripBudget.min = data?.roundtrip_airfare_min_budget ||0;
      state.airfare.roundtripBudget.max = data?.roundtrip_airfare_max_budget ||0;
      state.airfare.numRoundtrips = data?.number_of_roundtrips ||1;

      state.hotel.covered = Boolean(data?.hotel_cost_covered);
      state.hotel.reimbursementType = data?.hotel_reimbursed_prepaid ||"";
      state.hotel.preferredHotels = Boolean(data?.preferred_hotel);
      state.hotel.budgetPerNight.min = data?.hotel_per_night_min_budget ||0;
      state.hotel.budgetPerNight.max = data?.hotel_per_night_max_budget ||0;
      state.hotel.specificHotel = data?.specify_hotel ||"";
      state.hotel.totalNights = data?.total_nights ||1;

      state.carRental.covered = Boolean(data?.car_cost_covered);
      state.carRental.ownCar = Boolean(data?.car_own_rental);
      state.carRental.preferredCompanies = Boolean(data?.preferred_rental_car_company);
      state.carRental.specificCompanies = data?.specify_rental_car_company ||"";
      state.carRental.rentalCarClasses = Boolean(data?.limit_on_rental_car_class);
      state.carRental.specificCarRentClasses = data?.specify_limit_rental_car_class ||"";
      state.carRental.budgetPerDay.min = data?.rental_car_per_day_min_budget ||0;
      state.carRental.budgetPerDay.max = data?.rental_car_per_day_max_budget ||0;
      state.carRental.totalRentalDays = data?.total_rental_days ||1;

      state.loggedMiles.covered = Boolean(data?.personal_car_logged_miles_cost);
      state.loggedMiles.reimbursementRate = Boolean(data?.mileage_reimbursement_rate);
      state.loggedMiles.ratePerMile.min = data?.mileage_reimbursement_rate_min_budget ||0;
      state.loggedMiles.ratePerMile.max = data?.mileage_reimbursement_rate_max_budget ||0;

      state.tolls.covered = Boolean(data?.tolls_cost_covered);
      state.tolls.ratePerMile.min = data?.toll_per_day_min_budget ||0;
      state.tolls.ratePerMile.max = data?.toll_per_day_max_budget ||0;
      state.tolls.totalDays = data?.total_toll_days ||1;

      state.gas.covered = Boolean(data?.gas_cost_covered);

      state.parking.covered = Boolean(data?.parking_cost_covered);

      state.overBudgetTravel.covered = Boolean(data?.client_approve_overbudget_travel_cost);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle BudgetPreferenceForm thunk
      .addCase(BudgetPreferenceForm.pending, (state) => {
        state.status = 'loading';
        
      })
      .addCase(BudgetPreferenceForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgetPreferenceData=action.payload.data
        state.id=action.payload.data.id
      
      })
      .addCase(BudgetPreferenceForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchJobDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgetPreferenceData = action.payload?.budget_preferences;
        state.clientId = action.payload?.client?.id || "";
        // Optionally, reset the form or handle the submitted data
      })
      .addCase(fetchJobDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    }
});

export const { updateSection, reorderSections,resetFields,setBudgetPreferenceData } = budgetPreferencesSlice.actions;
export default budgetPreferencesSlice.reducer;