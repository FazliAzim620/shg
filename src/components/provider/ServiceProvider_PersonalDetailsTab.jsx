import { HeadingCommon } from "../../provider_portal/provider_components/settings/profile/HeadingCommon";
import CommonCardStyle from "../common/CommonCardStyle";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  fetchCountries,
  fetchStates,
} from "../../thunkOperation/job_management/providerInfoStep";
import RadioToggleButton from "../../components/RadioToggleButton";
import MultipleSelectCheckmarks from "../../components/common/MultipleSelectCheckmarks";
import { AttachMoneyOutlined } from "@mui/icons-material";
import { scrollToTop, selectOptions } from "../../util";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
} from "../../thunkOperation/job_management/states";
import { isPossiblePhoneNumber } from "libphonenumber-js";

import BasicInfoProfileImage from "../../provider_portal/provider_components/settings/BasicInfoProfileImage";
import API, { baseURLImage } from "../../API";
import { CommonInputField } from "../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../components/job-component/CommonSelect";
import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import ProfileImageAvatar from "../../pages/settings/ProfileImageAvatar";
import { providerDetails } from "../../feature/service_provider/serviceProvider";
import { BpCheckbox } from "../common/CustomizeCHeckbox";
import { CommonCreateableSelect } from "../job-component/CommonCreateableSelect";
import { IosCommonSwitch } from "../common/IosCommonSwitch";

