import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const addOrganizationDocument = createAsyncThunk(
  "organization/addOrganizationDocument",
  async (surveyData, { rejectWithValue, getState }) => {
    try {
      // Get formData directly from the state using getState()
      const state = getState();
      const formData = state.organizationForm; // Adjust this path according to your slice structure
      
      console.log('Form Data:', formData);
      console.log('Survey Data:', surveyData);
const obj={
    id:formData?.id||'',
    provider_role_ids:formData?.roles?.join(','),
    name:formData?.name,
    description:formData?.description,
    purpose:formData?.purpose,
    form_json:JSON.stringify(surveyData)
}
const response = await API.post("/api/save-cred-org-generated-doc", obj);
return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
