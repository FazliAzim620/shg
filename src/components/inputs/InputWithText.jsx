import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const InputWithText = ({
  name,
  value,
  onChange,
  placeholder,
  text,
  disabled,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        // border: "1px solid rgba(0, 0, 0, 0.23)",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: "rgba(0, 0, 0, 0.54)",
          //   mr: 1,
          fontSize: " .875rem",
          p: ".5525rem 0.5rem",
          fontWeight: 400,
          whiteSpace: "nowrap",
          border: ".0625rem solid rgba(231, 234, 243, .7)",
        }}
      >
        {text}
      </Typography>
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        size="small"
        sx={{
          p: 0,
          bgcolor: isLightMode ? "#F7F9FC" : "#333",
          color: isLightMode ? "black" : "white",
          border: ".0625rem solid transparent",
          "& fieldset": { border: "none" },
          "&:hover": {
            bgcolor: "transparent",
            border: ".0625rem solid rgba(231, 234, 243, .7)",
          },
          "&:focus": {
            bgcolor: isLightMode ? "white" : "red",
            borderRadius: "7px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 3px 9px 0px",
            transition:
              "box-shadow 0.3s ease-in-out, background 0.3s ease-in-out",
          },
          input: {
            color: isLightMode ? "black" : "white",
          },
        }}
      />
    </Box>
  );
};

export default InputWithText;
