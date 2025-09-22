import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
  Divider,
  Grid,
  FormGroup,
  Checkbox,
  Alert,
  IconButton,
  Switch,
  OutlinedInput,
} from "@mui/material";
import savemIcon from "../../assets/svg/icons/saveme.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setField,
  resetField,
  updateCertificate,
} from "../../feature/jobSlice";
import { AttachMoneyOutlined, Close } from "@mui/icons-material";
import { CommonSelect } from "./CommonSelect";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  fetchProvidersInfo,
  fetchStates,
  saveJobHandler,
} from "../../thunkOperation/job_management/states";
import ErrorAlert from "../ErrorAlert";
import { useLocation, useNavigate } from "react-router-dom";
import { selectOptions } from "../../util";
import API from "../../API";
import MultipleSelectCheckmarks from "../common/MultipleSelectCheckmarks";
import { current } from "@reduxjs/toolkit";
import { BpCheckbox } from "../common/CustomizeCHeckbox";
import { setAlert } from "../../feature/alert-message/alertSlice";
import { getLocation } from "../../api_request";
import { CommonCreateableSelect } from "./CommonCreateableSelect";
import { IosCommonSwitch } from "../common/IosCommonSwitch";
import { styled } from "@mui/material";
const CreateJobModal = ({
  open,
  onClose,
  from,
  getTableProviders,
  getProviderCountsHandlder,
  filterExistingProvider,
  providerInfo,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { userLocation } = useSelector((state) => state.login);
  const [filteredData, setFilteredData] = useState([]);
  const mode = useSelector((state) => state.theme.mode);
  const jobData = useSelector((state) => state.job);

  const {
    statesList,
    providerRolesList,
    medicalSpecialities,
    status,
    jobsTableData,
  } = useSelector((state) => state.job);
  const [selectedCurrentData, setSelectedCurrentData] = useState([]);
  const [recruitersData, setRecruitersData] = useState([]);
  const [isExisting, setIsExisting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getRecruiter = async (role) => {
    try {
      const resp = await API.get(`/api/get-users?role=${role}`);
      if (resp?.data?.success) {
        setIsLoading(false);
        setRecruitersData(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRecruiter("recruiter");
  }, []);
  useEffect(() => {
    if (state?.from === "service provider") {
      handleSelect(state?.provider);
    }
  }, [state]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showError, setShowError] = useState(null);
  const [error, setError] = useState({
    addNew: "",
    providerFullName: "",
    provider_sub_role: "",
    email: "",
    providerRole: "",
    medicalSpecialty: "",
    certifications: "",
    stateLicense: "",
    regularHourlyRate: "",
    holidayHourlyRate: "",
  });

  const [providerSubRoles, setProviderSubRoles] = useState([]);
  const selectedProviderSpecialities = selectedCurrentData?.specialities;
  // const [filterExistingProvider, setfilterExistingProvider] = useState([]);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);
  const [stateOptions, setstateOptions] = useState([]);

  const existingSpecialities = selectedProviderSpecialities?.map((opt) => ({
    label: opt?.speciality_name,
    value: opt?.speciality_id,
  }));

  useEffect(() => {
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setAllSpecialitiesOptions(selectOptions(medicalSpecialities));
    setstateOptions(selectOptions(statesList));
  }, [providerRolesList, medicalSpecialities, statesList]);

  const RecOptions = recruitersData?.map((opt) => ({
    label: opt?.name,
    value: opt?.id,
  }));

  const [isPossible, setIsPossible] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "provider") {
      const currentProvider = providerInfo?.filter(
        (provider) => provider?.id === value
      );
      // setSelectedCurrentData(currentProvider?.[0]);
      handleSelect(currentProvider?.[0]);
    }
    if (name === "email") {
      setShowDropDown(true);
      const filtered = providerInfo?.filter((provider) =>
        provider?.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }

    // Handle other fields (e.g., email)
    dispatch(setField({ field: name, value }));

    // Clear the error for the specific field
    setError((prevError) => ({
      ...prevError,
      [name]: " ",
      addNew: "",
    }));
  };

  const handleCheckboxChange = (e) => {
    dispatch(setField({ field: "boardCertification", value: e.target.name }));
    setError((prevError) => ({ ...prevError, certifications: "" }));
  };
  const contentRef = useRef(null);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };
  const handleSubmit = async (e) => {
    setShowDropDown(false);
    e.preventDefault();
    if (jobData.isLoading) {
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;
    // Validate Name
    if (!jobData.providerFullName) {
      setError((prevError) => ({
        ...prevError,
        providerFullName: !from
          ? "Provider is required! Please atleast select from existing or add new."
          : "Provider is required! Please enter provider name ",
      }));
      hasError = true;
      scrollToTop();
    } else if (jobData.providerFullName.length < 3) {
      setError((prevError) => ({
        ...prevError,
        addNew: "Name should be at least 3 characters!",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, name: "" }));
    }

    // Validate Email
    if (!jobData.email) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required!",
      }));
      hasError = true;
      scrollToTop();
    } else if (!emailRegex.test(jobData.email)) {
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
    if (!jobData.providerRole) {
      setError((prevError) => ({
        ...prevError,
        providerRole: "Provider role is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, providerRole: "" }));
    }
    // Validate Provider sub Role
    if (
      !jobData.provider_sub_role &&
      filterProviderRolesList?.find(
        (role) => role?.value === jobData?.providerRole
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

    // Validate Medical Speciality
    if (!from) {
      if (!jobData.medicalSpecialty) {
        setError((prevError) => ({
          ...prevError,
          medicalSpecialty: "Medical speciality is required!",
        }));
        hasError = true;
      } else {
        setError((prevError) => ({ ...prevError, medicalSpecialty: "" }));
      }
    } else {
      if (jobData.provider_specialities.length === 0) {
        setError((prevError) => ({
          ...prevError,
          medicalSpecialty: "Medical speciality is required!",
        }));
        hasError = true;
      } else {
        setError((prevError) => ({ ...prevError, medicalSpecialty: "" }));
      }
    }

    // Validate Medical Speciality
    if (
      !jobData.boardCertification.BC &&
      !jobData.boardCertification.BE &&
      !jobData.boardCertification.BCE &&
      !jobData.boardCertification.NA
    ) {
      setError((prevError) => ({
        ...prevError,
        certifications: "Atleast one certification is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, certifications: "" }));
    }

    // Validate State License
    // if (!jobData.stateLicense) {
    //   setError((prevError) => ({
    //     ...prevError,
    //     stateLicense: "State license is required!",
    //   }));
    //   hasError = true;
    // } else {
    //   setError((prevError) => ({ ...prevError, stateLicense: "" }));
    // }

    // Validate Regular Hourly Rate
    // if (!jobData.regularHourlyRate || isNaN(jobData.regularHourlyRate)) {
    //   setError((prevError) => ({
    //     ...prevError,
    //     regularHourlyRate:
    //       "Regular hourly rate is required and must be a number!",
    //   }));
    //   hasError = true;
    // } else {
    //   setError((prevError) => ({ ...prevError, regularHourlyRate: "" }));
    // }

    // Validate Holiday Hourly Rate
    // if (!jobData.holidayHourlyRate || isNaN(jobData.holidayHourlyRate)) {
    //   setError((prevError) => ({
    //     ...prevError,
    //     holidayHourlyRate:
    //       "Holiday hourly rate is required and must be a number!",
    //   }));
    //   hasError = true;
    // } else {
    //   setError((prevError) => ({ ...prevError, holidayHourlyRate: "" }));
    // }

    if (hasError) return;

    const obj = {
      name: jobData.providerFullName,
      email: jobData.email?.toLowerCase(),
      phone: jobData.phone,
      provider_role: jobData.providerRole,
      allied_health_clinician_type: jobData.provider_sub_role || "",
      medical_speciality: !from
        ? jobData.medicalSpecialty
        : // : jobData?.provider_specialities?.join(","),
          jobData?.provider_specialities?.join(","),
      recruiter_id: jobData.recruiter_id,
      // license_state_id: jobData.stateLicense,
      active_license_state_ids: jobData.stateLicense?.join(","),
      pending_license_state_ids: jobData.pendingStateLicense?.join(","),
      nonactive_license_state_ids: jobData.nonActiveStateLicense?.join(","),
      regular_hourly_rate: jobData.regularHourlyRate,
      regular_rate_type: jobData.regularRateType || "Hourly",
      holiday_hourly_rate: jobData.holidayHourlyRate,
      holiday_rate_type: jobData.holidayRateType || "Hourly",
      overtime_hourly_rate: jobData.overtimeHourlyRate,
      overtime_rate_type: jobData.overtimeRateType || "Hourly",
      board_certified: jobData.boardCertification.BC ? 1 : 0,
      board_eligible: jobData.boardCertification.BE ? 1 : 0,
      has_imlc: jobData.boardCertification.IMLC ? 1 : 0,
      board_certified_expired: jobData.boardCertification.BCE ? 1 : 0,
      not_applicable_board_certification_and_eligibility: jobData
        .boardCertification.NA
        ? 1
        : 0,
      // from_job_management: from ? false : true,
      ...(!from && { from_job_management: true }),
      ...(selectedCurrentData?.id && { id: selectedCurrentData?.id }),
      ...(jobData?.id && { id: jobData?.id }),
    };
    const resultAction = await dispatch(saveJobHandler(obj));

    if (saveJobHandler.fulfilled.match(resultAction)) {
      const newUserId = resultAction?.payload?.job?.id;
      dispatch(
        setAlert({
          message: resultAction?.payload?.msg,
          type: resultAction?.payload?.success ? "success" : "error",
          location: from ? "provider" : "job",
        })
      );
      if (from) {
        onCloseHandler();
        dispatch(resetField());
        getTableProviders();
        getProviderCountsHandlder();
      } else {
        navigate(`/assignment-management/provider-information/${newUserId}`);
        dispatch(resetField());
        onCloseHandler();
        //  -----------------------------------------------------------------------------------------------------------------------------------------------------------------
      }
      setSelectedCurrentData([]);
    } else {
      setShowError(resultAction?.payload?.data?.message);
      scrollToTop();
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

  const onCloseHandler = () => {
    setIsPossible(true);
    setError({
      addNew: "",
      providerFullName: "",
      email: "",
      providerRole: "",
      medicalSpecialty: "",
      certifications: "",
      stateLicense: "",
      regularHourlyRate: "",
      holidayHourlyRate: "",
    });

    onClose();
    dispatch(resetField());
    setSelectedCurrentData([]);
  };

  const clearHandler = () => {
    setError({
      addNew: "",
      providerFullName: "",
      email: "",
      providerRole: "",
      medicalSpecialty: "",
      certifications: "",
      stateLicense: "",
      regularHourlyRate: "",
      holidayHourlyRate: "",
    });
    dispatch(resetField());
    setSelectedCurrentData([]);
    setIsExisting(false);
  };
  // ========================= onClick select mail function  ==========================

  const handleSelect = (curr) => {
    setIsExisting(true);
    const activeLicenseIds = curr?.license_states
      ?.filter((state) => state.provider_license_status === "Active")
      ?.map((state) => state.provider_license_state_id);
    const pendingLicenseIds = curr?.license_states
      ?.filter((state) => state.provider_license_status === "Pending")
      ?.map((state) => state.provider_license_state_id);
    const nonActiveLicenseIds = curr?.license_states
      ?.filter((state) => state.provider_license_status === "Non-active")
      ?.map((state) => state.provider_license_state_id);
    setError({
      addNew: "",
      providerFullName: "",
      email: "",
      providerRole: "",
      medicalSpecialty: "",
      certifications: "",
      stateLicense: "",
      regularHourlyRate: "",
      holidayHourlyRate: "",
    });
    setSelectedCurrentData(curr);
    setShowDropDown(false);
    dispatch(setField({ field: "id", value: curr?.id }));
    dispatch(setField({ field: "providerFullName", value: curr?.name }));
    dispatch(setField({ field: "email", value: curr?.email }));
    dispatch(setField({ field: "phone", value: curr?.phone }));
    // dispatch(
    //   setField({ field: "provider_specialities", value: curr?.specialities })
    // );

    dispatch(
      setField({ field: "providerRole", value: curr?.provider_role_id })
    );
    dispatch(
      setField({
        field: "provider_sub_role",
        value: curr?.allied_health_clinician_type,
      })
    );
    dispatch(
      setField({
        field: "medicalSpecialty",
        value: curr?.medical_speciality_id,
      })
    );
    dispatch(
      updateCertificate({
        field: "IMLC",
        value: curr?.has_imlc == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "BC",
        value: curr?.board_certified == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "BE",
        value: curr?.board_eligible == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "BCE",
        value: curr?.board_certified_expired == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "NA",
        value:
          curr?.not_applicable_board_certification_and_eligibility == 1
            ? true
            : false,
      })
    );
    dispatch(
      setField({
        field: "stateLicense",
        value: activeLicenseIds,
      })
    );
    dispatch(
      setField({
        field: "pendingStateLicense",
        value: pendingLicenseIds,
      })
    );
    dispatch(
      setField({
        field: "nonActiveStateLicense",
        value: nonActiveLicenseIds,
      })
    );
    // dispatch(
    //   setField({ field: "stateLicense", value: curr?.license_state_id })
    // );
    dispatch(
      setField({ field: "regularHourlyRate", value: curr?.regular_hourly_rate })
    );
    dispatch(
      setField({ field: "holidayHourlyRate", value: curr?.holiday_hourly_rate })
    );
    dispatch(
      setField({
        field: "overtimeHourlyRate",
        value: curr?.overtime_hourly_rate,
      })
    );
  };
  {
    jobData.isLoading ? "Loading" : "Save";
  }
  const getProviderSubRoles = async () => {
    try {
      const resp = await API.get(
        `/api/get-provider-subroles?role_id=${jobData?.providerRole}`
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
        (role) => role?.value === jobData?.providerRole
      )?.label == "Allied Health Clinician"
    ) {
      getProviderSubRoles();
    }
  }, [jobData?.providerRole, open]);
  const handleCustomInput = (newOption) => {
    dispatch(setField({ field: "provider_sub_role", newOption }));
  };
  const subroleOptions = providerSubRoles.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  // StyledSelect for rate type dropdowns
  const StyledSelect = styled(Select)({
    bgcolor: mode === "dark" ? "#333" : "#F8F9FA",
    border: "none",
    outline: "none",
  });
  return (
    <Modal open={open} onClose={onCloseHandler}>
      <Box
        ref={contentRef}
        sx={{
          width: { sm: "100%", xl: "100%" },
          boxShadow: 24,
          pt: 4,
          overflowY: "auto",
          height: "100vh",
          bgcolor: "transparent",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: "background.paper",
            px: "1.5rem",
            pt: "0.5rem",
            pb: "1.5rem",
            width: { xs: "95vw", md: "auto", xl: "78%" },
            m: "0 auto",
            mb: { md: 3 },
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
              {!from
                ? "Create new job"
                : jobData?.id
                ? "Edit provider"
                : "Add Provider"}
            </Typography>
            <Close onClick={onCloseHandler} sx={{ cursor: "pointer" }} />
          </Box>
          {showError ? (
            <Alert
              severity="error"
              sx={
                {
                  // position: "absolute",
                  // top: 0,
                  // right: 0,
                  // width: "100%",
                  // zIndex: 999,
                }
              }
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowError(null);
                  }}
                >
                  <Close sx={{ color: "red", fontSize: "1.5rem" }} />
                </IconButton>
              }
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                    color: "red",
                  }}
                >
                  {showError}
                </Typography>
              </Box>
            </Alert>
          ) : (
            // <Alert
            //   severity={"error"}
            //   variant="filled"
            //   onClose={() => setShowError(false)}
            // >
            //   {showError}
            // </Alert>
            ""
          )}
          <Box
            sx={{
              px: ".6rem",
              pt: 3,
            }}
          >
            <form onSubmit={handleSubmit} style={{}}>
              {/* ============================== Existing or add new ======================== */}
              {!from && (
                <Grid container mt={2} spacing={2}>
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
                      Select Provider{" "}
                      <span style={{ fontWeight: 600, color: "red" }}>*</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9} sx={{}}>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <CommonSelect
                        name="provider"
                        width={"400px"}
                        // value={selectedCurrentData.medical_speciality_id}
                        value={jobData.provider}
                        handleChange={handleChange}
                        handleClear={clearHandler}
                        placeholder="Select from existing providers  "
                        options={filterExistingProvider}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.black",
                          py: "10px",
                          px: "40px",
                          lineHeight: "1.2rem",
                          fontSize: "14px",
                        }}
                      >
                        or
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <CommonInputField
                          name={"providerFullName"}
                          placeholder="Add new"
                          value={jobData.providerFullName}
                          onChange={handleChange}
                          type="text"
                          error={
                            jobData.providerFullName && error.addNew
                              ? true
                              : false
                          }
                        />
                        <Typography variant="caption" color="error">
                          {error.addNew}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="caption" color="error">
                      {error.providerFullName}
                    </Typography>
                  </Grid>
                </Grid>
              )}

              {/* ================================== email ================================ */}
              <Grid container mt={2} spacing={2}>
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
                    Email{" "}
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <CommonInputField
                    name={"email"}
                    placeholder="e.g., johndoe@gmail.com"
                    value={jobData.email}
                    // value={selectedCurrentData?.email}
                    onChange={handleChange}
                    type="text"
                    error={!jobData.email && error.email ? true : false}
                  />
                  {/* {showDropDown && filteredData?.length > 0 && (
                    <Box
                      sx={{
                        maxHeight: "150px",
                        overflowY: "scroll",
                        p: 1,
                        backgroundColor: "white",
                        boxShadow:
                          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                      }}
                    >
                      {filteredData?.map((curr, index) => (
                        <Box
                          key={index}
                          onClick={() => handleSelect(curr)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "10px",
                            cursor: "pointer",
                            "&:hover": {
                              color: "text.btn_blue",
                            },
                          }}
                        >
                          <Typography mb={1} fontSize={11}>
                            {curr?.email} -&nbsp;
                          </Typography>
                          <Typography mb={1} fontSize={11} fontWeight={600}>
                            {curr?.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )} */}

                  <Typography variant="caption" color="error">
                    {error.email}
                  </Typography>
                </Grid>
              </Grid>
              {/* ==================================name================================ */}
              {from && (
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
                      Provider full name
                      <span style={{ fontWeight: 600, color: "red" }}>*</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9} sx={{}}>
                    <CommonInputField
                      name={"providerFullName"}
                      placeholder="e.g., John Doe"
                      value={jobData.providerFullName}
                      // value={selectedCurrentData?.name}
                      onChange={handleChange}
                      type="text"
                      error={
                        !jobData.providerFullName && error.providerFullName
                          ? true
                          : false
                      }
                    />
                    <Typography variant="caption" color="error">
                      {error.providerFullName}
                    </Typography>
                  </Grid>
                </Grid>
              )}
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
                    Phone <span style={{ color: "#8c98a4" }}>(Optional)</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <CommonInputField
                    name="phone"
                    placeholder="+x(xxx)xxx-xx-xx"
                    value={jobData.phone}
                    // value={selectedCurrentData.phone}
                    onChange={handlePhoneNumber}
                    type={"phone"}
                    isPhoneNumber={"phone"}
                    defaultCountry={userLocation}
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
              {/* ================================== provider role================================ */}
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
                    value={jobData?.providerRole}
                    // value={selectedCurrentData.provider_role_id}
                    handleChange={handleChange}
                    name={"providerRole"}
                    placeholder={"Select provider role"}
                    options={filterProviderRolesList}
                    error={
                      !jobData.providerRole && error.providerRole ? true : false
                    }
                  />
                  <Typography variant="caption" color="error">
                    {error.providerRole}
                  </Typography>
                </Grid>
              </Grid>
              {filterProviderRolesList?.find(
                (role) => role?.value === jobData?.providerRole
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
                      value={jobData?.provider_sub_role}
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
              {!from ? (
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
                      Medical speciality
                      <span style={{ fontWeight: 600, color: "red" }}>*</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9} sx={{}}>
                    <CommonSelect
                      name="medicalSpecialty"
                      // value={selectedCurrentData.medical_speciality_id}
                      value={jobData.medicalSpecialty}
                      handleChange={handleChange}
                      placeholder="Select medical speciality"
                      options={
                        existingSpecialities?.length > 0
                          ? existingSpecialities
                          : allSpecialitiesOptions
                      }
                      error={
                        !jobData.medicalSpecialty && error.medicalSpecialty
                          ? true
                          : false
                      }
                    />
                    <Typography variant="caption" color="error">
                      {error.medicalSpecialty}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
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
                      name="provider_specialities"
                      options={allSpecialitiesOptions}
                      value={jobData?.provider_specialities}
                      onChange={(e, value) => {
                        dispatch(
                          setField({
                            field: "provider_specialities",
                            value: value,
                          })
                        );
                        setError((prevError) => ({
                          ...prevError,
                          medicalSpecialty: "",
                        }));
                      }}
                      error={
                        !jobData?.provider_specialities?.length === 0 ||
                        error.medicalSpecialty
                          ? true
                          : false
                      }
                    />

                    <Typography variant="caption" color="error">
                      {error?.medicalSpecialty}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {/* ================================ Recruiter =============================== */}
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
                    // value={selectedCurrentData.medical_speciality_id}
                    value={jobData.recruiter_id}
                    handleChange={handleChange}
                    placeholder="Select Recruiter"
                    options={RecOptions}
                    // error={
                    //   !jobData.medicalSpecialty && error.medicalSpecialty
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* <Typography variant="caption" color="error">
                    {error.medicalSpecialty}
                  </Typography> */}
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
                            !jobData.boardCertification.BC && "checkbox"
                          }`}
                          checked={jobData.boardCertification.BC}
                          onChange={handleCheckboxChange}
                          name="BC"
                        />
                      }
                      label="Board Certified (BC)"
                    />
                    <FormControlLabel
                      control={
                        <BpCheckbox
                          className={`${
                            !jobData.boardCertification.BE && "checkbox"
                          }`}
                          size="small"
                          checked={jobData.boardCertification.BE}
                          // checked={
                          //   selectedCurrentData.board_eligible === 1
                          //     ? true
                          //     : false
                          // }
                          onChange={handleCheckboxChange}
                          name="BE"
                        />
                      }
                      label="Board Eligible (BE)"
                    />
                    <FormControlLabel
                      control={
                        <BpCheckbox
                          className={`${
                            !jobData.boardCertification.BCE && "checkbox"
                          }`}
                          size="small"
                          checked={jobData.boardCertification.BCE}
                          // checked={
                          //   selectedCurrentData.board_eligible === 1
                          //     ? true
                          //     : false
                          // }
                          onChange={handleCheckboxChange}
                          name="BCE"
                        />
                      }
                      label="BC Expired"
                    />
                    <FormControlLabel
                      control={
                        <BpCheckbox
                          className={`${
                            !jobData.boardCertification.NA && "checkbox"
                          }`}
                          size="small"
                          checked={jobData.boardCertification.NA}
                          // checked={
                          //   selectedCurrentData.board_eligible === 1
                          //     ? true
                          //     : false
                          // }
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
              {/* =======================Active state licenses============================= */}
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
                    Active State licenses{" "}
                    {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <MultipleSelectCheckmarks
                    width={"900px"}
                    name="stateLicense"
                    options={stateOptions}
                    value={jobData.stateLicense}
                    onChange={(e, value) => {
                      dispatch(
                        setField({
                          field: "stateLicense",
                          value: value,
                        })
                      );
                      setError((prevError) => ({
                        ...prevError,
                        stateLicense: "",
                      }));
                    }}
                    error={
                      !jobData.stateLicense && error.stateLicense ? true : false
                    }
                  />
                  {/* <CommonSelect
                    name="stateLicense"
                    value={jobData.stateLicense}
                    // value={selectedCurrentData.license_state_id}
                    handleChange={handleChange}
                    placeholder="Select state license"
                    options={stateOptions}
                    error={
                      !jobData.stateLicense && error.stateLicense ? true : false
                    }
                  /> */}
                  <Typography variant="caption" color="error">
                    {error.stateLicense}
                  </Typography>
                </Grid>
              </Grid>
              {/* =======================Pending state licenses============================= */}
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
                    Pending State licenses{" "}
                    {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <MultipleSelectCheckmarks
                    width={"900px"}
                    name="pendingStateLicense"
                    options={stateOptions}
                    value={jobData.pendingStateLicense}
                    onChange={(e, value) => {
                      dispatch(
                        setField({
                          field: "pendingStateLicense",
                          value: value,
                        })
                      );
                    }}
                  />
                </Grid>
              </Grid>
              {/* =======================Non Active state licenses============================= */}
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
                    Expired licenses
                    {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <MultipleSelectCheckmarks
                    width={"900px"}
                    name="nonActiveStateLicense"
                    options={stateOptions}
                    value={jobData.nonActiveStateLicense}
                    onChange={(e, value) => {
                      dispatch(
                        setField({
                          field: "nonActiveStateLicense",
                          value: value,
                        })
                      );
                    }}
                  />
                  {/* <CommonSelect
                    name="stateLicense"
                    value={jobData.stateLicense}
                    // value={selectedCurrentData.license_state_id}
                    handleChange={handleChange}
                    placeholder="Select state license"
                    options={stateOptions}
                    error={
                      !jobData.stateLicense && error.stateLicense ? true : false
                    }
                  /> */}
                  <Typography variant="caption" color="error">
                    {error.stateLicense}
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
                <Grid item xs={12} md={9} sx={{}}>
                  <FormControlLabel
                    control={
                      <IosCommonSwitch
                        checked={jobData.boardCertification.IMLC}
                        onChange={handleCheckboxChange}
                        name="IMLC"
                        size="small"
                      />
                    }
                    label={jobData.boardCertification.IMLC ? "Yes" : "No"}
                  />
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
                    Regular rate
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CommonInputField
                    name={"regularHourlyRate"}
                    placeholder="e.g., 50"
                    value={jobData.regularHourlyRate}
                    onChange={handleChange}
                    type="number"
                    // InputProps={{
                    //   startAdornment: <AttachMoneyOutlined />,
                    //   endAdornment: jobData.regularRateType === 'Daily' ? '/day' : '/hr',
                    // }}
                    error={
                      !jobData.regularHourlyRate && error.regularHourlyRate
                        ? true
                        : false
                    }
                  />

                  <StyledSelect
                    name="regularRateType"
                    value={jobData.regularRateType || "hourly"}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      minWidth: "120px",
                      backgroundColor: mode === "dark" ? "#333" : "#F6F7FA",
                      color: mode === "dark" ? "#F6F7FA" : "text.black",
                      border:
                        mode === "dark"
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
                            backgroundColor: mode === "dark" ? "#333" : "#fff",
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
                          "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                            },
                        }}
                      />
                    }
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </StyledSelect>
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
                    Holiday rate
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CommonInputField
                    name={"holidayHourlyRate"}
                    placeholder="e.g., 60"
                    value={jobData.holidayHourlyRate}
                    onChange={handleChange}
                    type="number"
                    // InputProps={{
                    //   startAdornment: <AttachMoneyOutlined />,
                    //   endAdornment: jobData.holidayRateType === 'daily' ? '/day' : '/hr',
                    // }}
                    error={
                      !jobData.holidayHourlyRate && error.holidayHourlyRate
                        ? true
                        : false
                    }
                  />
                  <StyledSelect
                    name="holidayRateType"
                    value={jobData.holidayRateType || "hourly"}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      minWidth: "120px",
                      backgroundColor: mode === "dark" ? "#333" : "#F6F7FA",
                      color: mode === "dark" ? "#F6F7FA" : "text.black",
                      border:
                        mode === "dark"
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
                            backgroundColor: mode === "dark" ? "#333" : "#fff",
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
                          "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                            },
                        }}
                      />
                    }
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </StyledSelect>
                </Grid>
              </Grid>
              {/* ===========================overtimerate rate============================ */}
              {!from && (
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
                      Overtime rate
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={9}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CommonInputField
                      name={"overtimeHourlyRate"}
                      placeholder="e.g., 100"
                      value={jobData.overtimeHourlyRate}
                      onChange={handleChange}
                      type="number"
                      // InputProps={{
                      //   startAdornment: <AttachMoneyOutlined />,
                      //   endAdornment: jobData.overtimeRateType === 'daily' ? '/day' : '/hr',
                      // }}
                    />
                    <StyledSelect
                      name="overtimeRateType"
                      value={jobData.overtimeRateType || "hourly"}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        minWidth: "120px",
                        backgroundColor: mode === "dark" ? "#333" : "#F6F7FA",
                        color: mode === "dark" ? "#F6F7FA" : "text.black",
                        border:
                          mode === "dark"
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
                              backgroundColor:
                                mode === "dark" ? "#333" : "#fff",
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
                            "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                border: "none",
                              },
                          }}
                        />
                      }
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                    </StyledSelect>
                  </Grid>
                </Grid>
              )}
              {/* ======================================================= */}
              <Box sx={{ textAlign: "right", pt: 3, pb: "2rem" }}>
                <Button
                  onClick={onCloseHandler}
                  sx={{
                    mr: 2,
                    textTransform: "capitalize",
                    color: "text.primary",
                    fontSize: "0.8125rem",
                    fontWeight: 400,
                    border: "1px solid rgba(99, 99, 99, 0.2)",
                    padding: "5px 16px",
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
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "capitalize",
                    bgcolor: "background.btn_blue",
                  }}
                >
                  <img
                    src={savemIcon}
                    alt="icon"
                    style={{ width: "18px", marginRight: "0.5rem" }}
                  />
                  {jobData?.providerFullName && jobData.isLoading
                    ? "Loading"
                    : !from
                    ? "Save"
                    : jobData?.id
                    ? "Update"
                    : "Add"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateJobModal;
export const CommonInputField = ({
  value,
  name,
  type,
  onChange,
  placeholder,
  InputProps,
  isPhoneNumber,
  error,
  mr,
  mt,
  height,
  isUser,
  helperText,
  width,
  disabled,
  defaultCountry,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  const bordercolor = error ? "#d32f2f" : `rgba(231, 234, 243, .7)`;
  const [country, setCountry] = useState(null);
  useEffect(() => {
    getLocation()
      .then((data) => {
        setCountry(data.countryCode);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      {isPhoneNumber ? (
        <PhoneInput
          international
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          defaultCountry={country}
          disabled={disabled}
          className={`phone-input ${isLightMode ? "" : "dark"}`}
          style={{
            width: width,
            paddingLeft: "0.8rem",
            borderRadius: 5,
            height: height || "2.8rem",
            color: isLightMode ? "black" : "white",
            background: isLightMode ? "#F7F9FC" : "#333",
            border: `.0625rem solid ${bordercolor}`,
          }}
        />
      ) : (
        <TextField
          fullWidth={!isUser ? true : false}
          variant="outlined"
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="custom_input"
          InputProps={InputProps}
          helperText={
            <Typography color="error" sx={{ fontSize: "0.6rem" }}>
              {helperText}
            </Typography>
          }
          sx={{
            mr: mr,
            mt,
            borderRadius: "5px",
            width: width,
            bgcolor: isLightMode ? "#F6F7Fa" : "#333",
            color: isLightMode ? "black" : "white",
            border: `.0625rem solid ${bordercolor}`,
            height: height ? height : "2.6rem",
            "& fieldset": { border: "none" },
            "& .MuiOutlinedInput-root.Mui-focused": {
              height: height ? height : "2.75rem",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
              backgroundColor: isLightMode ? "white" : "#25282A",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#808080",
            },
            "&:focus .MuiOutlinedInput-root": {
              height: height ? height : "2.75rem",
              backgroundColor: isLightMode ? "white" : "#25282A",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
            },
            input: {
              color: isLightMode ? "black" : "white",
            },
          }}
          onFocus={(e) => {
            if (type === "date" || type === "time") {
              e.target.showPicker();
            }
          }}
        />
      )}
    </>
  );
};
