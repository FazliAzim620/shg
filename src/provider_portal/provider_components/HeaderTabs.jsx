import React from "react";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { PROVIDER_ROUTES } from "../../routes/Routes";
import { useSelector } from "react-redux";

const tabData = [
  { label: "My jobs", link: "/", hasDropdown: true },
  { label: "Assignment Letters", link: PROVIDER_ROUTES.assignmentsLetter },
  { label: "Credentials", link: PROVIDER_ROUTES.credentials },
  { label: "Travel Itinerary", link: PROVIDER_ROUTES.travelItinerary },
  { label: "Scheduling", link: PROVIDER_ROUTES.scheduling },
  { label: "My Timesheets", link: PROVIDER_ROUTES.myTimeSheets },
  { label: "Paystubs", link: PROVIDER_ROUTES.payments },
  { label: "Settings", link: PROVIDER_ROUTES.settings },
];

const HeaderTabs = ({
  jobsMenuAnchorEl,
  handleJobsMenuOpen,
  handleJobsMenuClose,
  activeJobStatus,
  isMobile,
  handleDrawerClose,
}) => {
  const location = useLocation();
  const darkMode = useSelector((state) => state.theme.mode);

  return (
    <Box sx={{ display: isMobile ? "block" : { xs: "none", md: "flex" } }}>
      {tabData.map((tab, index) => (
        <Box key={index} sx={{ my: isMobile ? 1 : 0 }}>
          {tab.hasDropdown ? (
            <>
              <Button
                onClick={handleJobsMenuOpen}
                sx={{
                  color:
                    location.pathname === tab.link
                      ? "text.main"
                      : "text.primary",
                  textTransform: "capitalize",
                  bgcolor:
                    location.pathname === tab.link
                      ? darkMode === "light"
                        ? "#F2F3F6"
                        : "background.paper"
                      : "transparent",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "flex-start" : "center",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                {activeJobStatus === "opened" ? "Opened" : "My jobs"}
                <KeyboardArrowDownOutlined sx={{ fontSize: "14px", ml: 0.5 }} />
              </Button>
              <Menu
                anchorEl={jobsMenuAnchorEl}
                open={Boolean(jobsMenuAnchorEl)}
                onClose={() => handleJobsMenuClose()}
                sx={{ mt: isMobile ? 0 : 1 }}
              >
                <MenuItem
                  onClick={() => {
                    handleJobsMenuClose("my_jobs");
                    if (isMobile) handleDrawerClose();
                  }}
                  selected={activeJobStatus === "my_jobs"}
                >
                  My Jobs
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleJobsMenuClose("opened");
                    if (isMobile) handleDrawerClose();
                  }}
                  selected={activeJobStatus === "opened"}
                >
                  Opened Jobs
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to={tab.link}
              onClick={() => isMobile && handleDrawerClose()}
              sx={{
                color:
                  location.pathname === tab.link ? "text.main" : "text.primary",
                textTransform: "initial",
                mx: isMobile ? 0 : 1.5,
                fontWeight: 500,
                fontSize: isMobile ? "1rem" : "0.875rem",
                bgcolor:
                  location.pathname === tab.link
                    ? darkMode === "light"
                      ? "#F2F3F6"
                      : "background.paper"
                    : "transparent",
                width: isMobile ? "100%" : "auto",
                justifyContent: isMobile ? "flex-start" : "center",
              }}
            >
              {tab.label}
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default HeaderTabs;
