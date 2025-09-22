import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { ArrowBackIos, CheckCircle } from "@mui/icons-material";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import { getCurrentDateTime } from "../../../../api_request";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PROVIDER_ROUTES } from "../../../../routes/Routes";

const TimesheetSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const submitted = searchParams.get("submitted");
  const navigateHandler = (url) => {
    navigate(url);
  };
  const navigateHandler2 = (url, state) => {
    navigate(url, state); // Navigate to the given URL and pass state
  };
  return (
    <Container maxWidth="full">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4, textAlign: "center", boxShadow: "none" }}
      >
        <CheckCircle
          sx={{
            color: "background.success",

            fontSize: "1.41094rem",
          }}
        />

        <CustomTypographyBold fontSize={"1.3125rem"} color={"text.black"}>
          Success! We've received your timesheet
        </CustomTypographyBold>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 }}
        >
          We've successfully received your timesheet submission for your recent{" "}
          shift(s). <br />
          You will be notified via email and in-app message about its approval
          status by{" "}
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: "0.875rem", color: "text.black" }}
          >
            [ {getCurrentDateTime()}]
          </Typography>
          .
        </Typography>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            onClick={() =>
              navigateHandler2(
                `${PROVIDER_ROUTES.myTimeSheets}?review=${submitted}`,
                { state: { location: "timesheet" } } // Passing state with location key
              )
            }
            variant="contained"
            color="primary"
            sx={{ mr: 2, textTransform: "none", padding: "10px 16px" }}
          >
            Review my timesheet
          </Button>
          {/* <Button
            onClick={() =>
              navigateHandler(
                `${PROVIDER_ROUTES.myTimeSheets}?review=${submitted}`,
                { state: { location: "timesheet" } }
              )
            }
            variant="contained"
            color="primary"
            sx={{ mr: 2, textTransform: "none", padding: "10px 16px" }}
          >
            Review my timesheet
          </Button> */}
          <Button
            onClick={() => navigateHandler("/")}
            startIcon={
              <ArrowBackIos sx={{ width: "1rem", color: "text.or_color" }} />
            }
            sx={{
              mr: 2,
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "10px 16px",
              minWidth: 0,
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                color: "text.main",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Back to jobs
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TimesheetSuccessPage;
