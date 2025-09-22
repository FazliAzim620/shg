import { Box, Typography, Button, Divider, Tab, Tabs } from "@mui/material";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import { PersonAddAlt1 } from "@mui/icons-material";
import { useEffect, useState } from "react";
import UserCards from "./UserCards";
import { useSelector } from "react-redux";
import AddUser from "./AddUser";
import UsersTable from "./UsersTable";
import Roles_Permissions from "./Roles_Permissions";
import ActivityLog from "./ActivityLog";
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
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
const Users = () => {
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
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  useEffect(() => {
    dispatch(fetchRoles()).finally(() => {});
  }, [dispatch]);

  // For adding a new user
  const handleAddUser = () => {
    setDrawerMode("add");
    setSelectedUser(null);
    setSelectedUserId(null);
    setDrawerOpen(true);
  };

  // For editing an existing user
  const handleEditUser = (user) => {
    setDrawerMode("edit");
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "User Management" },
  ];
  const usersCount = {};
  // const [value, setValue] = useState(0);
  const [value, setValue] = usePersistedTab(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const addUserHandler = async (data) => {
    setIsLoading(true);

    try {
      const roleIds = data?.roles;

      const roleNames = roleIds
        .map((roleId) => {
          const role = roles?.roles.find((r) => r.id === roleId);
          return role ? role.name : null;
        })
        .filter((name) => name);

      const handleAddUserData = new FormData();
      handleAddUserData.append("first_name", data?.firstName);
      handleAddUserData.append("last_name", data?.lastName);
      handleAddUserData.append("email", data?.email);
      handleAddUserData.append("role", roleNames.join(","));

      const response = await API.post("/api/add-user", handleAddUserData);

      if (response?.data?.success) {
        setDrawerOpen(false);
        Swal.fire({
          title: "User Added!",
          text: "The user has been added successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setIsLoading(false);
        dispatch(fetchUsers());
        setChangeOccure(!changeOccure);
      } else {
        setIsLoading(false);

        Swal.fire({
          title: "Oops!",
          text:
            response?.data?.msg ||
            "Something went wrong while adding the user.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while adding the user.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
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
  const [changeRole, setChangeRole] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const confirmStatus = (curr_user) => {
    setChangeStatus(true);
    setUser(curr_user);
  };
  const closeModal = () => {
    setChangeStatus(false);
    setChangeRole(false);
    setIsLoading(false);
    // setSelectedUser(null);
  };

  const changeStatusHandler = async () => {
    try {
      const response = await API.post("/api/update-user-status", {
        user_id: user.id,
        status: user.status ? 0 : 1,
      });

      if (response.data?.success) {
        Swal.fire({
          title: "Success!",
          text: "User status has been changed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setChangeOccure(!changeOccure);
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
        user_id: selectedUserId,
        role: roleNames?.join(","),
      });

      if (response.data?.success) {
        Swal.fire({
          title: "Success!",
          text:
            response?.data?.msg || "User role has been changed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setDrawerOpen(false);
        dispatch(fetchUserInfo());
        setChangeOccure(!changeOccure);
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
  const dummyData = [
    {
      id: 5,
      created_at: "2025-02-14T10:00:00Z",
      username: "John Doe",
      description: "Created a new timesheet entry.",
      note: "Pending approval",
      action: "Created",
    },
    {
      id: 1,
      created_at: "2025-02-13T10:00:00Z",
      username: "John Doe",
      description: "Created a new timesheet entry.",
      note: "Pending approval",
      action: "Created",
    },
    {
      id: 2,
      created_at: "2025-02-13T14:30:00Z",
      username: "Jane Smith",
      description: "Submitted the timesheet.",
      note: "Awaiting client review",
      action: "Submitted",
    },
    {
      id: 3,
      created_at: "2025-02-12T09:00:00Z",
      username: "Tommy Lee",
      description: "Approved by admin.",
      note: "Approved by admin",
      action: "Approved",
    },
    {
      id: 4,
      created_at: "2025-02-11T15:00:00Z",
      username: "Alice Brown",
      description: "Rejected by client.",
      note: "Rejected by client",
      action: "Rejected",
    },
    {
      id: 6,
      created_at: "2025-02-12T15:00:00Z",
      username: "Alice Brown",
      description: "Rejected by client.",
      note: "Rejected by client",
      action: "Rejected",
    },
  ];

  const dummyTimesheet = {
    admin_status: "pending_admin_review",
    client_status: "approved_by_client",
    status: "submitted_by_provider",
    timesheet_status: "approved_by_admin",
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
          mode={drawerMode}
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
            if (drawerMode === "role") {
              setSelectedRoles(data);
              setChangeRole(true);
            } else {
              addUserHandler(data);
            }
          }}
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
            <Breadcrumb items={breadcrumbItems} title={"User Management"} />
            {permissions?.includes("create user management user") &&
            value == 0 ? (
              <Button
                onClick={handleAddUser}
                variant="contained"
                startIcon={<PersonAddAlt1 />}
                sx={{ textTransform: "none", bgcolor: "background.btn_blue" }}
              >
                Create new users
              </Button>
            ) : (
              ""
            )}
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
                      Users
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
                    Roles & Permissions
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
                    Activity{" "}
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
                <UserCards usersCount={usersCount} />
              </Box>
            ) : (
              ""
            )}
            {value === 0 ? (
              <UsersTable
                openEditHandler={openEditHandler}
                confirmStatus={confirmStatus}
                changeOccure={changeOccure}
              />
            ) : (
              ""
            )}
            {value === 1 ? <Roles_Permissions /> : ""}
            {value === 2 ? (
              <ActivityLog data={dummyData} timesheet={dummyTimesheet} />
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default Users;
