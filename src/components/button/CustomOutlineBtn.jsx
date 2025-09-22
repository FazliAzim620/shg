import { Button } from "@mui/material";
import React from "react";

const CustomOutlineBtn = ({
  onClick,
  text,
  startIcon,
  width,
  mr,
  fontWeight,
  color,
  hover,
  mt,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      component="label"
      startIcon={startIcon}
      sx={{
        mt: mt || 1.1,
        textTransform: "inherit",
        boxShadow: "none",
        p: ".5125rem 1.1rem",
        width: width || "91.67px",
        height: "41.92px",
        color: " #677788",
        fontSize: "0.8125rem",
        border: "1px solid rgba(231, 234, 243, .7)",
        mr: mr || 3,
        fontWeight: fontWeight || 400,
        bgcolor: "background.paper",

        "&:hover": {
          bgcolor: "background.paper",

          border: "1px solid rgba(99, 99, 99, 0.2)",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          color: hover ? hover : "text.btn_theme",
        },
      }}
    >
      {text}
    </Button>
  );
};

export default CustomOutlineBtn;
