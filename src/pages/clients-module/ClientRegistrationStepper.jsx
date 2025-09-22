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
import BasicInfo from "../../components/client-module/BasicInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFields,
  // saveBasicInfo,
  // saveBillingAddress,
  // saveClient,
  // saveSiteAddress,
} from "../../feature/client-module/clientSlice";
import BillingAddress from "../../components/client-module/BillingAddress";
import SiteAddress from "../../components/client-module/SiteAddress";
import BudgetPreferences from "../../components/client-module/BudgetPreferences";
import { resetFields } from "../../feature/budgetPreferenceSlice";
import PreviewDetails from "../../components/client-module/PreviewDetails";
import { addClientHandler } from "../../thunkOperation/client-module/clientModlueThunk";
import { fetchClientsInfo } from "../../thunkOperation/job_management/states";
import { setAlert } from "../../feature/alert-message/alertSlice";

const steps = [
  { icon: <CorporateFare />, label: "Basic information" },
  { icon: <LocationOnOutlined />, label: "Billing address" },
  { icon: <Approval />, label: "Site address" },
  { icon: <AttachMoney />, label: "Budget preferences" },
  { icon: <ListAlt />, label: "Preview" },
];
export default function ClientRegistrationStepper({ handleClose }) {
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
    airfare,
    hotel,
    loggedMiles,
    carRental,
    overBudgetTravel,
    parking,
    tolls,
    gas,
  } = useSelector((state) => state.budgetPreferences);

  const {
    clientsTableData,
    basicInfo,
    billingAddress,
    siteAddress,
    status,
    error,
  } = useSelector((state) => state.clientBasicInfo);
  const [activeStep, setActiveStep] = usePersistedTab(0);
  const [errors, setErrors] = useState({});
  const [responseError, setResponseError] = useState(null);
  const validateBasicInfo = () => {
    const newErrors = {};
    if (!basicInfo.clientName) newErrors.clientName = "Client name is required";
    if (!basicInfo.firstName) newErrors.firstName = "First name is required";
    if (!basicInfo.lastName) newErrors.lastName = "Last name is required";
    if (!basicInfo.role) newErrors.role = "Role is required";
    if (!basicInfo.clientEmail) newErrors.clientEmail = "Client eail is required";
    if (basicInfo.phones.length === 0 || !basicInfo.phones[0].number) {
      newErrors.phone = "At least one phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBillingAddress = () => {
    const newErrors = {};
    if (!billingAddress.country) newErrors.country = "Country is required";
    if (!billingAddress.state) newErrors.state = "State is required";
    if (!billingAddress.city) newErrors.city = "City is required";
    if (!billingAddress.address_line_1)
      newErrors.address_line_1 = "Address is required";
    if (!billingAddress.zip_code) newErrors.zip_code = "Zip code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateSiteAddress = () => {
    const newErrors = {};
    if (!siteAddress.country) newErrors.country = "Country is required";
    if (!siteAddress.state) newErrors.state = "State is required";
    if (!siteAddress.city) newErrors.city = "City is required";
    if (!siteAddress.address_line_1)
      newErrors.address_line_1 = "Address is required";
    if (!siteAddress.zip_code) newErrors.zip_code = "Zip code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleDiscard = () => {
    handleClose();
    dispatch(clearFields());
    dispatch(resetFields());
  };
  const handleNext = async () => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = validateBasicInfo();
      // if (isValid) {
      //   await dispatch(saveBasicInfo(basicInfo));
      // }
    } else if (activeStep === 1) {
      isValid = validateBillingAddress();
      // if (isValid) {
      //   await dispatch(saveBillingAddress(billingAddress));
      // }
    } else if (activeStep === 2 && !siteAddress?.same_is_billing) {
      isValid = validateSiteAddress();
      // if (isValid) {
      //   await dispatch(saveSiteAddress(siteAddress));
      // }
    } else {
      isValid = true; // For other steps, no validation yet
    }
    if (activeStep === steps.length - 1) {
      const resp = await dispatch(
        addClientHandler({
          basicInfo,
          // basicInfo: {
          //   ...basicInfo,
          //   primary_contact_email: basicInfo.email, // Send as primary_contact_email
          //   email: basicInfo.clientEmail, // Send as client email (if present)
          // },
          billingAddress,
          siteAddress: {
            ...siteAddress,
            site_name: siteAddress.site_name || undefined,
          },
          airfare,
          hotel,
          loggedMiles,
          carRental,
          overBudgetTravel,
          parking,
          tolls: {
            ...tolls,
            total_days: undefined, // Remove total_days
          },
          gas,
        })
      );

      if (resp?.payload?.data?.message) {
        setResponseError(resp?.payload?.data?.message);
      }
      if (resp?.payload?.error) {
        setResponseError(resp?.payload?.msg);
      }
      if (resp?.payload?.success) {
        dispatch(
          setAlert({
            message: resp?.payload?.msg,
            type: "success",
            location: "client",
          })
        );
        dispatch(
          fetchClientsInfo({
            perpage: 10,
            page: 1,
          })
        );
        handleDiscard();
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
        return <BasicInfo errors={errors} />;
      case 1:
        return <BillingAddress errors={errors} />;
      case 2:
        return <SiteAddress errors={errors} />;
      case 3:
        return <BudgetPreferences errors={errors} />;
      case 4:
        return <PreviewDetails errors={errors} />;
    }
  };

  const CustomStepIcon = ({ active, completed, icon }) => {
    const iconStyles = {
      bgcolor: active
        ? darkMode === "dark"
          ? "#007BFF"
          : "primary.main"
        : completed
        ? darkMode === "dark"
          ? "#007BFF"
          : "primary.main"
        : "grey.400",
      color: active ? "#fff" : completed ? "#fff" : "text.black",
      borderRadius: "50%",
      width: "2.40rem",
      height: "2.40rem",
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
        <Alert
          severity="error"
          sx={{ position: "absolute", top: 0, right: 0, width: "100%" }}
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
                    fontSize: "0.875rem",
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

        <Button
          onClick={handleNext}
          endIcon={<East />}
          variant="contained"
          sx={{ textTransform: "none" }}
          disabled={status === "loading"}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Continue"}
        </Button>
      </Box>
    </Box>
  );
}
