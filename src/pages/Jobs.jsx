import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import underConstrucationImage from "../assets/svg/illustrations/oc-project-development.svg";
import Breadcrumb from "../components/BreadCrumb";
const Jobs = () => {
  const navigate = useNavigate();
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Jobs" }];
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
        <Breadcrumb items={breadcrumbItems} title={"Jobs"} />

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
              onClick={() => navigate("/assignment-management")}
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
};

export default Jobs;
