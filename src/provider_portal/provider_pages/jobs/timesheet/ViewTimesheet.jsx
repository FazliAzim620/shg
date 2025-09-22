import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import CustomChip from "../../../../components/CustomChip";
import { format } from "date-fns";
import {
  KeyboardBackspaceOutlined,
  Share,
  UploadFile,
} from "@mui/icons-material";
import ActivityStreamCard from "./ActivityStreamCard";
import API from "../../../../API";
import ExpensesModal from "../../../../pages/time-sheet/ExpensesModal";
import SkeletonRow from "../../../../components/SkeletonRow";
const ViewTimesheet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewId = searchParams.get("review");
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { location: stateLocation } = location.state || {}; // Destructure to get 'location' from state

  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const { currentJob, allWeeks, submitted } = useSelector(
    (state) => state.currentJob
  );
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  // const weekData = allWeeks?.find((week) => week?.id == 119);
  const [weekData, setWeekData] = useState([]);
  const handleBreadcrumbClick = (event, item) => {
    event.preventDefault();
    navigate(item.href);
  };
  const getDetails = async () => {
    try {
      const resp = await API.get(`/api/get-timesheet-summary/${reviewId}`);
      if (resp?.data?.success) {
        setWeekData(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getDetails();
    updateBreadcrumbs();
  }, []);

  const updateBreadcrumbs = () => {
    let newBreadcrumbs = [
      { text: "My Timesheets", href: "/provider-my-timesheet" },
    ];
    newBreadcrumbs.push({
      text: currentJob?.client_name,
      // href: `/provider-my-timesheet?client=${currentJob?.client_id}`,
      href: stateLocation ? -3 : -1,
    });
    newBreadcrumbs.push({
      text: `Timesheet No # ${submitted || reviewId}`,
      href: `/provider-my-timesheet?client=${currentJob?.client_name}`,
    });

    setBreadcrumbs(newBreadcrumbs);
  };
  const NoBorderTableCell = styled(TableCell)(({ theme }) => ({
    border: "none", // Remove the border
    padding: theme.spacing(2),
    color: darkMode == "light" ? "#71869d" : "text.or_color",
    fontWeight: 400,
  }));

  const calculateTotalHours = useMemo(() => {
    return weekData?.timesheets?.reduce((total, dayData) => {
      const dayTotal = dayData.timesheet_details.reduce((daySum, shift) => {
        let hours = 0;

        // If total_hours is in time format (HH:mm)
        if (shift.total_hours && typeof shift.total_hours === "string") {
          const [hour, minute] = shift.total_hours.split(":").map(Number);
          hours = hour + minute / 60;
        }
        // If total_hours is in numeric format
        else {
          hours =
            Number(shift.total_hours) ||
            Number(shift.overtime_hours) + Number(shift.regular_hours);
        }

        return daySum + hours;
      }, 0);
      return total + dayTotal;
    }, 0);
  }, [weekData]);
  const formatTotalHours = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };
  return (
    <Box
      sx={{ overflowX: "hidden", bgcolor: "background.page_bg", pt: 2, pl: 1 }}
    >
      <ExpensesModal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(!openExpenseModal)}
        data={expenses}
      />
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              {breadcrumbs.map((item, index) => {
                if (index === breadcrumbs.length - 1) {
                  return (
                    <Typography
                      key={item.text}
                      sx={{
                        color: "text.black",
                        fontWeight: 400,
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
                    onClick={(e) => handleBreadcrumbClick(e, item)}
                    sx={{
                      color: "text.or_color",
                      fontWeight: 400,
                      fontSize: "0.85rem",
                      textTransform: "capitalize",
                      "&:hover": { color: "text.link" },
                    }}
                  >
                    {item.text}
                  </Link>
                );
              })}
            </Breadcrumbs>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                pt={1}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <CustomTypographyBold
                  color="text.black"
                  weight={600}
                  fontSize={" 1.3rem"}
                >
                  Timesheet No #{submitted || reviewId}
                </CustomTypographyBold>
                {weekData?.client_status === "approved_by_client" ? (
                  <CustomChip
                    dot={true}
                    width={0}
                    chipText={"Approved by client"}
                    color={
                      weekData?.client_status === "approved_by_client"
                        ? "rgba(0, 201, 167)"
                        : "black"
                    }
                    bgcolor={
                      weekData?.client_status === "approved_by_client"
                        ? "rgba(0, 201, 167,0.1)"
                        : "lightgray"
                    }
                  />
                ) : (
                  <CustomChip
                    dot={true}
                    size={10}
                    width={40}
                    chipText="Submitted by provider"
                    color="black"
                    bgcolor="#e7e8ec"
                  />
                )}
              </Box>
              <Button
                onClick={() => {
                  navigate(
                    // `/provider-my-timesheet?client=${currentJob?.client_id}`
                    -1
                  );
                }}
                variant="contained"
                sx={{
                  bgcolor:
                    darkMode === "dark" ? "background.paper" : "#dee6f6 ",
                  boxShadow: "none",
                  color: "text.main",
                  textTransform: "inherit",
                  fontWeight: 400,
                  mr: 3,
                  "&:hover": {
                    color: "#fff",
                    boxShadow: "none",
                  },
                }}
              >
                <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                Back to {currentJob?.client_name}
              </Button>
            </Box>
            <Divider sx={{ opacity: "0.3", mt: 6 }} />
          </Grid>
          {isLoading ? (
            <Grid item xs={12} md={9} sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",

                  mx: "auto",
                }}
              >
                <SkeletonRow column={7} />
                <SkeletonRow column={7} />
                <SkeletonRow column={7} />
                <SkeletonRow column={7} />
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12} md={9} sx={{ mt: 3 }}>
              <Box
                sx={{
                  minHeight: "100vh",
                  overflowX: "hidden",
                }}
              >
                {/* ------------------------------------------------------------------- tabale  and header */}

                <Box
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "background.paper",
                    px: "1.5rem",
                    pt: "1rem",
                    pb: "1.5rem",
                    boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{}}>
                      <Grid container sx={{ width: 600 }}>
                        <Grid item xs={2}>
                          <CustomTypographyBold
                            weight={400}
                            fontSize={"0.75rem"}
                            color={"text.or_color"}
                          >
                            Provider:
                          </CustomTypographyBold>
                        </Grid>
                        <Grid item xs={10}>
                          <CustomTypographyBold
                            weight={500}
                            fontSize={"0.875rem"}
                            color={"text.black"}
                          >
                            {currentJob?.name || "--"}
                          </CustomTypographyBold>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ width: 600, mt: 1 }}>
                        <Grid item xs={2}>
                          <CustomTypographyBold
                            weight={400}
                            fontSize={"0.75rem"}
                            color={"text.or_color"}
                          >
                            Client:
                          </CustomTypographyBold>
                        </Grid>
                        <Grid item xs={10}>
                          <CustomTypographyBold
                            weight={500}
                            fontSize={"0.875rem"}
                            color={"text.black"}
                          >
                            {currentJob?.client_name || "--"}
                          </CustomTypographyBold>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box sx={{}}>
                      <Box sx={{ display: "flex", gap: 4 }}>
                        <CustomTypographyBold
                          weight={400}
                          fontSize={"0.75rem"}
                          color={"text.or_color"}
                        >
                          Week of:
                        </CustomTypographyBold>
                        <CustomTypographyBold
                          weight={500}
                          fontSize={"0.875rem"}
                          color={"text.black"}
                        >
                          {weekData?.start_date}
                        </CustomTypographyBold>
                      </Box>
                      <Box sx={{ display: "flex", gap: 4, pt: 1 }}>
                        <CustomTypographyBold
                          weight={400}
                          fontSize={"0.75rem"}
                          color={"text.or_color"}
                        >
                          Due date:
                        </CustomTypographyBold>
                        <CustomTypographyBold
                          weight={500}
                          fontSize={"0.875rem"}
                          color={"text.black"}
                        >
                          {weekData?.end_date}
                        </CustomTypographyBold>
                      </Box>
                    </Box>
                  </Box>
                  <Table>
                    <TableHead
                      sx={{
                        bgcolor:
                          darkMode === "light"
                            ? "rgba(231, 234, 243, .4)"
                            : "background.navbar_bg",
                      }}
                    >
                      <TableRow>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Date
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Day
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Start Time
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          End Time
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Regular Hours
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Overtime Hours
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Expenses{" "}
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Total Hours
                        </NoBorderTableCell>
                        <NoBorderTableCell sx={{ py: 1 }}>
                          Attachments{" "}
                        </NoBorderTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weekData?.timesheets?.map((timesheet) =>
                        timesheet?.timesheet_details?.map((shift, index) => {
                          const [shours, sminutes, sseconds = 0] =
                            shift.start_time.split(":").map(Number);
                          const [hours, minutes, seconds = 0] = shift.end_time
                            .split(":")
                            .map(Number);

                          // Create a date object with the provided time
                          const startDate = new Date();
                          startDate.setHours(shours);
                          startDate.setMinutes(sminutes);
                          startDate.setSeconds(sseconds);

                          const date = new Date();
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          date.setSeconds(seconds);

                          // Format the date object to 12-hour format
                          const formattedStartTime = format(
                            startDate,
                            "hh:mm a"
                          );
                          const formattedEndTime = format(date, "hh:mm a");
                          return (
                            <TableRow key={shift.id}>
                              <NoBorderTableCell sx={{ fontWeight: 600 }}>
                                {format(timesheet.date, "dd/MM/yy")}
                              </NoBorderTableCell>
                              <NoBorderTableCell>
                                {timesheet.day}
                              </NoBorderTableCell>

                              <NoBorderTableCell sx={{ width: "120px" }}>
                                {formattedStartTime || "--"}
                              </NoBorderTableCell>
                              <NoBorderTableCell sx={{ width: "120px" }}>
                                {formattedEndTime || "--"}
                              </NoBorderTableCell>
                              <NoBorderTableCell>
                                {shift.regular_hours || "0"}
                              </NoBorderTableCell>
                              <NoBorderTableCell>
                                {shift.overtime_hours || "0"}
                              </NoBorderTableCell>

                              <NoBorderTableCell>
                                {shift?.timesheet_detail_attachments
                                  ?.reduce((sum, item) => sum + item.amount, 0)
                                  .toFixed(2)}
                              </NoBorderTableCell>

                              <NoBorderTableCell>
                                {shift?.total_hours}{" "}
                                {/* {Number(shift.regular_hours) +
                                  Number(shift.overtime_hours) || "0"} */}
                              </NoBorderTableCell>
                              <NoBorderTableCell>
                                <Button
                                  disabled={
                                    shift?.timesheet_detail_attachments?.filter(
                                      (item) => item?.file_name
                                    )?.length === 0
                                  }
                                  onClick={() => {
                                    setOpenExpenseModal(true);
                                    setExpenses(shift);
                                  }}
                                  variant="text"
                                  sx={{
                                    bgcolor: darkMode === "dark" && "gray",
                                    color:
                                      darkMode === "light"
                                        ? "text.btn_blue"
                                        : "white",
                                  }}
                                >
                                  {shift?.timesheet_detail_attachments?.filter(
                                    (item) => item?.file_name
                                  )?.length || "0"}
                                </Button>
                              </NoBorderTableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                  <Box
                    sx={{
                      width: "90%",
                      pt: 2,
                      display: "flex",
                      justifyContent: "end",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <CustomTypographyBold color="text.secondary" weight={400}>
                      Weekly total hours:
                    </CustomTypographyBold>
                    <CustomTypographyBold color="text.black">
                      {formatTotalHours(calculateTotalHours)}
                    </CustomTypographyBold>
                  </Box>

                  <Divider sx={{ opacity: 0.4, mt: 3 }} />
                  <Box
                    sx={{
                      py: 2,
                    }}
                  >
                    <CustomTypographyBold
                      color="text.form_input"
                      weight={400}
                      fontSize={"0.875rem"}
                      textTransform={"none"}
                    >
                      Overtime explanation
                    </CustomTypographyBold>
                    <CustomTypographyBold
                      color="text.form_input"
                      weight={400}
                      fontSize={"0.65rem"}
                      textTransform={"none"}
                      wordBreak={"break-word"}
                    >
                      {weekData?.overtime_explanation}
                    </CustomTypographyBold>
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <CustomTypographyBold
                      color="text.form_input"
                      fontSize={"0.875rem"}
                      textTransform={"none"}
                    >
                      Provider signature
                    </CustomTypographyBold>
                    {weekData?.signature ? (
                      <Box
                        component={"img"}
                        src={JSON.parse(weekData?.signature)?.signature}
                        sx={{ width: "10rem" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          minWidth: "4rem",
                          height: "4rem",
                          bgcolor: "background.navbar_bg",
                        }}
                      ></Box>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.or_color">
                    © 2024 SHG Helthcare.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    mb: { xs: 2, xl: 0 },
                    display: "flex",
                    justifyContent: "end",
                    mr: 1,
                  }}
                >
                  <Button
                    startIcon={<UploadFile />}
                    sx={{
                      mr: 2,
                      textTransform: "capitalize",
                      color: "text.primary",
                      fontSize: "0.8125rem",
                      fontWeight: 400,
                      border: "1px solid rgba(99, 99, 99, 0.2)",
                      padding: "5px 16px",
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
                    Download PDF
                  </Button>
                  <Button
                    startIcon={<Share />}
                    variant="contained"
                    color="primary"
                    //   onClick={sendHandler}
                    size="small"
                    sx={{ textTransform: "none", height: "2.2rem" }}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
              {/* </Box> */}
            </Grid>
          )}
          <Grid item xs={12} md={3} sx={{ mt: 3, px: 1, mb: 2 }}>
            <ActivityStreamCard
              timesheetData={weekData?.history}
              weekData={weekData}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewTimesheet;
