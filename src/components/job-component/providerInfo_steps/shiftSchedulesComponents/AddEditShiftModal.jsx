import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  Modal,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Close,
  CalendarTodayOutlined,
  AccessTime,
  FileUploadOutlined,
  Delete,
} from "@mui/icons-material";
import CustomTypographyBold from "../../../CustomTypographyBold";
import {
  createShiftSchedule,
  deleteShiftSchedule,
  fetchShiftSchedules,
  updateShiftSchedule,
} from "../../../../thunkOperation/job_management/providerInfoStep";
import { daysArray } from "../../../constants/data";
import CustomOutlineBtn from "../../../button/CustomOutlineBtn";
import { DeleteConfirmModal } from "../../../handleConfirmDelete";
import { updateNewUserDataField } from "../../../../feature/jobSlice";
import { BpCheckbox } from "../../../common/CustomizeCHeckbox";

const AddEditShiftModal = ({
  modalOpen,
  handleClose,
  selectedEvent,
  darkMode,
  permissions,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { schedules, jobId } = useSelector((state) => state.shiftSchedules);

  const [isLoading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    selectedDays: [],
  });
  const [error, setError] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    days: "",
  });

  useEffect(() => {
    // dispatch(fetchShiftSchedules(params.id));
    setNewEvent({
      startDate: selectedEvent?.date,
      endDate: "",
      startTime: selectedEvent?.start_time,
      endTime: selectedEvent?.end_time,
      id: selectedEvent?.id,
      selectedDays: [],
    });
  }, [dispatch, params.id, selectedEvent]);

  const resetForm = () => {
    setNewEvent({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      id: "",
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
  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setError();
    handleClose();
  };

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

    // if (newEvent.selectedDays.length === 0) {
    //   newErrors.days = "At least one day must be selected.";
    //   hasError = true;
    // }

    if (hasError) {
      setError(newErrors);
      return;
    }
    setSaveLoading(true);
    // apiCall
    setSaveLoading(true);

    const result = await dispatch(createShiftSchedule({ newEvent, id: jobId }));
    if (createShiftSchedule.fulfilled.match(result)) {
      dispatch(
        updateNewUserDataField({ field: "shift_schedules_count", value: 1 })
      );
      setSaveLoading(false);
      handleClose();
      setNewEvent({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
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
      selectedDays: [],
    });
  };

  const handleDayChange = (event) => {
    const day = event.target.value;
    setNewEvent((prevState) => {
      const selectedDays = event.target.checked
        ? [...prevState.selectedDays, day]
        : prevState.selectedDays.filter((selectedDay) => selectedDay !== day);
      return { ...prevState, selectedDays };
    });
    setError((prevErr) => ({ ...prevErr, days: "" }));
  };

  const deleteHandler = async () => {
    handleClose();
    setLoading(true);
    const result = await dispatch(deleteShiftSchedule(selectedEvent?.id));
    if (deleteShiftSchedule.fulfilled.match(result)) {
      closeModal();
      setLoading(false);
      setSaveLoading(false);
      setNewEvent({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        selectedDays: [],
      });
    }
  };
  const deletePopupHandler = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={closeModal}
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
              {selectedEvent?.id ? "Update" : "Create"} shift schedule
            </CustomTypographyBold>
            <IconButton onClick={closeModal}>
              <Close />
            </IconButton>
          </Box>
          <Grid container style={{ marginTop: "1rem" }}>
            <Grid item xs={3} mt={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                <Typography variant="body2">
                  Start Date <span style={{ color: "red" }}>*</span>
                </Typography>
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

          {!selectedEvent?.id && (
            <Grid container style={{ marginTop: "1rem" }}>
              <Grid item xs={3} mt={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                  <Typography variant="body2">
                    End Date <span style={{ color: "red" }}>*</span>
                  </Typography>
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
          {!selectedEvent?.id && (
            <Grid sx={{ mt: 2 }} container>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                  <Typography variant="body2">
                    Working Days  
                  </Typography>
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
                sx={{  ml: 2 }}
                xs={12}
                md={9}
                container
                spacing={2}
              >
                <Typography variant="caption" color="error">
                  {error?.days}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 2,fontSize:'10px' }}>
        If no days are selected, all days will be considered as working days.
      </Typography>
              </Grid>
            </Grid>
          )}

          {/* =========================================================== */}

          <Grid container>
            <Grid item xs={3} mt={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ p: 0.5, opacity: 0.7 }} />
                <Typography variant="body2">
                  Start time <span style={{ color: "red" }}>*</span>
                </Typography>
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
                <Typography variant="body2">
                  End time <span style={{ color: "red" }}>*</span>
                </Typography>
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
            {selectedEvent?.id ? (
              permissions?.includes("create job management info") ? (
                <CustomOutlineBtn
                  startIcon={<Delete sx={{ color: "red" }} />}
                  text="Delete"
                  onClick={deletePopupHandler}
                  fontWeight={400}
                  color="red"
                />
              ) : (
                ""
              )
            ) : (
              <CustomOutlineBtn
                text="Discard"
                hover={"blue"}
                onClick={closeModal}
              />
            )}

            {saveLoading ? (
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  boxShadow: "none",
                  backgroundColor: "transparent",
                  height: "2.5rem",
                  mt: 1.1,
                  minWidth: "5rem",
                  border: "1px solid rgba(231, 234, 243, .7)",
                }}
              >
                <CircularProgress size={18} sx={{}} />
              </Button>
            ) : permissions?.includes("create job management info") ? (
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  boxShadow: "none",
                  backgroundColor: "#3b82f6",

                  height: "2.5rem",
                  mt: 1.1,
                }}
                startIcon={<FileUploadOutlined />}
                onClick={selectedEvent?.id ? updateSchedule : handleSave}
              >
                {selectedEvent?.id ? "Update" : "Save"}
              </Button>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Modal>
      {/* // ============================deelete modal open on the delete buton in  update shift ======================== */}
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
    </>
  );
};

export default AddEditShiftModal;
