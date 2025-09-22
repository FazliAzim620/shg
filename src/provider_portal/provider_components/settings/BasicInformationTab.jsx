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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicInfoProfileImage from "./BasicInfoProfileImage";
import API, { baseURLImage } from "../../../API";
import CardCommon from "../../../components/CardCommon";
import { useDispatch } from "react-redux";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../../components/job-component/CommonSelect";
import { fetchUserInfo } from "../../../thunkOperation/auth/loginUserInfo";
import {
  fetchCountries,
  fetchStates,
} from "../../../thunkOperation/job_management/providerInfoStep";
import RadioToggleButton from "../../../components/RadioToggleButton";
import MultipleSelectCheckmarks from "../../../components/common/MultipleSelectCheckmarks";
import { AttachMoneyOutlined } from "@mui/icons-material";
import { scrollToTop, selectOptions } from "../../../util";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
} from "../../../thunkOperation/job_management/states";

const BasicInformationTab = ({ admin, provider_id }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [avatarFile, setAvatarFile] = useState(null);
  const handleFileSelect = (file) => {
    setAvatarFile(file);
  };
  const dispatch = useDispatch();

  const [isPossible, setIsPossible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    address_line_1: "",
    provider_specialities: "",
    regular_hourly_rate: "",
    holiday_hourly_rate: "",
  });

  const {
    statesList,
    providerRolesList,
    medicalSpecialities,

    jobsTableData,
  } = useSelector((state) => state.job);

  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [filterMedicalSpecialities, setfilterMedicalSpecialities] = useState(
    []
  );
  const [stateOptions, setstateOptions] = useState([]);
  useEffect(() => {
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setfilterMedicalSpecialities(selectOptions(medicalSpecialities));
    setstateOptions(selectOptions(statesList));
  }, [providerRolesList, medicalSpecialities, statesList]);
  const { countries, states, status, newClientData } = useSelector(
    (state) => state.client
  );
  const { loadingData, userData } = useSelector((state) => state?.userInfo);

  // Dispatch the fetchUserInfo thunk when the component mounts
  useEffect(() => {
    dispatch(fetchProviderRoles());
    dispatch(fetchMedicalSpecialities());
    {
      !admin ? dispatch(fetchUserInfo()) : dispatch(fetchUserInfo(provider_id));
    }
  }, [dispatch]);

  // ======================== gender =====================
  const [selectedOption, setSelectedOption] = useState(
    userData?.detail?.gender || ""
  );

  const options = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const handleValueChange = (e) => {
    if (e.target.value !== null) {
      setSelectedOption(e.target.value);
      setError((prevError) => ({ ...prevError, gender: "" }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        gender: e.target.value,
      }));
      // Additional actions like API calls can be handled here
    }
  };
  const [formData, setFormData] = useState({
    first_name: userData?.first_name ? userData.first_name : "",
    last_name: userData?.last_name ? userData.last_name : "",
    gender: selectedOption,
    email: userData?.email ? userData.email : "",
    organization: userData?.detail?.organization
      ? userData.detail.organization
      : "",
    provider_role_id: userData?.provider_detail?.provider_role_id
      ? userData?.provider_detail?.provider_role_id
      : "",
    provider_specialities: userData?.provider_detail?.specialities
      ? userData?.provider_detail?.specialities?.map(
          (val) => val?.speciality_id
        )
      : [],
    regular_hourly_rate: userData?.provider_detail?.regular_hourly_rate
      ? userData?.provider_detail?.regular_hourly_rate
      : "",
    holiday_hourly_rate: userData?.provider_detail?.holiday_hourly_rate
      ? userData?.provider_detail?.holiday_hourly_rate
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
    if (e.target.name === "country_id") {
      if (e.target.value) {
        dispatch(fetchStates(e.target.value));
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // ==================== errors being cleared on typing input ===============
    if (error[e.target.name]) {
      setError((prevError) => ({ ...prevError, [e.target.name]: "" }));
    }
  };

  const handlePhoneNumber = (value) => {
    if (value && !isPossiblePhoneNumber(value)) {
      setIsPossible(false);
    } else {
      setIsPossible(true);
    }
    dispatch(setField({ field: "phone", value: value }));
  };

  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  // ===============================api call===============================
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

    // Validate gender
    if (!formData.gender) {
      setError((prevError) => ({
        ...prevError,
        gender: "Gender is required!",
      }));
      hasError = true;
    }
    // Validate address line1
    if (!formData.address_line_1) {
      setError((prevError) => ({
        ...prevError,
        address_line_1: "Address line 1 is required!",
      }));
      hasError = true;
    }

    // Validate Provider Role
    if (!formData.provider_role_id) {
      setError((prevError) => ({
        ...prevError,
        provider_role_id: "Provider role is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, provider_role_id: "" }));
    }

    // Validate Medical Speciality
    if (
      !formData.provider_specialities ||
      formData?.provider_specialities.length === 0
    ) {
      setError((prevError) => ({
        ...prevError,
        provider_specialities: "Medical speciality is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, provider_specialities: "" }));
    }
    // Validate Regular Hourly Rate
    if (!formData.regular_hourly_rate || isNaN(formData.regular_hourly_rate)) {
      setError((prevError) => ({
        ...prevError,
        regular_hourly_rate:
          "Regular hourly rate is required and must be a number!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, regular_hourly_rate: "" }));
    }

    // Validate Holiday Hourly Rate
    if (!formData.holiday_hourly_rate || isNaN(formData.holiday_hourly_rate)) {
      setError((prevError) => ({
        ...prevError,
        holiday_hourly_rate:
          "Holiday hourly rate is required and must be a number!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, holiday_hourly_rate: "" }));
    }
    if (!hasError) {
      const handleEditBasicInfoData = new FormData();
      handleEditBasicInfoData.append("first_name", formData?.first_name);
      handleEditBasicInfoData.append("last_name", formData?.last_name);
      handleEditBasicInfoData.append(
        "gender",
        userData?.gender ? userData?.gender : formData?.gender
      );
      handleEditBasicInfoData.append("email", formData?.email);
      handleEditBasicInfoData.append(
        "provider_role_id",
        formData?.provider_role_id
      );
      handleEditBasicInfoData.append(
        "regular_hourly_rate",
        formData?.regular_hourly_rate
      );
      handleEditBasicInfoData.append(
        "holiday_hourly_rate",
        formData?.holiday_hourly_rate
      );
      handleEditBasicInfoData.append("phone", phoneValue);
      handleEditBasicInfoData.append("organization", formData?.organization);
      handleEditBasicInfoData.append("department", formData?.department);
      handleEditBasicInfoData.append("country_id", formData?.country_id);
      handleEditBasicInfoData.append("state_id", formData?.state_id);
      handleEditBasicInfoData.append("city", formData?.city);
      // Join provider_specialities array into a comma-separated string
      const specialities = formData?.provider_specialities.join(",");
      // Append provider_specialities as a comma-separated string
      handleEditBasicInfoData.append("provider_specialities", specialities);

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
        scrollToTop();
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
    <Box sx={{}}>
      {/* ============================= profile image code =============================== */}
      <BasicInfoProfileImage
        admin={admin}
        darkMode={darkMode}
        onFileSelect={handleFileSelect}
        filePath={`${baseURLImage}${userData?.detail?.photo}`}
      />

      {/* ================================ basic info form ============================ */}
      <CardCommon
        mt={3.5}
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
                Full Name{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
              <Tooltip
                arrow
                placement="top"
                title="Displayed on public forums, such as SHG."
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
          {/* ============================ Gender ============================== */}
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
                Gender <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <RadioToggleButton
                error={!selectedOption && error.gender ? true : false}
                options={options}
                selectedValue={selectedOption}
                onValueChange={handleValueChange}
                sx={{ textTransform: "capitalize" }}
              />
              <Typography variant="caption" color="error">
                {error.gender}
              </Typography>
            </Grid>
          </Grid>
          {/* ========================================================== */}
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
          {/* ================================== dep =================================== */}
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
          {/* ==================================provider Role=================================== */}
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
                Provider role{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <CommonSelect
                value={formData?.provider_role_id}
                // value={selectedCurrentData.provider_role_id}
                handleChange={handleChange}
                name={"provider_role_id"}
                placeholder={"Select provider role"}
                options={filterProviderRolesList}
                error={
                  !formData.provider_role_id && error.provider_role_id
                    ? true
                    : false
                }
              />
              <Typography variant="caption" color="error">
                {error.provider_role_id}
              </Typography>
            </Grid>
            {/* ================================== Provider Multi speciality=================================== */}
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
                  Medical Specialities{" "}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <MultipleSelectCheckmarks
                  from="basic"
                  name="provider_specialities"
                  options={filterMedicalSpecialities}
                  value={formData.provider_specialities}
                  onChange={(name, values) => {
                    setFormData({ ...formData, [name]: values });
                    setError((prevError) => ({
                      ...prevError,
                      provider_specialities: "",
                    }));
                  }} // Pass selected values
                  error={
                    !formData?.provider_specialities?.length === 0 ||
                    error.provider_specialities
                      ? true
                      : false
                  }
                />

                <Typography variant="caption" color="error">
                  {error?.provider_specialities}
                </Typography>
              </Grid>
            </Grid>

            {/* ================================== regular Rate=================================== */}
            <Grid container spacing={2} mb={3} mt={0.1}>
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
                  Regular hourly rate{" "}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  height={"2.6rem"}
                  name={"regular_hourly_rate"}
                  placeholder="e.g., 50"
                  value={formData.regular_hourly_rate}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <AttachMoneyOutlined sx={{ color: "text.secondary" }} />
                    ),
                    endAdornment: "/hr",
                  }}
                  error={
                    !formData.regular_hourly_rate && error.regular_hourly_rate
                      ? true
                      : false
                  }
                />
                <Typography variant="caption" color="error">
                  {error.holiday_hourly_rate}
                </Typography>
              </Grid>
            </Grid>
            {/* ==================================holiday Rate=================================== */}
            <Grid container spacing={2} mb={2}>
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
                  Holiday hourly rate{" "}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  height={"2.6rem"}
                  name={"holiday_hourly_rate"}
                  placeholder="e.g., 50"
                  value={formData.holiday_hourly_rate}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <AttachMoneyOutlined sx={{ color: "text.secondary" }} />
                    ),
                    endAdornment: "/hr",
                  }}
                  error={
                    !formData.holiday_hourly_rate && error.holiday_hourly_rate
                      ? true
                      : false
                  }
                />
                <Typography variant="caption" color="error">
                  {error.holiday_hourly_rate}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* ================================== address form =================================== */}
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
              sx={{
                textTransform: "capitalize",
              }}
            >
              {isLoading ? (
                <CircularProgress size={23} sx={{ color: "white" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </form>
      </CardCommon>
    </Box>
  );
};

export default BasicInformationTab;
