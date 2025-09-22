import { Box, Link, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
const InputField = ({
  title,
  link,
  value,
  name,
  type,
  placeholder,
  onChange,
  endAdornment,
  url,
  error,
  submitHandler,
  className,
  validField,
  errBorder,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  return (
    <Box className={className}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <Typography variant="body1" sx={{ mb: 1, color: "text.black", mt: 2 }}>
          {title}
        </Typography>
        {link && (
          <Link
            href={url}
            variant="caption"
            display="block"
            align="right"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "text.link",
              textDecoration: "none",
            }}
          >
            {link}
          </Link>
        )}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        type={type}
        placeholder={placeholder}
        value={value}
        InputProps={{ endAdornment }}
        onChange={(e) => onChange(e.target.value, name)}
        // className="custom_input"
        onKeyDown={(e) => e.key === "Enter" && submitHandler(e)}
        sx={{
          marginBottom: "5px",
          borderRadius: "5px",
          bgcolor: isLightMode ? "#F6F7Fa" : "#333",
          color: isLightMode ? "black" : "white",
          border: error
            ? ".0625rem solid #ed4c78"
            : validField
            ? ".0625rem solid #00c9a7"
            : ".0625rem solid rgba(231, 234, 243, .7)",
          "& fieldset": { border: "none" },
          "& .MuiOutlinedInput-root.Mui-focused": {
            backgroundColor: isLightMode ? "white" : "#25282A",
            boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          },
          "&:focus .MuiOutlinedInput-root": {
            backgroundColor: isLightMode ? "white" : "#25282A",
            boxShadow:
              " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
          },
          input: {
            color: isLightMode ? "black" : "white",
          },
        }}
      />
      {/* <TextField
        fullWidth
        variant="outlined"
        type={type}
        placeholder={placeholder}
        value={value}
        InputProps={{ endAdornment }}
        onChange={(e) => onChange(e.target.value, name)}
        className="custom_input"
        sx={{
          mb: error ? 0 : 3,
          bgcolor: "#F7F9FC",
          // border: "none",
          // outline: "none",
          color: "red",
          "& fieldset": { border: "none" },
          "& :hover": {
            background: "white",
            borderRadius: "7px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 3px 9px 0px",
            transition:
              "box-shadow 0.3s ease-in-out, background 0.3s ease-in-out",
          },
          "& :focus": {
            background: "white",
            borderRadius: "7px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 3px 9px 0px",
            transition:
              "box-shadow 0.3s ease-in-out, background 0.3s ease-in-out",
          },
        }}
      /> */}
      {error && (
        <Typography
          variant="caption"
          sx={{ fontSize: ".875em", color: "#ed4c78", marginTop: ".25rem" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default InputField;
