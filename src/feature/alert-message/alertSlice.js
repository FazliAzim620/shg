import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: '', 
  isOpen: false,
  location:null,
  isSessionExpired: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isOpen = true;
      state.location=action.payload.location
    
    },
    clearAlert: (state) => {
      state.message = '';
      state.type = '';
      state.isOpen = false;
      state.location=null,
      state.isSessionExpired = false; 
    },  
      sessionExpiredAlert: (state, action) => {
      state.message = 'Your session has expired. Please login again.';
      state.type = 'error';
      state.isOpen = true;
      
      state.isSessionExpired = true; 
      state.location = '/login'; 
    },
  },
});

export const { setAlert, clearAlert,sessionExpiredAlert } = alertSlice.actions;

export default alertSlice.reducer;
