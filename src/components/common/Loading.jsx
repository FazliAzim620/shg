import React from "react";
import { CircularProgress, Box } from "@mui/material";

// Loading Component
const Loading = ({ open }) => {
  if (!open) return null; // Don't render anything if 'open' is false

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Slight opacity for overlay effect
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        zIndex: 9999, // Ensure it's above other content
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
};

export default Loading;
