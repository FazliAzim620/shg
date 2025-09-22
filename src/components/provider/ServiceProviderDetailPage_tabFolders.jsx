import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AccessTimeOutlined,
  AssignmentSharp,
  AttachMoneyOutlined,
  Business,
  CalendarMonth,
  Comment,
  DateRangeOutlined,
  Delete,
  Flight,
  Group,
  KeyboardBackspaceOutlined,
  LocationOnOutlined,
  Person,
  ReceiptOutlined,
  Share,
  VerifiedOutlined,
  WorkOutline,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import AirplanemodeActiveOutlinedIcon from "@mui/icons-material/AirplanemodeActiveOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ActionMenu from "../../components/client-module/ActionMenu";
import ClientRoleCard from "../../components/client-module/ClientRoleCard";
import { Link as RouterLink } from "react-router-dom";
import businessIcon from "../../assets/business.svg";
import { baseURLImage } from "../../API";
import CustomTypographyBold from "../CustomTypographyBold";
import ROUTES from "../../routes/Routes";
const ServiceProviderDetailPage_tabFolders = () => {
  const param = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const providerDetails = useSelector(
    (state) => state.providerDetails?.provider
  );
  const { id } = useParams();
  const provId = parseInt(id);
  const url = providerDetails?.name?.toLowerCase()?.replace(/ /g, "-");
  const roleData = [
    {
      id: 1,
      label: "Personal details",
      icon: <PermIdentityOutlinedIcon />,
      url: `${ROUTES.serviceProviderDetails}${param?.id}/0`,
    },
    {
      id: 2,
      label: "Credentials",
      icon: <VerifiedOutlined />,
      url: `${ROUTES.serviceProviderDetails}${param?.id}/1`,
      requiredPermission: "read service providers credentials",
    },
    {
      id: 3,
      label: "Schedule",
      icon: <CalendarMonth />,
      url: `${ROUTES.serviceProviderDetails}${param?.id}/2`,
      requiredPermission: "read service providers schedular",
    },
    {
      id: 4,
      label: "Availiblity",
      icon: <EventAvailableIcon />,
      requiredPermission: "read service providers availbility",
      url: `${ROUTES.serviceProviderDetails}${param?.id}/3`,
    },

    {
      id: 5,
      label: "Appointment Letters ",
      //   icon: <AssignmentSharp />,
      icon: <AssignmentOutlinedIcon />,
      requiredPermission: "read service providers appointment letters",
      url: `${ROUTES.serviceProviderDetails}${param?.id}/4`,
    },
    {
      id: 6,
      label: "Travel Itinerary",
      icon: <AirplanemodeActiveOutlinedIcon />,
      //   icon: <AirplaneTicketOutlinedIcon />,
      requiredPermission: "read service providers travel itinerary",
      url: `${ROUTES.serviceProviderDetails}${param?.id}/5`,
    },
    {
      id: 7,
      label: "Timesheets",
      icon: <AccessTimeOutlined />,
      requiredPermission: "read service providers timesheets",
      url: `${ROUTES.serviceProviderDetails}${param?.id}/6`,
    },
    {
      id: 8,
      label: "Paystubs",
      icon: <AttachMoneyOutlined />,
      requiredPermission: "read service providers paystubs",
      url: `${ROUTES.serviceProviderDetails}${param?.id}/7`,
    },
    {
      id: 9,
      label: "Travel Preferences  ",
      icon: <ReceiptOutlined />,
      requiredPermission: "read service providers travel preferences",
      url: `${ROUTES.serviceProviderDetails}${param?.id}/8`,
    },
  ];
  const filteredTabs = roleData.filter((tab) => {
    if (tab.requiredPermission) {
      return permissions?.includes(tab.requiredPermission); // Only include if the user has the required permission
    }
    return true; // Include tabs that do not have a permission requirement
  });
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
  const breadcrumbItems = [
    { text: "Home", href: "/" },

    { text: "Clients", href: "/clients" },
    { text: providerDetails?.name },
  ];
  const detailsViewHandler = (url) => {
    // const url = providerDetails?.name?.toLowerCase()?.replace(/ /g, "-");
    // const clientDetailUrl = url;
    navigate(url);
  };
  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      {/* <ClientRegistrationModal open={isOpen} handleClose={handleClose} /> */}
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
                onClick={() => navigate(ROUTES?.serviceProviders)}
                sx={{
                  bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
                  boxShadow: "none",
                  color: "text.btn_blue",
                  textTransform: "inherit",
                  // mr: 3,
                  py: 1,
                  fontWeight: 400,
                  "&:hover": {
                    color: "#fff",
                    boxShadow: "none",
                    bgcolor: "background.btn_blue",
                  },
                }}
              >
                <KeyboardBackspaceOutlined
                  sx={{
                    mr: 1,
                    fontSize: "1rem",
                  }}
                />
                Back to Provider
              </Button>
              {/* <ActionMenu
                menuItems={menuItems}
                background={darkMode === "light" ? "#fff" : "background.paper"}
                padding={1.2}
              /> */}
            </Box>
          </Box>
          <Divider sx={{ pt: 2, opacity: 0.3 }} />
        </Box>
        <Grid container spacing={4} pt={6} px={1}>
          {filteredTabs?.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ClientRoleCard
                data={item}
                clickHandler={() => detailsViewHandler(item.url)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ServiceProviderDetailPage_tabFolders;
