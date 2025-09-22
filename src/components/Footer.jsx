import { Box, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: "1rem",
        mb: "1.5rem",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.76rem" }}>
        © SHG. 2024. Job Management System.
      </Typography>
    </Box>
  );
};

export default Footer;
