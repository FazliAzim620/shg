import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ContentCopy,
  ExpandLess,
  ExpandMore,
  Group,
  KeyboardBackspaceOutlined,
  MoreVert,
} from "@mui/icons-material";
import API from "../../API";
import PermissionsComponent from "./PermissionsComponent";
import PermissionsSkeleton from "./PermissionsSkeleton";

import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import Breadcrumb from "../BreadCrumb";
import Header from "../Header";
import PermissionsTab from "./PermissionsTab";
import ROUTES from "../../routes/Routes";
import { capitalizeFirstLetter, logoutHandler, scrollToTop } from "../../util";
import usePersistedTab from "../customHooks/usePersistedTab";
import Swal from "sweetalert2";
import { DeleteConfirmModal } from "../handleConfirmDelete";
import NoPermissionCard from "../common/NoPermissionCard";
import Loading from "../common/Loading";

const RoleDetails = () => {
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const { currentRole } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.theme.mode);
  const location = useLocation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Menu state for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Role Management", href: ROUTES?.rolePermissionManagement },
    {
      text: location?.state?.roleDetails?.is_default
        ? "Default Role"
        : "Custom Role",
    },
  ];
  const getRolePermissoin = async () => {
    setIsLoading(true);
    try {
      const resp = await API.get(
        `/api/get-permissions?role_id=${location?.state?.roleDetails?.id}`
      );
      if (resp?.data?.success) {
        setData(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        navigate("/login");
        logoutHandler();
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRolePermissoin();
  }, [location?.state?.roleDetails?.id]);

  // Handle Menu Open and Close
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Delete Confirmation
  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
    handleMenuClose();
  };
  const handleEdit = () => {
    navigate(
      `${ROUTES.roleAddEditPage}?id=${location?.state?.roleDetails?.id}`,
      {
        state: { roleDetails: currentRole },
      }
    );
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    try {
      // Call delete API
      const resp = await API.delete(
        `/api/delete-role?role_id=${location?.state?.roleDetails?.id}`
      );
      if (resp?.data?.success) {
        console.log("Role deleted successfully");
        // Redirect or update the state as needed after delete
      }
      setOpenConfirmDialog(false);
    } catch (error) {
      console.log("Error deleting role:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };
  // --------------------------------------------------------------------- Duplicate Role
  const duplicateRole = async (role) => {
    setIsDuplicating(true);
    handleMenuClose();
    const permissionIds = currentRole?.permissions?.map(
      (permission) => permission?.id
    );

    try {
      const duplicateRoleAndPermissionsData = new FormData();
      duplicateRoleAndPermissionsData.append(
        "name",
        currentRole?.name + " Copy"
      );
      duplicateRoleAndPermissionsData.append(
        "permissions",
        permissionIds?.join(",")
      );
      duplicateRoleAndPermissionsData.append("duplicate", 1);
      duplicateRoleAndPermissionsData.append(
        "description",
        currentRole?.description
      );

      const resp = await API.post(
        "/api/add-role",
        duplicateRoleAndPermissionsData
      );
      if (resp?.data?.success) {
        setIsDuplicating(false);
        Swal.fire({
          title: "Role Duplicated!",
          text: "The role has been duplicated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        setIsDuplicating(false);
        // Optionally handle the case where the duplication fails
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while duplicating the role.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.log(error);
      setIsDuplicating(false);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while duplicating the role.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  // --------------------------------------------------------------------- Duplicate Role end
  // --------------------------------------------------------------------- Delete Role
  const deleteHandler = async (e) => {
    setIsLoading(true);

    try {
      const resp = await API.delete(
        `api/delete-role/${location?.state?.roleDetails?.id}`
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setOpenConfirmDialog(false);
        Swal.fire({
          title: "Delete Role!",
          text: "The role has been deleted successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        navigate(ROUTES?.rolePermissionManagement);
      } else {
        setOpenConfirmDialog(false);
        setIsLoading(false);
        // Optionally handle the case where the duplication fails
        Swal.fire({
          title: "Oops!",
          text:
            resp?.data?.msg || "Something went wrong while deleting the role.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      setOpenConfirmDialog(false);
      setIsLoading(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while deleting the role.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  // --------------------------------------------------------------------- Delete Role end
  if (permissions?.includes("read role & permissions role")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Loading open={isDuplicating} />
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
              title={
                location?.state?.roleDetails?.is_default
                  ? "Default role"
                  : "Custom role"
              }
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
                <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                Back
              </Button>

              {/* Dropdown Button */}
              {currentRole?.is_default ? (
                permissions?.includes("update role & permissions role") ? (
                  <Button
                    onClick={duplicateRole}
                    variant="contained"
                    sx={{
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
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 2.5C0 1.96957 0.210714 1.46086 0.585786 1.08579C0.960859 0.710714 1.46957 0.5 2 0.5L10 0.5C10.5304 0.5 11.0391 0.710714 11.4142 1.08579C11.7893 1.46086 12 1.96957 12 2.5V4.5H14C14.5304 4.5 15.0391 4.71071 15.4142 5.08579C15.7893 5.46086 16 5.96957 16 6.5V14.5C16 15.0304 15.7893 15.5391 15.4142 15.9142C15.0391 16.2893 14.5304 16.5 14 16.5H6C5.46957 16.5 4.96086 16.2893 4.58579 15.9142C4.21071 15.5391 4 15.0304 4 14.5V12.5H2C1.46957 12.5 0.960859 12.2893 0.585786 11.9142C0.210714 11.5391 0 11.0304 0 10.5V2.5ZM5 12.5V14.5C5 14.7652 5.10536 15.0196 5.29289 15.2071C5.48043 15.3946 5.73478 15.5 6 15.5H14C14.2652 15.5 14.5196 15.3946 14.7071 15.2071C14.8946 15.0196 15 14.7652 15 14.5V6.5C15 6.23478 14.8946 5.98043 14.7071 5.79289C14.5196 5.60536 14.2652 5.5 14 5.5H12V10.5C12 11.0304 11.7893 11.5391 11.4142 11.9142C11.0391 12.2893 10.5304 12.5 10 12.5H5Z"
                        fill="white"
                      />
                    </svg>
                    Duplicate
                  </Button>
                ) : (
                  ""
                )
              ) : (
                <Button
                  onClick={handleMenuClick}
                  variant="contained"
                  sx={{
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
                  Actions{Boolean(anchorEl) ? <ExpandLess /> : <ExpandMore />}
                </Button>
              )}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {!currentRole?.is_default &&
                permissions?.includes("update role & permissions role") ? (
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                ) : (
                  ""
                )}
                {permissions?.includes("update role & permissions role") ? (
                  <MenuItem onClick={duplicateRole}>Duplicate</MenuItem>
                ) : (
                  ""
                )}
                {!currentRole?.is_default &&
                permissions?.includes("delete role & permissions role") ? (
                  <MenuItem
                    onClick={handleDeleteClick}
                    sx={{ color: "rgba(220, 53, 69, 1)" }}
                  >
                    Delete
                  </MenuItem>
                ) : (
                  ""
                )}
              </Menu>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: 2,
                  p: 2,
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "text.black",
                    fontWeight: 600,
                    fontSize: "20px",
                    // textTransform: "capitalize",
                  }}
                >
                  {capitalizeFirstLetter(currentRole?.name)}
                </Typography>
                <Chip
                  icon={<Group />}
                  label={`${currentRole?.user_count} users`}
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
                    Role name:
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
                    {" "}
                    {capitalizeFirstLetter(currentRole?.name)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: "24px" }}>
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
                    Role description:
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
                    {capitalizeFirstLetter(currentRole?.description)}
                  </Typography>
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
                currentRole={currentRole}
                allPermissions={data.all_permissions}
                rolePermissions={data.role_permissions}
                isEdit={false}
              />
            )}
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}

        <DeleteConfirmModal
          isOpen={openConfirmDialog}
          onClose={handleCancelDelete}
          onConfirm={deleteHandler}
          isLoading={isLoading}
          itemName={"File"}
          title={"Delete"}
          action={"Delete"}
          bodyText={
            <Typography variant="body2">
              Are you sure you want to delete this role? This action cannot be
              undone.
            </Typography>
          }
        />
        {/* <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this role? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog> */}
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default RoleDetails;
