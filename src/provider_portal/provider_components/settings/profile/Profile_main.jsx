import { Box, Divider } from "@mui/material";
import React from "react";
import TopNav_providerProfile from "./TopNav_providerProfile";
import Provider_Specialities from "./Provider_Specialities";
import { fetchMedicalSpecialities } from "../../../../thunkOperation/job_management/states";
import { medicalSpecialities } from "../../../../components/constants/data";
import RightLeftSections from "./RightLeftSections";
import CurrentAvailiblityCard from "./CurrentAvailiblityCard";

const Profile_main = () => {
  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.page_bg" }}>
        <Box
          sx={{
            paddingTop: "5rem !important",
            width: { sm: "100%", xl: "78%" },
            mx: "auto",
          }}
        >
          {/* ==============================TopNav_providerProfile============================== */}
          <TopNav_providerProfile />
          {/* ==============================TopNav_providerProfile============================== */}
          <RightLeftSections />
        </Box>
      </Box>
    </>
  );
};

export default Profile_main;
