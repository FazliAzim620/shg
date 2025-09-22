import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import underConstrucationImage from "../assets/svg/illustrations/oc-project-development.svg";
import Breadcrumb from "../components/BreadCrumb";
import { useSelector } from "react-redux";

import SideTabAndContent from "./settings/SideTabAndContent";
const Setting = () => {
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Settings" }];
  const darkMode = useSelector((state) => state.theme.mode);
  const { newUserData, providerRolesList, medicalSpecialities, isLoading } =
    useSelector((state) => state.job);
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
        <Breadcrumb items={breadcrumbItems} title={"Settings"} />
        <Box
          sx={{
            flexGrow: 1,
            py: 4,
            px: 2,
            //   width: { sm: "100%", md: "70%", xl: "55%" },
            m: "0 auto",
          }}
        >
          <SideTabAndContent />
          {/* <Box sx={{ textAlign: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <SideTabsVertical />
              </Grid>
              <Grid xs={12} md={4}>
                <CardCommon cardTitle={"Basic Information"}>dsd</CardCommon>
              </Grid>
            </Grid>
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Setting;
