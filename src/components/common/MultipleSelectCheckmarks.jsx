import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { BpCheckbox } from "./CustomizeCHeckbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultipleSelectCheckmarks = ({
  width,
  options = [],
  name,
  value = [],
  onChange,
  error = false,
  from,
  disabled,
}) => {
  const borderColor = error ? "#d32f2f" : `rgba(231, 234, 243, .7)`;

  // Convert value array to the corresponding labels
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // Convert the value to an array of IDs
    onChange(
      name,
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  return (
    <Box>
      <FormControl
        sx={{
          mr: 3,
          mb: 1,
          width: "100%",
          maxWidth: width ? "none" : from ? "900px" : "700px",
        }}
      >
        <Select
          id="multiple-checkbox-select"
          multiple
          value={value}
          onChange={handleChange}
          disabled={disabled}
          input={
            <OutlinedInput
              sx={{
                height: "2.6rem",
                "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                  {
                    padding: 0,
                  },
                color: "text.black",
                fontSize: "0.875rem",
                backgroundColor: "#F6F7FA",
                border: `1px solid ${borderColor}`,
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  border: "none",
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: `1.5px solid rgba(231, 234, 243, .7)`,
                  },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          }
          renderValue={() => selectedLabels}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <BpCheckbox checked={value.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MultipleSelectCheckmarks;
