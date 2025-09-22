import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../thunkOperation/auth/loginUser";
const initialState = {
  user: null,
  userLocation:null,
  userRolesPermissions:null,
  loading: false,
  error: null,
};
const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    addUserLocation: (state,action) => { 
      state.userLocation = action.payload;
    }, 
     updateUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload; 
      }
    },
     updateUserAllRoles: (state, action) => {
      if (state.user) {
        state.user.user_all_roles= action.payload; 
      }
    },
     addUserRolesPermissions: (state, action) => {
      if (state.user) {
        state.userRolesPermissions = action.payload; 
      }
    },
    clearLoading: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload;
      });
  },
});

export const { logout, clearLoading ,addUserLocation,updateUserRole,addUserRolesPermissions,updateUserAllRoles} = loginSlice.actions;

export default loginSlice.reducer;
