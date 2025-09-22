import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  ButtonGroup,
  colors,
  MenuItem,
  Menu,
  styled,
  TextareaAutosize,
  Skeleton,
} from "@mui/material";
import logo from "../assets/logos/logo-short.svg";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector, useDispatch } from "react-redux";
import TimesheetModal from "./TimesheetModal";
import {
  Add,
  AttachFile,
  DeleteOutlined,
  ExpandMoreOutlined,
  ModeEditOutlineOutlined,
  RemoveRedEye,
  SaveAlt,
  Send,
  UploadFile,
} from "@mui/icons-material";
import API from "../../API";
import {
  setAllWeeksHandler,
  setJobWeeks,
} from "../../feature/providerPortal/currentJobSlice";
import { DeleteConfirmModal } from "../../components/handleConfirmDelete";
import { getProviderWeeks } from "../../api_request";
import { useParams, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { CommonInputField } from "../../components/job-component/CreateJobModal";

import PdfButton from "./PdfButton";
import { abbreviateDays, formatDate } from "../../util";
import { TimesheetTableAttachmentModal } from "./TimesheetTableAttachmentModal";
import UpdateTimesheetModal from "./UpdateTimesheetModal";
const NoBorderTableCell = styled(TableCell)(({ theme }) => ({
  border: "none", // Remove the border
  padding: theme.spacing(2),
  color: "#71869d",
  textTransform: "uppercase",
  fontSize: "0.75rem",
}));

const TimesheetTable = ({ actionHandler }) => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWeek = parseInt(searchParams.get("week"));
  const { week, allWeeks, currentJob, submitted } = useSelector(
    (state) => state.currentJob
  );

  const [overtimeExplanation, setOvertimeExplanation] = useState("");
  const [data, setData] = useState(
    allWeeks ? allWeeks?.find((cw) => cw?.id === initialWeek) : week
  );
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  const [isEdit, setIsEdit] = useState(null);
  const [isView, setIsView] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const generateWeekDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dates.push({
        date: dt.toISOString().split("T")[0],
        day: days[dt.getDay()],
        timesheet_details: [],
      });
    }
    return dates;
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeShift, setActiveShift] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [weekDates, setWeekDates] = useState([]);
  const [weekId, setWeekId] = useState([]);
  const calculateTotalHours = useMemo(() => {
    return weekDates.reduce((total, dayData) => {
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
  }, [weekDates]);
  const formatTotalHours = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };
  const isCurrentWeek = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return today >= start && today <= end;
  };
  const getWeeks = async () => {
    setIsLoading(true);
    try {
      const resp = await getProviderWeeks(params?.id);
      if (resp?.data?.success) {
        setIsLoading(false);
        const currentWeek = resp?.data?.data?.filter((week) =>
          isCurrentWeek(week.start_date, week.end_date)
        );

        if (!initialWeek) {
          dispatch(setJobWeeks(currentWeek?.[0]));
          setData(currentWeek?.[0]);
        }
        if (initialWeek) {
          dispatch(setAllWeeksHandler(resp?.data?.data));
          const data = resp?.data?.data?.find(
            (data) => data?.id === initialWeek
          );
          const generatedDates = generateWeekDates(
            data?.start_date,
            data?.end_date
          );
          const mergedDates = generatedDates.map((genDate) => {
            const existingTimesheet = data?.timesheets.find(
              (ts) => ts.date === genDate.date
            );
            return existingTimesheet
              ? { ...genDate, ...existingTimesheet }
              : genDate;
          });

          setWeekDates(mergedDates);
        }
      }
      if (resp === undefined) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const generatedDates = generateWeekDates(data?.start_date, data?.end_date);
    const mergedDates = generatedDates.map((genDate) => {
      const existingTimesheet = data?.timesheets.find(
        (ts) => ts.date === genDate.date
      );
      return existingTimesheet ? { ...genDate, ...existingTimesheet } : genDate;
    });

    setWeekDates(mergedDates);
  }, [data]);

  const handleAddShift = (dateIndex, date, shift = null) => {
    setCurrentShift({
      dateIndex,
      shifts: weekDates[dateIndex].timesheet_details,
      editingShift: shift,
      date,
    });
    setIsModalOpen(true);
    if (shift) {
      setIsEdit(shift);
    }
  };

  const handleShiftSave = (updatedShifts) => {
    getWeeks();
    setWeekDates((prevWeekDates) => {
      return prevWeekDates.map((day, index) =>
        index === currentShift.dateIndex
          ? { ...day, timesheet_details: updatedShifts }
          : day
      );
    });
    setIsEdit(null);
    // setIsModalOpen(false);
  };

  const isFutureDate = (date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const givenDate = new Date(date).setHours(0, 0, 0, 0);
    return givenDate > today;
  };

  useEffect(() => {
    setData(allWeeks ? allWeeks?.find((cw) => cw?.id === initialWeek) : week);
  }, [week]);

  const deleteTimesheetItem = (weekId, timesheetId) => {
    setAnchorEl(null);
    setWeekDates((prevWeeks) =>
      prevWeeks.map((week) => {
        if (week.id === weekId) {
          // Filter out the timesheet item with the specified timesheetId
          const updatedTimesheetDetails = week.timesheet_details.filter(
            (timesheet) => timesheet.id !== timesheetId
          );

          // Return the updated week with new timesheet details
          return {
            ...week,
            timesheet_details: updatedTimesheetDetails,
            updated_at: new Date().toISOString(), // Set updated_at to current timestamp
          };
        }
        return week;
      })
    );
  };

  const handleDeleteShift = async () => {
    setIsLoading(true);
    try {
      const resp = await API.delete(`/api/delete-shift/${deletedId}`);
      if (resp?.data?.success) {
        deleteTimesheetItem(weekId, deletedId);
        setIsLoading(false);
        setShowWarning(false);
        setDeletedId(null);
        getWeeks();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const closeModal = () => {
    setIsLoading(false);
    setShowWarning(false);
  };
  const handleOvertimeChange = (event) => {
    setOvertimeExplanation(event.target.value);
  };

  return (
    <Box sx={{ pb: 3 }}>
      <Box
        sx={{
          margin: "auto",
          padding: "2.5rem",
          bgcolor: "background.paper",
          width: "100%",
          ml: 1,
          // border: ".0625rem solid rgba(231, 234, 243, .7)",
          borderRadius: ".75rem",
        }}
      >
        <TimesheetTableAttachmentModal
          isOpen={isAttachmentModalOpen}
          setIsOpen={setIsAttachmentModalOpen}
          shiftId={isAttachmentModalOpen?.id}
        />
        {/* <TimesheetModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shift={currentShift}
          onSave={handleShiftSave}
          edit={isEdit}
        /> */}
        <UpdateTimesheetModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEdit(null);
            setIsView(null);
          }}
          shift={currentShift}
          onSave={handleShiftSave}
          edit={isEdit}
          view={isView}
        />
        <DeleteConfirmModal
          isOpen={showWarning}
          onClose={closeModal}
          onConfirm={handleDeleteShift}
          isLoading={isLoading}
          itemName={"Shift"}
          title={"Delete"}
          action={"Delete"}
          bodyText={
            <Typography variant="body2">
              Are you sure you want to delete this Shift?
              <br /> This action cannot be undone.
            </Typography>
          }
        />

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
                {data?.start_date}
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
                {data?.end_date}
              </CustomTypographyBold>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            // overflowX: "scroll",
            boxShadow: "none",
            maxWidth: "800",
          }}
        >
          <TableContainer
            sx={{
              boxShadow: "none",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  backgroundColor: "rgba(231, 234, 243, .4)",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <TableRow>
                  <NoBorderTableCell sx={{ py: 1 }}>Date</NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>Day</NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>
                    {" "}
                    Start Time
                  </NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>
                    {" "}
                    End Time
                  </NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>
                    Regular HRS
                  </NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>
                    Overtime HRS
                  </NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>
                    Total HRS
                  </NoBorderTableCell>

                  <NoBorderTableCell sx={{ py: 1 }}>
                    $ Expenses
                  </NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>
                    Attachments
                  </NoBorderTableCell>
                  <NoBorderTableCell sx={{ py: 1 }}>Actions</NoBorderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weekDates.map((dayData, outerIndex) => {
                  return (
                    <React.Fragment key={dayData.date}>
                      {dayData.timesheet_details.length > 0 ? (
                        dayData.timesheet_details.map((shift, index) => {
                          // Split the start_time and end_time, defaulting seconds to "00" if not provided
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
                          const formattedDate = formatDate(dayData.date);
                          return (
                            <React.Fragment key={`${dayData.date}-${index}`}>
                              <TableRow key={`${dayData.date}-${index}`}>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {index === 0 ? formattedDate : ""}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {index === 0
                                    ? abbreviateDays(dayData.day)
                                    : ""}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {formattedStartTime}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {formattedEndTime}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {shift.regular_hours}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {shift.overtime_hours}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {shift?.total_hours || "--"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                  }}
                                >
                                  {shift?.timesheet_detail_attachments
                                    ?.reduce(
                                      (sum, item) => sum + item.amount,
                                      0
                                    )
                                    .toFixed(2)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    color: "text.or_color",
                                    // fontWeight: 600,
                                  }}
                                >
                                  {shift?.timesheet_detail_attachments?.length}
                                </TableCell>
                                <TableCell
                                  sx={{ border: "none", display: "flex" }}
                                >
                                  <Button
                                    disabled={
                                      (data?.status !== null ||
                                        initialWeek == submitted) &&
                                      data?.status !== "resubmission_required"
                                    }
                                    variant="text"
                                    endIcon={<ExpandMoreOutlined />}
                                    sx={{
                                      textTransform: "capitalize",
                                      color: "text.or_color",
                                      fontSize: "0.8125rem",
                                      fontWeight: 400,
                                      border: "1px solid rgba(99, 99, 99, 0.2)",
                                      padding: "3px 8px",
                                      minWidth: 0,
                                      bgcolor: "background.paper",
                                      "&:hover": {
                                        boxShadow:
                                          "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                        bgcolor: "background.paper",
                                        transform: "scale(1.01)",
                                        color: "text.main",
                                      },
                                      "&:focus": {
                                        outline: "none",
                                      },
                                    }}
                                    onClick={(e) => {
                                      handleClick(e);
                                      setActiveShift(shift);
                                      setCurrentDay(dayData);
                                      setCurrentIndex(index);
                                    }}
                                  >
                                    More actions
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {index + 1 ===
                                dayData.timesheet_details.length && (
                                <TableRow
                                  sx={{
                                    borderBottom:
                                      " .0625rem solid rgba(231, 234, 243, .9)",
                                  }}
                                >
                                  <TableCell
                                    sx={{ border: "none" }}
                                  ></TableCell>
                                  <TableCell
                                    sx={{ border: "none" }}
                                  ></TableCell>

                                  <TableCell
                                    colSpan={6}
                                    sx={{ border: "none" }}
                                  >
                                    {(data?.status !== null ||
                                      initialWeek == submitted) &&
                                    data?.status !== "resubmission_required" ? (
                                      ""
                                    ) : (
                                      <Button
                                        sx={{
                                          bgcolor: "rgba(231, 234, 243, .4)",
                                          textTransform: "none",
                                          "&:hover": {
                                            backgroundColor: "#6d4a96",
                                            color: "white",
                                          },
                                        }}
                                        startIcon={
                                          <Add
                                            sx={{
                                              width: "0.8rem",
                                            }}
                                          />
                                        }
                                        variant="text"
                                        onClick={() =>
                                          handleAddShift(
                                            outerIndex,
                                            dayData.date
                                          )
                                        }
                                      >
                                        Add
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            sx={{
                              color: "text.or_color",
                              borderBottom:
                                " .0625rem solid rgba(231, 234, 243, .9)",
                            }}
                          >
                            {formatDate(dayData.date)}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.or_color",
                              borderBottom:
                                " .0625rem solid rgba(231, 234, 243, .9)",
                            }}
                          >
                            {abbreviateDays(dayData.day)}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.or_color",
                              borderBottom:
                                " .0625rem solid rgba(231, 234, 243, .9)",
                            }}
                            colSpan={9}
                          >
                            {(data?.status !== null ||
                              initialWeek == submitted) &&
                            data?.status !== "resubmission_required"
                              ? ""
                              : !isFutureDate(dayData.date) && (
                                  <Button
                                    sx={{
                                      bgcolor: "rgba(231, 234, 243, .4)",
                                      textTransform: "none",
                                      "&:hover": {
                                        backgroundColor: "#6d4a96",
                                        color: "white",
                                      },
                                    }}
                                    startIcon={<Add sx={{ width: "0.8rem" }} />}
                                    variant="text"
                                    onClick={() =>
                                      handleAddShift(outerIndex, dayData.date)
                                    }
                                  >
                                    Add
                                  </Button>
                                )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",

            justifyContent: "right",
            my: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "50%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* {formatTotalHours(calculateTotalHours) == "NaN:NaN" ? (
              ""
            ) : (
            )} */}
            <CustomTypographyBold
              weight={400}
              fontSize={"0.85rem"}
              color={"text.or_color"}
              lineHeight={1.5}
            >
              Weekly totals hours:
            </CustomTypographyBold>
            {isLoading ? (
              <Skeleton width={40} />
            ) : (
              <CustomTypographyBold
                weight={600}
                fontSize={"0.875rem"}
                color={"text.black"}
              >
                {/* {formatTotalHours(calculateTotalHours) == "NaN:NaN"
                ? ""
                :
              } */}
                {formatTotalHours(calculateTotalHours)}
              </CustomTypographyBold>
            )}
          </Box>
        </Box>

        <CustomTypographyBold
          weight={400}
          fontSize={"0.75rem"}
          color={"text.or_color"}
        >
          © 2024 SHG Helthcare.
        </CustomTypographyBold>
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          gap: 1.5,
          ml: 1,
          width: "100%",
        }}
      >
        <PdfButton>
          <Button
            size="small"
            variant="text"
            sx={{
              textTransform: "capitalize",
              color: "text.or_color",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.1)",
              p: ".5125rem 1rem;",
              minWidth: 0,
              borderRadius: "5px",
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",
                bgcolor: "background.paper",
                transform: "scale(1.01)",
                color: "text.main",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <UploadFile sx={{ fontSize: "1rem", mt: -0.4, mr: 0.5 }} /> Download
            PDF
          </Button>
        </PdfButton>

        <Button
          size="small"
          variant="contained"
          sx={{
            textTransform: "capitalize",
            color: "white",
            fontSize: "0.8125rem",
            fontWeight: 400,
            border: "1px solid rgba(99, 99, 99, 0.1)",
            p: ".5125rem 1rem;",
            minWidth: 0,
            borderRadius: "5px",

            "&:hover": {
              boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",

              transform: "scale(1.01)",
              color: "white",
            },
            "&:focus": {
              outline: "none",
            },
          }}
          onClick={actionHandler}
        >
          <Send
            sx={{ fontSize: "1rem", mt: -0.4, mr: 0.5, rotate: "-30deg" }}
          />
          Submit timesheet
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="moreAction"
      >
        <MenuItem
          disabled={
            data?.status !== null && data?.status !== "resubmission_required"
          }
          onClick={() => {
            handleAddShift(currentIndex, currentDay.date, activeShift);
            handleClose();
            setIsView(true);
          }}
          sx={{ color: "text.black", fontSize: "0.875rem" }}
        >
          <RemoveRedEye
            sx={{
              color: data?.status !== null ? "text.primary" : "text.or_color",
              fontSize: "1.2rem",
              mr: 1,
            }}
          />
          View
        </MenuItem>
        <MenuItem
          disabled={
            data?.status !== null && data?.status !== "resubmission_required"
          }
          onClick={() => {
            handleAddShift(currentIndex, currentDay.date, activeShift);
            handleClose();
          }}
          sx={{ color: "text.black", fontSize: "0.875rem" }}
        >
          <ModeEditOutlineOutlined
            sx={{
              color: data?.status !== null ? "text.primary" : "text.or_color",
              fontSize: "1.2rem",
              mr: 1,
            }}
          />
          Edit time
        </MenuItem>

        <MenuItem
          disabled={
            data?.status !== null && data?.status !== "resubmission_required"
          }
          onClick={() => {
            setShowWarning(true);
            setDeletedId(activeShift?.id);
            setWeekId(currentDay?.id);
            handleClose();
          }}
          sx={{ color: "text.black", fontSize: "0.875rem" }}
        >
          <DeleteOutlined
            sx={{
              color: data?.status !== null ? "text.primary" : "text.or_color",
              fontSize: "1.2rem",
              mr: 1,
            }}
          />
          Delete
        </MenuItem>

        {/* <MenuItem
          disabled={
            data?.status !== null && data?.status !== "resubmission_required"
          }
          onClick={() => {
            setIsAttachmentModalOpen(activeShift);
            handleClose();
          }}
          sx={{ color: "text.black", fontSize: "0.875rem" }}
        >
          <AttachFile
            sx={{
              color: data?.status !== null ? "text.primary" : "text.or_color",
              fontSize: "1.2rem",
              mr: 1,
            }}
          />
          Add expenses
        </MenuItem> */}
      </Menu>
    </Box>
  );
};

export default TimesheetTable;
