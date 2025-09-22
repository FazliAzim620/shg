import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";

import {
  DocumtnIcon,
  FormIcon,
  NotificationsIcon,
  OnboardingIcon,
  ReferencFormIcon,
} from "./Icons";
import Documents from "./documents/Documents";
import OrganizationDocuments from "./organization-documents/Index";
import ReferenceForms from "./reference-forms/Index";
import { useLocation } from "react-router-dom";
import FormsSection from "./forms/Index";
import NotificationsConfiguration from "./notifications-configuration/Index";
import OnBoardingSection from "./onboarding/Index";

const CredentialingSetting = () => {
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState(
    state?.active ? state?.active : "Documents"
  );

  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Sidebar tabs
  const tabs = [
    {
      id: "Documents",
      label: "Documents",
      icon: DocumtnIcon,
    },
    {
      id: "OrganizationDocuments",
      label: "Organization's documents",
      icon: DocumtnIcon,
    },
    {
      id: "ReferenceForms",
      label: "Reference forms",
      icon: ReferencFormIcon,
    },
    {
      id: "Forms",
      label: "Forms",
      icon: FormIcon,
    },
    {
      id: "Onboarding",
      label: "Onboarding",
      icon: OnboardingIcon,
    },
    {
      id: "NotificationsConfig",
      label: "Notifications configuration",
      icon: NotificationsIcon,
    },
  ];

  // Content components for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Documents":
        return <Documents />;
      case "OrganizationDocuments":
        return <OrganizationDocuments />;
      case "ReferenceForms":
        return <ReferenceForms />;
      case "Forms":
        return <FormsSection />;
      case "Onboarding":
        return <OnBoardingSection />;
      case "NotificationsConfig":
        return <NotificationsConfiguration />;
      default:
        return <Typography variant="h6">Select a tab</Typography>;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        my: "2rem",
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={1}
        sx={{
          width: {
            md: isScrolled ? "25%" : "27%",
            xl: isScrolled ? "17%" : "22%",
          },
          p: "24px",
          borderRadius: "12px",
          overflow: "auto",
          borderRight: "1px solid rgba(231, 234, 243, 0.7)",
          boxShadow: "none",
          maxHeight: "400px",
          position: isScrolled ? "fixed" : "sticky",
          pl: 2,
          top: "0rem",
          zIndex: 1,
        }}
      >
        <List component="nav" sx={{}}>
          {tabs.map((tab) => (
            <ListItem
              button
              key={tab.id}
              selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                borderRadius: "8px",
                mb: 0.5,
                bgcolor:
                  activeTab === tab.id
                    ? "#rgba(55, 125, 255, 0.1)"
                    : "transparent",
                "&:hover": {
                  bgcolor:
                    activeTab === tab.id
                      ? "#rgba(55, 125, 255, 0.1)"
                      : "#f5f5f5",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px", mr: "1rem" }}>
                <tab.icon
                  color={
                    activeTab === tab.id ? "#2196f3" : "rgba(108, 117, 125, 1)"
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      lineHeight: "21px",
                      color: activeTab === tab.id ? "#2196f3" : "inherit",
                    }}
                  >
                    {tab.label}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          width: "75%",
          ml: isScrolled ? { md: "28%", xl: "23%" } : "0",
        }}
      >
        <Paper
          sx={{
            // p: "24px",
            borderRadius: "12px",
            border: "1px solid rgba(231, 234, 243, 0.7)",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
            // height: "100%",
          }}
        >
          {renderTabContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default CredentialingSetting;
