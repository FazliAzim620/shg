import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const addClientHandler = createAsyncThunk(
  "client/submitForm",
  async (formData, { rejectWithValue }) => {
 
    let url = formData?.client_id ? `/api/edit-job-client` : `/api/add-client`;

    console.log("formData",formData);
    // Create new FormData instance
    const form = new FormData();

    // Add basic info
    form.append("name", formData?.basicInfo?.clientName);

    form.append("email", formData?.basicInfo?.clientEmail); // Use clientEmail for unique client email
    form.append("primary_contact_email", formData?.basicInfo?.email); // Add primary contact email
    
    // Handle phones array
    formData?.basicInfo?.phones?.forEach((phone, index) => {
      form.append(`phones[${index}][number]`, phone.number);
      form.append(`phones[${index}][type]`, phone.type);
    });

    // Add contact info
    form.append("primary_contact_firstname", formData?.basicInfo?.firstName);
    form.append("primary_contact_lastname", formData?.basicInfo?.lastName);
    form.append("primary_contact_role", formData?.basicInfo?.role);

    // Add billing address
    form.append("billing_country_id", formData?.billingAddress?.country);
    form.append("billing_state_id", formData?.billingAddress?.state);
    form.append("billing_city", formData?.billingAddress?.city);
    form.append("billing_address_line_1", formData?.billingAddress?.address_line_1);
    form.append("billing_address_line_2", formData?.billingAddress?.address_line_2 && formData?.billingAddress?.address_line_2!==null?formData?.billingAddress?.address_line_2:'');
    form.append("billing_zip_code", formData?.billingAddress?.zip_code && formData?.billingAddress?.zip_code!==null?formData?.billingAddress?.zip_code:'');

    // Add site address
    form.append("site_same_as_billing", formData?.siteAddress?.same_is_billing ? 1 : 0);
    form.append("site_country_id", formData.siteAddress?.country);
    form.append("site_state_id", formData?.siteAddress?.state);
    form.append("site_city", formData?.siteAddress?.city);
    form.append("site_address_line_1", formData?.siteAddress?.address_line_1);
    form.append("site_address_line_2", formData?.siteAddress?.address_line_2 && formData?.siteAddress?.address_line_2!==null? formData?.siteAddress?.address_line_2:'');
    form.append("site_zip_code", formData?.siteAddress?.zip_code && formData?.siteAddress?.zip_code!==null?formData?.siteAddress?.zip_code:'');
    form.append("site_name", formData?.siteAddress?.site_name || ""); // Add site_name

    // Add airfare details
    form.append("airfare_cost_covered", formData.airfare.covered ? 1 : 0);
    form.append("airfare_reimbursed_prepaid", 
      formData.airfare.covered ? formData.airfare.reimbursementType : "");
    form.append("booking_class", formData.airfare.specificAirlines ? 1 : 0);
    form.append("preferred_booking_class", 
      formData.airfare.specificAirlines ? formData.airfare.preferredClass : "");
    form.append("roundtrip_airfare_min_budget", formData.airfare.roundtripBudget.min || 0);
    form.append("roundtrip_airfare_max_budget", formData.airfare.roundtripBudget.max || 0);

    // Add hotel details
    form.append("hotel_cost_covered", formData.hotel.covered ? 1 : 0);
    form.append("hotel_reimbursed_prepaid", 
      formData.hotel.covered ? formData.hotel.reimbursementType : "");
    form.append("preferred_hotel", formData.hotel.preferredHotels ? 1 : 0);
    form.append("specify_hotel", 
      formData.hotel.preferredHotels ? formData.hotel.specificHotel : "");
    form.append("hotel_per_night_min_budget", formData.hotel.budgetPerNight.min);
    form.append("hotel_per_night_max_budget", formData.hotel.budgetPerNight.max);

    // Add car rental details
    form.append("car_cost_covered", formData.carRental.covered ? 1 : 0);
    form.append("car_own_rental", formData.carRental.ownCar ? 1 : 0);
    form.append("preferred_rental_car_company", formData.carRental.preferredCompanies ? 1 : 0);
    form.append("specify_rental_car_company", 
      formData.carRental.preferredCompanies ? formData.carRental.specificCompanies : "");
    form.append("limit_on_rental_car_class", formData.carRental.rentalCarClasses ? 1 : 0);
    form.append("specify_limit_rental_car_class", 
      formData.carRental.rentalCarClasses ? formData.carRental.specificCarRentClasses : "");
    form.append("rental_car_per_day_min_budget", formData.carRental.budgetPerDay.min);
    form.append("rental_car_per_day_max_budget", formData.carRental.budgetPerDay.max);

    // Add mileage details
    form.append("personal_car_logged_miles_cost", formData.loggedMiles.covered ? 1 : 0);
    form.append("mileage_reimbursement_rate", formData.loggedMiles.reimbursementRate ? 1 : 0);
    form.append("mileage_reimbursement_rate_min_budget", 
      formData.loggedMiles.reimbursementRate ? formData.loggedMiles.ratePerMile.min : "");
    form.append("mileage_reimbursement_rate_max_budget", 
      formData.loggedMiles.reimbursementRate ? formData.loggedMiles.ratePerMile.max : "");

    // Add tolls details
    form.append("tolls_cost_covered", formData.tolls.covered ? 1 : 0);
    form.append("tolls_reimbursement_rate", formData.tolls.reimbursementRate ? 1 : 0);
    form.append("toll_per_day_min_budget", 
      formData.tolls.reimbursementRate ? formData.tolls.ratePerMile.min : "");
    form.append("toll_per_day_max_budget", 
      formData.tolls.reimbursementRate ? formData.tolls.ratePerMile.max : "");

    // Add other costs
    form.append("gas_cost_covered", formData.gas.covered ? 1 : 0);
    form.append("parking_cost_covered", formData.parking.covered ? 1 : 0);
    form.append("client_approve_overbudget_travel_cost", 
      formData.overBudgetTravel.covered ? 1 : 0);
      try {
     
        const response = await API.post(url, form);
       
        return response?.data;
      } catch (error) {
        return rejectWithValue(error.response);
      }
 
  }
);