import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import CardTravel from "@mui/icons-material/CardTravel";
import { RecordVoiceOver } from "@mui/icons-material";
import CustomBadge from "../../CustomBadge";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeData, resetField } from "../../../feature/clientSlice";

const JobSetupChecklist = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 0;
  const [activeStep, setActiveStep] = useState(initialStep);
  const { newUserData } = useSelector((state) => state.job);
  const { newClientData } = useSelector((state) => state.client);
  const { budgetPreferenceData } = useSelector(
    (state) => state.budgetPreferences
  );
  const providerFile = useSelector((state) => state.providerConfirmation.files);
  const { files } = useSelector((state) => state.clientConfirmation);
  const darkMode = useSelector((state) => state.theme.mode);
  const { schedules } = useSelector((state) => state.shiftSchedules);
  const { createdItinerary } = useSelector((state) => state.travel);
  const steps = [
    {
      label: "Provider information",
      icon: <RecordVoiceOver sx={{ fontSize: "14px", mt: 1.5 }} />,
      status: newUserData?.id ? "Completed" : "In progress ",
    },
    {
      label: "Client Information",
      icon: <BusinessIcon sx={{ fontSize: "14px", mt: 1.5 }} />,
      // status: newClientData?.client_id ? "Completed" : "In progress",
      status:
        newUserData?.client_id ||
        (newUserData?.client_count && newUserData?.client_count !== 0)
          ? "Completed"
          : "In progress",
    },
    {
      label: "Budget preferences",
      icon: <AttachMoneyIcon sx={{ fontSize: "14px", mt: 1.5 }} />,
      // status: budgetPreferenceData?.id ? "Completed" : "In progress",
      status:
        newUserData?.budget_preferences?.id ||
        (newUserData?.budget_count && newUserData?.budget_count !== 0)
          ? "Completed"
          : "In progress",
    },
    {
      label: "Client confirmation letter",
      icon: <DescriptionIcon sx={{ fontSize: "14px", mt: 1.5 }} />,
      // status: files?.[0]?.id ? "Completed" : "In progress",
      status: newUserData?.client_attachments_count
        ? newUserData?.client_attachments_count !== 0
          ? "Completed"
          : "In progress"
        : "In progrss",
    },
    {
      label: "Provider confirmation letter",
      icon: <DescriptionIcon sx={{ fontSize: "14px", mt: 1.5 }} />,
      // status: providerFile?.[0]?.id ? "Completed" : "In progress",
      status: newUserData?.provider_attachments_count
        ? newUserData?.provider_attachments_count !== 0
          ? "Completed"
          : "In progress"
        : "In progress",
    },
    {
      label: "Shift schedules",
      icon: <CalendarMonth sx={{ fontSize: "14px", mt: 1.5 }} />,
      status: newUserData?.shift_schedules_count
        ? newUserData?.shift_schedules_count !== 0
          ? "Completed"
          : "In progress"
        : "In progress",
    },
    {
      label: "Travel itinerary",
      icon: <CardTravel sx={{ fontSize: "14px", mt: 1.5 }} />,
      status: newUserData?.itinerary_count
        ? newUserData?.itinerary_count !== 0
          ? "Completed"
          : "In progress"
        : "In progress",
    },
  ];

  const completedSteps = steps.filter(
    (step) => step.status === "Completed"
  ).length;

  const handleStepClick = (index) => {
    dispatch(resetField());
    setActiveStep(index);
    setSearchParams({ step: index });
  };

  useEffect(() => {
    setActiveStep(initialStep);
  }, [initialStep]);
  return (
    <Card sx={{ width: "100%", boxShadow: "none", borderRadius: ".6875rem" }}>
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: "0.98rem",
            fontWeight: 600,
            lineHeight: 1.2,
            color: "text.black",
            p: "1rem 1rem 0.75rem 1rem",
          }}
        >
          Job setup checklist
        </Typography>
        <Divider
          sx={{
            borderColor:
              darkMode == "dark"
                ? "rgba(255, 255, 255, .7"
                : "rgba(231, 234, 243, 01)",
          }}
        />
        <List sx={{ p: "1rem" }}>
          {steps.map((step, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => handleStepClick(index)}
              sx={{
                color: "text.black",
                cursor: "pointer",
                px: "1rem",
                py: 0.5,
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "start",
                bgcolor:
                  activeStep === index
                    ? "rgba(189, 197, 209, .2)"
                    : "transparent",
                "&:hover": {
                  bgcolor: "rgba(55, 125, 255, 0.05)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "25px" }}>{step.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "1.5",
                    }}
                  >
                    {step.label}
                  </Typography>
                }
                secondary={
                  <CustomBadge
                    color={
                      step.status === "Completed"
                        ? "rgba(0, 201, 167)"
                        : "rgba(55, 125, 255)"
                    }
                    bgcolor={
                      step.status === "Completed"
                        ? "rgba(0, 201, 167, .1)"
                        : "rgba(55, 125, 255, .1)"
                    }
                    text={
                      step.status === "Completed" ? "Completed" : "In progress"
                    }
                    width={"90px"}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
        <Grid
          container
          sx={{ display: "flex", alignItems: "center", px: 2, gap: 2 }}
        >
          <Grid item xs={5.5} sx={{}}>
            <LinearProgress
              variant="determinate"
              value={(completedSteps / steps.length) * 100}
              sx={{ height: 8, borderRadius: 5, bgcolor: "lightgray" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{}}>
              {completedSteps} of {steps.length} steps complete
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobSetupChecklist;
