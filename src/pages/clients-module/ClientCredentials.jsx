import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import businessIcon from "../../assets/business.svg";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
import { useSelector, useDispatch } from "react-redux";
import { Close, KeyboardBackspaceOutlined } from "@mui/icons-material";
import UnderConstruction from "../../components/UnderConstruction";
import NoPermissionCard from "../../components/common/NoPermissionCard";

const ClientCredentials = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Credentials");
  const [activeTab1, setActiveTab1] = useState(7);

  // =======================providers options====================

  const breadcrumbItems = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "Clients", href: "/clients" },
      {
        text: currentClient?.name,
        href: `/client/${currentClient?.name
          ?.toLowerCase()
          ?.replace(/ /g, "-")}/${params.id}`,
      },
      { text: activeTab },
    ],
    [currentClient, activeTab, params.id]
  );

  // ---------------------------------------------------- filter end

  const handleTopTabChange = (newValue) => {
    setActiveTab1(newValue);
  };

  if (permissions?.includes("read clients credentials")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
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
                    {breadcrumbItems.map((item, index) =>
                      index === breadcrumbItems.length - 1 ? (
                        <Typography
                          key={item.text}
                          sx={{
                            color: "text.black",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            pt: 0.2,
                          }}
                        >
                          {item.text}
                        </Typography>
                      ) : (
                        <Link
                          component={RouterLink}
                          to={item.href}
                          key={item.text}
                          underline="hover"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            "&:hover": { color: "text.link" },
                          }}
                        >
                          {item.text}
                        </Link>
                      )
                    )}
                  </Breadcrumbs>
                </Box>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/clients`)}
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
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
                  Back to clients
                </Button>
              </Box>
            </Box>
          </Box>
          <ScrollableTabBar
            activeTab={activeTab1}
            onTabChange={handleTopTabChange}
          />
          <Divider sx={{ opacity: 0.3 }} /> <UnderConstruction />
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ClientCredentials;
