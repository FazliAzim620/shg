import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Grid,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import {
  CircleOutlined,
  FiberManualRecord,
  SimCardDownloadOutlined,
} from "@mui/icons-material/";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PROVIDER_ROUTES } from "../../routes/Routes";

import {
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
} from "date-fns";

const TimesheetCard = ({ currentWeek, serviceProvider }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const { currentJob } = useSelector((state) => state.currentJob);
  const [showAlert, setShowAlert] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);

  const days = [
    { key: "Mon", value: "Monday" },
    { key: "Tue", value: "Tuesday" },
    { key: "Wed", value: "Wednesday" },
    { key: "Thu", value: "Thursday" },
    { key: "Fri", value: "Friday" },
    { key: "Sat", value: "Saturday" },
    { key: "Sun", value: "Sunday" },
  ];
  const detailHandler = (path) => {
    navigate(path);
  };

  const timesheetDays = new Set(currentWeek?.timesheets?.map((ts) => ts.day));
  const navigateHandler = (url) => {
    navigate(url);
  };
  // const isCurrentWeek = () => {
  //   const today = new Date();
  //   const startDate = parseISO(currentWeek?.start_date);
  //   const endDate = parseISO(currentWeek?.end_date);

  //   return isWithinInterval(today, { start: startDate, end: endDate });
  // };
  const today = new Date();

  useEffect(() => {
    // Only show the alert if the current week is within the date range and status is 'pending'
    if (
      currentWeek?.status === "resubmission_required" ||
      (currentWeek?.status === null &&
        isBefore(new Date(currentWeek?.end_date), new Date()))
    ) {
      const intervalId = setInterval(() => {
        setShowAlert((prev) => !prev);
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [currentWeek]);

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        bgcolor: "background.paper",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          px: 2,
          pt: 2,
          position: "relative",
        }}
      >
        {showAlert && !hideAlert && (
          <Box
            sx={{
              position: "absolute",
              top: 1,
              left: 0,
              width: "100%",
              zIndex: 99,
            }}
          >
            <Alert
              severity="warning"
              onClose={() => {
                setHideAlert(true);
              }}
            >
              {currentWeek?.status === "resubmission_required"
                ? "Your timesheet has been rejected. Please review and resubmit."
                : " Please complete your timesheet submission."}
            </Alert>
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CustomTypographyBold
            weight={600}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            {/* Timesheet No# {currentWeek?.week_no || currentWeek?.id} */}
            Timesheet No# {currentWeek?.id}
          </CustomTypographyBold>

          <Chip
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FiberManualRecord sx={{ fontSize: "0.8rem" }} />
                <Typography
                  variant="caption"
                  sx={{ color: "text.black", fontWeight: 600 }}
                >
                  {currentWeek?.status === null
                    ? "In progress"
                    : currentWeek?.status == "send"
                    ? "Submitted"
                    : currentWeek?.status === "resubmission_required"
                    ? "Re-submission Required"
                    : currentWeek?.status === "submitted_by_provider"
                    ? "Submitted by provider"
                    : currentWeek?.status}
                </Typography>
              </Box>
            }
            size="small"
            sx={{
              mr: 2,
              bgcolor: "rgba(113, 134, 157, .1)",
              color: "text.black",
              py: "0.5rem",
              borderRadius: 1,
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CustomTypographyBold
            weight={400}
            fontSize={"0.75rem"}
            color={"text.or_color"}
          >
            Client:
          </CustomTypographyBold>
          <CustomTypographyBold
            weight={500}
            fontSize={"0.751rem"}
            color={"text.or_color"}
          >
            {currentJob?.client_name}
          </CustomTypographyBold>
          &nbsp; &nbsp;
          <CustomTypographyBold
            weight={400}
            fontSize={"0.75rem"}
            color={"text.or_color"}
          >
            Due date:
          </CustomTypographyBold>
          <CustomTypographyBold
            weight={400}
            fontSize={"0.751rem"}
            color={"text.or_color"}
          >
            {format(currentWeek?.end_date, "dd/MM/yyyy")}
          </CustomTypographyBold>
        </Box>
        <Button
          variant="contained"
          sx={{
            boxShadow: "none",
            color: "text.main" || "text.btn_blue",
            textTransform: "inherit",
            fontSize: "0.75rem",
            bgcolor: "transparent",

            "&:hover": {
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6 ",
              boxShadow: "none",
            },
          }}
        >
          <SimCardDownloadOutlined sx={{ fontSize: "1rem" }} />
          Download .CSV{" "}
        </Button>
      </Box>
      <Divider sx={{ opacity: 0.5 }} />
      <Box sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Box>
            <CustomTypographyBold
              weight={400}
              fontSize={"0.71rem"}
              color={"text.or_color"}
              lineHeight={1.5}
            >
              YOUR TIMESHEET (BILLED BI-WEEKLY):
            </CustomTypographyBold>
            {currentWeek?.start_date && currentWeek?.end_date && (
              <CustomTypographyBold
                weight={600}
                fontSize={"1rem"}
                color={"text.black"}
                lineHeight={1.5}
              >
                Week of: {format(currentWeek?.start_date, "dd")} -
                {format(currentWeek?.end_date, "dd MMMM yyyy")}
              </CustomTypographyBold>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              size="small"
              variant="text"
              sx={{
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.1)",
                padding: "5px 16px",
                minWidth: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",
                  bgcolor: "background.paper",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
              onClick={() =>
                currentWeek?.status == null
                  ? detailHandler(
                      `${PROVIDER_ROUTES.timeSheetDetail}/${currentJob?.id}?week=${currentWeek?.id}`
                    )
                  : navigateHandler(
                      `${PROVIDER_ROUTES.myTimeSheets}?review=${currentWeek?.id}`
                    )
              }
            >
              View details
            </Button>
            {(currentWeek?.status == null ||
              currentWeek?.status === "resubmission_required") && (
              <Button
                onClick={() =>
                  detailHandler(
                    `${PROVIDER_ROUTES.timeSheetDetail}/${currentJob?.id}?week=${currentWeek?.id}`
                  )
                }
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                }}
              >
                Update sheet
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 2.5, pb: 4, px: 2 }}>
          <CustomTypographyBold
            weight={400}
            fontSize={"0.71rem"}
            color={"text.or_color"}
            lineHeight={1.5}
            textTransform={"uppercase"}
          >
            Weekly Totals
          </CustomTypographyBold>
          <CustomTypographyBold
            weight={600}
            fontSize={"1.4rem"}
            color={"text.main"}
            lineHeight={1.5}
          >
            8:00 HRS
          </CustomTypographyBold>
        </Box>
        <Divider sx={{ opacity: 0.5 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            pt: 5,
            pb: 1,
          }}
        >
          {" "}
          <CustomTypographyBold
            weight={600}
            fontSize={"0.874rem"}
            color={"text.black"}
            // lineHeight={1.5}
          >
            Timesheet usage
          </CustomTypographyBold>
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomTypographyBold
              weight={600}
              fontSize={"0.874rem"}
              color={"text.black"}
              mr={1}
            >
              8:00 Hours
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={400}
              fontSize={"0.874rem"}
              color={"text.or_color"}
              textTransform={"initail"}
            >
              used of 40:00 Hours
            </CustomTypographyBold>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={20}
          sx={{ mb: 2, mx: 2, height: 8, borderRadius: "10px" }}
        />
        <Grid container spacing={1} mx={1}>
          {days.map((day, index) => (
            <Grid item key={day.key}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">{day.key}</Typography>
                <IconButton>
                  {timesheetDays.has(day.value) ? (
                    <CheckCircleIcon
                      sx={{
                        width: 20,
                        color: "background.success",
                      }}
                    />
                  ) : (
                    <CircleOutlined
                      sx={{
                        width: 20,
                      }}
                    />
                  )}
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TimesheetCard;
