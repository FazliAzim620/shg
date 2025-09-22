import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link,
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
  Delete,
  Flight,
  Group,
  KeyboardBackspaceOutlined,
  ReceiptOutlined,
  Share,
  VerifiedOutlined,
  WorkOutline,
} from "@mui/icons-material";
import ActionMenu from "../../components/client-module/ActionMenu";
import ClientRoleCard from "../../components/client-module/ClientRoleCard";
import { Link as RouterLink } from "react-router-dom";
import businessIcon from "../../assets/business.svg";
import NoPermissionCard from "../../components/common/NoPermissionCard";
const ClientHome = () => {
  const navigate = useNavigate();
  const param = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const url = currentClient?.name?.toLowerCase()?.replace(/ /g, "-");
  const roleData = [
    {
      id: 1,
      label: "Client details",
      icon: <Business />,
      url: `/${url}/details/${param.id}`,
      permission: "read clients info",
    },
    {
      id: 2,
      label: "Job orders",
      icon: <WorkOutline />,
      url: `/${url}/jobs-order/${param.id}`,
      permission: "read clients job order",
    },
    {
      id: 3,
      label: "Shifts",
      icon: <CalendarMonth />,
      url: `/${url}/shifts/${param.id}`,
      permission: "read clients shift",
    },
    {
      id: 4,
      label: "Providers",
      icon: <Group />,
      url: `/${url}/providers/${param.id}`,
      permission: "read clients providers",
    },

    {
      id: 6,
      label: "Budget preferences",
      icon: <AttachMoneyOutlined />,
      url: `/${url}/preferences/${param.id}`,
      permission: "read clients budget preferences",
    },
    {
      id: 7,
      label: "Timesheets",
      icon: <AccessTimeOutlined />,
      url: `/${url}/timesheet/${param.id}`,
      permission: "read clients timesheets",
    },
    {
      id: 8,
      label: "Invoices",
      icon: <ReceiptOutlined />,
      url: `/${url}/invoices/${param.id}`,
      permission: "read clients invoices",
    },
    {
      id: 9,
      label: "Credentials",
      icon: <VerifiedOutlined />,
      url: `/${url}/credentials/${param.id}`,
      permission: "read clients credentials",
    },
    {
      id: 10,
      label: "Reports",
      icon: <AssignmentSharp />,
      url: `/${url}/reports/${param.id}`,
      permission: "read clients reports",
    },
  ];
  const filteredTabs = roleData.filter((tab) => {
    if (tab.permission) {
      return permissions?.includes(tab.permission);
    }
    return true;
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
    { text: currentClient?.name },
  ];
  const detailsViewHandler = (url) => {
    // const url = currentClient?.name?.toLowerCase()?.replace(/ /g, "-");
    // const clientDetailUrl = url;
    navigate(url);
  };
  if (permissions?.includes("read clients info")) {
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src={businessIcon}
                  alt="logo"
                  sx={{ width: "3rem" }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "21px",
                      color: "text.black",
                    }}
                  >
                    {currentClient?.name}
                  </Typography>
                  <Breadcrumbs aria-label="breadcrumb">
                    {breadcrumbItems.map((item, index) => {
                      if (index === breadcrumbItems.length - 1) {
                        return (
                          <Typography
                            key={item.text}
                            // color="text.primary"
                            sx={{
                              color: "text.black",
                              fontWeight: 500,
                              fontSize: "0.85rem",
                              pt: 0.2,
                            }}
                          >
                            {item.text}
                          </Typography>
                        );
                      }
                      return (
                        <Link
                          component={RouterLink}
                          to={item.href}
                          key={item.text}
                          underline="hover"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            "&:hover": {
                              color: "text.link",
                            },
                          }}
                        >
                          {item.text}
                        </Link>
                      );
                    })}
                  </Breadcrumbs>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(-1)}
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
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
                  <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                  Back
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
  } else {
    return <NoPermissionCard />;
  }
};

export default ClientHome;
