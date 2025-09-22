// ClientRegistrationStepper.js
import React, { useEffect, useRef, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CorporateFare,
  LocationOn,
  Approval,
  ListAlt,
  KeyboardBackspace,
  East,
  AttachMoney,
  LocationOnOutlined,
  CheckCircle,
  Close,
} from "@mui/icons-material";
import usePersistedTab from "../../components/customHooks/usePersistedTab";
import { useDispatch, useSelector } from "react-redux";
import JobBasic from "./JobBasic";
import ShiftDetails from "./ShiftDetails";
import { resetField } from "../../feature/post-job/PostJobSlice";
import SelectClient from "./SelectClientTab";
import BudgetPreferencesTab from "./BudgetPreferencesTab";
import PostJobPreview from "./PostJobPreview";
import {
  fetchPostedJobsData,
  savePostJobHandler,
} from "../../thunkOperation/postJob/postJobThunk";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/Routes";
import { setAlert } from "../../feature/alert-message/alertSlice";
import { selectOptions } from "../../util";

const steps = [
  { icon: <CorporateFare />, label: "Job basics" },
  { icon: <LocationOnOutlined />, label: "Shift details" },
  { icon: <Approval />, label: "Select client" },
  { icon: <AttachMoney />, label: "Budget preferences" },
  { icon: <ListAlt />, label: "Preview" },
];
export default function PostJobStepper({ handleClose, editLocation }) {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);
  const darkMode = useSelector((state) => state.theme.mode);

  const {
    isLoading,
    jobTitle,
    jobDescription,
    providerRoleIds,
    allied_health_clinician_type,
    openPositions,
    specialty,
    boardCertification,
    stateLicense,
    providerRolesList,
    regularHourlyRate,
    holidayHourlyRate,
    experienceRequired,
    lastDateToApply,
    payRateType,
    holidayRateType,
    //----------------------
    startDate,
    endDate,
    shiftDays,
    startTime,
    endTime,
    //--------------------------
    selectedCountry,
    selectedState,
    client,
  } = useSelector((state) => state.postJob);
  const navigate = useNavigate();
  const postJob = useSelector((state) => state.postJob);
  const [activeStep, setActiveStep] = usePersistedTab(0);
  const [errors, setErrors] = useState({});
  const [responseError, setResponseError] = useState(null);
  const validateBasicInfo = () => {
    const newErrors = {};
    if (!jobTitle) newErrors.jobTitle = "Job title is required";
    if (!providerRoleIds || providerRoleIds.length === 0)
      newErrors.providerRoleIds = "At least one provider role is required";
    // Check if Allied Health Clinician is among selected roles
    const alliedRole = providerRolesList?.find(
      (role) => role.name === "Allied Health Clinician"
    );
    if (
      alliedRole &&
      Array.isArray(providerRoleIds) &&
      providerRoleIds.includes(alliedRole.id) &&
      !allied_health_clinician_type
    ) {
      newErrors.allied_health_clinician_type = "Sub role required";
    }
    if (!specialty) newErrors.specialty = "Speciality is required";
    if (
      !boardCertification.BE &&
      !boardCertification.BC &&
      !boardCertification.NA
    )
      newErrors.boardCertification = "Board certification is required";
    if (!stateLicense) newErrors.stateLicense = "State license is required";
    // if (!regularHourlyRate)
    //   newErrors.regularHourlyRate = "Regular hourlyRate is required";
    // if (!lastDateToApply)
    //   newErrors.lastDateToApply = "Last date to apply is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateShiftDetails = () => {
    const newErrors = {};
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!startTime) newErrors.startTime = "State time is required";
    if (shiftDays?.length === 0) newErrors.shiftDays = "Atleast select one day";
    if (!endTime) newErrors.endTime = "End time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSelectClient = () => {
    const newErrors = {};
    if (!selectedCountry) newErrors.selectedCountry = "Country is required";
    // if (!client.email) newErrors.email = "Email is required";
    if (!selectedState) newErrors.selectedState = "State is required";
    if (!client?.name) newErrors.name = "Client name is required";
    if (!client?.city) newErrors.city = "City name is required";
    // if (!client?.address1) newErrors.address1 = "Address1 name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleDiscard = () => {
    handleClose();
    dispatch(resetField());
    // dispatch(resetFields());
  };
  const handleNext = async (save_type = null) => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = validateBasicInfo();
      // if (isValid) {
      //   await dispatch(saveBasicInfo(basicInfo));
      // }
    } else if (activeStep === 1) {
      isValid = true;
      // isValid = validateShiftDetails();
      // if (isValid) {
      //   await dispatch(saveBillingAddress(billingAddress));
      // }
    } else if (activeStep === 2) {
      isValid = validateSelectClient();
      // if (isValid) {
      //   await dispatch(saveSiteAddress(siteAddress));
      // }
    } else {
      isValid = true; // For other steps, no validation yet
    }

    if (activeStep === steps.length - 1) {
      const resp = await dispatch(
        savePostJobHandler({ data: postJob, save_type })
      );
      if (resp?.payload?.msg) {
        setResponseError(resp?.payload?.msg);
        dispatch(
          setAlert({
            message: postJob?.id
              ? "Your job updated successfully"
              : "Your job posted successfully ",
            type: "success",
            location: "postedJob",
          })
        );
      }

      if (resp?.payload?.success) {
        const per_page = localStorage.getItem("per_page");
        const param = {
          perpage: per_page || 20,
          page: 1,
          status: "",
        };
        dispatch(fetchPostedJobsData(param));
        handleDiscard();
        if (postJob?.id && editLocation !== "table") {
          navigate(`${ROUTES.postJobDetail}${resp?.payload?.data?.id}`, {
            state: resp?.payload?.data,
          });
        }
      }
    }

    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <JobBasic errors={errors} setErrors={setErrors} />;
      case 1:
        return <ShiftDetails errors={errors} setErrors={setErrors} />;
      case 2:
        return <SelectClient errors={errors} setErrors={setErrors} />;
      case 3:
        return <BudgetPreferencesTab />;
      case 4:
        return <PostJobPreview />;
    }
  };
  const CustomStepIcon = ({ active, completed, icon }) => {
    const iconStyles = {
      bgcolor: active
        ? darkMode === "dark"
          ? "rgba(55, 125, 255, 0.1)"
          : "rgba(55, 125, 255, 0.1)"
        : completed
        ? darkMode === "dark"
          ? "rgba(55, 125, 255, 0.1)"
          : "primary.main"
        : "rgba(19, 33, 68, 0.1)",
      color: active
        ? "rgba(55, 125, 255, 1)"
        : completed
        ? "white"
        : "text.black",
      borderRadius: "50%",
      width: "38.48px",
      height: "38.48px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <Box sx={iconStyles}>
        {React.cloneElement(icon, { fontSize: "small" })}
      </Box>
    );
  };
  return (
    <Box sx={{ width: "100%" }}>
      {responseError && (
        <Stack sx={{ width: "100%", p: 2 }} spacing={2}>
          <Alert
            severity="error"
            sx={{}}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setResponseError(null);
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
                {responseError}
              </Typography>
            </Box>
          </Alert>
        </Stack>
      )}
      <Stepper
        activeStep={activeStep}
        sx={{
          pr: 4,
          pl: 3,
          pb: 3,
          bgcolor: darkMode === "dark" ? "background.page_bg" : "#f2f3f5",
        }}
      >
        {steps.map((step, index) => {
          return (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon {...props} icon={step.icon} />
                )}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      index <= activeStep
                        ? darkMode === "dark"
                          ? "#007BFF"
                          : "primary.main"
                        : "text.black",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box
        ref={contentRef}
        sx={{
          mt: 2,
          mb: 1,
          maxHeight: { md: "45vh", xl: "50vh" },
          overflowY: "auto",
          pl: 7,
          pr: 3,
          pt: 2,
          pb: 6,
        }}
      >
        {getStepContent(activeStep)}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2, px: 4 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent:
              activeStep === steps.length - 1 ? "space-between" : "flex-end",
            alignItems: "center",
          }}
        >
          <Box>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                startIcon={<KeyboardBackspace />}
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
                Previous step
              </Button>
            )}

            <Button
              onClick={handleDiscard}
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
              Discard
            </Button>
          </Box>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={() => handleNext("draft")}
                endIcon={<East />}
                variant="contained"
                sx={{
                  textTransform: "none",
                  mr: 2,
                  bgcolor: "secondary.main",
                }}
                disabled={isLoading === "loading"}
              >
                Save as draft
              </Button>
            ) : (
              ""
            )}
            <Button
              onClick={() => handleNext("post")}
              endIcon={<East />}
              variant="contained"
              sx={{ textTransform: "none" }}
              disabled={isLoading === "loading"}
            >
              {isLoading
                ? "Loading"
                : activeStep === steps.length - 1
                ? "Post job"
                : "Continue"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
