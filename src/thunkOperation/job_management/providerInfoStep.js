import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const fetchCountries = createAsyncThunk("client/countries", async () => {
  const response = await API.get(`/api/get-countries`);
  if (response.error) {
    throw new Error("Failed to fetch states");
  }
  const data = response?.data?.data;
  return data;
});
export const fetchStates = createAsyncThunk("country/states", async (id) => {
  const response = await API.get(`/api/get-states?country_id=${id}`);
  if (response.error) {
    throw new Error("Failed to fetch states");
  }
  const data = response?.data?.data;
  return data;
});

export const fetchSiteStates = createAsyncThunk(
  "country/siteStates",
  async (id) => {
    const response = await API.get(`/api/get-states?country_id=${id}`);
    if (response.error) {
      throw new Error("Failed to fetch states");
    }
    const data = response?.data?.data;
    return data;
  }
);
export const fetchJobDetail = createAsyncThunk("job/detail", async (id) => {
  const response = await API.get(`/api/get-job-detail/${id}`);
  if (response.error) {
    throw new Error("Failed to fetch states");
  }
  const data = response?.data?.data;
  return data;
});

export const clientInfoForm = createAsyncThunk(
  "client/submitForm",
  async (formData, { rejectWithValue }) => {
    
    let url;
    if (formData?.client_id) {
      url = `/api/edit-job-client `;
    } else {
      url = `/api/add-client `;
    }
    const obj = {
      name: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      regular_hourly_rate: formData.regularRate,
      regular_rate_type: formData.regularRateType || 'Hourly',
      holiday_hourly_rate: formData.holidayRate,
      holiday_rate_type: formData.holidayRateType || 'Hourly',
      overtime_hourly_rate: formData?.overTimeRate || "",
      overtime_rate_type: formData?.overTimeRateType || 'Hourly',
      billing_country_id: formData.billingAddress,
      billing_state_id: formData.billingState,
      billing_city: formData.billingCity,
      billing_address_line_1: formData.billingAddress1,
      billing_address_line_2: formData.billingAddress2,
      billing_zip_code: formData.billingZipCode,
      site_same_as_billing: formData.sameAsBilling ? 1 : 0,
      site_country_id: formData.siteAddress,
      site_state_id: formData.siteState,
      site_city: formData.siteCity,
      site_address_line1: formData.siteAddress1,
      site_address_line2: formData.siteAddress2,
      site_zip_code: formData.siteZipCode,
      site_name: formData.siteName,
      site_phone: formData.sitePhone,
      from_job_management: true,
      job_id: formData?.job_id || "",
      id: formData?.id || "",
      site_address_id: formData?.siteAddressId || "",
      billing_address_id: formData?.billingAddressId || "",
      start_date: formData?.startDate || "",
      end_date: formData?.endDate || "",
      contract_duration_start_date: formData?.contract_duration_start_date,
      contract_duration_end_date: formData?.contract_duration_end_date,
      privilege_start_date: formData?.privilege_start_date,
      privilege_end_date: formData?.privilege_end_date,
    };
    try {
      const response = await API.post(url, obj);
      console.log("log", response);
      if (formData?.client_id) {
        return response?.data;
      } else {
        return { data: response?.data?.job };
      }
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
// =======================edit client api=====================
export const editClientForm = createAsyncThunk(
  "client/submitForm",
  async (formData, { rejectWithValue }) => {
    console.log(formData);
    const obj = {
      name: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      regular_hourly_rate: formData.regularRate,
      regular_rate_type: formData.regularRateType || 'hourly',
      holiday_hourly_rate: formData.holidayRate,
      holiday_rate_type: formData.holidayRateType || 'hourly',
      overtime_hourly_rate: formData?.overTimeRate || "",
      overtime_rate_type: formData?.overTimeRateType || 'hourly',
      billing_country_id: formData.billingAddress,
      billing_state_id: formData.billingState,
      billing_city: formData.billingCity,
      billing_address_line_1: formData.billingAddress1,
      billing_address_line_2: formData.billingAddress2,
      billing_zip_code: formData.billingZipCode,
      site_same_as_billing: formData.sameAsBilling ? 1 : 0,
      site_country_id: formData.siteAddress,
      site_state_id: formData.siteState,
      site_city: formData.siteCity,
      site_address_line1: formData.siteAddress1,
      site_address_line2: formData.siteAddress2,
      site_zip_code: formData.siteZipCode,
      site_name: formData.siteName,
      site_phone: formData.sitePhone,
      from_job_management: true,
      job_id: formData?.job_id || "",
      id: formData?.client_id || "",
      site_address_id: formData?.siteAddressId || "",
      billing_address_id: formData?.billingAddressId || "",
      start_date: formData?.startDate || "",
      end_date: formData?.endDate || "",
    };
    try {
      const response = await API.post(`/api/add-job-client `, obj);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
// ====================budget preferences api=================
export const BudgetPreferenceForm = createAsyncThunk(
  "budget/submitForm",
  async (formData, { rejectWithValue }) => {
    const obj = {

      id: formData.id || "",
      job_id: formData.jobId || "",
      client_id: formData.clientId || "",
      airfare_cost_covered: formData.airfare.covered ? 1 : 0,
      airfare_reimbursed_prepaid: formData.airfare.covered
        ? formData.airfare.reimbursementType
        : "",
      booking_class: formData.airfare.specificAirlines ? 1 : 0,
      preferred_booking_class: formData.airfare.specificAirlines
        ? formData.airfare.preferredClass
        : "",
      airline: formData.airfare.specificAirlines
        ? formData.airfare.airline
        : "",
      roundtrip_airfare_min_budget: formData.airfare.roundtripBudget.min || 0,
      roundtrip_airfare_max_budget: formData.airfare.roundtripBudget.max || 0,
      number_of_roundtrips: formData.airfare.numRoundtrips || 0,

      hotel_cost_covered: formData.hotel.covered ? 1 : 0,
      hotel_reimbursed_prepaid: formData.hotel.covered
        ? formData.hotel.reimbursementType
        : "",
      preferred_hotel: formData.hotel.preferredHotels ? 1 : 0,
      specify_hotel: formData.hotel.preferredHotels
        ? formData.hotel.specificHotel
        : "",
      hotel_per_night_min_budget: formData.hotel.budgetPerNight.min,
      hotel_per_night_max_budget: formData.hotel.budgetPerNight.max,
      total_nights: formData.hotel.totalNights,

      // -------------------------

      car_cost_covered: formData.carRental.covered ? 1 : 0,
      car_own_rental: formData.carRental.ownCar ? 1 : 0,
      preferred_rental_car_company: formData.carRental.preferredCompanies
        ? 1
        : 0,
      specify_rental_car_company: formData.carRental.preferredCompanies
        ? formData.carRental.specificCompanies
        : "",
      limit_on_rental_car_class: formData.carRental.rentalCarClasses ? 1 : 0,
      specify_limit_rental_car_class: formData.carRental.rentalCarClasses
        ? formData.carRental.specificCarRentClasses
        : "",
      rental_car_per_day_min_budget: formData.carRental.budgetPerDay.min,
      rental_car_per_day_max_budget: formData.carRental.budgetPerDay.max,
      total_rental_days: formData.carRental.totalRentalDays,

      // -------------------------
      personal_car_logged_miles_cost: formData.loggedMiles.covered ? 1 : 0,
      mileage_reimbursement_rate: formData.loggedMiles.reimbursementRate
        ? 1
        : 0,
        mileage_reimbursement_rate_budget: formData.loggedMiles
        .reimbursementRate
        ? formData.loggedMiles.ratePerMile.min
        : "",
      // mileage_reimbursement_rate_min_budget: formData.loggedMiles
      //   .reimbursementRate
      //   ? formData.loggedMiles.ratePerMile.min
      //   : "",
      // mileage_reimbursement_rate_max_budget: formData.loggedMiles
      //   .reimbursementRate
      //   ? formData.loggedMiles.ratePerMile.max
      //   : "",

      tolls_cost_covered: formData.tolls.covered ? 1 : 0,
      tolls_reimbursement_rate: formData.tolls.reimbursementRate ? 1 : 0,
      toll_per_day_min_budget: formData.tolls.reimbursementRate
        ? formData.tolls.ratePerMile.min
        : "",
      toll_per_day_max_budget: formData.tolls.reimbursementRate
        ? formData.tolls.ratePerMile.max
        : "",
      total_toll_days: formData.tolls.totalDays,
      gas_cost_covered: formData.gas.covered ? 1 : 0,
      parking_cost_covered: formData.parking.covered ? 1 : 0,
      client_approve_overbudget_travel_cost: formData.overBudgetTravel.covered
        ? 1
        : 0,
    };

    try {
      const response = await API.post(`/api/add-budget-preferences`, obj);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getJobAttachment = createAsyncThunk(
  "jobAttachment/get",
  async ({ jobId, type }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/api/get-job-attachment/${jobId}?type=${type}`
      );
      return { data: response.data, type };
    } catch (error) {
      return rejectWithValue({ error: error.response.data, type });
    }
  }
);

export const updateAttachmentStatus = createAsyncThunk(
  "attachmentStatus/update",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/make-attachment-active/${id}`);
      return { data: response.data, type };
    } catch (error) {
      return rejectWithValue({ error: error.response.data, type });
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  "attachment/delete",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/api/delete-job-attachment/${id}`);
      return { data: response.data, type };
    } catch (error) {
      return rejectWithValue({ error: error.response.data, type });
    }
  }
);

export const uploadConfirmationLetter = createAsyncThunk(
  "confirmationLetter/upload",
  async (file, { rejectWithValue }) => {
    const type = file.type;
    try {
      const formData = new FormData();
      formData.append("job_id", file.job_id);
      formData.append("file", file.file);
      formData.append("is_active", 1);
      formData.append("type", file.type);
      const response = await API.post("/api/add-job-attachment", formData);
      return { data: response.data, type };
    } catch (error) {
      return rejectWithValue({ error: error.response.data, type });
    }
  }
);
export const fetchShiftSchedules = createAsyncThunk(
  "shiftSchedules/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/get-job-timesheet/${id}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createShiftSchedule = createAsyncThunk(
  "shiftSchedules/create",
  async (newSchedule, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("from_date", newSchedule.newEvent.startDate);
      formData.append("to_date", newSchedule.newEvent.endDate);
      formData.append("start_time", newSchedule.newEvent.startTime);
      formData.append("end_time", newSchedule.newEvent.endTime);
      formData.append("job_id", newSchedule?.id);
      formData.append("working_days", newSchedule?.newEvent?.selectedDays);
      // formData.append("id",newSchedule.newEvent?.id)
      const resp = await API.post("/api/add-job-timesheet", formData);
      dispatch(fetchShiftSchedules(resp?.data?.data?.[0]?.job_id));
      return resp?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateShiftSchedule = createAsyncThunk(
  "updateShiftSchedule/update",
  async (newSchedule, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("date", newSchedule.newEvent.startDate);
      // formData.append("to_date",newSchedule.newEvent.endDate)
      formData.append("start_time", newSchedule.newEvent.startTime);
      formData.append("end_time", newSchedule.newEvent.endTime);
      formData.append("job_id", newSchedule?.id);
      formData.append("working_days", newSchedule?.newEvent?.selectedDays);
      formData.append("id", newSchedule.newEvent?.id);

      const resp = await API.post("/api/edit-job-timesheet", formData);
      dispatch(fetchShiftSchedules(resp?.data?.data?.job_id));
      return resp?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteShiftSchedule = createAsyncThunk(
  "deleteShiftSchedule/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const resp = await API.delete(`/api/delete-job-timesheet/${id}`);
      dispatch(fetchShiftSchedules(resp?.data?.data));
      return resp?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTravelItinerary = createAsyncThunk(
  "travel/saveTravelItinerary",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("id", data?.id);
      formData.append("airline", data?.airline);
      formData.append("ticket_number", data?.ticket_number);
      formData.append("flyer_number", data?.flyer_number);
      formData.append("booking_number", data?.booking_number);
      formData.append("trip_type", data?.trip_type);
      formData.append("total_fare_amount", data?.total_fare_amount);
      formData.append(
        "attachment",
        data?.isNewAttachmentUpload
          ? data?.attachment
          : data?.id
          ? ""
          : data?.attachment
          ? data?.attachment
          : ""
      );
      formData.append("job_id", data?.job_id);
      data?.details.forEach((detail, index) => {
        formData.append(
          `details[${index}][aircraft_number]`,
          detail.aircraft_number
        );
        formData.append(`details[${index}][arrival_time]`, detail.arrival_time);
        formData.append(
          `details[${index}][departure_time]`,
          detail.departure_time
        );
        formData.append(
          `details[${index}][flight_number]`,
          detail.flight_number
        );
        formData.append(`details[${index}][flight_from]`, detail.flight_from);
        formData.append(`details[${index}][seat_class]`, detail.seat_class);
        formData.append(`details[${index}][seat_status]`, detail.seat_status);
        formData.append(`details[${index}][flight_to]`, detail.flight_to);
        formData.append(`details[${index}][id]`, detail.id || "");
      });
      const response = await API.post("/api/add-plane-ticket", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addHotelBooking = createAsyncThunk(
  "hotelBooking/addHotelBooking",
  async (bookingData, { rejectWithValue }) => {
    const formatDateTime = (dateTime) => {
      const dateObj = new Date(dateTime);
      const date = dateObj.toISOString().split("T")[0];
      const time = dateObj.toTimeString().split(" ")[0].slice(0, 5);
      return { date, time };
    };
    // Separate check-in date and time
    const checkIn = formatDateTime(bookingData.checkInDateTime);

    // Separate check-out date and time
    const checkOut = formatDateTime(bookingData.checkOutDateTime);

    try {
      const formData = new FormData();
      formData.append("name", bookingData?.hotelName);
      formData.append("country_id", bookingData?.billingAddress);
      formData.append("state_id", bookingData?.billingState);
      formData.append("city", bookingData?.billingCity);
      formData.append("address_line_1", bookingData?.billingAddress1);
      formData.append("address_line_2", bookingData?.billingAddress2);
      formData.append("zip_code", bookingData?.billingZipCode);
      formData.append("check_in_date", checkIn.date);
      formData.append("check_in_time", checkIn.time);
      formData.append("check_out_date", checkOut.date);
      formData.append("check_out_time", checkOut.time);
      formData.append("room_type", bookingData?.roomType);
      formData.append("bed_type", bookingData?.bedType);
      formData.append("budget_per_night", bookingData?.budgetPerNight);
      formData.append("total_nights", bookingData?.totalNights);
      formData.append(
        "payment_terms",
        bookingData?.paymentTerms == "prepaid"
          ? bookingData?.paymentTerms
          : "later"
      );
      formData.append("job_id", bookingData?.job_id);
      formData.append(
        "attachment",
        bookingData?.isNewAttachmentUpload
          ? bookingData?.attachment
          : bookingData?.id
          ? ""
          : bookingData?.attachment
          ? bookingData?.attachment
          : ""
      );
      bookingData?.id && formData.append("id", bookingData?.id);
      const response = await API.post("/api/add-job-hotel", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCarRentalBooking = createAsyncThunk(
  "carBooking/addCarBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("pickup_date", bookingData.pickupDate);
      formData.append("pickup_time", bookingData.pickupTime);
      formData.append("dropoff_date", bookingData.dropoffDate);
      formData.append("dropoff_time", bookingData.dropoffTime);
      formData.append("car_type", bookingData.carType);
      formData.append("car_rental_company", bookingData.carRentalCompany);
      formData.append("pickup_address", bookingData.pickupAddress);
      formData.append("pickup_location_phone_no", bookingData.pickupPhone);
      formData.append("dropoff_address", bookingData.dropoffAddress);
      formData.append("dropoff_location_phone_no", bookingData.dropoffPhone);
      formData.append(
        "attachment",
        bookingData?.isNewAttachmentUpload
          ? bookingData?.attachment
          : bookingData?.id
          ? ""
          : bookingData?.attachment
          ? bookingData?.attachment
          : ""
      );
      formData.append("rental_amount", bookingData.rentalAmount);
      formData.append(
        "payment_terms",
        bookingData?.paymentTerms == "Prepaid"
          ? bookingData?.paymentTerms
          : "later"
      );
      formData.append("job_id", bookingData.job_id);

      formData.append("id", bookingData?.id);
      const response = await API.post("/api/add-job-car-rental", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getItineraryData = createAsyncThunk(
  "getItineraryData/get",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/get-job-travel-itinerary/${jobId}`);
      const data = response?.data?.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProviderAvailiblity = createAsyncThunk(
  "addProviderAvailiblity",
  async (newSchedule, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("from_date", newSchedule.newEvent.startDate);
      formData.append("to_date", newSchedule.newEvent.endDate);
      formData.append("start_time", newSchedule.newEvent.startTime);
      formData.append("end_time", newSchedule.newEvent.endTime);
      formData.append("type", newSchedule?.type);
      formData.append("selected_days", newSchedule?.newEvent?.selectedDays);
      // formData.append("id", newSchedule.newEvent?.id);
      const resp = await API.post("/api/add-provider-availability", formData);
      dispatch(fetchShiftSchedules(resp?.data?.data?.job_id));
      return resp?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const EditProviderAvailiblity = createAsyncThunk(
  "editProviderAvailiblity",
  async (newSchedule, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("date", newSchedule.newEvent.startDate);
      formData.append("start_time", newSchedule.newEvent.startTime);
      formData.append("end_time", newSchedule.newEvent.endTime);
      formData.append("type", newSchedule?.type);
      formData.append("selected_days", newSchedule?.newEvent?.selectedDays);
      formData.append("id", newSchedule.newEvent?.id);
      const resp = await API.post(
        "/api/update-provider-availability",
        formData
      );
      dispatch(fetchShiftSchedules(resp?.data?.data?.job_id));
      return resp?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
