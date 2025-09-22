// GetRolesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import { fetchUsersPermissions } from "../../thunkOperation/userManagementModulethunk/getPermissionsThunk";

const rolesSlice = createSlice({
  name: "users",
  initialState: {
    roles: [],
    users: [],
    rolePermissions: [],
    currentRole: null,
    // Store roles data
    loading: false,
    error: null,
  },
  reducers: {
    addCurrentRole: (state, action) => {
      state.currentRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================== get roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============================== get users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ============================== get user's permissions
      .addCase(fetchUsersPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePermissions = action.payload;
        state.error = null;
      })
      .addCase(fetchUsersPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
// Export actions if needed
export const { addCurrentRole } = rolesSlice.actions;
export default rolesSlice.reducer;
