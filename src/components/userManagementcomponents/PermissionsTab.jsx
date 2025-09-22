import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { IosCommonSwitch } from "../common/IosCommonSwitch";
import { fetchUsersPermissions } from "../../thunkOperation/userManagementModulethunk/getPermissionsThunk";
import CardCommon from "../CardCommon";
import { editJobProvider } from "../../thunkOperation/job_management/states";
import API from "../../API";
import { scrollToTop } from "../../util";

const PermissionsTab = ({ currentRole, tab }) => {
  const { rolePermissions } = useSelector((state) => state?.users);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedRole, setCheckedRole] = useState(
    rolePermissions?.role_permissions?.map((perm) => perm.id) || []
  );
  const [msg, setMsg] = useState("false");
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCheckedRole(
      rolePermissions?.role_permissions?.map((perm) => perm.id) || []
    );
  }, [rolePermissions?.role_permissions]);
  useEffect(() => {
    dispatch(fetchUsersPermissions(currentRole?.id));
  }, []);
  // Handle switch change
  const handlePermissionChange = (id) => {
    setCheckedRole(
      (prev) =>
        prev.includes(id)
          ? prev.filter((moduleId) => moduleId !== id) // Remove if already selected
          : [...prev, id] // Add if not selected
    );
  };

  const menuItems = rolePermissions?.permissions;
  // ============================api call for edit permissions

  const editPermissions = async () => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const editPermissions = new FormData();
      editPermissions.append("role_id", currentRole?.id);
      editPermissions.append("permissions", checkedRole?.join(","));
      const response = await API.post(
        "/api/update-permissions",
        editPermissions
      );
      if (response?.data?.success) {
        setSuccess(true);
        setMsg("Permissions updated Successfully");
        scrollToTop();

        dispatch(fetchUsersPermissions(currentRole?.id));
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mx: 3, mb: 8 }}>
      {success && (
        <Alert severity="success" onClose={() => setSuccess(false)}>
          {msg}
        </Alert>
      )}
      <CardCommon cardTitle={"Permissions"}>
        {menuItems?.map((permission, index) => (
          <>
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              // padding="9px 0"
            >
              <Box py={"25px"} display="flex" alignItems="center" gap={2}>
                <GppGoodOutlinedIcon
                  sx={{ color: "text.btn_blue", fontSize: "18px" }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: "#1e2022",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {permission.name}
                  </Typography>
                </Box>
              </Box>
              <IosCommonSwitch
                checked={checkedRole?.includes(permission.id)}
                onChange={() => handlePermissionChange(permission.id)}
              />
            </Box>
            <Divider key={permission?.id} />
          </>
        ))}

        {/* Submit Button */}
        <Box sx={{ textAlign: "right", pt: 3 }}>
          <Button
            disabled={isLoading}
            sx={{
              mt: 1.1,
              textTransform: "inherit",
              boxShadow: "none",
              height: "41.92px",
            }}
            backgroundcolor={"text.btn_blue"}
            // endIcon={<EastIcon />}
            onClick={editPermissions}
            variant="contained"
          >
            {/* Continue */}
            {isLoading ? (
              <CircularProgress
                size={23}
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </CardCommon>
    </Box>
  );
};

export default PermissionsTab;
