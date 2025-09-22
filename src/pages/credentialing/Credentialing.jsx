import { Box, Typography, Button, Divider, Tab, Tabs } from "@mui/material";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import { PersonAddAlt1 } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import AddUser from "./AddUser";
// import Roles_Permissions from "./Roles_Permissions";
// import ActivityLog from "./ActivityLog";
import { useDispatch } from "react-redux";
import { fetchRoles } from "../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import { selectOptions } from "../../util";
import API from "../../API";
import Swal from "sweetalert2";
import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import usePersistedTab from "../../components/customHooks/usePersistedTab";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../components/handleConfirmDelete";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../components/handleConfirmDelete";
import { fetchUserInfo } from "../../thunkOperation/auth/loginUserInfo";
import NoPermissionCard from "../../components/common/NoPermissionCard";
import UserCards from "../users/UserCards";
import UsersTable from "../users/UsersTable";
import {
  ActiveUserIcon,
  InActiveUserIcon,
  UserIcon,
  UserPendingIcon,
} from "../users/Icons";
import CredentialingTable from "./CredentialingTable";
import CredentialingSetting from "./CredentialingSetting";
import { fetchProviderRoles } from "../../thunkOperation/job_management/states";
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
const Credentialing = () => {
  const darkMode = useSelector((state) => state.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("edit");
  const [changeOccure, setChangeOccure] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const { roles } = useSelector((state) => state.users);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const userRole = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  useEffect(() => {
    dispatch(fetchProviderRoles()).finally(() => {});
  }, [dispatch]);

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Credentialing" },
  ];
  const usersCount = [
    {
      id: 1,
      title: "Total Providers",
      count: 0,
      Icon: <UserIcon />,
    },
    {
      id: 2,
      title: "Expiring Documents  ",
      count: 0,
      Icon: <InActiveUserIcon />,
    },
    {
      id: 3,
      title: "Pending Verification  ",
      count: 0,
      Icon: <UserPendingIcon />,
    },
    {
      id: 3,
      title: "verified Credentials  ",
      count: 0,
      Icon: <ActiveUserIcon />,
    },
  ];
  const [value, setValue] = usePersistedTab(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== 2) {
      setChangeOccure(!changeOccure);
    }
  };

  const openEditHandler = (user) => {
    setDrawerMode("role");
    setDrawerOpen(true);
    setSelectedUser(user?.roles);
    setSelectedUserId(user?.id);
  };
  const [user, setUser] = useState(null);
  const [changeStatus, setChangeStatus] = useState(false);
  const [deleteProvider, setDeleteProvider] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const confirmDelete = (curr_user) => {
    setDeleteProvider(true);
    setUser(curr_user);
  };
  const confirmStatus = (curr_user) => {
    setChangeStatus(true);
    setUser(curr_user);
  };
  const closeModal = () => {
    setChangeStatus(false);
    setDeleteProvider(false);
    setIsLoading(false);
    // setSelectedUser(null);
  };

  const changeStatusHandler = async () => {
    alert("under construction");
    // try {
    //   const response = await API.post("/api/update-user-status", {
    //     user_id: user.id,
    //     status: user.status ? 0 : 1,
    //   });

    //   if (response.data?.success) {
    //     Swal.fire({
    //       title: "Success!",
    //       text: "User status has been changed successfully.",
    //       icon: "success",
    //       confirmButtonText: "OK",
    //     });
    //     setChangeOccure(!changeOccure);
    //     closeModal();
    //   } else {
    //     closeModal();
    //     Swal.fire({
    //       title: "Error!",
    //       text: "There was an issue changing the user's status. Please try again later.",
    //       icon: "error",
    //       confirmButtonText: "OK",
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   closeModal();
    //   Swal.fire({
    //     title: "Error!",
    //     text:
    //       error.response?.data?.message ||
    //       "An error occurred. Please try again later.",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    // }
  };

  const deleteProviderHandler = async () => {
    alert("under construction");
    // if (isLoading) {
    //   return;
    // }
    // setIsLoading(true);
    // const roleNames = selectedRoles
    //   .map((roleId) => {
    //     const role = roles?.roles.find((r) => r.id === roleId);
    //     return role ? role.name : null;
    //   })
    //   .filter((name) => name);
    // // handleAddUserData.append("role", roleNames.join(","));

    // try {
    //   const response = await API.post("/api/change-userrole", {
    //     user_id: selectedUserId,
    //     role: roleNames?.join(","),
    //   });

    //   if (response.data?.success) {
    //     Swal.fire({
    //       title: "Success!",
    //       text:
    //         response?.data?.msg || "User role has been changed successfully.",
    //       icon: "success",
    //       confirmButtonText: "OK",
    //     });
    //     setDrawerOpen(false);
    //     dispatch(fetchUserInfo());
    //     setChangeOccure(!changeOccure);
    //     closeModal();
    //   } else {
    //     closeModal();
    //     Swal.fire({
    //       title: "Error!",
    //       text: "There was an issue changing the user's status. Please try again later.",
    //       icon: "error",
    //       confirmButtonText: "OK",
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   closeModal();
    //   Swal.fire({
    //     title: "Error!",
    //     text:
    //       error.response?.data?.message ||
    //       "An error occurred. Please try again later.",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    // }
  };

  if (permissions?.includes("read user management user")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <ConfirmStatusModal
          isOpen={changeStatus}
          onClose={closeModal}
          onConfirm={changeStatusHandler}
          isLoading={isLoading}
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
        <ConfirmRoleModal
          isOpen={deleteProvider}
          onClose={closeModal}
          onConfirm={deleteProviderHandler}
          isLoading={isLoading}
          title={"Delete provider"}
          action={"Delete "}
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
                Are you sure you want to delete this user?
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
              >
                Deleting this user will permanently remove their account and all
                associated data. This action cannot be undone. Are you sure you
                want to proceed?
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
            }}
          >
            <Breadcrumb items={breadcrumbItems} title={"Credentialing"} />
          </Box>
          <Box sx={{ width: "97%", m: "0 auto", mt: 1.8 }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "14px",
                        fontWeight: 600,
                        color:
                          value !== 0 && darkMode == "dark"
                            ? "rgba(255, 255, 255, .7)"
                            : "text.primary",
                      }}
                    >
                      All providers
                    </Typography>
                  </Box>
                }
                {...a11yProps(0)}
                sx={{ pb: 2.25 }}
              />

              <Tab
                label={
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                      fontWeight: 600,
                      color:
                        value !== 1 && darkMode == "dark"
                          ? "rgba(255, 255, 255, .7)"
                          : "text.primary",
                    }}
                  >
                    Archived providers
                  </Typography>
                }
                {...a11yProps(1)}
                sx={{
                  textTransform: "capitalize",
                  fontSize: "14px",
                  fontWeight: 400,
                  color:
                    darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#132144",
                  pb: 2.25,
                }}
              />
              {userRole?.user?.role === "Super Admin" ? (
                <Tab
                  label={
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "14px",
                        fontWeight: 600,
                        color:
                          value !== 1 && darkMode == "dark"
                            ? "rgba(255, 255, 255, .7)"
                            : "text.primary",
                      }}
                    >
                      Settings{" "}
                    </Typography>
                  }
                  {...a11yProps(1)}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: 400,
                    color:
                      darkMode == "dark"
                        ? "rgba(255, 255, 255, .7)"
                        : "#132144",
                    pb: 2.25,
                  }}
                />
              ) : (
                ""
              )}
            </Tabs>
            <Divider sx={{ opacity: 0.5 }} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              pb: 4,
              px: 2,
              //   width: { sm: "100%", md: "70%", xl: "55%" },
              m: "0 auto",
            }}
          >
            {value === 0 ? (
              <Box sx={{ textAlign: "center", mt: 4.5 }}>
                <UserCards propsData={usersCount} />
              </Box>
            ) : (
              ""
            )}
            {/* {value === 0 ? "Credentialing providers Table " : ""} */}
            {value === 2 ? (
              <CredentialingSetting />
            ) : (
              <CredentialingTable
                openEditHandler={openEditHandler}
                confirmStatus={confirmStatus}
                confirmDelete={confirmDelete}
                changeOccure={changeOccure}
                value={value}
              />
            )}
            {/* {value === 1 ? <Roles_Permissions /> : ""}
            {value === 2 ? (
              <ActivityLog data={dummyData} timesheet={dummyTimesheet} />
            ) : (
              ""
            )} */}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default Credentialing;
