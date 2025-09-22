import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const fetchLeadsData = createAsyncThunk(
    "jobs/fetchLeadsData",
    async (param) => { 
      let url;
      url = `/api/get-lead-providers?paginate=${param?.perpage ||20}&page=${param?.page ||1}&search=${param.search||""}&provider_id=${param.provider_name||""}
      &status=${param.status===0?0:param.status|| ""} &role=${param.role||""}&speciality=${param.speciality||""}&phone=${param.phone||""}&email=${param.email||""}&client=${param.client===undefined?"":param.client}&shift_from_time=${param.shift_time||""}&shift_end_time=${param.end_time||""}&location=${param.location===undefined?"":param.location}&sort_column_name=${!param?.sort_column_name ||param?.sort_column_name ===undefined?'':param?.sort_column_name }&sort_type=${!param.sort_type || param.sort_type===undefined?"" :param.sort_type}`;
      const response = await API.get(url);
      const data = response?.data?.data;
      return data;
    }
  );