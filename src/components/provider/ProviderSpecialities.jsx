import { Box, Typography } from "@mui/material";
import React from "react";
import { flxCntrSx } from "../constants/data";
import { useSelector } from "react-redux";

const ProviderSpecialities = () => {
  const providerDetails = useSelector(
    (state) => state.providerDetails?.provider
  );

  const providerSpecialities = providerDetails?.specialities;
  return (
    <>
      <Box
        sx={{
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
          marginBottom: "2rem",
          padding: "1.3125rem",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          wordWrap: "break-word",
          backgroundColor: "#fff",
          backgroundClip: "border-box",
          border: ".0625rem solid rgba(231, 234, 243, .7)",
          borderRadius: ".75rem",
        }}
      >
        <Typography
          sx={{
            marginTop: 0,
            marginBottom: ".5rem",
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#1e2022",
          }}
        >
          Specialities
        </Typography>
        <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
          {providerSpecialities?.map((speciality) => (
            <Box
              key={speciality?.id}
              sx={{
                backgroundColor: "rgba(19, 33, 68, .1)",
                borderRadius: "50rem",
                marginLeft: ".25rem",
                color: "#1e2022",
                display: "inline-block",
                padding: ".35em .65em",
              }}
            >
              <Typography sx={{ fontSize: ".75em", fontWeight: 700 }}>
                {speciality?.speciality_name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default ProviderSpecialities;
