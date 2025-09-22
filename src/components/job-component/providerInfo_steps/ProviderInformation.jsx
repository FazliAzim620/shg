import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Button,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import CustomBadge from "../../CustomBadge";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CommonInputField } from "../CreateJobModal";
import { AttachMoneyOutlined, Close } from "@mui/icons-material";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { editJobProvider } from "../../../thunkOperation/job_management/states";
import {
  fetchJobDetail,
  fetchShiftSchedules,
} from "../../../thunkOperation/job_management/providerInfoStep";
import { setJobId } from "../../../feature/providerConfirmationLetter";
import { setJobId as setClientJobId } from "../../../feature/clientConfirmationLetter";
import { updateSection } from "../../../feature/budgetPreferenceSlice";
import { useParams } from "react-router-dom";
import { CommonSelect } from "../CommonSelect";
import { scrollToTop, selectOptions } from "../../../util";
import { addNewUser, updateNewUserData } from "../../../feature/jobSlice";
import { BpCheckbox } from "../../common/CustomizeCHeckbox";
import { getLocation } from "../../../api_request";
const ProviderInformation = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const job_id = parseInt(useParams()?.id);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const { newUserData, providerRolesList, statesList, medicalSpecialities } =
    useSelector((state) => state.job);
  const { newClientData } = useSelector((state) => state.client);
  const [isPossible, setIsPossible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    email: "",
    providerRole: "",
    medicalSpecialty: "",
    certifications: "",
    stateLicense: "",
    p_regular_hourly_rate: "",
    p_holiday_hourly_rate: "",
  });
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  useEffect(() => {
    setEditedData(newUserData);
    dispatch(fetchJobDetail(params?.id));
    // dispatch(getJobAttachment({ jobId: params.id, type: "provider" }));
    dispatch(setJobId(params?.id));
    // dispatch(getJobAttachment({ jobId: params.id, type: "client" }));
    dispatch(setClientJobId(params?.id));
    dispatch(updateSection({ field: "clientId", value: newClientData?.id }));
    dispatch(updateSection({ field: "jobId", value: params?.id }));
    dispatch(fetchShiftSchedules(params?.id));
  }, [newUserData]);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setError((prevError) => ({ ...prevError, [field]: "" }));
  };
  const handlePhoneNumber = (value) => {
    setError((prevError) => ({ ...prevError, ["phone"]: "" }));
    if (value && !isPossiblePhoneNumber(value)) {
      setIsPossible(false);
    } else {
      setIsPossible(true);
    }

    setEditedData((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };
  const handleDiscard = () => {
    setEditedData(newUserData);
    setIsEditing(false);
    setError({
      name: "",
      email: "",
      providerRole: "",
      medicalSpecialty: "",
      certifications: "",
      stateLicense: "",
      p_regular_hourly_rate: "",
      p_holiday_hourly_rate: "",
    });
  };
  const [country, setCountry] = useState(null);
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
  // ===============handle save api call========================
  const handleSave = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;

    // Validate Name
    if (!editedData?.name) {
      setError((prevError) => ({
        ...prevError,
        name: "Name is required!",
      }));
      scrollToTop();
      hasError = true;
    } else if (!editedData?.name?.trim() || editedData?.name?.length < 3) {
      setError((prevError) => ({
        ...prevError,
        name: "Name should be at least 3 characters",
      }));
      scrollToTop();
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, name: "" }));
    }

    // Validate Email
    if (!editedData?.email) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required!",
      }));
      scrollToTop();
      hasError = true;
    } else if (!emailRegex.test(editedData?.email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Invalid email format",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, email: "" }));
    }

    // Validate Phone Number
    if (
      !editedData?.phone?.trim() ||
      !isPossiblePhoneNumber(editedData?.phone)
    ) {
      setError((prevError) => ({
        ...prevError,
        phone: "Invalid phone number!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, phone: "" }));
    }
    // Validate Provider Role
    if (!editedData.provider_role_id) {
      setError((prevError) => ({
        ...prevError,
        providerRole: "Provider role is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, providerRole: "" }));
    }

    // Validate Medical Speciality
    if (!editedData.medical_speciality_id) {
      setError((prevError) => ({
        ...prevError,
        medicalSpecialty: "Medical speciality is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, medicalSpecialty: "" }));
    }

    // Validate Medical Speciality
    if (!editedData?.board_certified && !editedData?.board_eligible) {
      setError((prevError) => ({
        ...prevError,
        certifications: "Atleast one certification is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, certifications: "" }));
    }

    // Validate State License
    if (!editedData.license_state_id) {
      setError((prevError) => ({
        ...prevError,
        stateLicense: "State license is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, stateLicense: "" }));
    }
    // Validate Regular Rate
    if (!editedData?.p_regular_hourly_rate) {
      setError((prevError) => ({
        ...prevError,
        p_regular_hourly_rate: "Regular rate is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, p_regular_hourly_rate: "" }));
    }

    // Validate Holiday Rate
    if (!editedData?.p_holiday_hourly_rate) {
      setError((prevError) => ({
        ...prevError,
        p_holiday_hourly_rate: "Holiday rate is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, p_holiday_hourly_rate: "" }));
    }

    if (!hasError) {
      setIsLoading(true);
      const obj = {
        id: editedData?.id,
        job_id: job_id ? job_id : editedData?.id,
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
        provider_role: editedData?.provider_role_id,
        medical_speciality: editedData?.medical_speciality_id,
        license_state_id: editedData?.license_state_id,
        board_certified: editedData.board_certified ? 1 : 0,
        board_eligible: editedData.board_eligible ? 1 : 0,
        regular_hourly_rate: editedData.p_regular_hourly_rate,
        regular_rate_type: editedData.p_regular_rate_type || 'hourly',
        holiday_hourly_rate: editedData.p_holiday_hourly_rate,
        holiday_rate_type: editedData.p_holiday_rate_type || 'hourly',
        overtime_hourly_rate: parseInt(editedData.p_overtime_hourly_rate),
        overtime_rate_type: editedData.p_overtime_rate_type || 'hourly',
        from_job_management: true,
      };

      const resultAction = await dispatch(editJobProvider(obj));
      if (editJobProvider.fulfilled.match(resultAction)) {
        // dispatch(addNewUser(resultAction?.payload?.data));
        if (resultAction?.payload?.data) {
          dispatch(updateNewUserData(resultAction?.payload?.data));
        }
        dispatch(fetchJobDetail(params?.id));
        setIsEditing(false);
        setIsLoading(false);
      }
    }
  };

  //---------------------===============---------------------== CloseEditHandler ==---------------------===============---------------------
console.log('new user',newUserData)
  const closeEditHandler = () => {
    setIsEditing(false);
    setError({
      name: "",
      email: "",
      providerRole: "",
      medicalSpecialty: "",
      certifications: "",
      stateLicense: "",
      p_regular_hourly_rate: "",
      p_holiday_hourly_rate: "",
    });
  };
  useEffect(() => {
    getLocation()
      .then((data) => {
        setCountry(data.countryCode);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (isEditing) {
    return (
      <Card sx={{ boxShadow: "none", borderRadius: ".6875rem" }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "-3px",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: ".98438rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "text.black",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  Provider information
                  <CustomBadge
                    color={"rgba(0, 201, 167)"}
                    bgcolor="rgba(0, 201, 167, .1)"
                    text={"Completed"}
                  />
                </Box>
              </Typography>
            </Box>

            <Button
              onClick={closeEditHandler}
              variant="outlined"
              color="primary"
              sx={{
                justifyContent: "flex-end",
                textTransform: "capitalize",
                color: "text.link",
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                lineHeight: 1.2,
                p: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "background.paper",
                  border: "none",
                },
                "&:focus": {
                  bgcolor: "background.paper",
                  outline: "none",
                },
              }}
            >
              <Close />
            </Button>
          </Box>
          <Divider
            sx={{
              borderColor:
                darkMode == "dark"
                  ? "rgba(255, 255, 255, .7"
                  : "rgba(231, 234, 243, 01)",
            }}
          />
          <Grid container spacing={2} sx={{ mb: 2, mt: 1, px: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Full name
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <CommonInputField
                name={"name"}
                placeholder="e.g., John Doe"
                value={editedData?.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                type="text"
                error={!editedData?.name && error.name ? true : false}
              />
              <Typography variant="caption" color="error">
                {error?.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Email <span style={{ color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <CommonInputField
                error={!editedData?.emai && error.email ? true : false}
                name={"email"}
                placeholder="(e.g., mark@site.com)"
                value={editedData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                type="text"
              />
              <Typography variant="caption" color="error">
                {error.email}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Phone
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <PhoneInput
                international
                placeholder={"+x(xxx)xxx-xx-xx"}
                value={editedData?.["phone"] || ""}
                onChange={handlePhoneNumber}
                // name={name}
                // className={!darkMode && `dark`}
                style={{
                  paddingLeft: "0.8rem",
                  borderRadius: 5,
                  height: "2.8rem",
                  color: darkMode ? "black" : "white",
                  background: darkMode ? "#F7F9FC" : "#333",
                }}
                defaultCountry={country}
              />

              {(!isPossible || error?.phone) && (
                <Typography
                  sx={{ color: "text.error", mb: "1.5rem" }}
                  variant="caption"
                >
                  Invalid phone number!
                </Typography>
              )}
            </Grid>
          </Grid>
          {/* ===========================dropdown============================== */}
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
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
                Provider role
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <CommonSelect
                value={editedData?.provider_role_id}
                // value={selectedCurrentData.provider_role_id}
                handleChange={(e) => {
                  handleInputChange("provider_role_id", e.target.value);
                  setError((prevError) => ({ ...prevError, providerRole: "" }));
                }}
                name={"providerRole"}
                placeholder={"Select provider role"}
                options={filterProviderRolesList}
                error={
                  !editedData.provider_role_id && error.providerRole
                    ? true
                    : false
                }
              />
              <Typography variant="caption" color="error">
                {error.providerRole}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
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
                Medical speciality{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <CommonSelect
                name="medicalSpecialty"
                // value={selectedCurrentData.medical_speciality_id}
                value={editedData.medical_speciality_id}
                handleChange={(e) => {
                  handleInputChange("medical_speciality_id", e.target.value);
                  setError((prevError) => ({
                    ...prevError,
                    medicalSpecialty: "",
                  }));
                }}
                placeholder="Select medical speciality"
                options={filterMedicalSpecialities}
                error={
                  !editedData.medical_speciality_id && error.medicalSpecialty
                    ? true
                    : false
                }
              />
              <Typography variant="caption" color="error">
                {error.medicalSpecialty}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
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
                Board certified/eligibility{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <BpCheckbox
                      size="small"
                      className={`${
                        editedData?.board_certified !== 1 && "checkbox"
                      }`}
                      checked={editedData?.board_certified === 1 ? true : false}
                      onChange={(e) => {
                        handleInputChange(
                          "board_certified",
                          editedData?.board_certified === 1 ? 0 : 1
                        );
                        setError((prevError) => ({
                          ...prevError,
                          certifications: "",
                        }));
                      }}
                      name="board_certified"
                    />
                  }
                  label="Board Certified (BC)"
                />
                <FormControlLabel
                  control={
                    <BpCheckbox
                      className={`${
                        editedData?.board_eligible !== 1 && "checkbox"
                      }`}
                      size="small"
                      checked={editedData?.board_eligible === 1 ? true : false}
                      onChange={(e) => {
                        handleInputChange(
                          "board_eligible",
                          editedData?.board_eligible === 1 ? 0 : 1
                        );
                        setError((prevError) => ({
                          ...prevError,
                          certifications: "",
                        }));
                      }}
                      name="board_eligible"
                    />
                  }
                  label="Board Eligible (BE)"
                />
              </FormGroup>
              <Typography variant="caption" color="error">
                {error.certifications}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
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
                State licenses{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <CommonSelect
                name="stateLicense"
                value={editedData?.license_state_id}
                handleChange={(e) => {
                  handleInputChange("license_state_id", e.target.value);
                }}
                placeholder="Select state license"
                options={stateOptions}
                error={
                  !editedData.license_state_id && error.stateLicense
                    ? true
                    : false
                }
              />
              <Typography variant="caption" color="error">
                {error.stateLicense}
              </Typography>
            </Grid>
          </Grid>
          {/* ========================================================= */}
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Regular rate ({editedData?.p_regular_rate_type === 'daily' ? 'per day' : 'per hour'}) <span style={{ color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} sx={{ display: 'flex', alignItems: 'center' }}>
              <CommonInputField
                error={
                  !editedData?.p_regular_hourly_rate &&
                  error.p_regular_hourly_rate
                    ? true
                    : false
                }
                name={"p_regular_hourly_rate"}
                placeholder="e.g., 50"
                value={editedData?.p_regular_hourly_rate || ""}
                onChange={(e) =>
                  handleInputChange("p_regular_hourly_rate", e.target.value)
                }
                type="number"
                InputProps={{
                  startAdornment: <AttachMoneyOutlined />,
                  endAdornment: editedData?.p_regular_rate_type === 'daily' ? '/day' : '/hr',
                }}
              />
              <Select
                name="p_regular_rate_type"
                value={editedData?.p_regular_rate_type || 'hourly'}
                onChange={(e) =>
                  handleInputChange("p_regular_rate_type", e.target.value)
                }
                size="small"
                sx={{
                  minWidth: "120px",
                  ml: 1,
                  backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                  color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                  border:
                    darkMode === "dark"
                      ? `1.5px solid rgba(231, 234, 243, .7)`
                      : "none",
                }}
                input={
                  <OutlinedInput
                    sx={{
                      height: "2.6rem",
                      "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                        {
                          padding: 0,
                        },
                      fontSize: "0.875rem",
                      border: `none`,
                      "&.Mui-focused": {
                        backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      },
                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          border: `1.5px solid rgba(231, 234, 243, .7)`,
                        },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                }
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
              <Typography variant="caption" color="error">
                {error.p_regular_hourly_rate}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Holiday rate ({editedData?.p_holiday_rate_type === 'daily' ? 'per day' : 'per hour'}) <span style={{ color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} sx={{ display: 'flex', alignItems: 'center' }}>
              <CommonInputField
                error={
                  !editedData?.p_holiday_hourly_rate &&
                  error.p_holiday_hourly_rate
                    ? true
                    : false
                }
                name={"p_holiday_hourly_rate"}
                placeholder="e.g., 50"
                value={editedData?.p_holiday_hourly_rate || ""}
                onChange={(e) =>
                  handleInputChange("p_holiday_hourly_rate", e.target.value)
                }
                type="number"
                InputProps={{
                  startAdornment: <AttachMoneyOutlined />,
                  endAdornment: editedData?.p_holiday_rate_type === 'daily' ? '/day' : '/hr',
                }}
              />
              <Select
                name="p_holiday_rate_type"
                value={editedData?.p_holiday_rate_type || 'hourly'}
                onChange={(e) =>
                  handleInputChange("p_holiday_rate_type", e.target.value)
                }
                size="small"
                sx={{
                  minWidth: "120px",
                  ml: 1,
                  backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                  color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                  border:
                    darkMode === "dark"
                      ? `1.5px solid rgba(231, 234, 243, .7)`
                      : "none",
                }}
                input={
                  <OutlinedInput
                    sx={{
                      height: "2.6rem",
                      "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                        {
                          padding: 0,
                        },
                      fontSize: "0.875rem",
                      border: `none`,
                      "&.Mui-focused": {
                        backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      },
                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          border: `1.5px solid rgba(231, 234, 243, .7)`,
                        },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                }
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
              <Typography variant="caption" color="error">
                {error.p_holiday_hourly_rate}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 12px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Overtime rate ({editedData?.p_overtime_rate_type === 'daily' ? 'per day' : 'per hour'})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} sx={{ display: 'flex', alignItems: 'center' }}>
              <CommonInputField
                name={"p_overtime_hourly_rate"}
                placeholder="e.g., 50"
                value={editedData?.p_overtime_hourly_rate || ""}
                onChange={(e) =>
                  handleInputChange("p_overtime_hourly_rate", e.target.value)
                }
                type="number"
                InputProps={{
                  startAdornment: <AttachMoneyOutlined />,
                  endAdornment: editedData?.p_overtime_rate_type === 'daily' ? '/day' : '/hr',
                }}
              />
              <Select
                name="p_overtime_rate_type"
                value={editedData?.p_overtime_rate_type || 'hourly'}
                onChange={(e) =>
                  handleInputChange("p_overtime_rate_type", e.target.value)
                }
                size="small"
                sx={{
                  minWidth: "120px",
                  ml: 1,
                  backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                  color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                  border:
                    darkMode === "dark"
                      ? `1.5px solid rgba(231, 234, 243, .7)`
                      : "none",
                }}
                input={
                  <OutlinedInput
                    sx={{
                      height: "2.6rem",
                      "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                        {
                          padding: 0,
                        },
                      fontSize: "0.875rem",
                      border: `none`,
                      "&.Mui-focused": {
                        backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      },
                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          border: `1.5px solid rgba(231, 234, 243, .7)`,
                        },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                }
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
            </Grid>
          </Grid>
          {permissions?.includes("create job management info") ? (
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mr: 2 }}
            >
              <Button
                onClick={handleDiscard}
                sx={{
                  mr: 1,
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
              {isLoading ? (
                <Button variant="contained" color="primary" sx={{ px: 7 }}>
                  <CircularProgress size={18} sx={{ color: "white" }} />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "inherit" }}
                  onClick={handleSave}
                >
                  Save changes
                </Button>
              )}
            </Box>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card
      sx={{
        boxShadow: "none",
        borderRadius: ".6875rem  ",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontSize: ".98438rem",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "text.black",
            }}
          >
            Provider information
            <CustomBadge
              ml={6.3}
              color={"rgba(0, 201, 167)"}
              bgcolor="rgba(0, 201, 167, .1)"
              text={"Completed"}
            />
          </Typography>
          {permissions?.includes("create job management info") ? (
            <Button
              onClick={handleEditClick}
              variant="outlined"
              color="primary"
              sx={{
                justifyContent: "flex-end",
                textTransform: "capitalize",
                color: "text.link",
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                lineHeight: 1.2,
                p: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "background.paper",
                  border: "none",
                  color: "blue",
                },
                "&:focus": {
                  bgcolor: "background.paper",
                  outline: "none",
                },
              }}
            >
              Edit
            </Button>
          ) : (
            ""
          )}
        </Box>
        <Divider
          sx={{
            borderColor:
              darkMode == "dark"
                ? "rgba(255, 255, 255, .7"
                : "rgba(231, 234, 243, 01)",
          }}
        />
        <Grid container spacing={2} sx={{ mt: 1, p: 2 }}>
          {[
            { label: "Full name:", value: newUserData?.name },
            {
              label: "Provider role:",
              value: providerRolesList?.find(
                (item) => item.id == newUserData?.provider_role_id
              )?.name,
            },

            { label: "Email:", value: newUserData?.email },
            { label: "Phone:", value: newUserData?.phone },
            {
              label: "Medical speciality:",
              value: medicalSpecialities?.find(
                (item) => item.id == newUserData?.medical_speciality_id
              )?.name,
            },

            {
              label: "Board certifications:",
              value: newUserData?.board_certified ? "Yes" : "N/A",
            },
            {
              label: "Board eligibility:",
              value: newUserData?.board_eligible ? "Yes" : "N/A",
            },
            {
              label: `Regular rate (${newUserData?.p_regular_rate_type === 'daily' ? 'per day' : 'per hour'}):`,
              value: `$ ${newUserData?.p_regular_hourly_rate}`,
            },
            {
              label: `Holiday rate (${newUserData?.p_holiday_rate_type === 'daily' ? 'per day' : 'per hour'}):`,
              value: `$ ${newUserData?.p_holiday_hourly_rate}`,
            },
            {
              label: `Overtime rate (${newUserData?.p_overtime_rate_type === 'daily' ? 'per day' : 'per hour'}):`,
              value: newUserData?.p_overtime_hourly_rate
                ? `$ ${newUserData?.p_overtime_hourly_rate}`
                : "NA",
            },
          ].map((item, index) => (
            <Grid container key={index} spacing={2} sx={{ px: 2 }}>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "14px", fontWeight: 400, pt: 1.5 }}
                >
                  {item.label}
                </Typography>
              </Grid>
              <Grid item xs={6} md={9}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "text.black",
                    pt: 1.5,
                    textTransform: item.label !== "Email:" && "capitalize",
                  }}
                >
                  {item.value}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProviderInformation;
