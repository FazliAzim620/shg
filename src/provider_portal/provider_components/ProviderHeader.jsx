import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  NightsStay,
  Notifications,
  WbSunny,
  MoreVert,
  Campaign,
  ToggleOffOutlined,
  Inventory2Outlined,
  DoneAllOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import logo from "../assets/logos/logo.svg";
import logo_white from "../assets/logos-light/logo.svg";
import { logoutHandler } from "../../util";
import { baseURLImage } from "../../API";
import { toggleMode } from "../../feature/themeSlice";
import HeaderTabs from "./HeaderTabs";
import { setJobStatus } from "../../feature/providerPortal/currentJobSlice";

const ProviderHeader = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const { loadingData, userData } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [modeMenuAnchorEl, setModeMenuAnchorEl] = useState(null);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] =
    useState(null);
  const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = useState(null);
  const [jobsMenuAnchorEl, setJobsMenuAnchorEl] = useState(null);
  const [activeJobStatus, setActiveJobStatus] = useState("my_jobs");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (setAnchorEl) => (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (setAnchorEl, path) => () => {
    setAnchorEl(null);
    if (path) navigate(path);
  };

  const toggleColorMode = (mode) => {
    dispatch(toggleMode(mode));
    setModeMenuAnchorEl(null);
  };

  const signOutHandler = () => {
    navigate("/login");
    logoutHandler();
  };

  const handleJobsMenuOpen = (event) => {
    setJobsMenuAnchorEl(event.currentTarget);
  };

  const handleJobsMenuClose = (status) => {
    setJobsMenuAnchorEl(null);
    if (status) {
      setActiveJobStatus(status);
      dispatch(setJobStatus(status));
      navigate("/");
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const userAvatar = userData?.detail?.photo ? (
    <Avatar
      src={`${baseURLImage}${userData?.detail?.photo}`}
      sx={{ height: 50, width: 50, background: "#677788" }}
    />
  ) : (
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {userData?.first_name?.[0] || "A"}
      {userData?.last_name?.[0] || "B"}
    </Typography>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "background.navbar_bg",
          boxShadow: "none",
          px: { xs: 1, sm: 2, xl: 0 },
          height: "55px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: { xs: "100%", xl: "78%" },
            m: "0 auto",
            minHeight: "55px !important",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1, md: 2 },
            }}
          >
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuIcon sx={{ fontSize: 24, color: "text.primary" }} />
            </IconButton>
            <img
              src={darkMode !== "light" ? logo_white : logo}
              alt="Logo"
              style={{
                width: "6rem",
                display: "flex",
                justifyContent: "center",
                marginLeft: "-0.8rem",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
            <HeaderTabs
              jobsMenuAnchorEl={jobsMenuAnchorEl}
              handleJobsMenuOpen={handleJobsMenuOpen}
              handleJobsMenuClose={handleJobsMenuClose}
              activeJobStatus={activeJobStatus}
              isMobile={false}
              handleDrawerClose={handleDrawerToggle}
            />
          </Box>
          <Box
            sx={{
              color: "gray",
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <IconButton
              color="inherit"
              sx={{
                position: "relative",
                "&:hover": { color: "primary.main" },
              }}
              onClick={handleMenuOpen(setNotificationMenuAnchorEl)}
            >
              <Notifications sx={{ fontSize: 18, color: "text.primary" }} />
              <Box
                sx={{
                  bgcolor: "red",
                  width: 10,
                  height: 10,
                  position: "absolute",
                  top: 0,
                  right: 0,
                  borderRadius: "50%",
                }}
              />
            </IconButton>
            <Menu
              id="notification-menu"
              anchorEl={notificationMenuAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(notificationMenuAnchorEl)}
              onClose={handleMenuClose(setNotificationMenuAnchorEl)}
              sx={{ mt: { xs: 5.5, md: 6.3 } }}
            >
              <Box
                sx={{
                  width: { xs: 280, md: 400 },
                  minHeight: { xs: 300, md: 400 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                    px: 2.8,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      fontWeight: 600,
                      fontSize: { xs: "16px", md: "18.37px" },
                    }}
                  >
                    Notifications
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen(setSettingsMenuAnchorEl)}
                  >
                    <MoreVert sx={{ fontWeight: 300, fontSize: 20 }} />
                  </IconButton>
                </Box>
                <Box sx={{ mt: 2, py: 1.5, px: 3, textAlign: "center" }}>
                  <Box sx={{ py: 2 }}>
                    <Campaign />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      color: "text.black",
                      fontWeight: 600,
                    }}
                  >
                    No Notifications
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", color: "text.primary", px: 4 }}
                  >
                    No new notifications yet. Stay tuned for updates and
                    important information here.
                  </Typography>
                </Box>
              </Box>
            </Menu>
            <Menu
              id="settings-menu"
              anchorEl={settingsMenuAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(settingsMenuAnchorEl)}
              onClose={handleMenuClose(setSettingsMenuAnchorEl)}
              sx={{ mt: { xs: 4, md: 4.5 } }}
            >
              <MenuItem onClick={handleMenuClose(setSettingsMenuAnchorEl)}>
                <Inventory2Outlined sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="caption">Archive all</Typography>
              </MenuItem>
              <MenuItem onClick={handleMenuClose(setSettingsMenuAnchorEl)}>
                <DoneAllOutlined sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="caption">Mark all as read</Typography>
              </MenuItem>
              <MenuItem onClick={handleMenuClose(setSettingsMenuAnchorEl)}>
                <ToggleOffOutlined sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="caption">Disable notifications</Typography>
              </MenuItem>
            </Menu>
            <IconButton
              onClick={handleMenuOpen(setModeMenuAnchorEl)}
              color="inherit"
            >
              {darkMode === "dark" ? (
                <NightsStay sx={{ fontSize: 18, color: "white" }} />
              ) : (
                <WbSunny sx={{ fontSize: 18 }} />
              )}
            </IconButton>
            <Menu
              id="mode-menu"
              anchorEl={modeMenuAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(modeMenuAnchorEl)}
              onClose={handleMenuClose(setModeMenuAnchorEl)}
              sx={{ mt: { xs: 5.5, md: 6.3 } }}
            >
              <MenuItem
                onClick={() => toggleColorMode("light")}
                sx={{
                  width: { xs: "140px", md: "160px" },
                  textAlign: "start",
                  bgcolor: darkMode !== "dark" && "rgba(155, 235, 235,0.2)",
                }}
              >
                <WbSunny sx={{ fontSize: 18, mr: 1.5 }} /> Light mode
              </MenuItem>
              <MenuItem
                onClick={() => toggleColorMode("dark")}
                sx={{
                  bgcolor: darkMode === "dark" && "rgba(255, 255, 255, .075)",
                }}
              >
                <NightsStay sx={{ fontSize: 18, mr: 1.5 }} /> Dark
              </MenuItem>
            </Menu>
            <IconButton
              onClick={handleMenuOpen(setAccountMenuAnchorEl)}
              color="inherit"
              sx={{ position: "relative" }}
            >
              <Avatar
                sx={{
                  bgcolor: "background.btn_blue",
                  width: 35,
                  height: 35,
                }}
              >
                {userAvatar}
              </Avatar>
              <Box
                sx={{
                  bgcolor: "#00c9a7",
                  width: 12,
                  height: 12,
                  position: "absolute",
                  bottom: 10,
                  right: 6,
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={accountMenuAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(accountMenuAnchorEl)}
              onClose={handleMenuClose(setAccountMenuAnchorEl)}
              sx={{ mt: { xs: 5.5, md: 6.3 } }}
            >
              <Box sx={{ py: 1, px: 1, width: { xs: 220, md: 256 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Avatar sx={{ width: 35, height: 35 }}>{userAvatar}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontSize={13}>
                      {loadingData ? "Loading..." : userData?.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {loadingData ? "Loading..." : userData?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <MenuItem
                    onClick={handleMenuClose(
                      setAccountMenuAnchorEl,
                      "/provider-settings"
                    )}
                  >
                    My account
                  </MenuItem>
                  <MenuItem onClick={signOutHandler}>Sign out</MenuItem>
                </Box>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "75%", sm: 300 },
            bgcolor: darkMode === "light" ? "#fff" : "background.paper",
            p: 2,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
        <HeaderTabs
          jobsMenuAnchorEl={jobsMenuAnchorEl}
          handleJobsMenuOpen={handleJobsMenuOpen}
          handleJobsMenuClose={handleJobsMenuClose}
          activeJobStatus={activeJobStatus}
          isMobile={true}
          handleDrawerClose={handleDrawerToggle}
        />
      </Drawer>
    </>
  );
};

export default ProviderHeader;
