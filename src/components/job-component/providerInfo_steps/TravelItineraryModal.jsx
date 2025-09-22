// TravelItinerary.js
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Input,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  updateItinerary,
  addDestination,
  updateDestination,
  deleteDestination,
} from "../../../feature/travelSlice";

import {
  Close,
  AttachFile,
  RadioButtonCheckedOutlined,
  DeleteOutlineOutlined,
  Add,
} from "@mui/icons-material";
import { CommonSelect } from "../CommonSelect";
import { CommonInputField } from "../CreateJobModal";
import CustomOutlineBtn from "../../button/CustomOutlineBtn";
import CustomTypographyBold from "../../CustomTypographyBold";
import { alphabetic } from "../../../util";
import { saveTravelItinerary } from "../../../thunkOperation/job_management/providerInfoStep";
import { useParams } from "react-router-dom";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
import API from "../../../API";
import { updateNewUserDataField } from "../../../feature/jobSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: "100%", xl: "78%" },
  boxShadow: 24,
  pt: 4,
  bgcolor: "transparent",
};

export default function TravelItineraryModal({
  open,
  handleClose,
  setIsDeleted,
}) {
  const [errorAirline, setErrorAirline] = useState("");
  const [errorTicketNumber, setErrorTicketNumber] = useState("");
  const [errorFlyerNumber, setErrorFlyerNumber] = useState("");
  const [ticketNumberErrors, setTicketNumberErrors] = useState([]);
  const [fromErrors, setFromErrors] = useState([]);
  const [toErrors, setToErrors] = useState([]);
  const [departureTimeErrors, setDepartureTimeErrors] = useState([]);
  const [arrivalTimeErrors, setArrivalTimeErrors] = useState([]);

  //-------------------clear all errors-------------------
  const clearAllErrors = () => {
    handleClose();
    setErrorAirline("");
    setErrorTicketNumber("");
    setErrorFlyerNumber("");
    setTicketNumberErrors([]);
    setFromErrors([]);
    setToErrors([]);
    setDepartureTimeErrors([]);
    setArrivalTimeErrors([]);
  };
  const params = useParams();
  const { newUserData } = useSelector((state) => state.job);
  const [deleteId, setDeleteId] = useState(null);
  const [deletedIndex, setDeletedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [airlines, setAirLines] = useState([]);
  const [airPorts, setAirPorts] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { itinerary, status } = useSelector((state) => state.travel);
  const showWarningHandler = (id) => {
    setShowWarning(true);
    setDeleteId(id);
  };
  const deleteHandler = async () => {
    setIsLoading(true);
    if (!deleteId || deleteId === null) {
      dispatch(deleteDestination({ index: deletedIndex }));
      setShowWarning(false);
      setIsLoading(false);
    } else {
      try {
        const resp = await API.delete(`api/delete-job-destination/${deleteId}`);
        if (resp?.data?.success) {
          setIsLoading(false);
          setShowWarning(false);
          dispatch(deleteDestination({ index: deletedIndex }));
          dispatch(
            updateNewUserDataField({
              field: "itinerary_count",
              value: 1,
            })
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };
  // ============= arrival and departure time vaidation handling ================
  const handleDepartureTimeChange = (index, value) => {
    // Update the departure time in the itinerary
    dispatch(updateDestination({ index, data: { departure_time: value } }));

    // Clear the error for the specific index
    const updatedErrors = [...departureTimeErrors];
    updatedErrors[index] = "";
    setDepartureTimeErrors(updatedErrors);
  };

  const handleArrivalTimeChange = (index, value) => {
    // Update the arrival time in the itinerary
    dispatch(updateDestination({ index, data: { arrival_time: value } }));
    // Clear the error for the specific index
    const updatedErrors = [...arrivalTimeErrors];
    updatedErrors[index] = "";
    setArrivalTimeErrors(updatedErrors);
  };

  // ============= handleSave ================
  const handleSave = async () => {
    // Validate the main fields
    let isValid = true;
    if (!itinerary?.airline) {
      setErrorAirline("Airline is required!");
      isValid = false;
    }
    if (!itinerary?.ticket_number) {
      setErrorTicketNumber("Ticket number is required!");
      isValid = false;
    }
    if (!itinerary?.flyer_number) {
      setErrorFlyerNumber("Flyer number is required!");
      isValid = false;
    }

    // Initialize arrays for errors
    const updatedTicketNumberErrors = [...ticketNumberErrors];
    const updatedFromErrors = [...fromErrors];
    const updatedToErrors = [...toErrors];
    const updatedDepartureTimeErrors = [...departureTimeErrors];
    const updatedArrivalTimeErrors = [...arrivalTimeErrors];

    // Validate ticket numbers, from, to, arrival, and departure times
    itinerary.details.forEach((destination, idx) => {
      if (!destination.flight_number) {
        updatedTicketNumberErrors[idx] = "Ticket number is required!";
        isValid = false;
      } else {
        updatedTicketNumberErrors[idx] = "";
      }

      if (!destination.flight_from) {
        updatedFromErrors[idx] = "Departure location is required!";
        isValid = false;
      } else {
        updatedFromErrors[idx] = "";
      }

      if (!destination.flight_to) {
        updatedToErrors[idx] = "Arrival location is required!";
        isValid = false;
      } else {
        updatedToErrors[idx] = "";
      }

      if (!destination.departure_time) {
        updatedDepartureTimeErrors[idx] = "Departure time is required!";
        isValid = false;
      } else if (
        destination.arrival_time &&
        destination.arrival_time < destination.departure_time
      ) {
        updatedDepartureTimeErrors[idx] =
          "Departure time must be before arrival time!";
        isValid = false;
      } else {
        updatedDepartureTimeErrors[idx] = "";
      }

      if (!destination.arrival_time) {
        updatedArrivalTimeErrors[idx] = "Arrival time is required!";
        isValid = false;
      } else {
        updatedArrivalTimeErrors[idx] = "";
      }
    });
    setTicketNumberErrors(updatedTicketNumberErrors);
    setFromErrors(updatedFromErrors);
    setToErrors(updatedToErrors);
    setDepartureTimeErrors(updatedDepartureTimeErrors);
    setArrivalTimeErrors(updatedArrivalTimeErrors);
    if (!isValid) return;
    // Proceed to save the itinerary
    const result = await dispatch(saveTravelItinerary(itinerary));
    if (saveTravelItinerary.fulfilled.match(result)) {
      dispatch(
        updateNewUserDataField({
          field: "itinerary_count",
          value: 1,
        })
      );
      if (itinerary?.isNewAttachmentUpload) {
        setIsDeleted(false);
      }
      clearAllErrors();
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      dispatch(updateItinerary({ attachment: e.target.files[0] }));
    }
  };
  const closeModal = () => {
    setIsLoading(false);
    setShowWarning(false);
  };
  const getAirLines = async () => {
    try {
      const resp = await API.get(`/api/get-airlines`);
      if (resp?.data?.success) {
        setAirLines(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAirPorts = async () => {
    try {
      const resp = await API.get(`/api/get-airports`);
      if (resp?.data?.success) {
        setAirPorts(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAirLines();
    getAirPorts();
    dispatch(updateItinerary({ job_id: params?.id }));
  }, [open]);
  const airlinesMaped = airlines?.map((option) => ({
    value: option?.name,
    label: option?.name,
  }));
  const airPortsMaped = airPorts?.map((option) => ({
    value: option?.name,
    label: option?.name,
  }));
  return (
    <>
      <Modal open={open} onClose={clearAllErrors}>
        <Box sx={style}>
          <Box
            sx={{
              borderRadius: "10px",
              bgcolor: "background.paper",
              p: "2rem",
              width: { xs: "95vw", md: "auto" },
              m: { xs: "0 auto" },
              mb: { md: 3 },
              maxHeight: "95vh",
              overflowY: { xs: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "text.black",
                  fontSize: { xs: "16px", md: "auto" },
                  fontWeight: { md: 600 },
                }}
              >
                <span style={{ color: "gray", fontWeight: 400 }}> + </span> Add
                travel itinerary
              </Typography>
              <Close onClick={clearAllErrors} sx={{ cursor: "pointer" }} />
            </Box>
            {
              <Grid container spacing={2} style={{ marginTop: "1rem" }}>
                <Grid item xs={12} mb={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2"> Attach itinerary </Typography>

                    {/* {!itinerary?.id && ( */}
                    <Button
                      variant="text"
                      component="label"
                      sx={{
                        textTransform: "capitalize",
                        color: itinerary?.attachment?.name
                          ? "text.form_input"
                          : "text.primary",
                        fontSize: "0.8125rem",
                        fontWeight: 400,
                        border: "1px solid rgba(99, 99, 99, 0.1)",
                        padding: "8px 16px",
                        minWidth: 0,
                        borderRadius: ".3125rem",
                        bgcolor: "background.paper",
                        "&:hover": {
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          bgcolor: "background.paper",
                          transform: "scale(1.01)",
                          color: "#007BFF",
                        },
                      }}
                      startIcon={<AttachFile />}
                    >
                      {itinerary?.attachment?.name
                        ? itinerary?.attachment?.name
                        : "Choose file"}
                      <input
                        type="file"
                        hidden
                        onChange={handleChange}
                        accept=".doc,.docx,.pdf"
                        ref={fileInputRef}
                      />
                    </Button>
                    {/* )} */}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ pb: 1 }}>
                    Airline
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                  <CommonSelect
                    height={"2.6rem"}
                    value={itinerary.airline}
                    handleChange={(e) => {
                      dispatch(updateItinerary({ airline: e.target.value }));
                      setErrorAirline("");
                    }}
                    name={"airline"}
                    placeholder={"Select an airline"}
                    options={airlinesMaped}
                    error={errorAirline ? true : false}
                  />
                  <Typography variant="caption" color="error">
                    {errorAirline}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ pb: 1 }}>
                    Airline
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errorAirline ? true : false}
                    name={"airline"}
                    placeholder="e.g., Emirates"
                    value={itinerary.airline}
                    onChange={(e) => {
                      dispatch(updateItinerary({ airline: e.target.value }));
                      setErrorAirline("");
                    }}
                    type="text"
                  />
                  <Typography variant="caption" color="error">
                    {errorAirline}
                  </Typography>
                </Grid> */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ pb: 1 }}>
                    Ticket number{" "}
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errorTicketNumber ? true : false}
                    name={"itinerary"}
                    placeholder="e.g., ED38784"
                    value={itinerary.ticket_number}
                    onChange={(e) => {
                      dispatch(
                        updateItinerary({ ticket_number: e.target.value })
                      );
                      setErrorTicketNumber("");
                    }}
                    type="text"
                  />
                  <Typography variant="caption" color="error">
                    {errorTicketNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" pb={1}>
                    Frequent flyer number{" "}
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errorFlyerNumber ? true : false}
                    name={"Frequent flyer number"}
                    placeholder="e.g., E25842"
                    value={itinerary.flyer_number}
                    onChange={(e) => {
                      dispatch(
                        updateItinerary({ flyer_number: e.target.value })
                      );
                      setErrorFlyerNumber("");
                    }}
                    type="text"
                  />
                  <Typography variant="caption" color="error">
                    {errorFlyerNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" pb={1}>
                    Booking number
                  </Typography>
                  <CommonInputField
                    height={"2.6rem"}
                    name={"Frequent flyer number"}
                    placeholder="e.g., EBN2546"
                    value={itinerary.booking_number}
                    onChange={(e) =>
                      dispatch(
                        updateItinerary({ booking_number: e.target.value })
                      )
                    }
                    type="text"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2">Trip Type</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomOutlineBtn
                      mr={"0px"}
                      width={"70%"}
                      onClick={() =>
                        dispatch(updateItinerary({ trip_type: "round" }))
                      }
                      startIcon={
                        <RadioButtonCheckedOutlined
                          sx={{
                            color:
                              itinerary.trip_type === "round"
                                ? "text.link"
                                : "text.primary",
                          }}
                        />
                      }
                      text={"Round Trip"}
                      fontWeight={400}
                    />
                    <CustomOutlineBtn
                      mr={"0px"}
                      width={"50%"}
                      onClick={() =>
                        dispatch(updateItinerary({ trip_type: "one_way" }))
                      }
                      startIcon={
                        <RadioButtonCheckedOutlined
                          sx={{
                            color:
                              itinerary.trip_type === "one_way"
                                ? "text.link"
                                : "text.primary",
                          }}
                        />
                      }
                      text={"One way"}
                      fontWeight={400}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2">Total fare amount</Typography>
                  <Box sx={{ mt: 1.1 }}>
                    <CommonInputField
                      height={"2.6rem"}
                      name={"Frequent flyer number"}
                      value={
                        itinerary.total_fare_amount
                          ? itinerary.total_fare_amount
                          : null
                      }
                      onChange={(e) =>
                        dispatch(
                          updateItinerary({
                            total_fare_amount: parseFloat(e.target.value),
                          })
                        )
                      }
                      type="text"
                    />
                  </Box>
                </Grid>
              </Grid>
            }
            <Grid
              container
              mt={4}
              sx={{
                bgcolor: "background.page_bg",
                p: 2,
                color: "text.black",
                display: { xs: "none", md: "flex" },
              }}
            >
              <Grid item xs={6} md={2} sx={{}}>
                <CustomTypographyBold weight={500}>Flight</CustomTypographyBold>
              </Grid>
              <Grid item xs={6} md={3} sx={{}}>
                <CustomTypographyBold weight={500}>From</CustomTypographyBold>
              </Grid>
              <Grid item xs={6} md={3} sx={{}}>
                <CustomTypographyBold weight={500}>to</CustomTypographyBold>
              </Grid>
              <Grid item xs={6} md={2} sx={{}}>
                <CustomTypographyBold weight={500}>
                  Aircraft
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={6} md={2} sx={{}}>
                <CustomTypographyBold weight={500}>
                  Class/status
                </CustomTypographyBold>
              </Grid>
            </Grid>
            {itinerary?.details?.map((destination, index) => (
              <Box
                key={index}
                mt={4}
                sx={{
                  borderBottom:
                    itinerary?.details?.length > 1 && "1px solid #b0b0b0",
                  pb: 2,
                }}
              >
                <Box sx={{ textAlign: "end" }}>
                  {/* <Typography variant="h6" gutterBottom>
                    Destination {index + 1}
                  </Typography> */}
                  {itinerary?.details?.length > 1 && (
                    // <IconButton
                    //   onClick={() => {
                    //     setDeletedIndex(index);
                    //     showWarningHandler(destination?.id);
                    //   }}
                    //   sx={{
                    //     fontSize: "1rem",
                    //     color: "gray",
                    //     "&:hover": {
                    //       color: "text.error",
                    //       bgcolor: "none",
                    //     },
                    //   }}
                    // >
                    //   <DeleteOutlineOutlined
                    //     sx={{
                    //       width: 20,
                    //     }}
                    //   />
                    //   Delete
                    // </IconButton>
                    <Button
                      startIcon={
                        <DeleteOutlineOutlined
                          sx={{
                            width: 20,
                          }}
                        />
                      }
                      onClick={() => {
                        setDeletedIndex(index);
                        showWarningHandler(destination?.id);
                      }}
                      sx={{
                        mr: 2,
                        fontSize: "1rem",
                        color: "text.form_input",
                        textTransform: "none",
                        "&:hover": {
                          color: "text.error",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={2} sx={{}}>
                    <Typography
                      variant="body2"
                      pb={1}
                      // sx={{ display: { md: "none" } }}
                    >
                      Flight number <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <CommonInputField
                      height={"2.6rem"}
                      error={ticketNumberErrors[index] ? true : false}
                      name={"flight_number"}
                      placeholder="e.g.AHD57542"
                      value={destination.flight_number}
                      onChange={(e) => {
                        dispatch(
                          updateDestination({
                            index,
                            data: { flight_number: e.target.value },
                          })
                        );
                        const updatedErrors = [...ticketNumberErrors];
                        updatedErrors[index] = "";
                        setTicketNumberErrors(updatedErrors);
                      }}
                      type="text"
                    />
                    <Typography variant="caption" color="error" mt={-1.5}>
                      {ticketNumberErrors[index]}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={3}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ pb: 1 }}>
                        Departure Location
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <CommonSelect
                        height={"2.6rem"}
                        name={"itinerary"}
                        placeholder="e.g., UK"
                        value={destination.flight_from}
                        handleChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { flight_from: e.target.value },
                            })
                          );
                          const updatedErrors = [...fromErrors];
                          updatedErrors[index] = "";
                          setFromErrors(updatedErrors);
                        }}
                        options={airPortsMaped}
                        error={fromErrors[index] ? true : false}
                      />

                      {/* <CommonInputField
                        height={"2.6rem"}
                        error={fromErrors[index] ? true : false}
                        name={"itinerary"}
                        placeholder="e.g., UK"
                        value={destination.flight_from}
                        onChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { flight_from: e.target.value },
                            })
                          )
                          const updatedErrors = [...fromErrors];
                          updatedErrors[index] = "";
                          setFromErrors(updatedErrors);
                        }}
                        type="text"
                      />*/}
                    </Box>
                    <Typography variant="caption" color="error" mt={-1.5}>
                      {fromErrors[index]}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ pb: 1 }}>
                        Departure date and time{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Input
                        variant="standard"
                        type="datetime-local"
                        sx={{
                          border: departureTimeErrors[index]
                            ? ".0625rem solid #d32f2f"
                            : ".0625rem solid rgba(231, 234, 243, .7)",
                          width: "100%",
                          p: ".6125rem 1rem",
                          height: "2.6rem",
                          borderRadius: ".3125rem",
                          bgcolor: "#f6f7fa",
                          "&:hover": {
                            bgcolor: "#fff",
                            boxShadow:
                              "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                          },
                        }}
                        disableUnderline={true}
                        value={destination.departure_time}
                        onChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { departure_time: e.target.value },
                            })
                          );
                          const updatedErrors = [...departureTimeErrors];
                          updatedErrors[index] = "";
                          setDepartureTimeErrors(updatedErrors);
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="error" mt={-1.5}>
                      {departureTimeErrors[index]}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={3}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box sx={{}}>
                      <Typography variant="body2" pb={1}>
                        Arrival Location<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <CommonSelect
                        height={"2.6rem"}
                        name={"itinerary"}
                        placeholder="e.g., UK"
                        value={destination.flight_to}
                        handleChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { flight_to: e.target.value },
                            })
                          );
                          const updatedErrors = [...toErrors];
                          updatedErrors[index] = "";
                          setToErrors(updatedErrors);
                        }}
                        options={airPortsMaped}
                        error={fromErrors[index] ? true : false}
                      />

                      {/* <CommonInputField
                        height={"2.6rem"}
                        name={"itinerary"}
                        placeholder="e.g., UK"
                        error={toErrors[index] ? true : false}
                        value={destination.flight_to}
                        onChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { flight_to: e.target.value },
                            })
                          );
                          const updatedErrors = [...toErrors];
                          updatedErrors[index] = "";
                          setToErrors(updatedErrors);
                        }}
                        type="text"
                      /> */}
                      {/* <CommonSelect
                        height={"2.6rem"}
                        error={toErrors[index] ? true : false}
                        value={destination.flight_to}
                        handleChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { flight_to: e.target.value },
                            })
                          );
                          const updatedErrors = [...toErrors];
                          updatedErrors[index] = "";
                          setToErrors(updatedErrors);
                        }}
                        name={"flight_to"}
                        placeholder={"Select destination"}
                        options={[
                          { value: "dubai", label: "Dubai" },
                          { value: "london", label: "London" },
                        ]}
                      /> */}
                    </Box>

                    <Typography variant="caption" color="error" mt={-1.5}>
                      {toErrors[index]}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ pb: 1 }}>
                        Arrival date and time{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <Input
                        variant="standard"
                        type="datetime-local"
                        sx={{
                          height: "2.6rem",
                          border: arrivalTimeErrors[index]
                            ? ".0625rem solid #d32f2f"
                            : ".0625rem solid rgba(231, 234, 243, .7)",

                          width: "100%",
                          p: ".6125rem 1rem",
                          borderRadius: ".3125rem",
                          bgcolor: "#f6f7fa",
                          "&:hover": {
                            bgcolor: "#fff",
                            boxShadow:
                              "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                          },
                        }}
                        disableUnderline={true}
                        value={destination.arrival_time}
                        onChange={(e) => {
                          dispatch(
                            updateDestination({
                              index,
                              data: { arrival_time: e.target.value },
                            })
                          );
                          const updatedErrors = [...arrivalTimeErrors];
                          updatedErrors[index] = "";
                          setArrivalTimeErrors(updatedErrors);
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="error" mt={-1.5}>
                      {arrivalTimeErrors[index]}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={2} sx={{}}>
                    <Typography variant="body2" pb={1}>
                      Aircraft number
                    </Typography>
                    <CommonInputField
                      height={"2.6rem"}
                      name={"aircraft_number"}
                      placeholder="e.g.45482    "
                      value={destination.aircraft_number}
                      onChange={(e) =>
                        dispatch(
                          updateDestination({
                            index,
                            data: { aircraft_number: e.target.value },
                          })
                        )
                      }
                      type="text"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={2}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" pb={1}>
                        Status/Class
                      </Typography>
                      <CommonSelect
                        // width="110px"
                        value={destination.seat_status}
                        handleChange={(e) =>
                          dispatch(
                            updateDestination({
                              index,
                              data: { seat_status: e.target.value },
                            })
                          )
                        }
                        name={"seat_status"}
                        placeholder={"Select  "}
                        options={[
                          {
                            value: "Confirmed",
                            label: "Confirmed",
                          },
                          {
                            value: "booked",
                            label: "Booked",
                          },
                          {
                            value: "waitlisted",
                            label: "Waitlisted",
                          },
                          {
                            value: "on_hold",
                            label: "On Hold",
                          },
                          {
                            value: "requested",
                            label: "Requested",
                          },
                        ]}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" pb={1}>
                        Class
                      </Typography>
                      <CommonSelect
                        // width="110px"
                        value={destination.seat_class}
                        handleChange={
                          (e) =>
                            dispatch(
                              updateDestination({
                                index,
                                data: { seat_class: e.target.value },
                              })
                            )
                          //   console.log("e", e)
                        }
                        name={"seat_class"}
                        placeholder={"Select"}
                        options={alphabetic}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              onClick={() => dispatch(addDestination())}
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "text.btn_blue",
              }}
              startIcon={<Add sx={{ width: "0.8rem" }} />}
            >
              Add destination
            </Button>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={clearAllErrors}
                sx={{
                  mr: 2,
                  textTransform: "capitalize",
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  border: "1px solid rgba(99, 99, 99, 0.2)",
                  padding: "8px 16px",
                  minWidth: 0,
                  bgcolor: "background.paper",
                  "&:hover": {
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    color: "text.btn_blue",
                    transform: "scale(1.01)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                Discard
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={status === "loading"}
                sx={{ textTransform: "none" }}
              >
                {status === "loading" ? (
                  <CircularProgress size={18} sx={{}} />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <DeleteConfirmModal
        isOpen={showWarning}
        onClose={closeModal}
        onConfirm={deleteHandler}
        isLoading={isLoading}
        itemName={"Destination"}
        title={"Delete"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to delete this Destination?
            <br /> This action cannot be undone.
          </Typography>
        }
      />
    </>
  );
}
