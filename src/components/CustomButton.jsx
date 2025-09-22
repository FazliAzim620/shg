import { Button } from "@mui/material";
import React from "react";

const CustomButton = ({ onClick, label, padding, mr }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        mr: mr ? mr : 2,
        textTransform: "capitalize",
        color: "text.primary",
        fontSize: "0.8125rem",
        fontWeight: 400,
        border: "1px solid rgba(99, 99, 99, 0.2)",
        padding: padding ? padding : "5px 16px",
        minWidth: 0,
        bgcolor: "background.paper",
        "&:hover": {
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          color: "text.btn_blue",
          transform: "scale(1.01)",
        },
        "&:focus": {
          outline: "none",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
