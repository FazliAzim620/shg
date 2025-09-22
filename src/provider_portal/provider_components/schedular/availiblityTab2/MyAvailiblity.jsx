import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Modal,
  Grid,
  Input,
  IconButton,
  Divider,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  AccessTime,
  Add,
  CalendarTodayOutlined,
  Close,
  Delete,
  FileUploadOutlined,
} from "@mui/icons-material";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";

import CustomOutlineBtn from "../../../../components/button/CustomOutlineBtn";
import CustomBadge from "../../../../components/CustomBadge";
import { useDispatch } from "react-redux";
import {
  createShiftSchedule,
  deleteShiftSchedule,
  fetchShiftSchedules,
  updateShiftSchedule,
} from "../../../../thunkOperation/job_management/providerInfoStep";
import { setJobId } from "../../../../feature/shiftSchedulesSlice";
import { DeleteConfirmModal } from "../../../../components/handleConfirmDelete";
import { daysArray, flxCntrSx } from "../../../../components/constants/data";
import { formatTime } from "../../../../util";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import API from "../../../../API";
import AvailabilityDetailModal from "./AvailabilityDetailModal";
import { fetchProviderAvailability } from "../../../../thunkOperation/job_management/availiblityThunk";
import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";
const MyAvailiblity = ({ admin, provider_id }) => {
  const [type, setType] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openAddMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const [showModal, setShowModal] = useState(false);
  const { newUserData } = useSelector((state) => state.job);
  const [open, setOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null); // Stores selected availability data
  const [openAvailiblityDetail, setOpenAvailiblityDetail] = useState(false); // Modal state
  const [isLoading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [saveLoading, setSaveLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility
  const [Availibity, setAvailibity] = useState({
    from_date: "",
    to_date: "",
    start_time: "",
    end_time: "",
    type,
    selected_days: [],
  });
  // ====================Drop down menu options==============
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAddMenu = () => {
    setAnchorEl(null);
  };
  const handleOptionClick = (option) => {
    setOpen(true);
    setType(option);
    handleCloseAddMenu();
  };
  const { availability, loading } = useSelector(
    (state) => state?.providerAvailability
  );
  const getAvailiblityData = availability?.data;

  useEffect(() => {
    // Dispatch the fetchProviderAvailability action when the component mounts
    if (admin) dispatch(fetchProviderAvailability(provider_id));
    else dispatch(fetchProviderAvailability());
  }, [dispatch]);
  // ===============styling to the right left btns===================
  const rightLeftStyling = {
    cursor: "pointer",
    color: "#71869d",
    fontSize: "2.2rem",
    p: 1,
    "&:hover": {
      borderRadius: "100%",
      color: "#6d4a96",
      backgroundColor: "rgba(55, 125, 255, .1)",
    },
  };
  // Handle going to the previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1); // Go to the previous month
    setCurrentDate(prevMonth);
  };

  // Handle going to the next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1); // Go to the next month
    setCurrentDate(nextMonth);
  };

  const handleClose = () => {
    setOpen(false);
    setAvailibity({
      from_date: "",
      to_date: "",
      start_time: "",
      end_time: "",
      selected_days: [],
    });

    setError({
      from_date: "",
      to_date: "",
      start_time: "",
      end_time: "",
      days: "",
    });
  };
  const [error, setError] = useState({
    from_date: "",
    to_date: "",
    start_time: "",
    end_time: "",
    days: "",
  });

  const handleSave = async () => {
    let hasError = false;
    const newErrors = {};

    if (!Availibity.from_date) {
      newErrors.from_date = "Start Date is required.";
      hasError = true;
    }

    // else if (new Date(Availibity.from_date) <= new Date()) {
    //   newErrors.from_date = "Start Date must be a future date.";
    //   hasError = true;
    // }

    if (!Availibity.to_date) {
      newErrors.to_date = "End Date is required.";
      hasError = true;
    }

    if (!Availibity.start_time) {
      newErrors.start_time = "Start Time is required.";
      hasError = true;
    }

    if (!Availibity.end_time) {
      newErrors.end_time = "End Time is required.";
      hasError = true;
    }

    if (Availibity.selected_days.length === 0) {
      newErrors.days = "At least one day must be selected.";
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }
    // =========================add availiblity========================
    const addAvailiblityData = new FormData();
    addAvailiblityData.append("from_date", Availibity?.from_date);
    addAvailiblityData.append("to_date", Availibity?.to_date);
    addAvailiblityData.append("start_time", Availibity?.start_time);
    addAvailiblityData.append("end_time", Availibity?.end_time);
    addAvailiblityData.append("type", type);
    addAvailiblityData.append("selected_days", Availibity?.selected_days);
    setSaveLoading(true);

    try {
      const response = await API?.post(
        "/api/add-provider-availability",
        addAvailiblityData
      );
      const data = response?.data;
      dispatch(fetchProviderAvailability());
      setApiResponseYes(true);
      setApiResponse(data);
      if (data?.success) {
        handleClose();
      }
      setSaveLoading(false);
      setShowAlert(true); // Show alert on success
    } catch (error) {
      setSaveLoading(false);
      console.log("err", error);
    }
  };
  const updateSchedule = async () => {
    let hasError = false;
    const newErrors = {};

    if (!Availibity.from_date) {
      newErrors.from_date = "Start Date is required.";
      hasError = true;
    }

    if (!Availibity.start_time) {
      newErrors.start_time = "Start Time is required.";
      hasError = true;
    }

    if (!Availibity.end_time) {
      newErrors.end_time = "End Time is required.";
      hasError = true;
    }

    // if (Availibity?.selected_days?.length === 0) {
    //   newErrors.days = "At least one day must be selected.";
    //   hasError = true;
    // }

    if (hasError) {
      setError(newErrors);
      return;
    }
    setSaveLoading(true);
    const obj = {
      date: Availibity?.from_date,
      start_time: Availibity?.start_time,
      end_time: Availibity?.end_time,
      id: Availibity?.id,
      type: Availibity?.type,
    };
    try {
      const resp = await API.post(`/api/update-provider-availability`, obj);
      if (resp?.data?.success) {
        setSaveLoading(false);
        setOpen(false);
        dispatch(fetchProviderAvailability());
        setAvailibity({
          from_date: "",
          to_date: "",
          start_time: "",
          end_time: "",
          selected_days: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteHandler = async () => {
    try {
      setLoading(true);
      const resp = await API.delete(
        `/api/delete-provider-availability/${selectedAvailability?.id}`
      );
      if (resp?.data?.success) {
        setLoading(false);
        setShowModal(false);
        setSelectedAvailability(null);
        setPopoverAnchorEl(null);
        // setOpenAvailiblityDetail(false);
        dispatch(fetchProviderAvailability());
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deletePopupHandler = () => {
    // setPopoverAnchorEl(null);
    setShowModal(true);
  };
  const editHandler = () => {
    // setOpenAvailiblityDetail(false);
    setPopoverAnchorEl(null);

    setOpen(true);
    setAvailibity({
      id: selectedAvailability?.id,
      from_date: selectedAvailability?.date,
      start_time: selectedAvailability?.start_time,
      end_time: selectedAvailability?.end_time,
      type: selectedAvailability?.type,
      // selected_days: [],
    });
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  // Handle date click event
  const handleTileClick = (event, date) => {
    const availabilityForDate = getAvailiblityData.find(
      (item) => item.date === date?.date
    );
    if (availabilityForDate) {
      setSelectedAvailability(availabilityForDate);
      // setOpenAvailiblityDetail(true); // Open the availability detail modal
      setPopoverAnchorEl(event.currentTarget); // Set the anchor element for the popover
    }
  };
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const day = localDate.toISOString().split("T")[0];
      // Find all events for this day
      const eventsForDay =
        getAvailiblityData &&
        Object?.values(getAvailiblityData)?.filter(
          (event) =>
            event.date === day ||
            (day >= event.startDate && day <= event.endDate)
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
          {eventsForDay?.map((selectedEvent, index) => (
            <Button
              onClick={(event) => handleTileClick(event, selectedEvent)} // Pass the event correctly
              key={index}
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                lineHeight: 1.5,
                bgcolor:
                  selectedEvent?.type === "available" ? "#b1f1fb" : "#FDEEF2",
                color: "text.black",
                borderRadius: "3px",
                p: "0.2rem 0rem",
                textTransform: "capitalize",
              }}
            >
              {selectedEvent?.type === "available"
                ? "Available"
                : "Unavailable"}
            </Button>
          ))}
        </Box>
      );
    }
  };

  // ===============selected days on change function===============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailibity((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset the error for the corresponding field
    setError((prevErr) => ({ ...prevErr, [name]: "" }));
  };

  // ===============selected days on change function===============
  const handleDayChange = (e) => {
    const { value } = e.target;
    setAvailibity((prevState) => {
      const selectedDays = prevState.selected_days.includes(value)
        ? prevState.selected_days.filter((day) => day !== value)
        : [...prevState.selected_days, value];

      return {
        ...prevState,
        selected_days: selectedDays,
      };
    });

    // Reset the days error
    setError((prevErr) => ({ ...prevErr, days: "" }));
  };

  const handleTypeChange = (event, type) => {
    if (type) {
      setAvailibity({ ...Availibity, type: type });
    }
  };
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null); // For Popover

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "event-availiblity-popover" : undefined;

  return (
    <>
      {/* drop down for avaliblity and unaviliblity here */}
      {showAlert &&
        apiResponseYes &&
        (apiResponse?.error ? (
          <Alert severity="error" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ) : (
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ))}
      <Box
        sx={{ mt: 4, mx: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ ...flxCntrSx, mb: 4 }}>
          <Tooltip title="Previous Month" placement="top" arrow>
            <ChevronLeftIcon
              sx={rightLeftStyling}
              onClick={goToPreviousMonth}
            />
          </Tooltip>
          <Tooltip title="Next Month" placement="top" arrow>
            <ChevronRightIcon sx={rightLeftStyling} onClick={goToNextMonth} />
          </Tooltip>

          <Typography
            variant="h6"
            sx={{
              mx: 2,
              fontWeight: 600,
              lineHeight: 1.2,
              color: darkMode == "light" ? "#1e2022" : "text.main",
              fontSize: "1rem",
            }}
          >
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(currentDate)}
          </Typography>
        </Box>

        {!admin && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ExpandMoreIcon />}
              onClick={handleClick}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AddIcon />
              <Typography variant="body2">Add</Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openAddMenu}
              onClose={handleCloseAddMenu}
              PaperProps={{
                sx: {
                  width: 150,
                },
              }}
            >
              <MenuItem onClick={() => handleOptionClick("available")}>
                Availability
              </MenuItem>
              <MenuItem onClick={() => handleOptionClick("unavailable")}>
                Unavailability
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      <Card
        sx={{
          mb: 2,
          borderRadius: ".75rem",
          backgroundColor: "text.paper",
          boxShadow: "none",
          mx: 2,
        }}
      >
        <CardContent sx={{ p: 2, mt: 0.5 }}>
          <Calendar
            className={darkMode === "dark" && `custom_calendar`}
            value={currentDate}
            onChange={handleDateChange}
            tileContent={renderTileContent}
            view="month"
            showNavigation={false}
            onActiveStartDateChange={({ activeStartDate }) =>
              setCurrentDate(activeStartDate)
            }
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
                {type === "available" ? "Add Availiblity" : "Add Unavailibity"}
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
                  name="from_date"
                  sx={{
                    border: error?.from_date
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
                  value={Availibity.from_date}
                  onChange={handleChange}
                />

                <Typography variant="caption" color="error">
                  {error?.from_date}
                </Typography>
              </Grid>
            </Grid>

            {Availibity?.id ? (
              <Grid container style={{}}>
                <Grid item xs={3} mt={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                    <Typography variant="body2">Type</Typography>
                  </Box>
                </Grid>
                <Grid item xs={9} sx={{ mt: 1.5 }}>
                  <ToggleButtonGroup
                    value={Availibity?.type}
                    exclusive
                    onChange={handleTypeChange}
                    aria-label="type"
                    fullWidth
                    sx={{ display: "flex", gap: 2 }}
                  >
                    <ToggleButton
                      value="available"
                      aria-label="available"
                      sx={{
                        textTransform: "initial",
                        background: darkMode == "light" ? "#F6F7FA" : "#333",
                        border: "none",
                      }}
                    >
                      Available
                    </ToggleButton>
                    <ToggleButton
                      sx={{
                        textTransform: "initial",
                        background: darkMode == "light" ? "#F6F7FA" : "#333",
                        border: "none",
                      }}
                      value="unavailable"
                      aria-label="unavailable"
                    >
                      Un available
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            ) : (
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
                    name="to_date"
                    sx={{
                      border: error?.to_date
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
                    value={Availibity.to_date}
                    onChange={handleChange}
                  />

                  <Typography variant="caption" color="error">
                    {error?.to_date}
                  </Typography>
                </Grid>
              </Grid>
            )}

            {/* =======================working days====================== */}
            {!Availibity?.id && (
              <Grid sx={{ mt: 2 }} container>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                    <Typography variant="body2">
                      {type === "available"
                        ? "Availibity Days"
                        : "Unavailibity Days"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={12} md={9} container spacing={2}>
                  {daysArray.map((day, index) => (
                    <Grid item xs={12} sm={1} key={index}>
                      <FormControlLabel
                        control={
                          <BpCheckbox
                            value={day.value}
                            checked={Availibity?.selected_days?.includes(
                              day.value
                            )}
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
                      name="start_time"
                      inputProps={{ step: 1 }}
                      sx={{
                        p: ".25rem 0.5rem",
                        borderRadius: ".3125rem",
                        bgcolor: "#f6f7fa",
                        border: error?.start_time
                          ? "1px solid #d32f2f"
                          : "1px solid rgba(231, 234, 243, .7)",
                        "&:hover": {
                          bgcolor: "#fff",
                          boxShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                        },
                      }}
                      disableUnderline={true}
                      value={Availibity.start_time}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="error">
                      {error?.start_time}
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
                        border: error?.end_time
                          ? "1px solid #d32f2f"
                          : "1px solid rgba(231, 234, 243, .7)",
                        "&:hover": {
                          bgcolor: "#fff",
                          boxShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                        },
                      }}
                      disableUnderline={true}
                      value={Availibity.end_time}
                      onChange={(e) => {
                        setAvailibity({
                          ...Availibity,
                          end_time: e.target.value,
                        });
                        setError((prevErr) => ({ ...prevErr, end_time: "" }));
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="error">
                      {error?.end_time}
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
              <CustomOutlineBtn text="Discard" onClick={handleClose} />

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
                  <CircularProgress size={18} />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    boxShadow: "none",
                    textTransform: "inherit",
                    height: "2.5rem",
                    mt: 1.1,
                  }}
                  startIcon={<FileUploadOutlined />}
                  onClick={Availibity?.id ? updateSchedule : handleSave}
                >
                  {Availibity?.id ? "Update" : "Save"}
                </Button>
              )}
            </Box>
          </Box>
        </Modal>
        {/* ====================== open AvailabilityDetailModal =========================== */}
        <AvailabilityDetailModal
          admin={admin}
          // openAvailiblityDetail={openAvailiblityDetail}
          // setOpenAvailiblityDetail={setOpenAvailiblityDetail}
          // selectedAvailability={selectedAvailability}

          deletePopupHandler={deletePopupHandler}
          editHandler={editHandler}
          popoverAnchorEl={popoverAnchorEl}
          setPopoverAnchorEl={setPopoverAnchorEl}
          isPopoverOpen={isPopoverOpen}
          popoverId={popoverId}
          selectedAvailability={selectedAvailability}
        />
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
    </>
  );
};

export default MyAvailiblity;
