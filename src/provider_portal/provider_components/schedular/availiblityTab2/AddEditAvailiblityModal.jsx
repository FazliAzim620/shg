import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  Modal,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import React, { useState } from "react";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import {
  AccessTime,
  CalendarTodayOutlined,
  Close,
  FileUploadOutlined,
} from "@mui/icons-material";
import { daysArray } from "../../../../components/constants/data";
import { useSelector } from "react-redux";
import CustomOutlineBtn from "../../../../components/button/CustomOutlineBtn";
import API from "../../../../API";
import { useDispatch } from "react-redux";
import { fetchProviderAvailability } from "../../../../thunkOperation/job_management/availiblityThunk";
import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";

const AddEditAvailiblityModal = ({
  open,
  type,
  handleClose,
  Availibity,
  setAvailibity,
}) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const [saveLoading, setSaveLoading] = useState(false);
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
    // addAvailiblityData.append("provider_id", type);
    addAvailiblityData.append("selected_days", Availibity?.selected_days);
    setSaveLoading(true);
    try {
      const response = await API?.post(
        "/api/add-provider-availability",
        addAvailiblityData
      );
      const data = response?.data;
      dispatch(fetchProviderAvailability());
      //   setApiResponseYes(true);
      //   setApiResponse(data);
      if (data?.success) {
        handleCloseHandler();
      }
      setSaveLoading(false);
    } catch (error) {
      setSaveLoading(false);
      console.log("err", error);
    }
  };
  const handleTypeChange = (event, type) => {
    if (type) {
      setAvailibity({ ...Availibity, type: type });
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
        handleClose();
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

  // ==============================handleChange===============
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
  const handleCloseHandler = () => {
    handleClose();
    setError({
      from_date: "",
      to_date: "",
      start_time: "",
      end_time: "",
      days: "",
    });
  };
  return (
    <Modal
      open={open}
      onClose={handleCloseHandler}
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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          maxHeight: "98vh",
          overflow: "hidden", // Prevent the outer modal from scrolling
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 10,
            padding: "6px 0", // Ensure spacing for the header
          }}
        >
          <CustomTypographyBold color={"text.black"}>
            {Availibity?.id
              ? "Edit Record"
              : type === "available"
              ? "Add Availiblity"
              : "Add Unavailiblity"}
          </CustomTypographyBold>
          <IconButton onClick={handleCloseHandler}>
            <Close />
          </IconButton>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            overflowY: "auto", // Enable scroll for content
            flexGrow: 1, // Ensure it grows to fill available space
            maxHeight: "calc(98vh - 120px)", // Adjust height to allow space for header and footer
            paddingBottom: "56px", // Leave space for the footer
          }}
        >
          {/* Start Date */}
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
            // If editing an existing record, show type toggle
            <Grid container>
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
                      background: darkMode === "light" ? "#F6F7FA" : "#333",
                      border: "none",
                      "&.Mui-selected": {
                        backgroundColor: "#dae3ed",
                        color: "black", // Optional: change text color to white for better contrast
                      },
                    }}
                  >
                    Available
                  </ToggleButton>
                  <ToggleButton
                    value="unavailable"
                    aria-label="unavailable"
                    sx={{
                      textTransform: "initial",
                      background: darkMode === "light" ? "#F6F7FA" : "#333",
                      border: "none",
                      "&.Mui-selected": {
                        backgroundColor: "#dae3ed",
                        color: "black", // Optional: change text color to white for better contrast
                      },
                    }}
                  >
                    Unavailable
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          ) : (
            // If adding a new record, show end date
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

          {/* Working days */}
          {!Availibity?.id && (
            <Grid sx={{ mt: 2 }} container>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarTodayOutlined sx={{ p: 0.5, opacity: 0.7 }} />
                  <Typography variant="body2">
                    {type === "available"
                      ? "Availability Days"
                      : "Unavailability Days"}
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

          {/* Start Time */}
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
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
        </Box>

        {/* Fixed Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            mt: 2,
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            padding: "16px 0", // Padding for footer
            zIndex: 10,
          }}
        >
          <CustomOutlineBtn
            hover="primary.main"
            text="Discard"
            onClick={handleCloseHandler}
          />
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
              <CircularProgress size={18} />
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                boxShadow: "none",
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
  );
};

export default AddEditAvailiblityModal;
