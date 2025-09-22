import { Box, Typography } from "@mui/material";
import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";

const NoFileUploaded = () => {
  return (
    <Box
      sx={{
        px: 2,
        ml: 1,
        width: "180px",
        height: "220px",
        bgcolor: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <DescriptionIcon
        sx={{
          fontSize: 40,
        }}
      />
      <Typography fontSize={10}>Receipt is not attached!</Typography>
    </Box>
  );
};

export default NoFileUploaded;
