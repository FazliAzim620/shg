import React, { useState } from "react";
import {
  FlightTakeoffOutlined,
  DeleteOutlineOutlined,
  NotificationsOutlined,
  PersonOutlined,
  VpnKeyOutlined as VpnKeyOutlinedIcon,
  GppGoodOutlined as GppGoodOutlinedIcon,
  Draw,
} from "@mui/icons-material";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import { Box, Card, CardContent, MenuItem, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Import tab components

import Provider_Specialities from "./Provider_Specialities";
import { medicalSpecialities } from "../../../../components/constants/data";
import CurrentAvailiblityCard from "./CurrentAvailiblityCard";
import TravelPreferencesLanguagesLinks from "./TravelPreferencesLanguagesLinks";
import WorkExperience from "./WorkExperience";
import Education from "./Education";
import ProviderNeededJobDetails from "./ProviderNeededJobDetails";

const RightLeftSections = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const [activeStep, setActiveStep] = useState(initialStep);
  const navigate = useNavigate();
  const headingstyle = {
    fontSize: "1.14844rem",
    marginTop: 0,
    marginBottom: "0.5rem",
    fontWeight: 600,
    lineHeight: 1.2,
    color: "#1e2022",
  };

  return (
    <Box style={{ display: "flex", justifyContent: "center" }}>
      {/* =============================left============================ */}
      <Box sx={{ flex: 1, mx: "12px", mb: 1 }}>
        <Provider_Specialities
          sx={headingstyle}
          medicalSpecialities={medicalSpecialities}
        />
        <ProviderNeededJobDetails />
        <WorkExperience />
        <Education />
        <TravelPreferencesLanguagesLinks />
      </Box>
      {/* =============================right============================ */}
      <Box>
        <CurrentAvailiblityCard />
      </Box>
    </Box>
  );
};

export default RightLeftSections;
