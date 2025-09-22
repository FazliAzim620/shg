import React, { useEffect, useState } from "react";
import CardCommon from "../../../components/CardCommon";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { setField, resetField } from "../../../feature/jobSlice";
import { useSelector } from "react-redux";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useDispatch } from "react-redux";
import savemIcon from "../../../assets/svg/icons/saveme.svg";
import ProfileImageAvatar from "../ProfileImageAvatar";
import AddressForm from "../../../components/job-component/providerInfo_steps/AddressForm";
import {
  fetchCountries,
  fetchStates,
} from "../../../thunkOperation/job_management/providerInfoStep";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import API, { baseURLImage } from "../../../API";
import { updateField } from "../../../feature/clientSlice";
import { fetchUserInfo } from "../../../thunkOperation/auth/loginUserInfo";
import { CommonSelect } from "../../../components/job-component/CommonSelect";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";

// ================================= component ==================================
const BasicInformation = () => {
  const dispatch = useDispatch();

  const [isPossible, setIsPossible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // Added state for alert visibility
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address_line_1: "",
  });

  const darkMode = useSelector((state) => state.theme.mode);
  const { countries, states, status, newClientData } = useSelector(
    (state) => state.client
  );
  const { loadingData, userData } = useSelector((state) => state?.userInfo);

  // Dispatch the fetchUserInfo thunk when the component mounts
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    first_name: userData?.first_name ? userData.first_name : "",
    last_name: userData?.last_name ? userData.last_name : "",
    email: userData?.email ? userData.email : "",
    organization: userData?.detail?.organization
      ? userData.detail.organization
      : "",
    department: userData?.detail?.department ? userData.detail.department : "",
    country_id: userData?.detail?.country_id ? userData.detail.country_id : "",
    state_id: userData?.detail?.state_id ? userData.detail.state_id : "",
    city: userData?.detail?.city ? userData.detail.city : "",
    address_line_1: userData?.detail?.address_line_1
      ? userData.detail.address_line_1
      : "",
    address_line_2: userData?.detail?.address_line_2
      ? userData.detail.address_line_2
      : "",
    zip_code: userData?.detail?.zip_code ? userData.detail.zip_code : "",
  });
  const [phoneValue, setPhoneValue] = useState(
    userData?.detail?.phone ? userData.detail.phone : ""
  );

  // const formData = useSelector((state) => state.client);
  // ======================fetch countries and states=====================
  useEffect(() => {
    dispatch(fetchCountries());
    if (formData?.country_id) {
      dispatch(fetchStates(formData?.country_id));
    }
  }, []);

  // ======================countries options=====================
  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "provider_specialities") {
      // Special handling for multi-select fields
      setFormData({
        ...formData,
        [name]: typeof value === "string" ? value.split(",") : value, // Ensure it's an array
      });
    } else {
      if (name === "country_id" && value) {
        dispatch(fetchStates(value)); // Additional logic for specific fields
      }
      setFormData({
        ...formData,
        [name]: value, // General form handling
      });
      setError((prevErr) => ({
        ...prevErr,
        [name]: "", // General form handling
      }));
    }
  };

  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const onCloseHandler = () => {
    setError({ name: "", email: "" });
    // onClose();
    dispatch(resetField());
  };
  const [avatarFile, setAvatarFile] = useState(null);

  const handleFileSelect = (file) => {
    setAvatarFile(file);
  };

  // =============================== api call ===============================
  const handleEditBasicInfo = async (e) => {
    let hasError = false;
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate first Name
    if (!formData.first_name) {
      setError((prevError) => ({
        ...prevError,
        first_name: "First name is required!",
      }));
      hasError = true;
    } else if (formData.first_name.length < 3) {
      setError((prevError) => ({
        ...prevError,
        first_name: "Name should be at least 3 characters!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, first_name: "" }));
    }
    // Validate last Name
    if (!formData.last_name) {
      setError((prevError) => ({
        ...prevError,
        last_name: "Last name is required!",
      }));
      hasError = true;
      scrollToTop();
    } else if (formData.last_name.length < 3) {
      setError((prevError) => ({
        ...prevError,
        last_name: "Name should be at least 3 characters!",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, last_name: "" }));
    }
    // Validate email
    if (!formData.email.trim()) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required!",
      }));
      hasError = true;
      scrollToTop();
    } else if (!emailRegex.test(formData.email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter valid Email!",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, email: "" }));
    }
    // Validate address line1
    if (!formData.address_line_1) {
      setError((prevError) => ({
        ...prevError,
        address_line_1: "Address line 1 is required!",
      }));
      hasError = true;
    }
    if (!hasError) {
      const handleEditBasicInfoData = new FormData();
      handleEditBasicInfoData.append("first_name", formData?.first_name);
      handleEditBasicInfoData.append("last_name", formData?.last_name);
      handleEditBasicInfoData.append("email", formData?.email);
      handleEditBasicInfoData.append("phone", phoneValue);
      handleEditBasicInfoData.append("organization", formData?.organization);
      handleEditBasicInfoData.append("department", formData?.department);
      handleEditBasicInfoData.append("country_id", formData?.country_id);
      handleEditBasicInfoData.append("state_id", formData?.state_id);
      handleEditBasicInfoData.append("city", formData?.city);
      handleEditBasicInfoData.append(
        "address_line_1",
        formData?.address_line_1
      );

      handleEditBasicInfoData.append(
        "address_line_2",
        formData?.address_line_2
      );
      handleEditBasicInfoData.append("zip_code", formData?.zip_code);
      handleEditBasicInfoData.append("file", avatarFile);
      setIsLoading(true);
      try {
        const response = await API.post(
          "/api/save-user-data",
          handleEditBasicInfoData
        );
        const data = response.data;
        dispatch(fetchUserInfo());
        setApiResponseYes(true);
        setApiResponse(data);
        setIsLoading(false);
        setShowAlert(true); // Show alert on success
        return data;
      } catch (error) {
        setIsLoading(false);
        console.log("err", error);
      }
    }
  };

  if (loadingData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CardCommon
      //  btnText={"Edit"}
      cardTitle={"Basic Information"}
    >
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
      <form onSubmit={handleEditBasicInfo} style={{ margin: 20 }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3} sx={{}}>
            <Typography
              variant="body2"
              sx={{
                color: "text.black",
                p: "10px 12px",
                lineHeight: "1.2rem",
                fontSize: "14px",
              }}
            >
              Avatar
            </Typography>
          </Grid>
          <Grid item xs={12} md={9} sx={{ mb: 4 }}>
            <ProfileImageAvatar
              filePath={`${baseURLImage}${userData?.detail?.photo}`}
              onFileSelect={handleFileSelect}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.black",
                p: "10px 12px",
                lineHeight: "1.2rem",
                fontSize: "14px",
              }}
            >
              Full Name <span style={{ fontWeight: 600, color: "red" }}>*</span>
            </Typography>
            <Tooltip
              arrow
              placement="top"
              title="Displayed on public forums, such as SHG."
              sx={{ p: 0, ml: -0.7 }}
            >
              <IconButton>
                <HelpOutlineIcon
                  sx={{ fontSize: "18px", color: "text.primary" }}
                />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={4.5} sx={{ mb: { xs: 1, md: 0 } }}>
            <CommonInputField
              height={"2.6rem"}
              error={!formData.first_name && error.first_name ? true : false}
              name={"first_name"}
              placeholder="e.g., John "
              value={formData.first_name}
              onChange={handleChange}
              type="text"
            />
            <Typography variant="caption" color="error">
              {error.first_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4.5} sx={{}}>
            <CommonInputField
              height={"2.6rem"}
              error={!formData.last_name && error.last_name ? true : false}
              name={"last_name"}
              placeholder="e.g.,  Doe"
              value={formData.last_name}
              onChange={handleChange}
              type="text"
            />
            <Typography variant="caption" color="error">
              {error.last_name}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3} sx={{}}>
            <Typography
              variant="body2"
              sx={{
                color: "text.black",
                p: "10px 12px",
                lineHeight: "1.2rem",
                fontSize: "14px",
              }}
            >
              Email <span style={{ fontWeight: 600, color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={9} sx={{}}>
            <CommonInputField
              height={"2.6rem"}
              error={!formData.email && error.email ? true : false}
              name={"email"}
              placeholder="e.g., mark@site.com"
              value={formData.email}
              onChange={handleChange}
              type="text"
            />
            <Typography variant="caption" color="error">
              {error.email}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3} sx={{}}>
            <Typography
              variant="body2"
              sx={{
                color: "text.black",
                p: "10px 12px",
                lineHeight: "1.2rem",
                fontSize: "14px",
              }}
            >
              Phone <span style={{ color: "#8c98a4" }}>(Optional)</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={9} sx={{}}>
            <CommonInputField
              height={"2.6rem"}
              name="phone"
              placeholder="+x(xxx)xxx-xx-xx"
              value={phoneValue}
              onChange={(e) => {
                setPhoneValue(e);
              }}
              type={"phone"}
              isPhoneNumber={"phone"}
            />
            {!isPossible && (
              <Typography
                sx={{ color: "text.error", mb: "1.5rem" }}
                variant="caption"
              >
                Invalid phone number!
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3} sx={{}}>
            <Typography
              variant="body2"
              sx={{
                color: "text.black",
                p: "10px 12px",
                lineHeight: "1.2rem",
                fontSize: "14px",
              }}
            >
              Organization
            </Typography>
          </Grid>
          <Grid item xs={12} md={9} sx={{}}>
            <CommonInputField
              height={"2.6rem"}
              name={"organization"}
              placeholder="SHG Health Care"
              value={formData.organization}
              onChange={handleChange}
              type="text"
            />
            <Typography variant="caption" color="error">
              {error.providerRole}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={3} sx={{}}>
            <Typography
              variant="body2"
              sx={{
                color: "text.black",
                p: "10px 12px",
                lineHeight: "1.2rem",
                fontSize: "14px",
              }}
            >
              Department
            </Typography>
          </Grid>
          <Grid item xs={12} md={9} sx={{}}>
            <CommonInputField
              height={"2.6rem"}
              name={"department"}
              placeholder="Your Department"
              value={formData.department}
              onChange={handleChange}
              type="text"
            />
            <Typography variant="caption" color="error">
              {error.medicalSpecialty}
            </Typography>
          </Grid>
        </Grid>

        {/* ==================================address form=================================== */}
        <Box sx={{ pt: 1 }}>
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
                Location
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <CommonSelect
                height={"2.6rem"}
                options={filterCountries}
                name={"country_id"}
                handleChange={handleChange}
                fullWidth
                margin="normal"
                value={formData?.country_id}
                placeholder="e.g., USA"
                type="text"
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
                State
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <CommonSelect
                height={"2.6rem"}
                options={filterState}
                name={"state_id"}
                handleChange={handleChange}
                fullWidth
                margin="normal"
                value={formData?.state_id}
                placeholder="State"
                type="text"
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
                City
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <CommonInputField
                height={"2.6rem"}
                fullWidth
                placeholder="City"
                type="text"
                name={"city"}
                onChange={handleChange}
                margin="normal"
                value={formData?.city}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            mt={1}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
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
                Address line 1{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <CommonInputField
                height={"2.6rem"}
                error={
                  !formData.address_line_1 && error.address_line_1
                    ? true
                    : false
                }
                name={"address_line_1"}
                placeholder="e.g,123 Main Street"
                onChange={handleChange}
                type="text"
                fullWidth
                margin="normal"
                value={formData?.address_line_1}
              />
              <Typography variant="caption" color="error">
                {error.address_line_1}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            mt={1}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Grid item xs={12} md={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  pl: "12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Address line 2{" "}
                <span style={{ color: "#8c98a4" }}>(Optional)</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <CommonInputField
                height={"2.6rem"}
                name={"address_line_2"}
                placeholder="e.g, Apartment suite, unit, building, floor, etc."
                onChange={handleChange}
                type="text"
                fullWidth
                margin="normal"
                value={formData?.address_line_2}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            mt={1}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Grid container item xs={12} md={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Zip Code
              </Typography>
              <Tooltip
                arrow
                placement="top"
                title="You can find your code in a postal address."
              >
                <IconButton>
                  <HelpOutlineIcon
                    sx={{ fontSize: "18px", color: "text.primary" }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={9}>
              <CommonInputField
                height={"2.6rem"}
                name={"zip_code"}
                placeholder="1254"
                onChange={handleChange}
                type="text"
                fullWidth
                margin="normal"
                value={formData?.zip_code}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ==================================form cancel save btn=================================== */}
        <Box sx={{ textAlign: "right", pt: 3, pb: "2rem" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              textTransform: "capitalize",
              bgcolor: "background.btn_blue",
            }}
          >
            {isLoading ? (
              <CircularProgress size={23} sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </form>
    </CardCommon>
  );
};

export default BasicInformation;
