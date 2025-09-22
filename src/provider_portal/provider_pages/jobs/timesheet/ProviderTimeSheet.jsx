import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  Link,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import ProviderHeader from "../../../provider_components/ProviderHeader";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import StepsCard from "../../../provider_components/StepsCard";
import TimesheetCard from "../../../provider_components/TimesheetCard";
import JobScheduling from "../JobScheduling";
import Job_paymentTab from "../Job_paymentTab";
import Job_clientContact from "../Job_clientContact";
import JobTraveltinerary from "../JobTraveltinerary";
import AssignmentLetters from "../AssignmentLetters";
import TimesheetStatusCards from "../../../provider_components/TimesheetStatusCards";
import CardSkeleton from "../../../provider_components/CardSkeleton";

import {
  getCurrentJobBudgetPreferences,
  getProviderWeeks,
} from "../../../../api_request";
import {
  setAllWeeksHandler,
  setCurrentJobBudgetPreference,
  setJobWeeks,
} from "../../../../feature/providerPortal/currentJobSlice";
import CustomToggleButtonGroup from "../../../../components/button/CustomToggleButtonGroup";
import { HeadingCommon } from "../../../provider_components/settings/profile/HeadingCommon";
import TimesheetsTableView from "./TimesheetsTableView";

const ProviderTimeSheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentJob, currentJobBudgetPreference } = useSelector(
    (state) => state.currentJob
  );

  const [weeks, setWeeks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCurrentWeek, setHasCurrentWeek] = useState(true);
  const [allWeeks, setAllWeeks] = useState([]);
  const [alignment, setAlignment] = useState("table_view");
  const [view, setView] = useState("table_view");
  const initialStep = parseInt(searchParams.get("step")) || 1;

  const items = useMemo(
    () => [{ text: "My jobs", href: "/" }, { text: `job No# ${id}` }],
    [id]
  );

  const isCurrentWeek = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
  };
  const getWeeks = async () => {
    try {
      const resp = await getProviderWeeks(id);
      if (resp?.data?.success) {
        const currentWeek = resp.data.data.find((week) =>
          isCurrentWeek(week.start_date, week.end_date)
        );
        setWeeks(currentWeek);
        dispatch(setJobWeeks(currentWeek));

        setHasCurrentWeek(!!currentWeek);
        setAllWeeks(resp.data.data);
        dispatch(setAllWeeksHandler(resp.data.data));
      }
    } catch (error) {
      console.error("Error fetching weeks:", error);
      setHasCurrentWeek(false);
    } finally {
      setIsLoading(false);
    }
  };
  const buttonTab = [
    { label: "Table view", value: "table_view" },
    { label: "List view", value: "list_view" },
  ];
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const handleToggleClick = (e) => {
    setView(e);
    localStorage.setItem("view_list", e);
  };
  const jobBudgetPreferencesHandler = async (id) => {
    try {
      const resp = await getCurrentJobBudgetPreferences(id);

      if (resp?.data?.success) {
        dispatch(setCurrentJobBudgetPreference(resp?.data?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWeeks();
    jobBudgetPreferencesHandler(id);
  }, [id]);
  const fetchTimesheets = async (page, rowsPerPage) => {};

  const renderStep = () => {
    switch (initialStep) {
      case 1:
        return isLoading ? (
          <CardSkeleton timesheet={true} />
        ) : (
          <Box sx={{ mt: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <HeadingCommon
                  mb={"0px"}
                  title={"Timesheets"}
                  color={"theme.primary"}
                />
              </Box>
              <CustomToggleButtonGroup
                buttonTab={buttonTab}
                alignment={alignment}
                handleAlignment={handleAlignment}
                handleToggleClick={handleToggleClick}
                darkMode={darkMode}
              />
            </Box>
            {view === "list_view" ? (
              <TimesheetStatusCards weeks={allWeeks} />
            ) : (
              ""
            )}
            {view === "table_view" ? (
              <TimesheetsTableView fetchTimesheets={fetchTimesheets} />
            ) : (
              ""
            )}
          </Box>
        );

      case 2:
        return <JobScheduling />;
      case 3:
        return <AssignmentLetters />;
      case 4:
        return <JobTraveltinerary />;
      case 5:
        return <Job_paymentTab />;
      case 6:
        return <Job_clientContact />;
      default:
        return null;
    }
  };
  const renderActiveStep = () => {
    switch (initialStep) {
      case 1:
        return "Timesheets";
      case 2:
        return "Job Scheduling";
      case 3:
        return "Assignment Letters ";
      case 4:
        return "Job Traveltinerary ";
      case 5:
        return "Invoice & Payments ";
      case 6:
        return "Client Contact";
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        // overflowX: "hidden",
        minHeight: "100vh",
        bgcolor: "background.page_bg",
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", xl: "78%" },
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ minHeight: "71px", p: "1rem 0.5rem" }}>
          <Breadcrumbs aria-label="breadcrumb">
            {items?.map((item, index) =>
              index === items.length - 1 ? (
                <Typography
                  key={index}
                  sx={{
                    color: "text.black",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    pt: 0.2,
                  }}
                >
                  {item.text}
                  <Chip
                    label={
                      <Typography
                        variant="caption"
                        sx={{ color: "text.black", fontWeight: 600 }}
                      >
                        Setup in progress
                      </Typography>
                    }
                    size="small"
                    sx={{
                      ml: 0.5,
                      bgcolor: "rgba(113, 134, 157, .1)",
                      color: "#666",
                      py: "0.5rem",
                      borderRadius: 1,
                    }}
                  />
                </Typography>
              ) : (
                <>
                  <Link
                    component={RouterLink}
                    to={item.href}
                    key={item.text}
                    underline="hover"
                    sx={{
                      color: "text.or_color",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      "&:hover": { color: "text.link" },
                    }}
                  >
                    {item.text}
                  </Link>
                </>
              )
            )}
          </Breadcrumbs>
          <Box sx={{ mt: 1.2, display: "flex", alignItems: "center" }}>
            <CustomTypographyBold
              color="text.black"
              weight={600}
              fontSize="1.3rem"
            >
              {renderActiveStep()}
              {/* {currentJob?.client_name}, {currentJob?.speciality?.name} */}
            </CustomTypographyBold>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mt: 1,
            }}
          >
            <CustomTypographyBold
              color="text.or_color"
              weight={400}
              fontSize="0.75rem"
            >
              Client:
            </CustomTypographyBold>

            <CustomTypographyBold
              color="text.main"
              weight={400}
              fontSize="0.75rem"
            >
              {currentJob?.client_name}
            </CustomTypographyBold>
          </Box>
        </Box>
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          sx={{
            bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
            boxShadow: "none",
            color: "text.main",
            textTransform: "inherit",
            mr: 3,
            "&:hover": { color: "#fff", boxShadow: "none" },
          }}
        >
          <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1.5rem" }} />
          Back to my jobs
        </Button>
      </Box>
      <Box
        sx={{ width: { sm: "100%", xl: "78%" }, mx: "auto", pr: 1.5, mt: 2 }}
      >
        <Divider sx={{ opacity: 0.3 }} />
        <Grid container spacing={2.5}>
          <Grid
            item
            xs={12}
            md={2}
            ml={1.1}
            sx={{ position: "sticky", top: 20, alignSelf: "flex-start" }}
          >
            <StepsCard />
          </Grid>
          <Grid
            item
            xs={12}
            md={9.8}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {renderStep()}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProviderTimeSheet;
