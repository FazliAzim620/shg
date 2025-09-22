import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
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
import { useDispatch } from "react-redux";

import { resetFields } from "../feature/budgetPreferenceSlice";
import { useSelector } from "react-redux";
export const menuItems = [
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
function MainMenuDropdown({ setShowDropdown }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const handleItemClick = (title) => {
    dispatch(resetFields());
    if (title === "Home") {
      navigate(`/`);
    } else {
      const path = title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/${path}`);
    }
  };

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
  return (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        left: 10,
        zIndex: 1000,
        width: { md: " 60rem" },
        backgroundColor: "background.paper",
        boxShadow: 3,
        // borderRadius: 1,
        p: 2,
        borderTop: "2px solid #007BFF",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
      }}
      onMouseLeave={() => setShowDropdown(false)}
      onMouseEnter={() => setShowDropdown(true)}
    >
      <Grid container spacing={2}>
        {filteredMenuItems?.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: "1rem",
                display: "flex",
                borderRadius: "0.5rem",
                alignItems: "start",
                cursor: "pointer",
                color: "text.black",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
                "&:hover": {
                  transform: "translateY(-5px)",
                  color: "text.link",
                },
              }}
              onClick={() =>
                handleItemClick(item.subtitle ? item.subtitle : item.title)
              }
            >
              <img src={item.icon} alt="icon" style={{ width: "1.75rem" }} />
              <Box sx={{ pl: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {item.subtitle ? item.subtitle : item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.76rem" }}
                >
                  {item.description}
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
            <img src={settingIcon} alt="icon" style={{ width: "1.75rem" }} />
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
    </Box>
  );
}

export default MainMenuDropdown;
