import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Input,
  IconButton,
  Divider,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import {
  AccessTime,
  Add,
  CalendarTodayOutlined,
  Check,
  CheckBox,
  Close,
  Delete,
  Favorite,
  FavoriteBorder,
  FileUploadOutlined,
} from "@mui/icons-material";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../CustomTypographyBold";
import { CommonSelect } from "../CommonSelect";
import CustomOutlineBtn from "../../button/CustomOutlineBtn";
import CustomBadge from "../../CustomBadge";
import { useDispatch } from "react-redux";
import {
  createShiftSchedule,
  deleteShiftSchedule,
  fetchShiftSchedules,
  updateShiftSchedule,
} from "../../../thunkOperation/job_management/providerInfoStep";
import { setJobId } from "../../../feature/shiftSchedulesSlice";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
import { daysArray } from "../../constants/data";
import { formatTime } from "../../../util";
import { useParams } from "react-router-dom";
import { BpCheckbox } from "../../common/CustomizeCHeckbox";

const ShiftSchedules = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const { schedules, jobId, status } = useSelector(
    (state) => state.shiftSchedules
  );
  const [showModal, setShowModal] = useState(false);
  const { newUserData } = useSelector((state) => state.job);
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [saveLoading, setSaveLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    recurrence: "Daily",
    selectedDays: [],
  });

  // const [selectedDays, setSelectedDays] = useState([]);
  useEffect(() => {
    dispatch(fetchShiftSchedules(params?.id));
    dispatch(setJobId(params?.id));
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewEvent({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      recurrence: "Daily",
      selectedDays: [],
    });

    setError({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      days: "",
    });
  };
  const [error, setError] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    days: "",
  });
  const handleSave = async () => {
    let hasError = false;
    const newErrors = {};

    if (!newEvent.startDate) {
      newErrors.startDate = "Start Date is required.";
      hasError = true;
    }

    // else if (new Date(newEvent.startDate) <= new Date()) {
    //   newErrors.startDate = "Start Date must be a future date.";
    //   hasError = true;
    // }

    if (!newEvent.endDate) {
      newErrors.endDate = "End Date is required.";
      hasError = true;
    }
    // else if (new Date(newEvent.startDate) >= new Date(newEvent.endDate)) {
    //   newErrors.endDate = "End Date must be after Start Date.";
    //   hasError = true;
    // }

    if (!newEvent.startTime) {
      newErrors.startTime = "Start Time is required.";
      hasError = true;
    }

    if (!newEvent.endTime) {
      newErrors.endTime = "End Time is required.";
      hasError = true;
    }

    if (newEvent.selectedDays.length === 0) {
      newErrors.days = "At least one day must be selected.";
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }
    setSaveLoading(true);
    // apiCall
    setSaveLoading(true);
    const result = await dispatch(createShiftSchedule({ newEvent, id: jobId }));
    if (createShiftSchedule.fulfilled.match(result)) {
      setSaveLoading(false);
      handleClose();
      setNewEvent({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        recurrence: "Daily",
        selectedDays: [],
      });
    }
  };

  const updateSchedule = () => {
    let hasError = false;
    const newErrors = {};

    if (!newEvent.startDate) {
      newErrors.startDate = "Start Date is required.";
      hasError = true;
    }

    if (!newEvent.startTime) {
      newErrors.startTime = "Start Time is required.";
      hasError = true;
    }

    if (!newEvent.endTime) {
      newErrors.endTime = "End Time is required.";
      hasError = true;
    }

    if (newEvent?.selectedDays?.length === 0) {
      newErrors.days = "At least one day must be selected.";
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }
    setSaveLoading(true);
    dispatch(updateShiftSchedule({ newEvent, id: jobId }));
    handleClose();
    setSaveLoading(false);
    setNewEvent({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      recurrence: "Daily",
      selectedDays: [],
    });
  };
  const deleteHandler = async () => {
    setLoading(true);
    const result = await dispatch(deleteShiftSchedule(newEvent?.id));
    if (deleteShiftSchedule.fulfilled.match(result)) {
      setOpen(false);
      setShowModal(false);
      setLoading(false);
      setNewEvent({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        recurrence: "Daily",
        selectedDays: [],
      });
    }
  };
  const deletePopupHandler = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleDateChange = (date) => {
    setCurrentDate(date);
  };
  const viewHandler = (event) => {
    setNewEvent({
      startDate: event?.date || "",
      endDate: "",
      startTime: event?.start_time || "",
      endTime: event?.end_time || "",
      recurrence: "Daily",
      id: event?.id,
    });

    setOpen(true);
  };
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const day = localDate.toISOString().split("T")[0];

      // Find all events for this day
      const eventsForDay = Object.values(schedules).filter(
        (event) =>
          event.date === day || (day >= event.startDate && day <= event.endDate)
      );

      return (
        <Box
          className="thin_slider"
          sx={{
            maxHeight: "4rem",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {eventsForDay.map((event, index) => (
            <Button
              onClick={() => viewHandler(event)}
              key={index}
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                lineHeight: 1.5,
                bgcolor: "#b1f1fb",
                color: "text.black",
                borderRadius: "8px",
                p: "0.2rem 0rem",
                "&:hover": {
                  color: "blue",
                },
              }}
            >
              {formatTime(event.start_time || event.startTime)} -{" "}
              {formatTime(event.end_time || event.endTime)}
            </Button>
          ))}
        </Box>
      );
    }
  };
  // ===============selected days on chane function===============
  const handleDayChange = (event) => {
    setError((prevErr) => ({ ...prevErr, days: "" }));
    const day = event.target.value;

    if (event.target.checked) {
      setNewEvent((prevState) => ({
        ...prevState,
        selectedDays: [...prevState?.selectedDays, day],
      }));
    } else {
      setNewEvent((prevState) => ({
        ...prevState,
        selectedDays: prevState?.selectedDays?.filter(
          (selectedDay) => selectedDay !== day
        ),
      }));
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: ".75rem",
        backgroundColor: "text.paper",
        boxShadow: "none",
      }}
    >
      <CardHeader
        sx={{
          pb: 0.5,
          borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
        }}
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 1.2,
                color: "text.black",
              }}
            >
              Shift schedules
              <CustomBadge
                color={
                  schedules?.[0]?.id
                    ? "rgba(0, 201, 167)"
                    : "rgba(55, 125, 255)"
                }
                bgcolor={
                  schedules?.[0]?.id
                    ? "rgba(0, 201, 167, .1)"
                    : "rgba(55, 125, 255, .1)"
                }
                text={schedules?.[0]?.id ? "Completed" : "In progress"}
                width="90px"
                ml={6}
              />
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                boxShadow: "none",
                backgroundColor: "#3b82f6",
              }}
              startIcon={<Add />}
              onClick={handleOpen}
            >
              Create schedule
            </Button>
          </Box>
        }
      />
      <CardContent sx={{ p: 2, mt: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            sx={{ color: "#3b82f6" }}
            onClick={() => setCurrentDate(new Date())}
          >
            TODAY
          </Button>
          <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 500 }}>
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>
        <Calendar
          className={darkMode === "dark" && `custom_calendar`}
          value={currentDate}
          onChange={handleDateChange}
          tileContent={renderTileContent}
          view="month"
        />
      </CardContent>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { md: "802px" },
            maxHeight: { md: "700px" },
            overflowY: "scroll",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <CustomTypographyBold color={"text.black"}>
              {newEvent?.id ? "Update" : "Create"} shift schedule
            </CustomTypographyBold>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Grid container style={{ marginTop: "1rem" }}>
            <Grid item xs={3} mt={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                <Typography variant="body2">Start Date</Typography>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Input
                variant="standard"
                type="date"
                sx={{
                  border: error?.startDate
                    ? "1px solid #d32f2f"
                    : "1px solid rgba(231, 234, 243, .7)",
                  width: "100%",
                  p: ".6125rem 1rem",
                  borderRadius: ".3125rem",
                  bgcolor: "#f6f7fa",
                  "&:hover": {
                    bgcolor: "#fff",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  },
                }}
                disableUnderline={true}
                value={newEvent.startDate}
                onChange={(e) => {
                  setNewEvent({ ...newEvent, startDate: e.target.value });
                  setError((prevErr) => ({ ...prevErr, startDate: "" }));
                }}
              />
              <Typography variant="caption" color="error">
                {error?.startDate}
              </Typography>
            </Grid>
          </Grid>

          {!newEvent?.id && (
            <Grid container style={{ marginTop: "1rem" }}>
              <Grid item xs={3} mt={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                  <Typography variant="body2">End Date</Typography>
                </Box>
              </Grid>
              <Grid item xs={9}>
                <Input
                  variant="standard"
                  type="date"
                  sx={{
                    border: error?.endDate
                      ? "1px solid #d32f2f"
                      : `rgba(231, 234, 243, .7)`,
                    width: "100%",
                    p: ".6125rem 1rem",
                    borderRadius: ".3125rem",
                    bgcolor: "#f6f7fa",
                    "&:hover": {
                      bgcolor: "#fff",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    },
                  }}
                  disableUnderline={true}
                  value={newEvent.endDate}
                  onChange={(e) => {
                    setNewEvent({ ...newEvent, endDate: e.target.value });
                    setError((prevErr) => ({ ...prevErr, endDate: "" }));
                  }}
                />
                <Typography variant="caption" color="error">
                  {error?.endDate}
                </Typography>
              </Grid>
            </Grid>
          )}
          {/* <Grid container>
            <Grid item xs={3} mt={2}>
              <Typography variant="body2" sx={{ display: "none" }}>
                Recurrence
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
              >
                <Typography variant="body2" sx={{}}>
                  Recurrence:
                </Typography>
                <CommonSelect
                  value={newEvent.recurrence}
                  handleChange={(e) =>
                    setNewEvent({ ...newEvent, recurrence: e.target.value })
                  }
                  width="130px"
                  height={"30px"}
                  name={"providerRole"}
                  placeholder={"Select"}
                  options={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                />
              </Box>
            </Grid>
          </Grid> */}
          {/* =======================working days====================== */}
          {!newEvent?.id && (
            <Grid sx={{ mt: 2 }} container>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                  <Typography variant="body2">Working Days</Typography>
                </Box>
              </Grid>
              <Grid xs={12} md={9} container spacing={2}>
                {daysArray.map((day, index) => (
                  <Grid item xs={12} sm={1} key={index}>
                    <FormControlLabel
                      control={
                        <BpCheckbox
                          // icon={<CircleOutlinedIcon />}
                          // checkedIcon={<Check />}
                          // checked={day?.value}
                          value={day.value}
                          onChange={handleDayChange}
                        />
                      }
                      label={day.label}
                      labelPlacement="top"
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid xs={12} md={3} container spacing={2}></Grid>
              <Grid
                sx={{ mt: "0.5px", ml: 2 }}
                xs={12}
                md={9}
                container
                spacing={2}
              >
                <Typography variant="caption" color="error">
                  {error?.days}
                </Typography>
              </Grid>
            </Grid>
          )}

          {/* =========================================================== */}

          <Grid container>
            <Grid item xs={3} mt={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ p: 0.5, opacity: 0.7 }} />
                <Typography variant="body2">Start time</Typography>
              </Box>
            </Grid>
            <Grid item xs={9} mt={3}>
              <Grid container direction="column">
                <Grid item>
                  <Input
                    variant="standard"
                    type="time"
                    inputProps={{ step: 1 }}
                    sx={{
                      p: ".25rem 0.5rem",
                      borderRadius: ".3125rem",
                      bgcolor: "#f6f7fa",
                      border: error?.startTime
                        ? "1px solid #d32f2f"
                        : "1px solid rgba(231, 234, 243, .7)",
                      "&:hover": {
                        bgcolor: "#fff",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      },
                    }}
                    disableUnderline={true}
                    value={newEvent.startTime}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, startTime: e.target.value });
                      setError((prevErr) => ({ ...prevErr, startTime: "" }));
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="caption" color="error">
                    {error?.startTime}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container sx={{ mb: 5 }}>
            <Grid item xs={3} mt={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ p: 0.5, opacity: 0.7 }} />
                <Typography variant="body2">End time</Typography>
              </Box>
            </Grid>
            <Grid item xs={9} mt={3}>
              <Grid container direction="column">
                <Grid item>
                  <Input
                    variant="standard"
                    type="time"
                    inputProps={{ step: 1 }}
                    sx={{
                      p: ".25rem 0.5rem",
                      borderRadius: ".3125rem",
                      bgcolor: "#f6f7fa",
                      border: error?.endTime
                        ? "1px solid #d32f2f"
                        : "1px solid rgba(231, 234, 243, .7)",
                      "&:hover": {
                        bgcolor: "#fff",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      },
                    }}
                    disableUnderline={true}
                    value={newEvent.endTime}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, endTime: e.target.value });
                      setError((prevErr) => ({ ...prevErr, endTime: "" }));
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="caption" color="error">
                    {error?.endTime}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider
            sx={{
              borderColor:
                darkMode == "dark"
                  ? "rgba(255, 255, 255, .7"
                  : "rgba(231, 234, 243, .7)",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              mt: 2,
            }}
          >
            {newEvent?.id ? (
              <CustomOutlineBtn
                startIcon={<Delete sx={{ color: "red" }} />}
                text="Delete"
                onClick={deletePopupHandler}
                fontWeight={400}
                color="red"
              />
            ) : (
              <CustomOutlineBtn
                text="Discard"
                hover={"text.btn_blue"}
                onClick={handleClose}
              />
            )}

            {saveLoading ? (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "transparent",
                  textTransform: "inherit",
                  height: "2.5rem",
                  mt: 1.1,
                  minWidth: "5rem",
                  border: "1px solid rgba(231, 234, 243, .7)",
                }}
              >
                <CircularProgress size={18} sx={{}} />
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "#3b82f6",
                  textTransform: "inherit",
                  height: "2.5rem",
                  mt: 1.1,
                }}
                startIcon={<FileUploadOutlined />}
                onClick={newEvent?.id ? updateSchedule : handleSave}
              >
                {newEvent?.id ? "Update" : "Save"}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={deleteHandler}
        isLoading={isLoading}
        itemName={"Schedule"}
        title={"Delete"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to delete this Schedule?
            <br /> This action cannot be undone.
          </Typography>
        }
      />
    </Card>
  );
};

export default ShiftSchedules;
