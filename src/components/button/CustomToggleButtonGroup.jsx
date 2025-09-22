import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const CustomToggleButtonGroup = ({
  buttonTab, // Dynamic button configurations
  alignment,
  handleAlignment,
  handleToggleClick,
  darkMode = "light", // Default value for darkMode if not passed
  sx,
}) => {
  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="toggle button group"
      sx={{
        bgcolor: darkMode === "light" ? "#F8FAFD" : "#1E2022", // Background color based on darkMode
        ...sx, // Apply any additional custom styles passed from the parent
      }}
    >
      {buttonTab.map((item, index) => (
        <ToggleButton
          key={index}
          value={item.value}
          aria-label={item.label}
          onClick={() => handleToggleClick(item.value)}
          sx={{
            border: "none",
            outline: "none",
            color: "text.or_color", // Assuming 'text.or_color' is a color from the theme
            textTransform: "none",
            fontSize: ".875rem",
            fontWeight: 400,
            height: "2.5rem",
            mt: 0.5,
            minWidth: "5rem", // Fixed width for buttons
            "&:hover": {
              bgcolor: "#F8FAFD", // Hover background color
            },
            "&.Mui-selected": {
              m: 0.5,
              color: "text.black", // Color for selected button text
              fontWeight: 400,
              boxShadow:
                darkMode === "light" &&
                "0 .1875rem .375rem 0 rgba(140, 152, 164, .25)", // Box shadow for light mode
              bgcolor: darkMode === "light" ? "background.paper" : "#25282A",
            },
            "&.Mui-selected:hover": {
              bgcolor: darkMode === "light" ? "white" : "black", // Hover effect for selected button
            },
            "&.Mui-selected ": {
              borderRadius: "7px", // Rounded corners for selected button
            },
          }}
        >
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default CustomToggleButtonGroup;
