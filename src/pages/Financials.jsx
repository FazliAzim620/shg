import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import underConstrucationImage from "../assets/svg/illustrations/oc-project-development.svg";
import Breadcrumb from "../components/BreadCrumb";
// import FormBuilderComponent from "../components/testing/FormBuilderComponent";

import FormCreator from "./form-builder/FormCreator";
import { useSelector } from "react-redux";
import NoPermissionCard from "../components/common/NoPermissionCard";
import CreatedForm from "./form-builder/CreatedForm";
import DynamicFormBuilder from "./form-builder/DynamicFormBuilder";
import FormFiller from "./form-builder/NewFormBuilder";
import FormBuilderComponent from "./form-builder/FormBuilderComponent";
const Financials = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Financial" }];
  if (permissions?.includes("read financials info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        {/* <FormCreator /> */}
        {/* <FormFiller /> */}
        {/* <FormBuilderComponent /> */}
        {/* <DynamicFormBuilder /> */}
        {/* <CreatedForm /> */}
        {/* <Header /> */}

        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",

            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Breadcrumb items={breadcrumbItems} title={"Financial"} />

          <Box
            sx={{
              flexGrow: 1,
              py: 4,
              px: 2,
              //   width: { sm: "100%", md: "70%", xl: "55%" },
              m: "0 auto",
            }}
          >
            <Box sx={{ textAlign: "center", mt: 4.5 }}>
              <img
                src={underConstrucationImage}
                alt="Under construction"
                style={{
                  maxWidth: "15rem",
                  marginBottom: "20px",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: "text.black",
                  fontSize: "1.41094rem",
                  fontWeight: 600,
                }}
                gutterBottom
              >
                Under construction.
              </Typography>
              <Typography variant="body2" gutterBottom>
                This module is under construction! In the meantime, you can
                continue using all Job Management features
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/job-management")}
                sx={{
                  mt: 2,
                  textTransform: "capitalize",
                  bgcolor: "background.btn_blue",
                  boxShadow: "none",
                  py: 1.2,
                }}
              >
                Go to Job Management
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default Financials;
