import { Box, Typography } from "@mui/material";
import React from "react";
import { HeadingCommon } from "./HeadingCommon";

const ProviderNeededJobDetails = () => {
  return (
    <>
      <Box sx={{ mt: "56px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px", // Add space between columns
          }}
        >
          <Box>
            <HeadingCommon mb={"5px"} title={"Desired job title"} />
            <Typography
              sx={{ color: "#677796", fontSize: "14px", mb: "1rem", mt: 0 }}
            >
              Family Nurse Practitioner
            </Typography>
          </Box>
          <Box>
            <HeadingCommon mb={"5px"} title={"Regular hourly rate"} />
            <Typography
              sx={{ color: "#677796", fontSize: "14px", mb: "1rem", mt: 0 }}
            >
              $80 per hour
            </Typography>
          </Box>
          <Box>
            <HeadingCommon mb={"5px"} title={"Desired job types"} />
            <Typography
              sx={{ color: "#677796", fontSize: "14px", mb: "1rem", mt: 0 }}
            >
              Full time
            </Typography>
          </Box>

          <Box>
            <HeadingCommon mb={"5px"} title={"Holiday hourly rate"} />
            <Typography
              sx={{ color: "#677796", fontSize: "14px", mb: "1rem", mt: 0 }}
            >
              $80 per hour
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProviderNeededJobDetails;
