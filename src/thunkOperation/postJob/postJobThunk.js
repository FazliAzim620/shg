import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const savePostJobHandler = createAsyncThunk(
    "job/saveJob",
    async ({data,save_type}, { rejectWithValue }) => { 
      try { 
        const formData=new FormData()
        formData.append('id',data?.id || "")
        formData.append('save_type',save_type || "")
        formData.append('title',data?.jobTitle || '')
        formData.append('description',data?.jobDescription || "")
        formData.append('provider_role_ids', Array.isArray(data?.providerRoleIds) ? data?.providerRoleIds.join(',') : (data?.providerRoleIds || ""));
        formData.append('pay_rate_type', data?.payRateType || "");
        formData.append('holiday_rate_type', data?.holidayRateType || "");
        formData.append('allied_health_clinician_type',data?.allied_health_clinician_type || "")

        formData.append('speciality_id',data?.specialty || "")
        formData.append('board_certified',data?.boardCertification?.BC?1:0)
        formData.append('board_eligible',data?.boardCertification?.BE?1:0)
        formData.append('not_applicable_board_certification_and_eligibility',data?.boardCertification?.NA?1:0)
        formData.append('state_license_id',data?.stateLicense || "")
        formData.append('regular_hourly_rate',data?.regularHourlyRate || "")
        formData.append('holiday_hourly_rate',data?.holidayHourlyRate || "")
        formData.append('experience_required',data?.experienceRequired || "")
        formData.append('open_positions',data?.openPositions || 1)
        // formData.append('last_date_to_apply',data?.lastDateToApply || "")
        formData.append('shift_start_date',data?.startDate || "")
        formData.append('shift_end_date',data?.endDate || "")
        formData.append('shift_days',data?.shiftDays?.join(',') || "")
        formData.append('shift_start_time',data?.startTime || "")
        formData.append('shift_end_time',data?.endTime || "")
        formData.append('client_id',data?.client?.id || "")
        // -----------------------------------------------------------------------------------------------
        // formData.append('client_id',data?.selectedClient?.id || client?.id ||'')
        formData.append('client_name',data?.client?.name || "")
        formData.append('facility_name',data?.client?.facilityName || "")
        formData.append('client_country_id',data?.selectedCountry?.id || "")
        formData.append('client_state_id',data?.selectedState?.id ||data?.selectedState || "")
        // formData.append('email',data?.client?.email || "")
        formData.append('client_city',data?.client?.city || "")
        // formData.append('client_address_line_1',data?.client?.address1 || '')
        formData.append('client_address_line_1',data?.client?.address2 && data?.client?.address2!==null?data?.client?.address2:'' || '')
        // formData.append('client_zipcode',data?.client?.zipCode && data?.client?.zipCode !==null?data?.client?.zipCode :''|| '')
        // -----------------------------------------------------------------------------------------------
        formData.append('airfare_covered',data?.airfare==='no'?0:1)
        formData.append('hotel_accommodation_covered',data?.hotel==='no'?0:1)
        formData.append('car_rental_covered',data?.car==='no'?0:1)
        formData.append('logged_miles_covered',data?.mileage==='no'?0:1)
        formData.append('toll_expense_covered',data?.tolls==='no'?0:1)
        formData.append('gas_expense_covered',data?.gas==='no'?0:1)
        formData.append('parking_fee_covered',data?.parking==='no'?0:1 )
        formData.append('overbudget_travel_covered',data?.overbudget==='no'?0:1) 
        const response = await API.post("/api/post-job", formData);
        return response?.data;
      } catch (error) {
        return rejectWithValue(error.response);
      }
    }
  );
  export const fetchPostedJobsData = createAsyncThunk(
    "jobs/fetchPostedJobsData",
    async (param) => { 
      let url;
      url = `/api/get-posted-jobs?paginate=${param?.perpage ||20}&page=${param?.page ||1}&search=${param.search||""}&provider_id=${param.provider_name||""}
      &status=${param.status===0?0:param.status|| ""} &role=${param.role||""}&speciality=${param.speciality||""}&from_date=${param.from_date||""}&end_date=${param.end_date||""}&client=${param.client===undefined?"":param.client}&shift_from_time=${param.shift_time||""}&shift_end_time=${param.end_time||""}&location=${param.location===undefined?"":param.location}&sort_column_name=${!param?.sort_column_name ||param?.sort_column_name ===undefined?'':param?.sort_column_name }&sort_type=${!param.sort_type || param.sort_type===undefined?"" :param.sort_type}`;
      const response = await API.get(url);
      const data = response?.data?.data;
      return data;
    }
  );