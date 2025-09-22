import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Skeleton,
  CircularProgress, // Import Skeleton component
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { KeyboardBackspaceOutlined, Loop, MoreVert } from "@mui/icons-material";
import ROUTES from "../../routes/Routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomChip from "../../components/CustomChip";
import API from "../../API";
import {
  capitalizeFirstLetter,
  formatOnlyDate,
  selectOptions,
} from "../../util";
import UserDetailsSkeleton from "./UserDetailsSkeleton";
import UserDetailsPermissions from "./UserDetailsPermissions";
import PermissionsComponent from "../../components/userManagementcomponents/PermissionsComponent";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
import PermissionsSkeleton from "../../components/userManagementcomponents/PermissionsSkeleton";
import EditUserDetails from "./EditUserDetails";
import Swal from "sweetalert2";
import { DeleteConfirmModal as ConfirmSyncModal } from "../../components/handleConfirmDelete";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../components/handleConfirmDelete";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../components/handleConfirmDelete";
import { useDispatch } from "react-redux";
import { fetchRoles } from "../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import AddUser from "./AddUser";
import UserPermissionComponent from "./UserPermissionComponent";
import { fetchUserInfo } from "../../thunkOperation/auth/loginUserInfo";
import NoPermissionCard from "../../components/common/NoPermissionCard";
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
const UserDetails = () => {
  const { roles } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const params = useParams();
  const location = useLocation();
  const { currentUser, edit } = location.state || {};
  const [openSyncAlert, setOpenSyncAlert] = useState(false);
  const darkMode = useSelector((state) => state.theme.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [userNewPermissions, setUserNewPermissions] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    status: " ",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [data, setData] = useState([]);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Role Management", href: ROUTES?.userManagement },
    {
      text: "User Details",
    },
  ];

  useEffect(() => {
    dispatch(fetchRoles()).finally(() => {});
  }, [dispatch]);

  const getUserDetails = async () => {
    try {
      const resp = await API.get(`/api/get-user-details?id=${params.id}`);
      if (resp?.data?.success) {
        setUserDetails(resp?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // console.log("first");
  const getRolePermission = async () => {
    setLoading(true);
    try {
      let url;

      // url = `/api/get-permissions`;

      url = `/api/get-user-roles-permissions?user_id=${params.id}`;
      const resp = await API.get(url);
      if (resp?.data?.success) {
        setData(resp?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRolePermission();
    getUserDetails();
    if (edit) {
      setIsEditing(currentUser);

      setFormData({
        first_name: currentUser?.first_name || "",
        last_name: currentUser?.last_name || "",
        email: currentUser?.email || "",
        status: currentUser?.status ? "active" : "inactive",
      });
    }
  }, [params.id]);

  const formatDateHandler = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }) +
      " - " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };
  const editHandler = () => {
    setIsEditing(userDetails);
    handleMenuClose();

    setFormData({
      first_name: userDetails?.user?.first_name || "",
      last_name: userDetails?.user?.last_name || "",
      email: userDetails?.user?.email || "",
      status: userDetails?.user?.status ? "active" : "inactive",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the fields
    let isValid = true;
    let errorsTemp = {};

    if (!formData.first_name) {
      errorsTemp.first_name = "First Name is required";
      isValid = false;
    }

    if (!formData.last_name) {
      errorsTemp.last_name = "Last Name is required";
      isValid = false;
    }

    if (!formData.email) {
      errorsTemp.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errorsTemp.email = "Email is not valid";
      isValid = false;
    }
    setErrors(errorsTemp);

    if (isValid) {
      const permissionIds = userNewPermissions?.map(
        (permission) => permission?.id
      );
      setIsSaveLoading(true);
      try {
        const userInfoData = new FormData();
        userInfoData.append("id", params?.id);
        userInfoData.append("first_name", formData?.first_name);
        userInfoData.append("last_name", formData?.last_name);
        userInfoData.append("email", formData?.email);
        userInfoData.append(
          "status",
          formData?.status === "inactive" ? "0" : 1
        );

        const userNewPermissions = new FormData();
        userNewPermissions.append("user_id", params.id);
        userNewPermissions.append("permissions", permissionIds?.join(","));

        const userPerm = await API.post(
          `/api/user/update-permissions`,
          userNewPermissions
        );

        const resp = await API.post(`/api/add-user`, userInfoData);

        if (resp?.data?.success) {
          setIsSaveLoading(false);
          setIsEditing(null);
          getRolePermission();
          getUserDetails();
          Swal.fire({
            title: "Success!",
            text: "User updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          setIsSaveLoading(false);
          Swal.fire({
            title: "Error!",
            text:
              resp?.data?.msg ||
              "Failed to update user. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        // Catching any errors from the API calls
        console.log(error);
        setIsSaveLoading(false);
        Swal.fire({
          title: "Error!",
          text:
            error?.response?.data?.msg ||
            "An error occurred while updating the user. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      console.log(formData);
    }
  };
  const syncHandler = async () => {
    setSyncLoading(true);
    try {
      const resp = await API.get(`/api/sync-user-permissions?id=${params?.id}`);
      if (resp?.data?.success) {
        setSyncLoading(false);
        setOpenSyncAlert(false);
        getUserDetails();
        Swal.fire({
          title: "Success!",
          text: resp?.data?.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        setSyncLoading(false);

        setOpenSyncAlert(false);
        Swal.fire({
          title: "Error!",
          text: "There was an issue sync role permissions. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setOpenSyncAlert(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  // ---------------------------------------------------------------- change status
  const [changeStatus, setChangeStatus] = useState(false);
  const changeStatusHandler = async () => {
    setSyncLoading(true);
    try {
      const response = await API.post("/api/update-user-status", {
        user_id: params.id,
        status: userDetails?.user?.status ? 0 : 1,
      });

      if (response.data?.success) {
        setSyncLoading(false);
        getUserDetails();
        Swal.fire({
          title: "Success!",
          text: "User status has been changed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setChangeStatus(false);
      } else {
        setChangeStatus(false);
        setSyncLoading(false);
        Swal.fire({
          title: "Error!",
          text: "There was an issue changing the user's status. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      setSyncLoading(false);
      setChangeStatus(false);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // ------------------------------------------------------------ change status end
  // ----------------------------------------------------------------- change roles
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [changeRole, setChangeRole] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const closeModal = () => {
    setIsLoading(false);
    setDrawerOpen(false);
    setChangeRole(false);
  };
  const changeRoleHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const roleNames = selectedRoles
      .map((roleId) => {
        const role = roles?.roles.find((r) => r.id === roleId);
        return role ? role.name : null;
      })
      .filter((name) => name);
    // handleAddUserData.append("role", roleNames.join(","));

    try {
      const response = await API.post("/api/change-userrole", {
        user_id: params.id,
        role: roleNames?.join(","),
      });

      if (response.data?.success) {
        getUserDetails();
        Swal.fire({
          title: "Success!",
          text:
            response?.data?.msg || "User role has been changed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setDrawerOpen(false);
        dispatch(fetchUserInfo());
        closeModal();
      } else {
        closeModal();
        Swal.fire({
          title: "Error!",
          text: "There was an issue changing the user's status. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      closeModal();
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  console.log("roles?.roles", roles?.roles);
  // ----------------------------------------------------------------- change roles end
  if (permissions?.includes("update user management user")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <ConfirmRoleModal
          isOpen={changeRole}
          onClose={closeModal}
          onConfirm={changeRoleHandler}
          isLoading={isLoading}
          title={"Update user role"}
          action={"Update role"}
          bodyText={
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "21px",
                  pb: "1rem",
                  color: "rgba(52, 58, 64, 1)",
                }}
              >
                Are you sure you want to update roles?
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
              >
                Updating this user's role will replace their current permissions
                with those of the new role. All existing permissions will be
                removed. Are you sure you want to proceed?
              </Typography>
            </Box>
          }
        />
        <AddUser
          open={drawerOpen}
          mode={"role"}
          user={selectedUser}
          isLoading={isLoading}
          rolesList={selectOptions(
            roles?.roles?.filter(
              (item) =>
                item?.name !== "provider" && item?.name !== "Super Admin"
            )
          )}
          onClose={() => setDrawerOpen(false)}
          onSave={(data) => {
            setSelectedRoles(data);
            setChangeRole(true);
          }}
        />
        <ConfirmStatusModal
          isOpen={changeStatus}
          onClose={() => {
            setChangeStatus(false);
            setSyncLoading(false);
          }}
          onConfirm={changeStatusHandler}
          isLoading={syncLoading}
          title={"Status"}
          action={"Change"}
          bodyText={
            <Typography variant="body2">
              Are you sure you want to change the user's status? This action
              will update the user's current status. Please ensure the action is
              correct before proceeding.
            </Typography>
          }
        />
        <ConfirmSyncModal
          isOpen={openSyncAlert}
          onClose={() => {
            setOpenSyncAlert(false);
            setSyncLoading(false);
          }}
          onConfirm={syncHandler}
          isLoading={syncLoading}
          title={"Sync permissions"}
          action={"Sync"}
          bodyText={
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "21px",
                  pb: "1rem",
                  color: "rgba(52, 58, 64, 1)",
                }}
              >
                Are you sure you want to sync role permissions?
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
              >
                Syncing roles will remove all current permissions of this user
                and assign permissions based on their assigned roles. Are you
                sure you want to proceed?
              </Typography>
            </Box>
          }
        />
        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
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
              title={loading ? "" : userDetails?.user?.name}
            />
            {isEditing ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => {
                    setIsEditing(null);
                  }}
                  variant="contained"
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
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
                  Discard
                </Button>
                {permissions?.includes("update user management user") && (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSaveLoading}
                    sx={{
                      display: "flex",
                      gap: 1,
                      bgcolor:
                        darkMode === "dark"
                          ? "background.paper"
                          : "text.btn_blue",
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
                )}
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => {
                    navigate(-1);
                  }}
                  variant="contained"
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
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
                  <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                  Back
                </Button>
                {permissions?.includes("update user management user") && (
                  <Button
                    onClick={() => {
                      setOpenSyncAlert(true);
                    }}
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      bgcolor: "background.btn_blue",
                    }}
                  >
                    <Loop sx={{ mr: 1, fontSize: "1rem" }} />
                    Sync now
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {loading ? (
            <UserDetailsSkeleton />
          ) : isEditing ? (
            <EditUserDetails
              errors={errors}
              setErrors={setErrors}
              setFormData={setFormData}
              formData={formData}
              userDetails={userDetails}
              onSave={async (formData) => {
                try {
                  const resp = await API.put(
                    `/api/update-user-details/${params.id}`,
                    formData
                  );
                  if (resp?.data?.success) {
                    getUserDetails();
                    setIsEditing(null);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
              onCancel={() => setIsEditing(null)}
            />
          ) : (
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "text.black",
                          fontWeight: 600,
                          fontSize: "20px",
                          textTransform: "capitalize",
                        }}
                      >
                        {userDetails?.user?.name}
                      </Typography>

                      <CustomChip
                        dot={true}
                        width={40}
                        dotColor={
                          userDetails?.user?.status
                            ? "rgba(0, 201, 167)"
                            : "rgba( 237, 76, 120)"
                        }
                        chipText={
                          userDetails?.user?.status ? "Active" : "Inactive"
                        }
                        color={"rgba(103, 119, 136, 1)"}
                        bgcolor={
                          userDetails?.user?.status
                            ? "rgba(0, 201, 167,0.1)"
                            : "rgba( 237, 76, 120,0.1)"
                        }
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: "rgba(140, 152, 164, 1)",
                        fontWeight: 600,
                        fontSize: "11.4px",
                        textTransform: "uppercase",
                      }}
                    >
                      Last login &nbsp;
                      {userDetails?.user?.last_login_at
                        ? formatDateHandler(userDetails?.user?.last_login_at)
                        : "--"}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={handleMenuClick}
                    sx={{ p: "0", mr: "-10px" }}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {permissions?.includes("update user management user") && (
                      <MenuItem onClick={editHandler}>Edit details</MenuItem>
                    )}
                    {permissions?.includes("update user management user") && (
                      <MenuItem
                        onClick={() => {
                          setDrawerOpen(true);
                          setSelectedUser(userDetails?.roles);
                          handleMenuClose(false);
                        }}
                      >
                        Change roles
                      </MenuItem>
                    )}
                    {permissions?.includes("update user management user") && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          setChangeStatus(true);
                        }}
                        sx={{ color: "rgba(220, 53, 69, 1)" }}
                      >
                        {userDetails?.user?.status ? "De-activate" : "Activate"}
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mt: 2, px: 2, pt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                        width: "50%",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "21px",
                      }}
                    >
                      Email:
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        width: "50%",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "21px",
                        color:
                          darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                      }}
                    >
                      {userDetails?.user?.email}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "center", mt: "24px" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                        width: "50%",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "21px",
                      }}
                    >
                      Role :
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {userDetails?.roles?.length > 0 ? (
                        <>
                          {userDetails?.roles.slice(0, 2).map((role, index) => (
                            <Chip
                              key={index}
                              label={role?.name || "--"}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(55, 125, 255, 0.1)",
                                borderRadius: "4px",
                                color: "rgba(103, 119, 136, 1)",
                                textTransform: "capitalize",
                              }}
                            />
                          ))}
                          {userDetails?.roles.length > 2 && (
                            <Chip
                              key="count"
                              label={`+${userDetails?.roles.length - 2}`}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(222, 226, 230, 1)",
                                borderRadius: "4px",
                                color: "rgba(30, 32, 34, 1)",
                                textTransform: "capitalize",
                              }}
                            />
                          )}
                        </>
                      ) : (
                        "--"
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "center", mt: "24px" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                        width: "50%",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "21px",
                      }}
                    >
                      Last Updated:
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        width: "50%",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "21px",
                        color:
                          darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                      }}
                    >
                      {userDetails?.user?.updated_at
                        ? formatOnlyDate(userDetails?.user?.updated_at)
                        : ""}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
          <Box sx={{ my: 2, px: 2, pt: 2 }}>
            {loading ? (
              <PermissionsSkeleton />
            ) : // ) : userDetails?.permissions?.length > 0 ? (
            userDetails?.permissions?.length > 0 || isEditing ? (
              // <PermissionsComponent
              //   allPermissions={data.all_permissions}
              //   rolePermissions={userDetails?.permissions}
              //   isEdit={false}
              //   userEdit={isEditing}
              //   onPermissionChange={(newPermissions) => {
              //     setUserNewPermissions(newPermissions);
              //   }}
              // />
              <UserPermissionComponent
                allPermissions={data?.user_roles_permissions_module_wise}
                rolePermissions={userDetails?.permissions}
                isEdit={false}
                userEdit={isEditing}
                userNewPermissions={userNewPermissions}
                onPermissionChange={(newPermissions) => {
                  setUserNewPermissions(newPermissions);
                }}
              />
            ) : (
              <NodataFoundCard
                title={"This user has no permissions assigned."}
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

export default UserDetails;
