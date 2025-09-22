import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Chip,
  TextField,
  TextareaAutosize,
  styled,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import Breadcrumb from "../BreadCrumb";
import Header from "../Header";
import {
  ContentCopy,
  Group,
  KeyboardBackspaceOutlined,
} from "@mui/icons-material";
import API from "../../API";
import PermissionsComponent from "./PermissionsComponent";
import PermissionsSkeleton from "./PermissionsSkeleton";
import Swal from "sweetalert2";
import { CommonInputField } from "../job-component/CreateJobModal";
import ROUTES from "../../routes/Routes";
import { addCurrentRole } from "../../feature/userManagmentModule/GetRolesSlice";
import NoPermissionCard from "../common/NoPermissionCard";
const SaveIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4823_9451)">
      <path
        d="M2 1.5C1.73478 1.5 1.48043 1.60536 1.29289 1.79289C1.10536 1.98043 1 2.23478 1 2.5V14.5C1 14.7652 1.10536 15.0196 1.29289 15.2071C1.48043 15.3946 1.73478 15.5 2 15.5H14C14.2652 15.5 14.5196 15.3946 14.7071 15.2071C14.8946 15.0196 15 14.7652 15 14.5V2.5C15 2.23478 14.8946 1.98043 14.7071 1.79289C14.5196 1.60536 14.2652 1.5 14 1.5H9.5C9.23478 1.5 8.98043 1.60536 8.79289 1.79289C8.60536 1.98043 8.5 2.23478 8.5 2.5V9.793L11.146 7.146C11.2399 7.05211 11.3672 6.99937 11.5 6.99937C11.6328 6.99937 11.7601 7.05211 11.854 7.146C11.9479 7.23989 12.0006 7.36722 12.0006 7.5C12.0006 7.63278 11.9479 7.76011 11.854 7.854L8.354 11.354C8.30755 11.4006 8.25238 11.4375 8.19163 11.4627C8.13089 11.4879 8.06577 11.5009 8 11.5009C7.93423 11.5009 7.86911 11.4879 7.80837 11.4627C7.74762 11.4375 7.69245 11.4006 7.646 11.354L4.146 7.854C4.09951 7.80751 4.06264 7.75232 4.03748 7.69158C4.01232 7.63084 3.99937 7.56574 3.99937 7.5C3.99937 7.43426 4.01232 7.36916 4.03748 7.30842C4.06264 7.24768 4.09951 7.19249 4.146 7.146C4.19249 7.09951 4.24768 7.06264 4.30842 7.03748C4.36916 7.01232 4.43426 6.99937 4.5 6.99937C4.56574 6.99937 4.63084 7.01232 4.69158 7.03748C4.75232 7.06264 4.80751 7.09951 4.854 7.146L7.5 9.793V2.5C7.5 1.96957 7.71071 1.46086 8.08579 1.08579C8.46086 0.710714 8.96957 0.5 9.5 0.5L14 0.5C14.5304 0.5 15.0391 0.710714 15.4142 1.08579C15.7893 1.46086 16 1.96957 16 2.5V14.5C16 15.0304 15.7893 15.5391 15.4142 15.9142C15.0391 16.2893 14.5304 16.5 14 16.5H2C1.46957 16.5 0.960859 16.2893 0.585786 15.9142C0.210714 15.5391 0 15.0304 0 14.5V2.5C0 1.96957 0.210714 1.46086 0.585786 1.08579C0.960859 0.710714 1.46957 0.5 2 0.5L4.5 0.5C4.63261 0.5 4.75979 0.552678 4.85355 0.646447C4.94732 0.740215 5 0.867392 5 1C5 1.13261 4.94732 1.25979 4.85355 1.35355C4.75979 1.44732 4.63261 1.5 4.5 1.5H2Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_4823_9451">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

const AddEditRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const userPermissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const { currentRole } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.theme.mode);
  const location = useLocation();
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [roleDescriptionError, setRoleDescriptionError] = useState("");

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Role Management", href: ROUTES?.rolePermissionManagement },
    { text: "Custom role" },
  ];
  // Fetch role permissions if editing
  const getRolePermission = async () => {
    setIsLoading(true);
    try {
      let url;
      if (location?.state?.roleDetails?.id) {
        url = `/api/get-permissions?role_id=${location?.state?.roleDetails?.id}`;
      } else {
        url = `/api/get-permissions`;
      }
      const resp = await API.get(url);
      if (resp?.data?.success) {
        setData(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRolePermission();
    if (location?.state?.roleDetails?.id) {
      setIsEditMode(true);
      setRoleName(location.state.roleDetails.name);
      setRoleDescription(location.state.roleDetails.description);
    } else {
      setIsEditMode(false);
    }
  }, [location?.state?.roleDetails?.id]);
  // Handle save or update action
  const handleSave = async () => {
    if (!roleName.trim()) {
      setNameError("Role name is required");
      return;
    }
    // if (!roleDescription.trim()) {
    //   setRoleDescriptionError("Role Description is required");
    // }
    const perMissionArr =
      permissions?.length > 0 ? permissions : data.role_permissions;
    const permissionIds = perMissionArr?.map((permission) => permission?.id);

    if (permissions?.length === 0 && data?.role_permissions?.length == 0) {
      Swal.fire({
        title: `  Opps`,
        text: `Select at least one permission`,
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    try {
      setIsSaveLoading(true);
      const roleData = new FormData();
      roleData.append("id", location?.state?.roleDetails?.id || "");
      roleData.append("name", roleName);
      roleData.append("permissions", permissionIds?.join(","));
      roleData.append("description", roleDescription || "");

      const resp = await API.post("/api/add-role", roleData);
      if (resp?.data?.success) {
        const updatedRoleDetails = {
          ...location?.state?.roleDetails,
          name: roleName,
          description: roleDescription || "",
        };
        dispatch(addCurrentRole(updatedRoleDetails));
        navigate(-1, {
          state: {
            ...location?.state,
            roleDetails: updatedRoleDetails,
          },
        });
        setIsSaveLoading(false);
        Swal.fire({
          title: `  ${isEditMode ? "Update" : "Add"} Role`,
          text: `The role has been ${
            isEditMode ? "Update" : "Add"
          }  successfully.`,
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        setIsSaveLoading(false);
        // Optionally handle the case where the duplication fails
        Swal.fire({
          title: "Oops!",
          text: `Something went wrong while ${
            isEditMode ? "Updating" : "Adding"
          }  the role.`,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.log(error);
      setIsSaveLoading(false);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          `There was an error while ${
            isEditMode ? "Updating" : "Adding"
          }  the role.`,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  if (userPermissions?.includes("update role & permissions role")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              pr: 2,
              mb: "2rem",
            }}
          >
            <Breadcrumb
              items={breadcrumbItems}
              title={"Custom role"}
            ></Breadcrumb>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                variant="contained"
                sx={{
                  bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
                  boxShadow: "none",
                  color: "text.btn_blue",
                  textTransform: "inherit",
                  py: 1.2,
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  "&:hover": {
                    color: "#fff",
                    boxShadow: "none",
                    bgcolor: "text.btn_blue",
                  },
                }}
              >
                {isEditMode ? (
                  ""
                ) : (
                  <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                )}
                {isEditMode ? "Discard" : "Back"}
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={isSaveLoading}
                sx={{
                  display: "flex",
                  gap: 1,
                  bgcolor:
                    darkMode === "dark" ? "background.paper" : "text.btn_blue",
                  boxShadow: "none",
                  color: darkMode === "dark" ? "text.btn_blue" : "white ",
                  textTransform: "inherit",
                  py: 1.2,
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  "&:hover": {
                    color: darkMode === "dark" ? "text.btn_blue" : "#fff",
                    boxShadow: "none",
                    bgcolor: "text.btn_blue",
                  },
                }}
              >
                {isSaveLoading ? "" : <SaveIcon />}
                {isSaveLoading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  "Save"
                )}{" "}
                {/* Dynamically change button text */}
              </Button>
            </Box>
          </Box>
          {/* <Divider sx={{ opacity: 0.3, mb: 4, mx: 2 }} /> */}
          <Card
            sx={{
              bgcolor: "background.paper",
              borderRadius: "12px",
              boxShadow: "none",
              width: "98%",
              mx: "auto",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "text.black",
                    fontWeight: 600,
                    fontSize: "20px",
                    textTransform: isEditMode ? "capitalize" : "initial",
                  }}
                >
                  {isEditMode
                    ? currentRole?.name
                    : "Enter title and description"}
                </Typography>
                {isEditMode ? (
                  <Chip
                    icon={<Group />}
                    label={`${location.state.roleDetails?.user_count} users`}
                    size="small"
                    sx={{
                      p: "4px 6px",
                      bgcolor: "#EDF5FF",
                      color: "#0066FF",
                      "& .MuiChip-icon": {
                        color: "#0066FF",
                      },
                    }}
                  />
                ) : (
                  ""
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mt: 2, px: 2, pt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        darkMode === "dark" ? "white" : "rgba(30, 32, 34, 1) ",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    Role name <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <CommonInputField
                      name="name"
                      placeholder="Enter role name"
                      value={roleName}
                      onChange={(e) => {
                        setRoleName(e.target.value);
                        setNameError("");
                      }}
                      error={nameError}
                    />

                    <Typography variant="caption" color="error">
                      {nameError ? nameError : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    flexDirection: "column",
                    // gap: "8px",
                    mt: "24px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        darkMode === "dark" ? "white" : "rgba(30, 32, 34, 1) ",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    Role description
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ textAlign: "right" }}>
                      <StyledTextarea
                        minRows={4}
                        value={roleDescription}
                        onChange={(e) => {
                          setRoleDescriptionError("");
                          setRoleDescription(e.target.value);
                        }}
                        placeholder="Briefly describe the responsibilities and permissions of this role... "
                        isLightMode={darkMode}
                        sx={{ mt: 1, fontFamily: "Inter, sans-serif" }}
                      />
                      <Typography variant="caption" sx={{}}>
                        Max 500 characters
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="error">
                      {roleDescriptionError ? roleDescriptionError : ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{
              overflowX: "hidden",
              width: "98%",
              m: "0 auto",
              mb: 2,
            }}
          >
            {isLoading ? (
              <PermissionsSkeleton />
            ) : (
              <PermissionsComponent
                isEdit={true}
                currentRole={currentRole}
                allPermissions={data.all_permissions}
                rolePermissions={data.role_permissions}
                onPermissionChange={(newPermissions) => {
                  setPermissions(newPermissions);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};
const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px",
  padding: "8px 16px",
  resize: "none", // prevent resizing if desired
  outline: "none",
  transition: "box-shadow 0.2s",
  backgroundColor: isLightMode ? "#F6F7Fa" : "#25282A",
  color: isLightMode ? "black" : "white",
  "&:focus": {
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    backgroundColor: isLightMode ? "white" : "#25282A",
  },
}));

export default AddEditRole;
