import React, { useState } from "react";
import {
  FlightTakeoffOutlined,
  DeleteOutlineOutlined,
  NotificationsOutlined,
  PersonOutlined,
  VpnKeyOutlined as VpnKeyOutlinedIcon,
  GppGoodOutlined as GppGoodOutlinedIcon,
  Draw,
} from "@mui/icons-material";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import { Box, Card, CardContent, MenuItem } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Import tab components
import BasicInformationTab from "./BasicInformationTab";
import PasswordTab from "./PasswordTab";
import TwoStepVerificationTab from "./TwoStepVerificationTab";
import TravelPreferencesTab from "./TravelPreferencesTab";
import NotificationsTab from "./NotificationsTab";
import DeleteAccountTab from "./DeleteAccountTab";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import Signature from "./Signature";
import TravelPreferencesSummary from "../../../pages/service_provider/TravelPreferencesSummary";
import ServiceProviderSettingsTab_BasicInfo from "../../../pages/service_provider/ServiceProviderSettingsTab_BasicInfo";

const ProviderSettingsSideNavAndContent = ({ admin, provider_id }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const [activeStep, setActiveStep] = useState(initialStep);
  const navigate = useNavigate();

  const navigateHandler = (path) => {
    navigate(path);
  };

  const tabChangeHandler = ({ index, path }) => {
    navigateHandler(path);
    setActiveStep(index);
    setSearchParams({ step: index });
  };

  // Tabs based on whether user is admin or not
  const tabs = admin
    ? [
        {
          index: 1,
          path: "/basic-information",
          label: "Basic Information",
          icon: <PersonOutlined />,
        },
        {
          index: 4,
          path: "/travel-preferences",
          label: "Travel preferences",
          icon: <FlightTakeoffOutlined />,
        },
        {
          index: 7,
          path: "/delete-account",
          label: "Delete account",
          icon: <DeleteOutlineOutlined />,
        },
      ]
    : [
        {
          index: 1,
          path: "/basic-information",
          label: "Basic Information",
          icon: <PersonOutlined />,
        },
        {
          index: 2,
          path: "/password",
          label: "Password",
          icon: <VpnKeyOutlinedIcon />,
        },
        {
          index: 3,
          path: "/two-step-verification",
          label: "Two-step verification",
          icon: <GppGoodOutlinedIcon />,
        },
        {
          index: 4,
          path: "/travel-preferences",
          label: "Travel preferences",
          icon: <FlightTakeoffOutlined />,
        },
        {
          index: 5,
          path: "/notifications",
          label: "Notifications",
          icon: <NotificationsOutlined />,
        },
        {
          index: 6,
          path: "/digital-sign",
          label: "Digital Signature",
          icon: <Draw />,
        },
        {
          index: 7,
          path: "/delete-account",
          label: "Delete account",
          icon: <DeleteOutlineOutlined />,
        },
      ];

  // Function to render the active tab component
  const renderActiveTab = () => {
    switch (activeStep) {
      case 1:
        return admin ? (
          <ServiceProviderSettingsTab_BasicInfo
            admin={admin}
            provider_id={provider_id}
          />
        ) : (
          <BasicInformationTab />
        );
      case 2:
        return <PasswordTab />;
      case 3:
        return <TwoStepVerificationTab />;
      case 4:
        return admin ? (
          <TravelPreferencesSummary provider_id={provider_id} />
        ) : (
          <TravelPreferencesTab />
        );
      case 5:
        return <NotificationsTab />;
      case 6:
        return <Signature />;
      case 7:
        return <DeleteAccountTab admin={admin} />;
      default:
        return <BasicInformationTab />;
    }
  };

  return (
    <Box style={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          mx: 2,
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
          borderRadius: ".6875rem",
          minWidth: "240px",
          maxHeight: "340px",
          position: "sticky",
          top: 70,
        }}
      >
        <CardContent sx={{ px: 0 }}>
          {tabs.map(({ index, path, label, icon }) => (
            <MenuItem
              key={index}
              onClick={() => tabChangeHandler({ index, path })}
              sx={{
                borderLeft:
                  activeStep === index &&
                  `3px solid ${darkMode === "dark" ? "#007BFF" : "#6d4a96"}`,
              }}
            >
              {React.cloneElement(icon, {
                sx: {
                  fontSize: "1rem",
                  fontWeight: activeStep === index ? { md: 600, xl: 700 } : 400,
                  color:
                    activeStep === index
                      ? darkMode === "dark"
                        ? "white"
                        : "#6d4a96"
                      : "#132144",
                  mr: 1,
                  my: 1,
                },
              })}
              <CustomTypographyBold
                ml={1.6}
                weight={activeStep === index ? { md: 600, xl: 700 } : 400}
                fontSize={"0.875rem"}
                color={
                  activeStep === index &&
                  (darkMode === "dark" ? "white" : "#6d4a96")
                }
                lineHeight={1.5}
              >
                {label}
              </CustomTypographyBold>
            </MenuItem>
          ))}
        </CardContent>
      </Card>

      <Box sx={{ flex: 1, mx: "12px", mb: 1 }}>{renderActiveTab()}</Box>
    </Box>
  );
};

export default ProviderSettingsSideNavAndContent;
