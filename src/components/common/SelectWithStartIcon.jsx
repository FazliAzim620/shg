import React from "react";
import { FormControl, Select, MenuItem, Typography } from "@mui/material";

const SelectWithStartIcon = ({
  name,
  value,
  onChange,
  options,
  displayEmpty = false,
  placeholder,
  startIcon: StartIcon, // Expecting a component to be passed as startIcon
  sxStyles = {},
}) => {
  return (
    <FormControl fullWidth>
      <Select
        name={name}
        startAdornment={StartIcon && <StartIcon style={{ fontSize: "17px" }} />} // Render the passed startIcon component
        value={value}
        onChange={onChange}
        displayEmpty={displayEmpty}
        renderValue={(selected) => {
          if (!selected) {
            return <Typography sx={{ pl: 1 }}>{placeholder}</Typography>;
          }
          return <Typography sx={{ pl: 1 }}>{selected}</Typography>;
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "border.lightGray",
          },
          "& .MuiSelect-select": {
            paddingY: "12px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "border.lightGray",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "border.lightGray",
            border: "1px solid border.lightGray",
          },
          color: "text.secondary",
          "& .MuiSvgIcon-root": {
            color: "text.secondary",
          },
          ...sxStyles, // Custom styles passed as prop
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectWithStartIcon;
