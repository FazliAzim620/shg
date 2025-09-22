// src/redux/slices/organizationFormSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  id:'',
  name: "",
  roles: [],
  description: "",
  purpose: "signature",
  type:''
};

// Create the slice
const organizationFormSlice = createSlice({
  name: "organizationForm",
  initialState,
  reducers: {
    setFormData: (state, action) => { 
      const { name, value } = action.payload;
      state[name] = value;
    },
    setRoles: (state, action) => { 
      state.roles = action.payload;
    },
    clearOrgForm: (state) => { 
      return initialState;
    },
    editOrganizationFormData: (state, action) => {
      const {id, name, roles, description, purpose } = action.payload; 
      if (id !== undefined) state.id = id;
      if (name !== undefined) state.name = name;
      if (roles !== undefined) state.roles = roles;
      if (description !== undefined) state.description = description;
      if (purpose !== undefined) state.purpose = purpose;
    },
  },
});

export const { setFormData, setRoles, clearOrgForm, editOrganizationFormData } = organizationFormSlice.actions;

export const selectFormData = (state) => state.organizationForm;

export default organizationFormSlice.reducer;
