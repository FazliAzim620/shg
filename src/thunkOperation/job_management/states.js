import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const fetchStates = createAsyncThunk("job/fetchStates", async () => {
  const response = await API.get(`/api/get-states?country_id=231`);
  if (response.error) {
    throw new Error("Failed to fetch states");
  }
  const data = response?.data?.data;
  return data;
});
export const fetchProviderRoles = createAsyncThunk(
  "job/fetchProviderRoles",
  async () => {
    const response = await API.get("/api/get-provider-roles");
    if (response.error) {
      throw new Error("Failed to fetch roles");
    }
    const data = response?.data?.data;
    return data;
  }
);
export const fetchMedicalSpecialities = createAsyncThunk(
  "job/fetchMedicalSpecialities",
  async () => {
    const response = await API.get(`/api/get-medical-specialities`);
    if (response.error) {
      throw new Error("Failed to fetch states");
    }
    const data = response?.data?.data;
    return data;
  }
);

export const saveJobHandler = createAsyncThunk(
  "job/saveJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/add-provider", jobData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
// ========================= edit job provider ============================
export const editJobProvider = createAsyncThunk(
  "job/editJobProvider",
  async (editJobData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/edit-job-provider", editJobData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const fetchJobsData = createAsyncThunk(
  "jobs/fetchJobsData",
  async (param) => {
    let url;
    if (param?.jobOrder) {
      url = `/api/get-jobs?paginate=${param?.perpage}&page=${param?.page}&provider_id=${param.provider_name}&status=${param.status}&role=${param.role}&speciality=${param.speciality}&from_date=${param.from_date}&end_date=${param.end_date}&client_min_rate=${param.client_min_rate}&client_max_rate=${param.client_max_rate}&provider_min_rate=${param.provider_min_rate}&provider_max_rate=${param.provider_max_rate}`;
    } else if (param?.search?.trim()) {
      url = `/api/get-jobs?paginate=${param?.perpage}&page=${param?.page}&status=${param.status}&search=${param?.search}`;
    } else if (param?.sort_type) {
      url = `/api/get-jobs?paginate=${param?.perpage}&page=${param?.page}&sort_column_name=${param?.sort_column_name}&sort_type=${param?.sort_type}&status=${param.status}`;
    } else {
      url = `/api/get-jobs?paginate=${param?.perpage}&page=${param?.page}&status=${param.status}`;
    }
    if (param?.client_id) {
      url = `${url}&client_id=${param.client_id}`;
    }
    const response = await API.get(url);
    const data = response?.data?.data;
    return data;
  }
);
export const fetchProvidersInfo = createAsyncThunk(
  "job/fetchProvidersInfo",
  async (paginate) => {
    let baseUrl = "";
    let query = "";

   
    const isUnscheduled = paginate?.tab === "unscheduled";
    const days = paginate?.days || 30;

    // Choose base URL
    baseUrl = isUnscheduled 
      ? `api/providers/no-shifts?days=${days}` 
      : `api/get-providers`;

    // Build query string based on paginate data
    if (paginate) {
      if (paginate?.filter) {
        query += `&paginate=${paginate?.perpage}`;
        query += `&page=${paginate?.page}`;
        query += `&provider_name=${paginate?.provider_name || ""}`;
        query += `&role=${paginate?.role || ""}`;
        query += `&speciality=${paginate?.speciality || ""}`;
        query += `&min_rate=${paginate?.min_rate || ""}`;
        query += `&max_rate=${paginate?.max_rate || ""}`;
      } else if (paginate?.search) {
        query += `&paginate=${paginate?.rowsPerPage}`;
        query += `&page=${paginate?.currentPage}`;
        query += `&search=${paginate?.search}`;
      } else if (paginate?.rowsPerPage) {
        query += `&paginate=${paginate?.rowsPerPage}`;
        query += `&page=${paginate?.currentPage}`;
      } else {
        query += `&paginate=${paginate}`;
      }
    }

    // Clean up URL (remove leading &)
    const url = `${baseUrl}${query ? (baseUrl.includes('?') ? query : '?' + query.slice(1)) : ''}`;

    const response = await API.get(url);

    if (response.error) {
      throw new Error("Failed to fetch Providers.");
    }

    const data = response?.data?.data;
    return data;
  }
);

// export const fetchProvidersInfo = createAsyncThunk(
//   "job/fetchProvidersInfo",
//   async (paginate) => {
//     let url = "";
//     console.log('paginatae',pagin)
//     if (paginate) {
//       if (paginate?.filter) {
//         url = `api/get-providers?paginate=${paginate?.perpage}&page=${paginate?.page}&provider_name=${paginate?.provider_name}&role=${paginate?.role}&speciality=${paginate?.speciality}&min_rate=${paginate?.min_rate}&max_rate=${paginate?.max_rate}`;
       
//       } else if (paginate?.search) {
//         url = `api/get-providers?paginate=${paginate?.rowsPerPage}&page=${paginate?.currentPage}&search=${paginate?.search}`;
//       } else if (paginate?.rowsPerPage) {
//         url = `api/get-providers?paginate=${paginate?.rowsPerPage}&page=${paginate?.currentPage}`;
//       } else {
//         url = `api/get-providers?paginate=${paginate}`;
//       }
//     } else url = "api/get-providers";
//     const response = await API.get(url);
//     if (response.error) {
//       throw new Error("Failed to fetch Providers.");
//     }
//     const data = response?.data?.data;
//     return data;
//   }
// );
export const fetchClientsInfo = createAsyncThunk(
  "job/fetchClientsInfo",
  async (paginate) => {
    let url = "";
    if (paginate) {
      url = `api/get-clients?paginate=${paginate?.perpage}&page=${paginate?.page}&search=${paginate.search}`;
    } else url = "api/get-clients";
    const response = await API.get(url);
    if (response.error) {
      throw new Error("Failed to fetch Clients.");
    }
    const data = response?.data?.data;
    return data;
  }
);
