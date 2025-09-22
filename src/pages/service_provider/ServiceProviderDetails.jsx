import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography,
  Avatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { baseURLImage } from "../../API";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import {
  Delete,
  Share,
  WorkOutlineOutlined,
  Comment,
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CalendarMonth,
  KeyboardBackspaceOutlined,
  Person,
  ReceiptOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AirplanemodeActiveOutlinedIcon from "@mui/icons-material/AirplanemodeActiveOutlined";
import { useNavigate, useParams } from "react-router-dom";
import usePersistedTab from "../../components/customHooks/usePersistedTab";
import ServiceProviderProfile from "../../components/provider/ServiceProviderProfile";
import ServiceProviderAppointmentLetters from "./ServiceProviderAppointmentLetters";
import ServiceProviderCredentials from "./ServiceProviderCredentials";
import ServiceProviderTravelItinerary from "./ServiceProviderTravelItinerary";
import ServiceProviderScheduler from "./ServiceProviderScheduler";
import ServiceProviderTimesheets from "./ServiceProviderTimesheets";
import ServiceProviderPaystubs from "./ServiceProviderPaystubs";
import ROUTES from "../../routes/Routes";
import ServiceProviderAvailiblityTab from "./ServiceProviderAvailiblityTab";
import TravelPreferencesSummary from "./TravelPreferencesSummary";
import ActionMenu from "../../components/client-module/ActionMenu";
import { flxCntrSx } from "../../components/constants/data";
import ServiceProvider_PersonalDetailsTab from "../../components/provider/ServiceProvider_PersonalDetailsTab";

const ServiceProviderDetails = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const [value, setValue] = usePersistedTab(0);
  const params = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const providerDetails = useSelector(
    (state) => state.providerDetails?.provider
  );
  const { id } = useParams();
  const provId = parseInt(id);

  useEffect(() => {
    setValue(Number(params.tab));
  }, []);

  const tabs = [
    {
      id: 0,
      label: "Personal details",
      icon: <PermIdentityOutlinedIcon sx={{ fontSize: "14px", mt: 0.6 }} />,
      component: (
        <ServiceProvider_PersonalDetailsTab
          provider_id={provId}
          setValue={setValue}
        />
      ),
    },
    {
      id: 1,
      label: "Credentials",
      icon: <VerifiedOutlined sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers credentials",
      component: <ServiceProviderCredentials provider_id={provId} />,
    },
    {
      id: 2,
      label: "Schedule",
      icon: <CalendarMonth sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers schedular",
      component: <ServiceProviderScheduler provider_id={provId} />,
    },
    {
      id: 3,
      label: "Availiblity",
      icon: <EventAvailableIcon sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers availbility",
      component: <ServiceProviderAvailiblityTab provider_id={provId} />,
    },
    {
      id: 4,
      label: "Appointment Letters",
      icon: <AssignmentOutlinedIcon sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers appointment letters",
      component: <ServiceProviderAppointmentLetters provider_id={provId} />,
    },
    {
      id: 5,
      label: "Travel Itinerary",
      icon: (
        <AirplanemodeActiveOutlinedIcon sx={{ fontSize: "14px", mt: 0.6 }} />
      ),
      requiredPermission: "read service providers travel itinerary",
      component: <ServiceProviderTravelItinerary provider_id={provId} />,
    },
    {
      id: 6,
      label: "Timesheets",
      icon: <AccessTimeOutlined sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers timesheets",
      component: <ServiceProviderTimesheets provider_id={provId} />,
    },
    {
      id: 7,
      label: "Paystubs",
      icon: <AttachMoneyOutlined sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers paystubs",
      component: <ServiceProviderPaystubs provider_id={provId} />,
    },
    {
      id: 8,
      label: "Travel Preferences",
      icon: <ReceiptOutlined sx={{ fontSize: "14px", mt: 0.6 }} />,
      requiredPermission: "read service providers travel preferences",
      component: <TravelPreferencesSummary provider_id={provId} />,
    },
  ];

  // Filter tabs based on user permissions
  const filteredTabs = tabs.filter((tab) => {
    if (tab.requiredPermission) {
      return permissions?.includes(tab.requiredPermission);
    }
    return true;
  });

  const handleChange = (event, newIndex) => {
    const selectedTab = filteredTabs[newIndex]; // Get the tab based on index
    setValue(selectedTab.id); // Set the value using the tab's ID
    navigate(`${ROUTES.serviceProviderDetails}${provId}/${selectedTab.id}`); // Navigate with tab id
  };

  const menuItems = [
    {
      label: "Action 1",
      icon: <Share fontSize="small" />,
      action: () => console.log("Action 1 clicked"),
    },
    {
      label: "Action 2",
      icon: <Comment fontSize="small" />,
      action: () => console.log("Action 2 clicked"),
    },
    {
      label: "Delete",
      icon: <Delete fontSize="small" />,
      action: () => console.log("Delete clicked"),
    },
  ];

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  }
  const currentTabIndex = filteredTabs.findIndex((tab) => tab.id === value);
  console.log("providerDetaisl", providerDetails);
  return (
    <Box sx={{ pb: 4, overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Header />

      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Box pt={6} px={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              {providerDetails?.user?.detail?.photo ? (
                <Box
                  component={"img"}
                  src={`${baseURLImage}/${providerDetails?.user?.detail?.photo}`}
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    objectFit: "contain",
                    borderRadius: "5px",
                    bgcolor: "gray",
                    mr: 1.5,
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    background: "background.paper",
                  }}
                >
                  <Person />
                </Avatar>
              )}

              <Box>
                <CustomTypographyBold fontSize={"1.5rem"} color={"text.black"}>
                  {providerDetails?.user?.name || providerDetails?.name}
                </CustomTypographyBold>
                <Box
                  sx={{ pt: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ListItemButton sx={{ p: 0 }}>
                    <ListItemIcon sx={{ minWidth: "1.1rem" }}>
                      <WorkOutlineOutlined sx={{ fontSize: "0.8rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <CustomTypographyBold
                          fontSize={"0.75rem"}
                          color={"text.or_color"}
                          weight={400}
                        >
                          {providerDetails?.role?.name}
                        </CustomTypographyBold>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ p: 0 }}>
                    <ListItemIcon sx={{ minWidth: "1.1rem", ml: 1.5 }}>
                      <EmailOutlinedIcon sx={{ fontSize: "0.8rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <CustomTypographyBold
                          fontSize={"0.75rem"}
                          color={"text.or_color"}
                          weight={400}
                          textTransform={"none"}
                        >
                          {providerDetails?.email}
                        </CustomTypographyBold>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ p: 0 }}>
                    <ListItemIcon sx={{ minWidth: "1.1rem", ml: 1.5 }}>
                      <LocalPhoneOutlinedIcon sx={{ fontSize: "0.8rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <CustomTypographyBold
                          fontSize={"0.75rem"}
                          color={"text.or_color"}
                          weight={400}
                        >
                          {providerDetails?.phone || "--"}
                        </CustomTypographyBold>
                      }
                    />
                  </ListItemButton>
                </Box>
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate(`${ROUTES.serviceProviderDetails}${provId}`)
                }
                sx={{
                  bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
                  boxShadow: "none",
                  color: "text.btn_blue",
                  textTransform: "inherit",
                  mr: 3,
                  py: 1,
                  fontWeight: 400,
                  "&:hover": {
                    color: "#fff",
                    boxShadow: "none",
                    bgcolor: "background.btn_blue",
                  },
                }}
              >
                <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                Back
              </Button>
              <ActionMenu
                menuItems={menuItems}
                background={darkMode === "light" ? "#fff" : "background.paper"}
                padding={1.2}
              />
            </Box>
          </Box>
          <Tabs value={currentTabIndex} onChange={handleChange} sx={{ mt: 4 }}>
            {filteredTabs?.map((tab, index) => (
              <Tab
                key={tab.id}
                label={
                  <Box sx={{ ...flxCntrSx, gap: 0.6 }}>
                    <Typography>{tab.icon}</Typography>
                    <Typography
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "13px",
                        fontWeight: value === tab.id ? 600 : 400,
                        color: value === tab.id ? "text.main" : "inherit",
                      }}
                    >
                      {tab.label}
                    </Typography>
                  </Box>
                }
                {...a11yProps(tab.id)}
              />
            ))}
          </Tabs>
          <Divider sx={{ opacity: 0.3 }} />
        </Box>
        <Box sx={{ pt: 4 }}>
          {tabs.find((tab) => tab.id === value)?.component}
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceProviderDetails;
