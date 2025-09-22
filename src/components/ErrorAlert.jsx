// ErrorAlert.js
import React from "react";
import { Alert, Box, Collapse } from "@mui/material";

const ErrorAlert = ({ successMessage, error, onClose }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      <Collapse in={Boolean(error)}>
        <Alert
          severity={successMessage ? "success" : "error"}
          variant="filled"
          onClose={onClose}
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            mb: 2,
            mr: 2,
          }}
        >
          {error}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default ErrorAlert;