const ServiceProvider_PersonalDetailsTab = ({ admin, provider_id }) => {
  const jobData = useSelector((state) => state.job);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const providerDetailsData = useSelector(
    (state) => state.providerDetails?.provider
  );
  const { users } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.theme.mode);
  const [avatarFile, setAvatarFile] = useState(null);
  const handleFileSelect = (file) => {
    setAvatarFile(file);
  };
  const dispatch = useDispatch();
  const [isPossible, setIsPossible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [providerSubRoles, setProviderSubRoles] = useState([]);
  const [phoneValue, setPhoneValue] = useState(providerDetailsData?.phone);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    provider_role: "",
    provider_sub_role: "",
    medical_speciality: [],
    license_state_id: [],
    pendingStateLicense: [],
    nonActiveStateLicense: [],
    regular_hourly_rate: "",
    holiday_hourly_rate: "",
    board_certified: "",
    has_imlc: false,
    board_eligible: "",
    BCE: "",
    NA: "",
    recruiter: "",
    recruiter_id: "",
    date_of_birth: "",
    social_security_number: "",
    nip: "",
  });
  useEffect(() => {
    if (providerDetailsData) {
      const activeLicenseIds = providerDetailsData?.license_states
        ?.filter((state) => state.provider_license_status === "Active")
        ?.map((state) => state.provider_license_state_id);
      const pendingLicenseIds = providerDetailsData?.license_states
        ?.filter((state) => state.provider_license_status === "Pending")
        ?.map((state) => state.provider_license_state_id);
      const nonActiveLicenseIds = providerDetailsData?.license_states
        ?.filter((state) => state.provider_license_status === "Non-active")
        ?.map((state) => state.provider_license_state_id);

      setFormData({
        name: providerDetailsData?.name || "",
        email: providerDetailsData?.email || "",
        phone: providerDetailsData?.phone || "",
        provider_role: providerDetailsData?.role?.id || "",
        provider_sub_role:
          providerDetailsData?.allied_health_clinician_type || "",
        medical_speciality: providerDetailsData?.specialities
          ? providerDetailsData?.specialities.map((val) => val?.speciality_id)
          : [],
        license_state_id: activeLicenseIds || [],
        pendingStateLicense: pendingLicenseIds || [],
        nonActiveStateLicense: nonActiveLicenseIds || [],
        regular_hourly_rate: providerDetailsData?.regular_hourly_rate || "",
        holiday_hourly_rate: providerDetailsData?.holiday_hourly_rate || "",
        board_certified: +providerDetailsData?.board_certified || "",
        BCE: +providerDetailsData?.board_certified_expired || "",
        has_imlc: +providerDetailsData?.has_imlc || "",
        board_eligible: +providerDetailsData?.board_eligible || "",
        board_certified_expired:
          +providerDetailsData?.board_certified_expired || "",
        NA:
          +providerDetailsData?.not_applicable_board_certification_and_eligibility ||
          "",
        recruiter_id: providerDetailsData?.recruiter?.id || "",
        date_of_birth: providerDetailsData?.date_of_birth || "",
        social_security_number:
          providerDetailsData?.social_security_number || "",
        nip: providerDetailsData?.nip || "",
      });
    }
  }, [providerDetailsData]);

  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    provider_role: "",
    provider_sub_role: "",
    medical_speciality: [],
    // license_state_id: "",
    regular_hourly_rate: "",
    holiday_hourly_rate: "",
    certifications: "",
    recruiter_id: "",
    date_of_birth: "",
    social_security_number: "",
    nip: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;

  //     if (name === "email") {
  //       setShowDropDown(true);
  //       const filtered = providerInfo?.filter((provider) =>
  //         provider?.email.toLowerCase().includes(value.toLowerCase())
  //       );
  //       setFilteredData(filtered);
  //     }

  //     // Handle other fields (e.g., email)
  //     dispatch(setField({ field: name, value }));

  //     // Clear the error for the specific field
  //     setError((prevError) => ({
  //       ...prevError,
  //       [name]: " ",
  //     }));
  //   };

  const { statesList, providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
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
  const { countries, states } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchProviderRoles());
    dispatch(fetchMedicalSpecialities());
    const data = { role: "recruiter", status: 1 };
    dispatch(fetchUsers(data));
  }, [dispatch]);

  // ====================== RecOptions ======================
  // const RecOptions = users?.data?.map((opt) => ({
  const usersArr = users.length > 0 ? users : users?.data;
  const RecOptions = usersArr?.map((opt) => ({
    label: opt?.name,
    value: opt?.id,
  }));
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };
  const contentRef = useRef(null);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  // =============================== api call ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;
    // Validate Name
    if (!formData?.name) {
      setError((prevError) => ({
        ...prevError,
        name: "Name is required!",
      }));
      hasError = true;
      scrollToTop();
    } else if (formData?.name.length < 3) {
      setError((prevError) => ({
        ...prevError,
        name: "Name should be at least 3 characters!",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, name: "" }));
    }

    // Validate Email
    if (!formData?.email) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required!",
      }));
      hasError = true;
      scrollToTop();
    } else if (!emailRegex.test(formData?.email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Invalid email format!",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, email: "" }));
    }

    // Validate Provider Role
    if (!formData?.provider_role) {
      setError((prevError) => ({
        ...prevError,
        provider_role: "Provider role is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, provider_role: "" }));
    }
    // Validate Provider sub Role
    if (
      !formData.provider_sub_role &&
      filterProviderRolesList?.find(
        (role) => role?.value === formData?.provider_role
      )?.label == "Allied Health Clinician"
    ) {
      setError((prevError) => ({
        ...prevError,
        provider_sub_role: "Provider sub role is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, provider_sub_role: "" }));
    }
    // Validate Medical Speciality===================================================

    if (formData?.provider_medical_speciality?.length === 0) {
      setError((prevError) => ({
        ...prevError,
        medical_speciality: "Atleast one dedical speciality is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, medical_speciality: "" }));
    }
    // Validate certification
    if (
      !formData?.board_certified &&
      !formData?.board_eligible &&
      !formData?.NA &&
      !formData?.BCE
    ) {
      setError((prevError) => ({
        ...prevError,
        certifications: "Atleast one certification is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, certifications: "" }));
    }

    if (hasError) return;

    if (!hasError) {
      setIsLoading(true);
      const handleProvData = new FormData();
      handleProvData.append("name", formData?.name);
      handleProvData.append(
        "phone",
        phoneValue ? phoneValue : providerDetails?.phone
      );
      handleProvData.append("email", formData?.email?.toLowerCase());
      handleProvData.append("provider_role", formData?.provider_role);
      handleProvData.append(
        "allied_health_clinician_type",
        formData?.provider_sub_role || ""
      );
      handleProvData.append(
        "medical_speciality",
        formData?.medical_speciality?.join(",")
      );
      handleProvData.append("recruiter_id", formData?.recruiter_id);

      handleProvData.append(
        "active_license_state_ids",
        formData?.license_state_id?.join(",")
      );
      handleProvData.append(
        "pending_license_state_ids",
        formData?.pendingStateLicense?.join(",")
      );
      handleProvData.append(
        "nonactive_license_state_ids",
        formData?.nonActiveStateLicense?.join(",")
      );
      handleProvData.append(
        "regular_hourly_rate",
        formData?.regular_hourly_rate
      );
      handleProvData.append(
        "holiday_hourly_rate",
        formData?.holiday_hourly_rate
      );
      handleProvData.append(
        "board_certified",
        formData?.board_certified ? 1 : 0
      );
      handleProvData.append("has_imlc", formData?.has_imlc ? 1 : 0);
      handleProvData.append("board_eligible", formData?.board_eligible ? 1 : 0);
      handleProvData.append("date_of_birth", formData?.date_of_birth);
      handleProvData.append("board_certified_expired", formData?.BCE ? 1 : 0);
      handleProvData.append(
        "not_applicable_board_certification_and_eligibility",
        formData?.NA ? 1 : 0
      );
      handleProvData.append(
        "social_security_number",
        formData?.social_security_number
      );
      handleProvData.append("nip", formData?.nip);
      handleProvData.append("id", providerDetailsData?.id);
      try {
        const response = await API.post("/api/add-provider", handleProvData);
        const data = response.data;

        if (data?.success) {
          dispatch(providerDetails(data?.data));
          setApiResponseYes(true);
          setApiResponse(data);
          setIsLoading(false);
          scrollToTop();
          setShowAlert(true);
        }
      } catch (error) {
        setIsLoading(false);
        console.log("err", error);
      }
    }
  };
  const getProviderSubRoles = async () => {
    try {
      const resp = await API.get(
        `/api/get-provider-subroles?role_id=${formData?.provider_role}`
      );
      if (resp?.data?.success) {
        setProviderSubRoles(resp?.data?.data);
      }
    } catch (error) {
      console.log(first);
    }
  };
  useEffect(() => {
    if (
      filterProviderRolesList?.find(
        (role) => role?.value === formData?.provider_role
      )?.label == "Allied Health Clinician"
    ) {
      getProviderSubRoles();
    }
  }, [formData?.provider_role]);

  const handleCustomInput = (newOption) => {
    setFormData({ ...formData, ["provider_sub_role"]: newOption });
  };
  const subroleOptions = providerSubRoles.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  return (
    <>
      <Box sx={{ mx: 2, mb: 2 }}>
        <HeadingCommon
          mb={"1rem"}
          fontSize={"14px"}
          title={"Personal Details"}
        />
        <CommonCardStyle>
          <form style={{ paddingTop: "20px" }} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
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
                  Provider full name{" "}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"name"}
                  placeholder="e.g., John Doe"
                  value={formData?.name}
                  // value={selectedCurrentData?.name}
                  onChange={handleChange}
                  type="text"
                  error={!formData?.name && error.name ? true : false}
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />
                <Typography variant="caption" color="error">
                  {error.name}
                </Typography>
              </Grid>
            </Grid>
            {/* ==================================email================================ */}
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
                  name={"email"}
                  value={formData?.email}
                  onChange={handleChange}
                  type="text"
                  error={!formData?.email && error.email ? true : false}
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />

                <Typography variant="caption" color="error">
                  {error.email}
                </Typography>
              </Grid>
            </Grid>
            {/* ==================================phone================================ */}
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
                  Phone
                  {/* <span style={{ color: "#8c98a4" }}>(Optional)</span> */}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name="phone"
                  placeholder="+x(xxx)xxx-xx-xx"
                  value={formData?.phone}
                  // value={selectedCurrentData.phone}
                  onChange={(e) => {
                    setPhoneValue(e);
                  }}
                  type={"phone"}
                  isPhoneNumber={"phone"}
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
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
            {/* ==================================d o b================================ */}
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
                  Date of birth{" "}
                  {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"date_of_birth"}
                  value={formData?.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  error={
                    !formData?.date_of_birth && error?.date_of_birth
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />

                <Typography variant="caption" color="error">
                  {error?.date_of_birth}
                </Typography>
              </Grid>
            </Grid>
            {/* ================================social secuirity no.======================= */}
            {/* <Grid container spacing={2} mt={1}>
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
                  Social security number 
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"social_security_number"}
                  value={formData?.social_security_number}
                  onChange={handleChange}
                  type="number"
                  error={
                    !formData?.social_security_number &&
                    error?.social_security_number
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />

                <Typography variant="caption" color="error">
                  {error?.social_security_number}
                </Typography>
              </Grid>
            </Grid> */}
            {/* ==================================nip================================ */}
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
                  NPI#
                  {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"nip"}
                  value={formData?.nip}
                  onChange={handleChange}
                  type="number"
                  error={!formData?.nip && error?.nip ? true : false}
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />
                <Typography variant="caption" color="error">
                  {error?.nip}
                </Typography>
              </Grid>
            </Grid>
            {/* ================================== Provider role================================ */}
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
                  Provider role
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonSelect
                  value={formData?.provider_role}
                  // value={selectedCurrentData.provider_role}
                  handleChange={handleChange}
                  name={"provider_role"}
                  placeholder={"Select provider role"}
                  options={filterProviderRolesList}
                  error={
                    !formData?.provider_role && error.provider_role
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />
                <Typography variant="caption" color="error">
                  {error.provider_role}
                </Typography>
              </Grid>
            </Grid>
            {filterProviderRolesList?.find(
              (role) => role?.value === formData?.provider_role
            )?.label == "Allied Health Clinician" ? (
              <Grid container spacing={2} mt={1}>
                <Grid item xs={3} sx={{}}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Provider Sub Role <span style={{ color: "red" }}>*</span>{" "}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CommonCreateableSelect
                    name="provider_sub_role"
                    options={subroleOptions}
                    value={formData?.provider_sub_role}
                    handleChange={handleChange}
                    placeholder="Select or enter allied health clinician type"
                    handleCustomInput={handleCustomInput}
                  />
                  {error?.provider_sub_role && (
                    <div
                      style={{
                        color: "#d32f2f",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {error.provider_sub_role}
                    </div>
                  )}
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            {/* ================================== Provider Multi speciality ====================== */}
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
                  width={"900px"}
                  name="medical_speciality"
                  options={filterMedicalSpecialities} // The array of options { value, label }
                  value={formData?.medical_speciality} // Pass the current medical_speciality
                  onChange={(e, value) =>
                    setFormData({ ...formData, [e]: value })
                  }
                  error={
                    !formData?.medical_speciality?.length === 0 ||
                    error.social_security_number
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />

                {/* <Typography variant="caption" color="error">
                  {error?.medicalSpecialty}
                </Typography> */}
              </Grid>
            </Grid>
            {/* ================================Recruiter=============================== */}
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
                  Recruiter
                  {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonSelect
                  name="recruiter_id"
                  value={formData?.recruiter_id}
                  handleChange={handleChange}
                  placeholder="Select Recruiter"
                  options={RecOptions}
                  error={
                    !formData?.recruiter_id && error.recruiter_id ? true : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />
              </Grid>
            </Grid>
            {/* =======================certifications============================= */}
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
                  Board certification/eligibility{" "}
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
                          !formData?.board_certified && "checkbox"
                        }`}
                        checked={formData?.board_certified}
                        // onChange={handleChange}
                        onChange={handleCheckboxChange}
                        name="board_certified"
                        disabled={
                          !permissions?.includes(
                            "update service providers info"
                          )
                        }
                      />
                    }
                    label="Board Certified (BC)"
                  />
                  <FormControlLabel
                    control={
                      <BpCheckbox
                        className={`${!formData?.board_eligible && "checkbox"}`}
                        size="small"
                        checked={formData?.board_eligible}
                        // checked={
                        //   selectedCurrentData.board_eligible === 1
                        //     ? true
                        //     : false
                        // }
                        disabled={
                          !permissions?.includes(
                            "update service providers info"
                          )
                        }
                        onChange={handleCheckboxChange}
                        name="board_eligible"
                      />
                    }
                    label="Board Eligible (BE)"
                  />
                  <FormControlLabel
                    control={
                      <BpCheckbox
                        className={`${!formData?.BCE && "checkbox"}`}
                        size="small"
                        checked={formData?.BCE}
                        disabled={
                          !permissions?.includes(
                            "update service providers info"
                          )
                        }
                        onChange={handleCheckboxChange}
                        name="BCE"
                      />
                    }
                    label="BCE"
                  />
                  <FormControlLabel
                    control={
                      <BpCheckbox
                        className={`${!formData?.NA && "checkbox"}`}
                        size="small"
                        checked={formData?.NA}
                        // checked={
                        //   selectedCurrentData.board_eligible === 1
                        //     ? true
                        //     : false
                        // }
                        disabled={
                          !permissions?.includes(
                            "update service providers info"
                          )
                        }
                        onChange={handleCheckboxChange}
                        name="NA"
                      />
                    }
                    label="N/A"
                  />
                </FormGroup>
                <Typography variant="caption" color="error">
                  {error.certifications}
                </Typography>
              </Grid>
            </Grid>
            {/* =======================IMLC  ============================= */}
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
                  Do you have IMLC?
                  {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                </Typography>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <IosCommonSwitch
                      checked={formData?.has_imlc}
                      onChange={handleCheckboxChange}
                      name="has_imlc"
                      size="small"
                    />
                  }
                  label={formData?.has_imlc ? "Yes" : "No"}
                />
              </Grid>
            </Grid>
            {/* =======================active state licenses============================= */}
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
                  Active State licenses{""}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <MultipleSelectCheckmarks
                  width={"900px"}
                  name="license_state_id"
                  options={stateOptions}
                  value={formData?.license_state_id}
                  onChange={(e, value) => {
                    setFormData({ ...formData, ["license_state_id"]: value });

                    setError((prevError) => ({
                      ...prevError,
                      license_state_id: "",
                    }));
                  }}
                  error={
                    !jobData.license_state_id && error.license_state_id
                      ? true
                      : false
                  }
                />
                {/* <CommonSelect
                  name="license_state_id"
                  value={formData?.license_state_id}
                  // value={selectedCurrentData.sta_id}
                  handleChange={handleChange}
                  placeholder="Select state license"
                  options={stateOptions}
                  error={
                    !formData?.license_state_id && error.license_state_id
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                /> */}
                <Typography variant="caption" color="error">
                  {error.license_state_id}
                </Typography>
              </Grid>
            </Grid>
            {/* =======================pending active state licenses============================= */}
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
                  Pending State licenses{""}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <MultipleSelectCheckmarks
                  width={"900px"}
                  name="pendingStateLicense"
                  options={stateOptions}
                  value={formData?.pendingStateLicense}
                  onChange={(e, value) => {
                    setFormData({
                      ...formData,
                      ["pendingStateLicense"]: value,
                    });
                  }}
                />

                <Typography variant="caption" color="error">
                  {error.license_state_id}
                </Typography>
              </Grid>
            </Grid>
            {/* ======================= non active state licenses============================= */}
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
                  Expired
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <MultipleSelectCheckmarks
                  width={"900px"}
                  name="nonActiveStateLicense"
                  options={stateOptions}
                  value={formData?.nonActiveStateLicense}
                  onChange={(e, value) => {
                    setFormData({
                      ...formData,
                      ["nonActiveStateLicense"]: value,
                    });
                  }}
                />

                <Typography variant="caption" color="error">
                  {error.license_state_id}
                </Typography>
              </Grid>
            </Grid>
            {/* ================================== regular Rate=================================== */}
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
                  Regular hourly rate{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"regular_hourly_rate"}
                  placeholder="e.g., 50"
                  value={formData?.regular_hourly_rate}
                  // value={selectedCurrentData.holiday_hourly_rate}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: <AttachMoneyOutlined />,
                    endAdornment: "/hr",
                  }}
                  error={
                    !formData?.regular_hourly_rate && error.regular_hourly_rate
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />
                <Typography variant="caption" color="error">
                  {error?.regular_hourly_rate}
                </Typography>
              </Grid>
            </Grid>
            {/* ================================== holiday Rate=================================== */}
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
                  Holiday hourly rate{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"holiday_hourly_rate"}
                  placeholder="e.g., 60"
                  value={formData?.holiday_hourly_rate}
                  // value={selectedCurrentData.regular_hourly_rate}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: <AttachMoneyOutlined />,
                    endAdornment: "/hr",
                  }}
                  error={
                    !formData?.holiday_hourly_rate && error.holiday_hourly_rate
                      ? true
                      : false
                  }
                  disabled={
                    !permissions?.includes("update service providers info")
                  }
                />
                <Typography variant="caption" color="error">
                  {error.holiday_hourly_rate}
                </Typography>
              </Grid>
            </Grid>
            {/* ===========================overtimerate rate============================ */}
            {/* <Grid container spacing={2} mt={1}>
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
                  Overtime hourly rate
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name={"overtime_hourly_rate"}
                  placeholder="e.g., 100"
                  value={formData?.overTimeHourlyRate}
                  // value={selectedCurrentData.regular_hourly_rate}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: <AttachMoneyOutlined />,
                    endAdornment: "/hr",
                  }}
                />
              </Grid>
            </Grid> */}
            {/* ===========================save button=========================== */}
            {showAlert &&
              apiResponseYes &&
              (apiResponse?.error ? (
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                  {apiResponse?.msg}
                </Alert>
              ) : (
                <Alert
                  sx={{ mt: 2 }}
                  severity="success"
                  onClose={() => setShowAlert(false)}
                >
                  {apiResponse?.msg}
                </Alert>
              ))}
            {permissions?.includes("update service providers info") ? (
              <Box sx={{ textAlign: "right", pt: 2, pb: "2rem" }}>
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
            ) : (
              ""
            )}
          </form>
        </CommonCardStyle>
      </Box>
    </>
  );
};

export default ServiceProvider_PersonalDetailsTab;
