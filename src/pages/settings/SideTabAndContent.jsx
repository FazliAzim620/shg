import React from "react";
import { Tabs, Tab, Box, Typography, Divider } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import BasicInformation from "./tab_content/BasicInformation";
import Security from "./tab_content/Security";
import TwoFA from "./tab_content/TwoFA";
import Notification from "./tab_content/Notification";
import { useSelector } from "react-redux";
import usePersistedTab from "../../components/customHooks/usePersistedTab";
import Signature from "../../provider_portal/provider_components/settings/Signature";
import { Draw } from "@mui/icons-material";

const SideTabAndContent = () => {
  const [value, setValue] = usePersistedTab(0); // Use the custom hook
  const darkMode = useSelector((state) => state.theme.mode);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: "Basic Information",
      icon: <PersonOutlineOutlinedIcon sx={{ fontSize: "14px" }} />,
      value: 0,
    },
    {
      label: "Security",
      icon: <VpnKeyOutlinedIcon sx={{ fontSize: "14px" }} />,
      value: 1,
    },
    {
      label: "Two-step verification",
      icon: <SecurityOutlinedIcon sx={{ fontSize: "14px" }} />,
      value: 2,
    },
    {
      label: "Notifications",
      icon: <NotificationsNoneOutlinedIcon sx={{ fontSize: "14px" }} />,
      value: 3,
    },
    {
      label: "Digital Signature",
      icon: <Draw sx={{ fontSize: "14px" }} />,
      value: 4,
    },
  ];

  const renderContent = () => {
    switch (value) {
      case 0:
        return <BasicInformation />;
      case 1:
        return <Security />;
      case 2:
        return <TwoFA />;
      case 3:
        return <Notification />;
      case 4:
        return <Signature />;
      default:
        return null;
    }
  };

  return (
    <>
      <Divider
        sx={{
          opacity: 0.3,
          mb: 2,
          "&::before, &::after": {
            bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
          },
        }}
      />
      <Box sx={{ display: { sm: "flex" } }}>
        <Box
          sx={{
            minWidth: "250px",
            height: "100vh",
          }}
        >
          {/* =========================== Tabs ========================== */}
          <Tabs
            sx={{ py: 6 }}
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Sidebar tabs"
            className="setting_tab"
          >
            {tabs.map((tab) => (
              <Tab
                className="setting_tab"
                key={tab.value}
                sx={{
                  borderRight: "none",
                  borderLeft:
                    value === tab.value
                      ? darkMode === "dark"
                        ? "0.1875rem solid #383c40"
                        : "0.1875rem solid #377dff"
                      : "none",
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "left",
                      textTransform: "capitalize",
                      width: "100%",
                      fontSize: "14px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        pl: 1,
                        fontWeight: value === tab.value ? 600 : "normal",
                        color:
                          value === tab.value
                            ? darkMode === "dark"
                              ? "white"
                              : "text.link"
                            : "text.black",
                      }}
                    >
                      {tab.icon}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        pl: 3,
                        fontWeight: value === tab.value ? 600 : "normal",
                        color:
                          value === tab.value
                            ? darkMode === "dark"
                              ? "white"
                              : "text.link"
                            : "text.black",
                      }}
                    >
                      {tab.label}
                    </Typography>
                  </Box>
                }
                value={tab.value}
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ p: 3, width: "100%" }}>{renderContent()}</Box>
      </Box>
    </>
  );
};

export default SideTabAndContent;
