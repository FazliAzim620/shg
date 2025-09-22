import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const RadioToggleButton = ({
  options,
  selectedValue,
  onValueChange, // This can now be handled in the parent
  error,
}) => {
  const sx = { width: 16, height: 16, marginRight: 1, color: "text.main" };

  // Helper function to convert label to sentence case
  const toSentenceCase = (label) => {
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      border={error ? "1.2px solid red" : "1px solid #eef0f7"}
      boxShadow={"none"}
      borderRadius={1}
      alignItems="flex-start"
    >
      <ToggleButtonGroup
        value={selectedValue}
        exclusive
        onChange={onValueChange} // Use the function passed from the parent
        aria-label="toggle-button-group"
        fullWidth
        sx={{ width: "100%", boxShadow: "none" }}
      >
        {options.map((option, index) => (
          <ToggleButton
            key={option.value}
            sx={{
              border: "none",
              borderRight: options?.length > 2 && "1px solid #eef0f7",
              flexGrow: 1,
              height: "2.6rem",
              justifyContent: "flex-start", // Align text to the left
              textTransform: "capitalize",
            }}
            value={option.value}
            aria-label={option.value}
          >
            {selectedValue === option.value ? (
              <RadioButtonCheckedIcon sx={sx} />
            ) : (
              <RadioButtonUncheckedIcon sx={sx} />
            )}
            {toSentenceCase(option.label)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default RadioToggleButton;
