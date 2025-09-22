import React, { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAlert } from "./alertSlice";

const AlertMessage = () => {
  const dispatch = useDispatch();
  const { message, type, isOpen } = useSelector((state) => state.alert);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        dispatch(clearAlert());
      }, 7000);
    }
  }, [isOpen, dispatch]);

  return isOpen ? (
    <Alert
      severity={type}
      onClose={() => dispatch(clearAlert())}
      sx={{
        width: "100%",
        minWidth: { xs: "100%", md: "500px" },
        textTransform: "capitalize",
      }}
    >
      {message}
    </Alert>
  ) : (
    ""
  );
};

export default AlertMessage;
