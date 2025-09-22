import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Container,
  Skeleton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import Breadcrumb from "../BreadCrumb";
import Header from "../Header";
import PermissionsTab from "./PermissionsTab";
import ROUTES from "../../routes/Routes";
import { scrollToTop } from "../../util";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { flxCntrSx } from "../constants/data";
import usePersistedTab from "../customHooks/usePersistedTab";
import ActiveUsersTab from "./ActiveUsersTab";
import InactiveUsersTab from "./InactiveUsersTab";

const tabLabels = [
  {
    label: "Active Users",
    icon: <GroupOutlinedIcon sx={{ fontSize: "18px", mt: 0.6 }} />,
    value: 0,
  },
  {
    label: "Inactive Users",
    icon: <NoAccountsOutlinedIcon sx={{ fontSize: "18px", mt: 0.6 }} />,
    value: 1,
  },
  {
    label: "Permissions",
    icon: <ManageAccountsOutlinedIcon sx={{ fontSize: "18px", mt: 0.6 }} />,
    value: 3,
  },
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RoleIndex_UsersList = () => {
  const [value, setValue] = usePersistedTab(0);
  const navigate = useNavigate();
  const { currentRole } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.theme.mode);
  // Function to handle fetching users
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setValue(0);
  }, [navigate, currentRole]);

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "User Management", href: ROUTES?.userManagement },
    { text: currentRole?.name },
  ];

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Header />
      <Box
        sx={{
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Breadcrumb
          items={breadcrumbItems}
          title={currentRole?.name}
          setValue={setValue}
        >
          <Button
            onClick={() => {
              setValue(0);
              navigate(-1);
              scrollToTop();
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
            Back to user management
          </Button>
        </Breadcrumb>

        {/* Tabs */}
        <Tabs
          sx={{ mx: 2 }}
          value={value}
          onChange={handleChange}
          aria-label="user management tabs"
        >
          {tabLabels.map((tab, index) => (
            <Tab
              key={tab.label}
              label={
                <Box sx={{ ...flxCntrSx, gap: 0.8 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: value === index ? "text.main" : "inherit",
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
        <Divider
          sx={{
            opacity: 0.3,
            mb: 4,
            mx: 2,
            "&::before, &::after": {
              bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
            },
          }}
        />
        {/* <Typography>{tab.icon}</Typography>======================== */}
        {value === 0 && (
          <ActiveUsersTab value={value} currentRole={currentRole} />
        )}
        {value === 1 && (
          <InactiveUsersTab value={value} currentRole={currentRole} />
        )}
        {value === 2 && (
          <PermissionsTab currentRole={currentRole} tab={value} />
        )}
      </Box>
    </Box>
  );
};

export default RoleIndex_UsersList;
