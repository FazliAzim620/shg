import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API";

export const addReferenceDocument = createAsyncThunk(
  "reference/addReferenceDocument",
  async ({surveyData,btnState}, { rejectWithValue, getState }) => {
    try {
      // Get formData directly from the state using getState()
      const state = getState();
      const formData = state.referenceForm;  
const obj={
    id:formData?.id||'',
    provider_role_ids:formData?.roles?.join(','),
    name:formData?.name,
    has_expiry:formData?.has_expiry?1:'0',
    has_multiple_submissions:formData?.has_multi_submission?1:'0',

    form_json:JSON.stringify(surveyData)
}
let url;
console.log('btnState',btnState)
if(btnState==='peer'){
  url='/api/save-cred-peer-ref-form'
}else if(btnState==='reference'){
  url="/api/save-cred-profess-ref-form"
}else if(btnState==='forms'){
  url='/api/save-cred-form'
}
const response = await API.post(url, obj);
return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
