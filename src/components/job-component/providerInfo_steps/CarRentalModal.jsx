import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardHeader,
  CardContent,
  Divider,
  CardActions,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { CommonInputField } from "../CreateJobModal";
import { CommonSelect } from "../CommonSelect";
import {
  AttachFile,
  Brightness1,
  TripOriginOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../CustomTypographyBold";
import { useDispatch } from "react-redux";
import { addCarRentalBooking } from "../../../thunkOperation/job_management/providerInfoStep";
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
  //   boxShadow: 24,
  pt: 4,
  bgcolor: "transparent",
  //   bgcolor: "green",
};

const CarRentalModal = ({ open, onClose, editData, status }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const fileInputRef = useRef(null);
  const { newUserData } = useSelector((state) => state.job);
  const [formData, setFormData] = useState({
    id: "",
    attachment: "",
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    carType: "",
    carRentalCompany: "",
    isNewAttachmentUpload: false,
    pickupAddress: "",
    pickupPhone: "",
    dropoffAddress: "",
    dropoffPhone: "",
    rentalAmount: "",
    paymentTerms: "Reimburse later",
    job_id: "",
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};
    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup Date is required!";
    }
    if (!formData.pickupTime) {
      newErrors.pickupTime = "Pickup Time   is required!";
    }
    if (!formData.dropoffDate) {
      newErrors.dropoffDate = "Dropoff Date is required!";
    }
    if (!formData.dropoffTime) {
      newErrors.dropoffTime = "Dropoff Time   is required!";
    }
    if (!formData.carType) {
      newErrors.carType = "Car type is required!";
    }
    if (!formData.carRentalCompany) {
      newErrors.carRentalCompany = "Car rental company   is required!";
    }
    if (!formData.pickupAddress) {
      newErrors.pickupAddress = "Pickup address   is required!";
    }
    if (!formData.pickupPhone) {
      newErrors.pickupPhone = "Pickup phone  is required!";
    }
    if (!formData.dropoffAddress) {
      newErrors.dropoffAddress = "Dropoff address is required!";
    }
    if (!formData.dropoffPhone) {
      newErrors.dropoffPhone = " Dropoff phone is required!";
    }
    // if (!/^\d+$/.test(formData.dropoffPhone)) {
    //   newErrors.dropoffPhone = "Dropoff phone must contain only numbers!";
    // }
    if (!formData.rentalAmount) {
      newErrors.rentalAmount = " Rental amount is required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dropoffPhone" || name === "pickupPhone") {
      // Allow the change only if the value contains only numbers or is empty
      if (/^\d*$/.test(value)) {
        setErrors({ ...errors, [name]: "" });
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setErrors({ ...errors, [name]: "" });
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePaymentTermsChange = (event, newPaymentTerms) => {
    setFormData({ ...formData, paymentTerms: newPaymentTerms });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    if (validateForm()) {
      const result = await dispatch(addCarRentalBooking(formData));
      if (addCarRentalBooking.fulfilled.match(result)) {
        dispatch(
          updateNewUserDataField({
            field: "itinerary_count",
            value: 1,
          })
        );
        onClose();
      }
    }
    // onClose();
  };

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
    // dispatch(clearHotelBooking());
    setFormData({ ...formData, job_id: params.id });
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        attachment: editData.attachment || "",
        pickupDate: editData.pickup_date || "",
        pickupTime: editData.pickup_time || "",
        dropoffDate: editData.dropoff_date || "",
        dropoffTime: editData.dropoff_time || "",
        carType: editData.car_type || "",
        isNewAttachmentUpload: false,
        carRentalCompany: editData.car_rental_company || "",
        pickupAddress: editData.pickup_address || "",
        pickupPhone: editData.pickup_location_phone_no || "",
        dropoffAddress: editData.dropoff_address || "",
        dropoffPhone: editData.dropoff_location_phone_no || "",
        rentalAmount: editData.rental_amount || "",
        paymentTerms: editData.payment_terms || "Reimburse later",
        job_id: params.id,
      });
    }
  }, [editData]);
  const closeHandler = () => {
    onClose();
    setErrors({});
  };
  return (
    <Modal open={open} onClose={closeHandler}>
      <Box sx={style}>
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: "green",
            width: { xs: "95vw", md: "798px" },
            m: { xs: "0 auto" },
            mb: { md: 3 },
            // maxHeight: "535px",
            // overflowY: { xs: "auto" },
            // px: 2,
          }}
        >
          <Card>
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ px: 1 }}>
                    Add car booking
                  </Typography>
                  <IconButton onClick={closeHandler}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: "396px", overflowY: "auto", px: 3 }}>
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

                      "&:hover": {
                        color: "#007BFF",
                      },
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
              <Grid
                container
                spacing={2}
                mt={1}
                sx={{ display: "flex", alignItems: "center", my: 1.5 }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Pick-up date <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.pickupDate ? true : false}
                    fullWidth
                    placeholder="Pick-up date"
                    type="date"
                    name="pickupDate"
                    onChange={handleChange}
                    margin="normal"
                    value={formData.pickupDate}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.pickupDate}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", mt: 4 }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Pick-up time <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.pickupTime ? true : false}
                    fullWidth
                    placeholder="Pick-up date"
                    type="time"
                    name="pickupTime"
                    onChange={handleChange}
                    margin="normal"
                    value={formData.pickupTime}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.pickupTime}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", mt: 3 }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Drop-off date <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.dropoffDate ? true : false}
                    fullWidth
                    placeholder="Drop-off date"
                    type="date"
                    name="dropoffDate"
                    onChange={handleChange}
                    margin="normal"
                    value={formData.dropoffDate}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.dropoffDate}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 2 }}
              >
                <Grid
                  container
                  sx={{ display: "flex", alignItems: "center", my: 1.5 }}
                >
                  <Grid item xs={12} md={3}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "14px",
                      }}
                    >
                      Drop-off time <span style={{ color: "red" }}>*</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CommonInputField
                      height={"2.6rem"}
                      error={errors?.dropoffTime ? true : false}
                      fullWidth
                      placeholder="drop off Time "
                      type="time"
                      name="dropoffTime"
                      onChange={handleChange}
                      margin="normal"
                      value={formData.dropoffTime}
                    />
                    <Typography variant="caption" color="error">
                      {errors?.dropoffTime}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 2 }}
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
                    Car details
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
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 3 }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Car type <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <CommonSelect
                    height={"2.6rem"}
                    error={errors?.carType ? true : false}
                    value={formData.carType}
                    fullWidth
                    label="Car type"
                    handleChange={handleChange}
                    name="carType"
                    options={[
                      { label: "Economy", value: "economy" },
                      { label: "Compact", value: "compact" },
                      { label: "Luxury", value: "luxury" },
                    ]}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.carType}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 1.5 }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Car rental company <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.carRentalCompany ? true : false}
                    fullWidth
                    label="Car rental company"
                    placeholder="e.g., Enterprise, Hertz"
                    onChange={handleChange}
                    name="carRentalCompany"
                    value={formData.carRentalCompany}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.carRentalCompany}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 3 }}
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
                    Pick-up location
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
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 1.5 }}
              >
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Pick-up address <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.pickupAddress ? true : false}
                    fullWidth
                    label="Pick-up address"
                    placeholder="e.g., 123 Main St, City, State,"
                    onChange={handleChange}
                    name="pickupAddress"
                    value={formData.pickupAddress}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.pickupAddress}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 2.5 }}
              >
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Pick-up location phone number{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.pickupPhone ? true : false}
                    fullWidth
                    label="Pick-up location phone number"
                    placeholder="(123) 456-7890"
                    onChange={(number) => {
                      setErrors({ ...errors, ["pickupPhone"]: "" });
                      setFormData({ ...formData, ["pickupPhone"]: number });
                    }}
                    name="pickupPhone"
                    value={formData.pickupPhone}
                    isPhoneNumber={"phone"}
                  />
                  {/* <CommonInputField
                    height={"2.6rem"}
                    error={errors?.pickupPhone ? true : false}
                    fullWidth
                    label="Pick-up location phone number"
                    placeholder="(123) 456-7890"
                    onChange={handleChange}
                    name="pickupPhone"
                    value={formData.pickupPhone}
                  /> */}
                  <Typography variant="caption" color="error">
                    {errors?.pickupPhone}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 3 }}
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
                    Drop-off location
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
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 2.5 }}
              >
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Drop-off address <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    error={errors?.dropoffAddress ? true : false}
                    fullWidth
                    label="Drop-off address"
                    placeholder="e.g., 123 Main St, City, State,"
                    onChange={handleChange}
                    name="dropoffAddress"
                    value={formData.dropoffAddress}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.dropoffAddress}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 1.5 }}
              >
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Drop-off location phone number{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CommonInputField
                    height={"2.6rem"}
                    onChange={(number) => {
                      setErrors({ ...errors, ["dropoffPhone"]: "" });
                      setFormData({ ...formData, ["dropoffPhone"]: number });
                    }}
                    isPhoneNumber={"phone"}
                    error={errors?.dropoffPhone ? true : false}
                    fullWidth
                    label="Drop-off location phone number"
                    placeholder="(123) 456-7890"
                    name="dropoffPhone"
                    value={formData.dropoffPhone}
                  />
                  {/* <CommonInputField
                    height={"2.6rem"}
                    error={errors?.dropoffPhone ? true : false}
                    fullWidth
                    label="Drop-off location phone number"
                    placeholder="(123) 456-7890"
                    onChange={handleChange}
                    name="dropoffPhone"
                    value={formData.dropoffPhone}
                  /> */}
                  <Typography variant="caption" color="error">
                    {errors?.dropoffPhone}
                  </Typography>
                </Grid>

                <Grid
                  container
                  sx={{ display: "flex", alignItems: "center", my: 3 }}
                >
                  <Grid item xs={6} md={2}>
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
                      Payments
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
                <Grid
                  container
                  sx={{ display: "flex", alignItems: "center", my: 1.5 }}
                >
                  <Grid item xs={6} md={3}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "14px",
                      }}
                    >
                      Rental amount <span style={{ color: "red" }}>*</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <CommonInputField
                      height={"2.6rem"}
                      error={errors?.rentalAmount ? true : false}
                      fullWidth
                      label="Rental amount"
                      type="number"
                      placeholder="e.g., 50"
                      onChange={handleChange}
                      name="rentalAmount"
                      value={formData.rentalAmount}
                      InputProps={{
                        startAdornment: "$",
                        endAdornment: (
                          <Typography
                            variant="caption"
                            sx={{ bgcolor: "white" }}
                          >
                            /.00
                          </Typography>
                        ),
                      }}
                    />
                    <Typography variant="caption" color="error">
                      {errors?.rentalAmount}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ display: "flex", alignItems: "center", my: 3 }}
                >
                  <Grid item xs={6} md={3}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
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
                          textTransform: "initial",
                          background: darkMode == "light" ? "#F6F7FA" : "#333",
                          border: "none",
                        }}
                      >
                        {formData.paymentTerms === "Reimburse later" ||
                        formData.paymentTerms === "later" ? (
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
                        value="Prepaid"
                        aria-label="prepaid"
                      >
                        {formData.paymentTerms === "Prepaid" ? (
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

                <Grid item xs={12}>
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
                        ${formData.rentalAmount}
                      </CustomTypographyBold>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ py: 3 }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mr: 2,
                  }}
                >
                  <Button
                    onClick={closeHandler}
                    sx={{
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
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
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

export default CarRentalModal;
