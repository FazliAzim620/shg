import { Download } from "@mui/icons-material";
import { Alert, CircularProgress } from "@mui/material";
import React from "react";

const ExportAlert = ({ severity, message }) => {
  return (
    <Alert
      severity={severity}
      //   icon={
      //     severity === "success" ? (
      //       <Download size={20} />
      //     ) : (
      //       <CircularProgress size={20} />
      //     )
      icon={severity === "info" ? <CircularProgress size={20} /> : ""}
      sx={{
        my: "24px",
        borderLeft: "3px solid",
        borderColor:
          severity === "success" ? "rgba(0, 201, 167, 1)" : "primary.main",
        bgcolor:
          severity === "success"
            ? "rgba(0, 201, 167, 0.1)"
            : "rgba(55, 125, 255, 0.1)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {message
        ? message
        : severity === "success"
        ? " Your export file has been successfully generated!"
        : "Generating your export file. This may take a few moments."}
    </Alert>
  );
};

export default ExportAlert;
