import React, { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  Link,
  Chip,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import {
  Link as RouterLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Circle,
  KeyboardBackspaceOutlined,
  SaveAlt,
  Send,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
// import PdfButton from "../../../provider_components/PdfButton";
// import API from "../../../../API";
// import { useDispatch } from "react-redux";
// import TimeSummaryModal from "./TimeSummaryModal";
import TimesheetTable from "../../../provider_components/TimesheetTable";
import { PROVIDER_ROUTES } from "../../../../routes/Routes";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import PdfButton from "../../../provider_components/PdfButton";
import { useDispatch } from "react-redux";
import TimeSummaryModal from "./TimeSummaryModal";
const UpdateTimesheet = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const darkMode = useSelector((state) => state.theme.mode);
  const { week, allWeeks, currentJob, submitted } = useSelector(
    (state) => state.currentJob
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const initialWeek = parseInt(searchParams.get("week"));
  const cw = allWeeks?.find((week) => week?.id === initialWeek);

  const timesheetSummaryHandler = async () => {
    setOpen(!open);
  };
  const navigate = useNavigate();
  const filterWeek = allWeeks?.find((cw) => cw?.id === initialWeek);
  const isMyTimesheet = sessionStorage.getItem("mytimesheet");
  const items = [
    {
      text: isMyTimesheet ? "My Timesheets" : "My jobs",
      href: isMyTimesheet ? "/provider-my-timesheet" : "/",
    },
    {
      text: `${currentJob?.client_name}`,
      href: isMyTimesheet
        ? `/provider-my-timesheet?client=${currentJob?.client_id}&job=${currentJob?.id}`
        : `${PROVIDER_ROUTES.timeSheet}/${currentJob?.id}`,
    },
    { text: `Timesheet No# ${filterWeek?.id || week?.id}` },
  ];

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <TimeSummaryModal
          open={open}
          handleClose={() => setOpen(false)}
          weekData={cw}
        />
        {/* ------------------------------------------------------------ tab section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minHeight: "71px", p: "1rem 0.5rem", mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              {items.map((item, index) => {
                if (index === items.length - 1) {
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
                      color: "text.or_color",
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
            <Box sx={{ mt: 1.2, display: "flex", alignItems: "center" }}>
              <CustomTypographyBold
                color="text.black"
                weight={600}
                fontSize={" 1.3rem"}
              >
                Timesheet #{filterWeek?.id || week?.id}
              </CustomTypographyBold>
              <Chip
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "background.success",
                        // bgcolor: "background.success",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Circle sx={{ fontSize: 12 }} /> In progress
                    </Typography>
                  </Box>
                }
                size="small"
                sx={{
                  ml: 0.5,
                  bgcolor: "rgba(0, 201, 167, .1)",
                  color: "#666",
                  py: "0.5rem",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6 ",
              boxShadow: "none",
              color: "text.main",
              textTransform: "inherit",
              mr: 3,
              "&:hover": {
                color: "#fff",
                boxShadow: "none",
              },
            }}
          >
            <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1.5rem" }} />
            Back to my jobs
          </Button>
        </Box>
        <Divider sx={{ opacity: 0.3 }} />
        {/* ------------------------------------------------------------ tab section end */}
        <Grid container spacing={2.5} sx={{ pr: 1.5, mt: 2 }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TimesheetTable actionHandler={timesheetSummaryHandler} />
          </Grid>
          {/* --------------------------------------------------------------------------------------- */}
        </Grid>
      </Box>
    </Box>
  );
};

export default UpdateTimesheet;
