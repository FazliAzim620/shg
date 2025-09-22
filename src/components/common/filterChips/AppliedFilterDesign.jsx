import { Close } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
import { flxCntrSx } from "../../constants/data";

const AppliedFilterDesign = ({ title }) => {
  return (
    <Box
      sx={{
        py: 0.5,
        px: "14px",
        border: "1px solid #DEE2E6",
        bgcolor: "white",
        borderRadius: "4px",
      }}
    >
      <Typography
        sx={{
          ...flxCntrSx,
          gap: 0.5,
          color: "#1E2022",
          fontWeight: 500,
          fontSize: "14px",
          textTransform: "capitalize",
        }}
      >
        {title} <Close sx={{ cursor: "pointer", fontSize: "1rem" }} />
      </Typography>
    </Box>
  );
};

export default AppliedFilterDesign;
