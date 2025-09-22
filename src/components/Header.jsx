import {
  AppBar,
  Avatar,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AppsOutlined,
  KeyboardArrowDownOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import logo from "../assets/logos/logo.svg";
import logo_white from "../assets/logos/logo-white.svg";
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  NightsStay,
  Notifications,
  WbSunny,
  MoreVert,
  Campaign,
  ToggleOffOutlined,
  DoneAll,
  Inventory,
  Inventory2Outlined,
  DoneAllOutlined,
} from "@mui/icons-material";
import { toggleMode } from "../feature/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import MainMenuDropdown from "./MainMenuDropdown";
import { logoutHandler, selectOptions } from "../util";
import API, { baseURLImage } from "../API";
import { CommonSelect } from "./job-component/CommonSelect";
import { addUserRolesPermissions, updateUserRole } from "../feature/loginSlice";
import Loading from "./common/Loading";

const Header = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const showmenu = location.pathname !== "/";

  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [modeMenuAnchorEl, setModeMenuAnchorEl] = useState(null);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] =
    useState(null);
  const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = useState(null);
  const { loadingData, userData } = useSelector((state) => state?.userInfo);
  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = (path) => {
    setAccountMenuAnchorEl(null);
    navigate(path);
  };

  const handleModeMenuOpen = (event) => {
    setModeMenuAnchorEl(event.currentTarget);
  };

  const handleModeMenuClose = () => {
    setModeMenuAnchorEl(null);
  };

  const toggleColorMode = (mode) => {
    dispatch(toggleMode(mode));
    setModeMenuAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
    setSettingsMenuAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchorEl(null);
  };
  const signOutHandler = () => {
    navigate("/login");
    logoutHandler();
  };
  useEffect(() => {
    setSelectedRole(
      userData?.roles?.find((role) => role.name === user?.user?.role)?.id
    );
  }, []);
  const roleHandler = async (value) => {
    setAccountMenuAnchorEl(null);
    try {
      setIsLoading(true);
      const resp = await API.get(
        `/api/get-user-permissions-for-specific-role?user_id=${user?.user?.user?.id}&role_id=${value}`
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        if (resp?.data?.data?.user_roles_modules?.length === 1) {
          navigate(`/`);
          localStorage.setItem("redirect", "redirect");
        } else {
          navigate(`/`);
          localStorage.removeItem("redirect");
        }

        dispatch(
          updateUserRole(
            userData?.roles?.find((role) => role.id === value)?.name
          )
        );
        dispatch(addUserRolesPermissions(resp?.data?.data));
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <AppBar
      position="sticky"
      // position="fixed"
      sx={{
        bgcolor: "background.navbar_bg",
        boxShadow: "none",

        // opacity: darkMode !== "light" && "0.5",
      }}
    >
      <Loading open={isLoading} />
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Box
            onClick={(e) => {
              navigate("/");
            }}
          >
            <img
              src={darkMode !== "light" ? logo_white : logo}
              alt="Image Description"
              style={{
                width: "6rem",
                display: "flex",
                justifyContent: "center",
                marginLeft: "-0.8rem",
              }}
            />
          </Box>
          <Box sx={{ pl: 1 }}>
            {showmenu && (
              <IconButton
                color="inherit"
                aria-label="menu"
                sx={{ bgcolor: "inherit", "&:hover": { bgcolor: "inherit" } }}
                onClick={() => navigate("/")}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <AppsOutlined sx={{ color: "text.link", fontSize: "1.2rem" }} />
                <Typography
                  variant="caption"
                  sx={{
                    ml: 1,
                    color: "text.link",
                    fontSize: "14px",
                    p: "1rem .75rem 1rem 0.2rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Main Menu
                  <KeyboardArrowDownOutlined
                    sx={{ color: "gray", fontWeight: 300, fontSize: "16px" }}
                  />
                </Typography>
              </IconButton>
            )}
            {showmenu && showDropdown && (
              <MainMenuDropdown setShowDropdown={setShowDropdown} />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            color: "gray",
            marginRight: "-1.7rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            color="inherit"
            sx={{
              position: "relative",
              "&:hover": {
                color: "primary.main",
              },
            }}
            onClick={handleNotificationMenuOpen}
          >
            <Notifications sx={{ fontSize: 18, color: "text.primary" }} />
            <Box
              sx={{
                bgcolor: "red",
                width: "10px",
                height: "10px",
                position: "absolute",
                top: 0,
                right: 0,
                borderRadius: "50%",
              }}
            ></Box>
          </IconButton>
          <Menu
            id="notification-menu"
            anchorEl={notificationMenuAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(notificationMenuAnchorEl)}
            onClose={handleNotificationMenuClose}
            sx={{ mt: 6.3 }}
          >
            <Box
              sx={{
                width: { md: 400 },
                minHeight: { md: 350 },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  px: 2.8,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "background.paper", // Optional: to ensure the header stays visible on scroll
                  zIndex: 10, // Make sure the header is above content
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    fontWeight: 600,
                    fontSize: "18.37px",
                  }}
                >
                  Notifications
                </Typography>
                <IconButton size="small" onClick={handleSettingsMenuOpen}>
                  <MoreVert sx={{ fontWeight: 300, fontSize: 20 }} />
                </IconButton>
              </Box>

              <Box
                sx={{
                  borderBottom: "1px solid rgba(231, 234, 243, .7)",
                  width: "100%",
                }}
              ></Box>

              {/* Content Box that will scroll */}
              <Box
                sx={{
                  flexGrow: 1, // Ensures content takes up remaining space
                  maxHeight: 300, // Set max height for scroll
                  overflow: "auto", // Makes content scrollable
                  mt: 2,
                  py: 1.5,
                  px: 3,
                  textAlign: "center",
                }}
                className="thin_slider"
              >
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
                  No new notifications yet. Stay tuned for updates and important
                  information here.
                </Typography>
              </Box>
            </Box>

            <Menu
              id="settings-menu"
              anchorEl={settingsMenuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(settingsMenuAnchorEl)}
              onClose={handleSettingsMenuClose}
              sx={{ mt: 4.5 }}
            >
              <MenuItem onClick={handleSettingsMenuClose}>
                <Inventory2Outlined sx={{ fontSize: "16px", mr: 1 }} />
                <Typography variant="caption"> Archive all</Typography>
              </MenuItem>
              <MenuItem onClick={handleSettingsMenuClose}>
                <DoneAllOutlined sx={{ fontSize: "16px", mr: 1 }} />
                <Typography variant="caption">Mark all as read</Typography>
              </MenuItem>
              <MenuItem onClick={handleSettingsMenuClose}>
                <ToggleOffOutlined sx={{ fontSize: "16px", mr: 1 }} />
                <Typography variant="caption">Disable notifications</Typography>
              </MenuItem>
            </Menu>
          </Menu>

          <IconButton onClick={handleModeMenuOpen} color="inherit">
            {darkMode === "dark" ? (
              <NightsStay sx={{ fontSize: 18, color: "white" }} />
            ) : (
              <WbSunny sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          <Menu
            id="mode-menu"
            anchorEl={modeMenuAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(modeMenuAnchorEl)}
            onClose={handleModeMenuClose}
            sx={{ mt: 6.3 }}
          >
            <MenuItem
              onClick={() => {
                toggleColorMode("light");
              }}
              sx={{
                width: {
                  md: "160px",
                },
                textAlign: "start",
                bgcolor: darkMode !== "dark" && "rgba(155, 235, 235,0.2)",
              }}
            >
              <WbSunny
                sx={{
                  fontSize: 18,
                  mr: 1.5,
                }}
              />{" "}
              Light mode
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleColorMode("dark");
              }}
              sx={{
                bgcolor: darkMode === "dark" && "rgba(255, 255, 255, .075)",
              }}
            >
              <NightsStay sx={{ fontSize: 18, mr: 1.5 }} /> Dark
            </MenuItem>
          </Menu>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="account-menu"
            aria-haspopup="true"
            onClick={handleAccountMenuOpen}
            color="inherit"
            sx={{ position: "relative" }}
          >
            {/* <AccountCircle sx={{ fontSize: "2.6rem" }} /> */}
            <Avatar
              sx={{
                width: "38.5px",
                height: "38.5px",
                bgcolor: "background.btn_blue",
              }}
            >
              {userData?.detail?.photo ? (
                <Avatar
                  sx={{
                    height: 50,
                    width: 50,
                    background: "#677788",
                  }}
                  src={`${baseURLImage}${userData?.detail?.photo}`}
                ></Avatar>
              ) : userData?.first_name ? (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, textTransform: "uppercase" }}
                >
                  {userData?.first_name?.slice(0, 1)}
                  {userData?.last_name?.slice(0, 1)}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  A B
                </Typography>
              )}
            </Avatar>
            <Box
              sx={{
                bgcolor: "#00c9a7",
                width: "14px",
                height: "14px",
                position: "absolute",
                bottom: 10,
                right: 9,
                borderRadius: "50%",
                border: "2px solid white",
              }}
            ></Box>
          </IconButton>
          <Box>
            <Menu
              id="account-menu"
              anchorEl={accountMenuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(accountMenuAnchorEl)}
              onClose={handleAccountMenuClose}
              sx={{ mt: 6.3 }}
            >
              <Box
                sx={{
                  py: 1,
                  px: 1,
                  width: 256,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    px: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      height: 45,
                      width: 45,
                      bgcolor: "background.btn_blue",
                    }}
                  >
                    {userData?.detail?.photo ? (
                      <Avatar
                        sx={{
                          height: 78.75,
                          width: 78.75,
                          background: "#677788",
                        }}
                        src={`${baseURLImage}${userData?.detail?.photo}`}
                      ></Avatar>
                    ) : userData?.first_name ? (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, textTransform: "uppercase" }}
                      >
                        {userData?.first_name?.slice(0, 1)}
                        {userData?.last_name?.slice(0, 1)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        A B
                      </Typography>
                    )}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.black",
                        fontSize: "14px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {userData?.first_name} &nbsp;
                      {userData?.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userData?.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider
                  sx={{
                    borderColor:
                      darkMode == "dark"
                        ? "rgba(255, 255, 255, .7"
                        : "rgba(231, 234, 243, .7)",
                  }}
                />

                <MenuItem
                  onClick={() => handleAccountMenuClose("/settings")}
                  sx={{
                    my: 1,
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "text.black",
                  }}
                >
                  Settings
                </MenuItem>
                <Divider
                  sx={{
                    borderColor:
                      darkMode == "dark"
                        ? "rgba(255, 255, 255, .7"
                        : "rgba(231, 234, 243, .7)",
                  }}
                />
                {userData?.roles?.length > 1 ? (
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value);
                        roleHandler(e.target.value);
                      }}
                      sx={{
                        bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",

                        boxShadow: "none",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "& .MuiSelect-icon": {
                          color: darkMode === "light" ? "#000" : "#fff",
                        },
                      }}
                    >
                      {selectOptions(userData?.roles)?.map((item, index) => {
                        return (
                          <MenuItem value={item?.value} key={index}>
                            {item?.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : (
                  ""
                )}
                {/* <MenuItem
                  sx={{
                    my: 1,
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "text.black",
                    bgcolor: "transparent",
                    p: 0,
                  }}
                >
                  {userData?.roles?.length > 1 ? (
                    <Box sx={{}}>
                      <CommonSelect
                        fontSize="13px"
                        value={selectedRole}
                        handleChange={(e) => {
                          setSelectedRole(e.target.value);
                          roleHandler(e.target.value);
                        }}
                        name={"role"}
                        placeholder={"Switch role"}
                        options={selectOptions(userData?.roles)}
                        height={"2rem"}
                        hideBtn={true}
                        minWidth={240}
                      />
                      <Divider
                        sx={{
                          borderColor:
                            darkMode == "dark"
                              ? "rgba(255, 255, 255, .7"
                              : "rgba(231, 234, 243, .7)",
                        }}
                      />
                    </Box>
                  ) : (
                    ""
                  )}
                </MenuItem> */}

                <MenuItem
                  onClick={signOutHandler}
                  sx={{
                    my: 1,
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "text.black",
                  }}
                >
                  Sign out
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
