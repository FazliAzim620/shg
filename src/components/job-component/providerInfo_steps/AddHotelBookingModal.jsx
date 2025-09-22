import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Input,
  Card,
  CardHeader,
  CardContent,
  Divider,
  CardActions,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector } from "react-redux";
import {
  addHotelBooking,
  fetchCountries,
  fetchStates,
} from "../../../thunkOperation/job_management/providerInfoStep";
import AddressForm from "./AddressForm";
import { CommonInputField } from "../CreateJobModal";
import { updateField } from "../../../feature/clientSlice";
import {
  Add,
  AttachFile,
  AttachMoneyOutlined,
  Brightness1,
  Brightness1Outlined,
  Remove,
  TripOrigin,
  TripOriginOutlined,
} from "@mui/icons-material";
import { CommonSelect } from "../CommonSelect";
import CustomTypographyBold from "../../CustomTypographyBold";
import { clearHotelBooking } from "../../../feature/hotelBookingSlice";
import { useParams } from "react-router-dom";
import { updateNewUserDataField } from "../../../feature/jobSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: "100%", xl: "78%" },
  //   maxHeight: "90vh",
  //   overflowY: "auto",
  boxShadow: 24,
  pt: 4,
  bgcolor: "transparent",
};

const AddHotelBookingModal = ({ open, onClose, editData }) => {
  const { countries, states } = useSelector((state) => state.client);
  const fileInputRef = useRef(null);
  const params = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const { newUserData } = useSelector((state) => state.job);
  const { bookings, status } = useSelector((state) => state.hotel);
  const [requiredFields, setRequiredFields] = useState([]);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    job_id: "",
    hotelName: "",
    attachment: "",
    billingAddress: "",
    city: "",
    billingState: "",
    addressLine1: "",
    isNewAttachmentUpload: false,
    addressLine2: "",
    zipCode: "",
    checkInDateTime: null,
    checkOutDateTime: null,
    roomType: "",
    bedType: "",
    budgetPerNight: "",
    totalNights: 1,
    billingZipCode: "",
    paymentTerms: "Reimburse later",
  });

  const validateForm = () => {
    let newErrors = {};

    // Check for required fields
    if (!formData.hotelName) {
      newErrors.hotelName = "Hotel name is required!";
      if (!requiredFields.includes("hotelName")) {
        requiredFields.push("hotelName");
      }
    }
    if (!formData.billingAddress) {
      if (!requiredFields.includes("billingAddress")) {
        requiredFields.push("billingAddress");
      }
    }
    if (!formData?.billingAddress1) {
      if (!requiredFields.includes("billingAddress1")) {
        requiredFields.push("billingAddress1");
      }
    }
    if (!formData?.billingCity) {
      if (!requiredFields.includes("billingCity")) {
        requiredFields.push("billingCity");
      }

      newErrors.city = "City is required!";
    }
    if (!formData?.billingState) {
      if (!requiredFields.includes("billingState")) {
        requiredFields.push("billingState");
      }
      newErrors.billingState = "State is required!";
    }

    if (!formData?.billingZipCode) {
      if (!requiredFields.includes("billingZipCode")) {
        requiredFields.push("billingZipCode");
      }
      newErrors.zipCode = "Zip code is required!";
    }
    if (!formData.budgetPerNight)
      newErrors.budgetPerNight = "Budget Per Night is required!";
    if (
      !formData.checkInDateTime ||
      formData.checkInDateTime === "undefinedTundefined"
    )
      newErrors.checkInDateTime = "Check-in date/time is required!";
    if (
      !formData.checkOutDateTime ||
      formData.checkOutDateTime === "undefinedTundefined"
    )
      newErrors.checkOutDateTime = "Check-out date/time is required!";
    if (!formData.roomType) newErrors.roomType = "Room type is required!";
    if (!formData.bedType) newErrors.bedType = "Bed type is required!";

    // Validate date/time format and logic
    const checkIn = new Date(formData.checkInDateTime);
    const checkOut = new Date(formData.checkOutDateTime);
    if (checkOut <= checkIn) {
      newErrors.checkOutDateTime = "Check-out must be after check-in";
    }

    // Validate budget per night (assuming it should be a positive number)
    if (formData.budgetPerNight && parseFloat(formData.budgetPerNight) <= 0) {
      newErrors.budgetPerNight = "Budget per night must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setRequiredFields(requiredFields?.filter((item) => item !== e.target.name));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[e.target.name];
      return updatedErrors;
    });
    if (e.target.name === "billingAddress") {
      if (e.target.value) {
        dispatch(fetchStates(e.target.value));
      } else {
        dispatch(updateField({ field: "states", value: [] }));
        dispatch(updateField({ field: "billingState", value: "" }));
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentTermsChange = (event, newPaymentTerms) => {
    setFormData({ ...formData, paymentTerms: newPaymentTerms });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await dispatch(addHotelBooking(formData));
      if (addHotelBooking.fulfilled.match(result)) {
        dispatch(
          updateNewUserDataField({
            field: "itinerary_count",
            value: 1,
          })
        );
        onClose();
      }
    } else {
      console.log("Form has errors. Please correct them.", errors);
    }
  };
  useEffect(() => {
    // dispatch(clearHotelBooking());
    if (open) {
      dispatch(fetchCountries());
      setFormData({ ...formData, job_id: params?.id });
    }
  }, [open]);
  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.abbrevation?`${option.name} (${option.abbrevation})`:option.name,
  }));
  const uploadFile = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        attachment: e.target.files[0],
        isNewAttachmentUpload: true, // Ensure this flag is also updated
      });
      //   dispatch(updateItinerary({ attachment: e.target.files[0] }));
    }
  };
  useEffect(() => {
    // if (editData?.length > 0) {
    if (editData) {
      dispatch(fetchStates(editData?.country_id));
      setFormData({
        id: editData.id || "",
        job_id: params.id || "",
        hotelName: editData.hotel_name || "",
        // attachment: editData.attachment || "",
        isNewAttachmentUpload: false,
        billingAddress: editData?.country_id,
        billingCity: editData.city || "",
        billingState: editData?.state_id,
        billingAddress1: editData.address_line_1 || "",
        billingAddress2: editData.address_line_2 || "",
        billingZipCode: editData.zip_code || "",
        checkInDateTime:
          `${editData.check_in_date}T${editData.check_in_time}` || "",
        checkOutDateTime:
          `${editData.check_out_date}T${editData.check_out_time}` || "",
        roomType: editData.room_type || "",
        bedType: editData.bed_type || "",
        budgetPerNight: editData.budget_per_night || "",
        totalNights: Number(editData.total_nights) || 1,
        paymentTerms: editData.payment_terms || "Reimburse later",
      });
    }
  }, [open, editData]);
  const inputStyle = {
    width: "100%",
    p: ".6125rem 1rem",
    borderRadius: ".3125rem",
    bgcolor: "#f6f7fa",
    "&:hover": {
      bgcolor: "#fff",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    },
  };
  const closeHandler = () => {
    onClose();
    setErrors({});
    setRequiredFields([]);
  };
  return (
    <Modal open={open} onClose={closeHandler}>
      <Box sx={style}>
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: "background.paper",
            width: { xs: "95vw", md: "798px" },
            m: { xs: "0 auto" },
            mb: { md: 3 },
            // maxHeight: "535px",
            // overflowY: { xs: "auto" },
          }}
        >
          <Card>
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
                    alignItems: "start",
                  }}
                >
                  <Typography variant="h6" component="h2" mb={2}>
                    Add hotel booking
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={closeHandler}
                    sx={
                      {
                        //   position: "absolute",
                        //   right: 8,
                        //   top: 8,
                      }
                    }
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: "396px", overflowY: "auto" }}>
              <Box
                mb={2}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Typography variant="body1" mb={1}>
                  Booking receipt
                </Typography>

                <Button
                  variant="text"
                  component="label"
                  sx={{
                    textTransform: "capitalize",
                    color: formData?.attachment?.name
                      ? "text.black"
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
                  {formData?.attachment?.name
                    ? formData?.attachment?.name
                    : "Choose file"}
                  <input
                    type="file"
                    hidden
                    name="attachment"
                    onChange={uploadFile}
                    accept=".doc,.docx,.pdf"
                    ref={fileInputRef}
                  />
                </Button>
              </Box>

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 1.5 }}
              >
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.98rem",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      // color: "text.black",
                      // p: "1rem 1rem 0.75rem 1rem",
                    }}
                  >
                    Hotel information
                  </Typography>
                </Grid>
                <Grid item xs={6} md={9}>
                  <Divider
                    sx={{
                      borderColor:
                        darkMode == "dark"
                          ? "rgba(255, 255, 255, .7"
                          : "rgba(231, 234, 243, 01)",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1} mb={2}>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Hotel name <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonInputField
                    error={errors?.hotelName ? true : false}
                    fullWidth
                    placeholder="Five star"
                    type="text"
                    name={"hotelName"}
                    onChange={handleChange}
                    margin="normal"
                    value={formData.hotelName}
                  />

                  <Typography variant="caption" color="error">
                    {errors?.hotelName}
                  </Typography>
                </Grid>
              </Grid>
              <AddressForm
                formData={formData}
                handleChange={handleChange}
                filterCountries={filterCountries}
                filterState={filterState}
                requiredFields={requiredFields}
              />

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", mt: 5, mb: 2 }}
              >
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.98rem",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      // color: "text.black",
                      pl: "0.7rem  ",
                    }}
                  >
                    Booking details
                  </Typography>
                </Grid>
                <Grid item xs={6} md={9}>
                  <Divider
                    sx={{
                      borderColor:
                        darkMode == "dark"
                          ? "rgba(255, 255, 255, .7"
                          : "rgba(231, 234, 243, 01)",
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Check-in date and time{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Input
                    variant="standard"
                    type="datetime-local"
                    sx={{
                      height: "2.6rem",
                      ...inputStyle,
                      border: errors?.checkInDateTime
                        ? ".0625rem solid #d32f2f"
                        : ".0625rem solid rgba(231, 234, 243, .7)",
                    }}
                    disableUnderline={true}
                    value={formData.checkInDateTime}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "checkInDateTime",
                          value: e.target.value,
                        },
                      })
                    }
                  />
                  <Typography variant="caption" color="error">
                    {errors?.checkInDateTime}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Check-out date and time{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Input
                    variant="standard"
                    type="datetime-local"
                    sx={{
                      height: "2.6rem",
                      ...inputStyle,
                      border: errors?.checkOutDateTime
                        ? ".0625rem solid #d32f2f"
                        : ".0625rem solid rgba(231, 234, 243, .7)",
                    }}
                    disableUnderline={true}
                    value={formData.checkOutDateTime}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "checkOutDateTime",
                          value: e.target.value,
                        },
                      })
                    }
                  />
                  <Typography variant="caption" color="error">
                    {errors?.checkOutDateTime}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Room type <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonSelect
                    height={"2.6rem"}
                    error={errors?.roomType ? true : false}
                    name="roomType"
                    handleChange={handleChange}
                    fullWidth
                    margin="normal"
                    value={formData.roomType}
                    placeholder="e.g., Double"
                    type="text"
                    options={[
                      { value: "single", label: "Single" },
                      { value: "double", label: "Double" },
                      { value: "family_room", label: "Family Room" },
                      { value: "twin_room", label: "Twin Room" },
                      { value: "studio", label: "Studio" },
                    ]}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.roomType}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Bed type <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonSelect
                    height={"2.6rem"}
                    error={errors?.bedType ? true : false}
                    name="bedType"
                    handleChange={handleChange}
                    fullWidth
                    margin="normal"
                    value={formData.bedType}
                    placeholder="e.g., Single"
                    type="text"
                    options={[
                      { value: "single_bed", label: "Single Bed" },
                      { value: "double_bed", label: "Double bed" },
                      { value: "queeen_bed", label: "Queen Bed" },
                      { value: "king_bed", label: "King Bed" },
                      { value: "twin_bed", label: "Twin Bed" },
                      { value: "sofa_bed", label: "Sofa Bed" },
                    ]}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.bedType}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", mt: 2, mb: 1 }}
              >
                <Grid item xs={6} md={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.98rem",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      // color: "text.black",
                      pl: "0.7rem  ",
                    }}
                  >
                    Payment
                  </Typography>
                </Grid>
                <Grid item xs={6} md={10}>
                  <Divider
                    sx={{
                      borderColor:
                        darkMode == "dark"
                          ? "rgba(255, 255, 255, .7"
                          : "rgba(231, 234, 243, 01)",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Budget per night<span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.budgetPerNight ? true : false}
                    name="budgetPerNight"
                    placeholder="e.g., 50"
                    value={formData.budgetPerNight}
                    onChange={(e) => {
                      setErrors((prevErrors) => {
                        const updatedErrors = { ...prevErrors };
                        delete updatedErrors[e.target.name];
                        return updatedErrors;
                      });
                      setFormData({
                        ...formData,
                        budgetPerNight: e.target.value,
                      });
                    }}
                    type="number"
                    InputProps={{
                      startAdornment: <AttachMoneyOutlined />,
                      endAdornment: "/night",
                    }}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.budgetPerNight}
                  </Typography>
                </Grid>
              </Grid>
              {/* ----------------------------------------------------------------------------------------------------------------- */}
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={3} mt={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Total nights
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: darkMode == "light" ? "#F6F7FA" : "#333",
                      p: 1,
                      borderRadius: ".3125rem",
                      height: "2.6rem",
                    }}
                  >
                    <Input
                      variant="standard"
                      value={formData.totalNights}
                      sx={{
                        height: "2.3rem",
                        px: 1,
                        "&:hover": {
                          bgcolor: "white",
                        },
                      }}
                      disableUnderline={true}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*$/.test(inputValue)) {
                          const numericValue =
                            inputValue === "" ? 1 : parseInt(inputValue, 10);
                          setFormData({
                            ...formData,
                            totalNights: numericValue,
                          });
                        }
                      }}
                    />
                    <Box>
                      <Button
                        size="small"
                        onClick={() => {
                          if (formData.totalNights > 1) {
                            setFormData({
                              ...formData,
                              totalNights: formData.totalNights - 1,
                            });
                          }
                        }}
                        sx={{
                          bgcolor: darkMode == "light" ? "#fff" : "#333",
                          color: "text.primary",
                          borderRadius: "50%",
                          height: "30px",
                          mr: 1,
                          minWidth: "5px",
                          "&:hover": {
                            bgcolor: "white",
                          },
                        }}
                      >
                        <Remove />
                      </Button>

                      <Button
                        size="small"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            totalNights: formData.totalNights + 1,
                          })
                        }
                        sx={{
                          bgcolor: darkMode == "light" ? "#fff" : "#333",
                          borderRadius: "50%",
                          color: "text.primary",
                          height: "30px",
                          minWidth: "5px",
                          "&:hover": {
                            bgcolor: "white",
                          },
                        }}
                      >
                        <Add />
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* ----------------------------------------------------------------------------------------------------------------- */}
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={3} mt={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Payment terms
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <ToggleButtonGroup
                    value={formData.paymentTerms}
                    exclusive
                    onChange={handlePaymentTermsChange}
                    aria-label="payment terms"
                    fullWidth
                    sx={{ display: "flex", gap: 2, height: "2.6rem" }}
                  >
                    <ToggleButton
                      value="Reimburse later"
                      aria-label="reimburse later"
                      sx={{
                        height: "2.6rem",
                        textTransform: "initial",
                        background: darkMode == "light" ? "#F6F7FA" : "#333",
                        border: "none",
                      }}
                    >
                      {formData.paymentTerms === "Reimburse later" ? (
                        <TripOriginOutlined
                          sx={{ color: "text.link", width: 18, mr: 1 }}
                          size="small"
                        />
                      ) : (
                        <Brightness1
                          sx={{ color: "white", width: 18, mr: 1 }}
                        />
                      )}
                      Reimburse later
                    </ToggleButton>
                    <ToggleButton
                      sx={{
                        textTransform: "initial",
                        background: darkMode == "light" ? "#F6F7FA" : "#333",
                        border: "none",
                      }}
                      value="later"
                      aria-label="prepaid"
                    >
                      {formData.paymentTerms === "later" ? (
                        <TripOriginOutlined
                          sx={{ color: "text.link", width: 18, mr: 1 }}
                          size="small"
                        />
                      ) : (
                        <Brightness1
                          sx={{ color: "white", width: 18, mr: 1 }}
                        />
                      )}
                      Prepaid
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "right", mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "40%",
                  }}
                >
                  <Typography variant="body1">Total amount:</Typography>
                  <CustomTypographyBold color="text.black">
                    ${formData.budgetPerNight * formData.totalNights}
                  </CustomTypographyBold>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ py: 3 }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                    pr: 2,
                  }}
                >
                  <Button
                    onClick={closeHandler}
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
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
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
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddHotelBookingModal;
