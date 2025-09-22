// src/redux/slices/referenceFormSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  id:'',
  name: "",
  roles: [],
  has_expiry:false,
  has_multi_submission:false,
  type:''
};

// Create the slice
const referenceFormSlice = createSlice({
  name: "referenceForm",
  initialState,
  reducers: {
    setRefFormData: (state, action) => { 
      const { name, value } = action.payload;
      state[name] = value;
    },
    setRefRoles: (state, action) => { 
      state.roles = action.payload;
    },
    clearRefForm: (state) => { 
      return initialState;
    },
    editRefFormData: (state, action) => { 
      const {id, name, roles,has_multiple_submissions
      } = action.payload; 
      if (id !== undefined) state.id = id;
      if (name !== undefined) state.name = name;
      if (roles !== undefined) state.roles = roles;
      if (has_multiple_submissions
        !== undefined) state.has_multi_submission = has_multiple_submissions
        ;
 
    },
  },
});

export const { setRefFormData, setRefRoles, clearRefForm, editRefFormData } = referenceFormSlice.actions;

export const selectRefFormData = (state) => state.referenceForm;

export default referenceFormSlice.reducer;
