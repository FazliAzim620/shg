import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Grid,
  Paper,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Notifications,
  AccountCircle,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import jobIcon from "../assets/svg/icons/fin006.svg";
import providerIcon from "../assets/svg/icons/com006.svg";
import clientIcon from "../assets/svg/icons/com005.svg";
import credentialIcon from "../assets/svg/icons/fil016.svg";
import scheduleIcon from "../assets/svg/icons/gen014.svg";
import managementIcon from "../assets/svg/icons/abs037.svg";
import timesheetIcon from "../assets/svg/icons/gen013.svg";
import FinancialIcon from "../assets/svg/icons/fin010.svg";
import analyticsIcon from "../assets/svg/icons/gra012.svg";
import usermanagementIcon from "../assets/svg/icons/teh004.svg";
import settingIcon from "../assets/svg/icons/cod001.svg";
import { useSelector } from "react-redux";
import { fetchUserInfo } from "../thunkOperation/auth/loginUserInfo";
import { useDispatch } from "react-redux";
const menuItems = [
  { icon: jobIcon, title: "Jobs", description: "Manage open positions." },
  { icon: jobIcon, title: "Leads", description: "Manage Leads" },
  {
    icon: providerIcon,
    title: "Service Providers",
    description: "Provider profiles & availability",
  },
  {
    icon: clientIcon,
    title: "Clients",
    description: "Client details & contracts.",
  },
  {
    icon: credentialIcon,
    title: "Credentialing",
    description: "Verification & documentation.",
  },
  {
    icon: scheduleIcon,
    title: "Schedules",
    subtitle: "Shifts",
    description: "Shifts & assignments calendar.",
  },
  {
    icon: managementIcon,
    title: "Job Management",
    subtitle: "Assignment Management",
    description: "Placement details & confirmations.",
  },
  {
    icon: timesheetIcon,
    title: "Timesheets",
    description: "Review & track hours.",
  },
  {
    icon: FinancialIcon,
    title: "Financials",
    description: "Invoices, payments and more.",
  },
  {
    icon: analyticsIcon,
    title: "Analytics",
    description: "View reports & insights.",
  },
  {
    icon: usermanagementIcon,
    title: "Role & Permissions",
    description: "Manage roles & permissions.",
  },
  {
    icon: usermanagementIcon,
    title: "User Management",
    description: "Manage users & permissions.",
  },

  {
    icon: settingIcon,
    title: "Settings",
    description: "System preferences & configurations.",
  },
];
//
function Dashboard() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const handleItemClick = (title) => {
    const path = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${path}`);
  };

  useEffect(() => {
    dispatch(fetchUserInfo());
    sessionStorage.removeItem("currentTabIndex");
  }, [dispatch]);
  // const filteredMenuItems = menuItems?.filter((item) =>
  //   userRolesPermissions?.user_roles_modules?.some(
  //     (role) => role.name == item?.title
  //   )
  // );
  const filteredMenuItems = menuItems?.filter(
    (item) =>
      item?.title === "Leads" ||
      userRolesPermissions?.user_roles_modules?.some(
        (role) => role.name === item?.title
      )
  ); 
  useEffect(() => {
    const redirect = localStorage.getItem("redirect");
    if (redirect) {
      setLoading(true);
      handleItemClick(filteredMenuItems?.[0]?.title);
      setTimeout(() => {
        localStorage.removeItem("redirect");
      }, 1000);
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [filteredMenuItems]);

  return (
    <Box
      sx={{
        bgcolor: "background.page_bg",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: 4, md: 14 },
          pb: 3,
          width: { sm: "100%", md: "70%", xl: "55%" },
          m: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "85vh",
        }}
      >
        {loading ? (
          <Grid container spacing={2} my={1}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                <Skeleton
                  sx={{ borderRadius: "10px" }}
                  variant="rectangular"
                  height={60}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={5.5}>
            {filteredMenuItems?.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: "1rem",
                    display: "flex",
                    borderRadius: "0.5rem",
                    alignItems: "start",
                    cursor: "pointer",
                    boxShadow: "none",
                    color: "text.black",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      color: "text.link",
                    },
                  }}
                  onClick={() =>
                    handleItemClick(item.subtitle ? item.subtitle : item.title)
                  }
                >
                  <img
                    src={item.icon}
                    alt="icon"
                    style={{ width: "1.75rem" }}
                  />
                  <Box sx={{ pl: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: "14px", fontWeight: 600 }}
                    >
                      {item.subtitle ? item.subtitle : item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.76rem" }}
                    >
                      {item?.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: "1rem",
                  display: "flex",
                  borderRadius: "0.5rem",
                  alignItems: "start",
                  cursor: "pointer",
                  boxShadow: "none",
                  color: "text.black",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    color: "text.link",
                  },
                }}
                onClick={() => handleItemClick("Settings")}
              >
                <img
                  src={settingIcon}
                  alt="icon"
                  style={{ width: "1.75rem" }}
                />
                <Box sx={{ pl: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "14px", fontWeight: 600 }}
                  >
                    Settings
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.76rem" }}
                  >
                    System preferences & configurations
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
        <Box sx={{ textAlign: "center", mt: { xs: 10, xl: 35 } }}>
          <Typography>© SHG. 2024, Job Management System.</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
