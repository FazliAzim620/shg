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
  BackgroundIcon,
  DocumtnIcon,
  FormIcon,
  HistoryIcon,
  NotificationsIcon,
  OnboardingIcon,
  ProfessionalIcon,
  ReferencFormIcon,
} from "../../../pages/credentialing/Icons";
import Documents from "./documents/Documents";
import OrganizationDocuments from "./organization-documents/Index";
import ReferenceForms from "./reference-forms/Index";
import { useLocation, useNavigate } from "react-router-dom";
import Overview from "./overview/Overview";
import Breadcrumb from "../../../components/BreadCrumb";
import Preview from "../../provider_components/onboarding-components/Preview";
import { useSelector } from "react-redux";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
import WelcomeScreen from "./WelcomeScreen";
import EventHistoryIndex from "./event-history/Index";
import ProfessionalRegistration from "./professional-register/Index";
import Forms from "./forms/index";
import BackgroundCheck from "./background-check/Index";
const Credentialing = ({ userId }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [isOnboardingStart, setIsOnBoardingStart] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [backTrigger, setBackTrigger] = useState(false);
  const [activeTab, setActiveTab] = useState(
    state?.active ? state?.active : userId ? "Overview" : "Onboarding"
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
    if (userId) {
      setActiveTab("Overview");
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [userId]);

  // Sidebar tabs
  const tabs = [
    {
      id: "Overview",
      label: "Overview",
      icon: ReferencFormIcon,
    },
    {
      id: "Onboarding",
      label: "Onboarding",
      icon: OnboardingIcon,
      userId: userId,
    },
    {
      id: "Documents",
      label: "Documents",
      icon: DocumtnIcon,
    },
    {
      id: "Organization's Documents",
      label: "Organization's documents",
      icon: DocumtnIcon,
    },
    {
      id: "Reference Forms",
      label: "References",
      icon: ReferencFormIcon,
    },
    {
      id: "Forms",
      label: "Forms",
      icon: ReferencFormIcon,
      // userId: userId,
    },
    {
      id: "Professional Registration",
      label: "Professional registration",
      icon: ProfessionalIcon,
    },
    {
      id: "Background Checks",
      label: "Background checks",
      icon: BackgroundIcon,
    },
    {
      id: "Event History",
      label: "Event history",
      icon: HistoryIcon,
    },
  ];
  const onBoardingAction = (action) => {
    if (action === "skip") {
      setIsOnBoardingStart(false);
    }
    if (action === "onboarding") {
      setIsOnBoardingStart(false);
      setActiveTab("Onboarding");
    }
  };
  // Content components for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview setActiveTab={setActiveTab} userId={userId} />;
      case "Documents":
        return <Documents userId={userId} />;
      case "Organization's Documents":
        return <OrganizationDocuments userId={userId} />;
      case "Reference Forms":
        return <ReferenceForms userId={userId} />;
      case "Forms":
        return <Forms userId={userId} />;
      case "Professional Registration":
        return (
          <ProfessionalRegistration
            backTrigger={backTrigger}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            userId={userId}
          />
        );
      case "Background Checks":
        return (
          <BackgroundCheck
            backTrigger={backTrigger}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            userId={userId}
          />
        );
      case "Event History":
        return <EventHistoryIndex userId={userId} />;

      case "Onboarding":
        return <Preview userId={userId} />;

      default:
        return <Typography variant="h6">Select a tab</Typography>;
    }
  };
  if (!isOnboardingStart) {
    return <WelcomeScreen actionHandler={onBoardingAction} />;
  } else {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumb items={[]} title={activeTab} jobDetail={true}>
          {userId ? (
            <Button
              onClick={() => {
                navigate(-1);
              }}
              variant="contained"
              sx={{
                bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6 ",
                boxShadow: "none",
                color: "text.main",
                textTransform: "inherit",
                mr: 3,
                fontWeight: 300,
                "&:hover": {
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
            >
              <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
              back
            </Button>
          ) : (
            ""
          )}
        </Breadcrumb>

        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            my: "2rem",
            gap: 3,
          }}
        >
          {/* Sidebar */}
          {activeTab == "Onboarding" ? (
            ""
          ) : (
            <Paper
              elevation={1}
              sx={{
                width: {
                  md: isScrolled ? "26%" : "27%",
                  xl: isScrolled ? "22%" : "22%",
                },
                p: "24px",
                borderRadius: "12px",
                overflow: "auto",
                borderRight: "1px solid rgba(231, 234, 243, 0.7)",
                boxShadow: "none",
                maxHeight: "460px",
                position: isScrolled ? { md: "fixed" } : "sticky",
                pl: 2,
                top: "1rem",
                zIndex: 1,
              }}
            >
              <List component="nav" sx={{}}>
                {tabs
                  .filter((tab) => !tab.userId)
                  .map((tab) => (
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
                            ? "rgba(55, 125, 255, 0.1)"
                            : "transparent",
                        "&:hover": {
                          bgcolor:
                            activeTab === tab.id
                              ? "rgba(55, 125, 255, 0.1)"
                              : "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "10px", mr: "1rem" }}>
                        <tab.icon
                          color={
                            activeTab === tab.id
                              ? "#2196f3"
                              : "rgba(108, 117, 125, 1)"
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
                              color:
                                activeTab === tab.id ? "#2196f3" : "inherit",
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
          )}
          {/* Main content */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              width: "75%",
              ml:
                activeTab === "Onboarding"
                  ? 0
                  : isScrolled
                  ? { md: "28%", xl: "23%" }
                  : "0",
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
      </Box>
    );
  }
};

export default Credentialing;
