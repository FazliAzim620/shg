import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Chip,
  Box,
  Button,
  Typography,
  Switch,
  Menu,
  MenuItem,
  TextareaAutosize,
  styled,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import MultipleSelectCheckmarks from "../../../components/common/MultipleSelectCheckmarks";
import CustomChip from "../../../components/CustomChip";
import { useSelector } from "react-redux";
import { ExpandMore } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

// const rolesList = ["Healthcare professionals", "Doctors", "Nurses"];
const rolesList = [
  { value: 1, label: "Healthcare professionals" },
  { value: 2, label: "Doctors  " },
  { value: 3, label: "Nurses  " },
];
const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px", // optional: adjust for styling
  padding: "8px",
  resize: "vertical", // prevent resizing if desired
  outline: "none",
  height: "100",
  transition: "box-shadow 0.2s",
  backgroundColor: isLightMode ? "#f8fafd" : "#25282A",
  color: isLightMode ? "black" : "white",
  "&:focus": {
    boxShadow: " rgba(0, 0, 0, 0.09) 0px 3px 12px",
    backgroundColor: isLightMode ? "white" : "#25282A",
  },
}));
const ReferenceForm = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const mode = useSelector((state) => state.theme.mode);
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    roles: [],
    description: "",
    purpose: "download",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",

        maxWidth: "98%",
        mx: "auto",
        mt: "12px",
        boxShadow: "none",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "text.black", fontSize: "20px", fontWeight: 600 }}
          >
            Create new{" "}
            {state?.active === "OrganizationDocuments"
              ? "organization document"
              : "reference form"}
          </Typography>

          <CustomChip
            dot={true}
            dotColor={true ? "#00c9a7" : "rgba(237, 76, 120, 1)"}
            color={mode == "dark" ? "#fff" : "rgba(103, 119, 136, 1)"}
            bgcolor={
              true ? "rgba(0, 201, 167, 0.1)" : "rgba(237, 76, 120, 0.1)"
            }
            chipText={true ? "Active" : "Pending"}
            textTransform={"capitalize"}
            weight={400}
          />
        </Box>
        <Button
          onClick={handleMenuClick}
          variant="contained"
          sx={{ bgcolor: "primary.main", textTransform: "none" }}
        >
          More <ExpandMore />
        </Button>
        <Menu
          id="reference-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              gap: 1,
              color: "text.black",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            View
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              gap: 1,
              color: "text.black",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              // confirmDelete(references?.[0]);
            }}
            sx={{
              gap: 1,
              color: "text.error",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>

      {/* Form Name Input */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            fontSize: "1rem",
            fontWeight: 400,
            color: "text.black",
          }}
        >
          Form name <span style={{ color: "red" }}>*</span>
        </Typography>

        <CommonInputField
          fullWidth
          placeholder="Enter the reference form name"
          variant="outlined"
          value={formData?.name}
          name="name"
          onChange={handleChange}
        />
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            fontSize: "1rem",
            fontWeight: 400,
            color: "text.black",
          }}
        >
          Description <span style={{ color: "red" }}>*</span>
        </Typography>
        <StyledTextarea
          minRows={3}
          name="description"
          value={formData?.description}
          onChange={handleChange}
          placeholder="Enter a brief note on this document..."
          isLightMode={darkMode}
          sx={{ mt: 1, height: "auto", fontFamily: "Inter, sans-serif" }}
        />
      </Box>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Purpose <span style={{ color: "red" }}>*</span>
          </Typography>
        </FormLabel>
        <RadioGroup
          onChange={handleChange}
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="purpose"
          value={formData?.purpose}
        >
          <FormControlLabel
            value="signature"
            control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
            label={
              <Typography
                variant="caption"
                sx={{ fontSize: "14px", fontWeight: 400 }}
              >
                Signature required
              </Typography>
            }
          />
          <FormControlLabel
            value="download"
            control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
            label={
              <Typography
                variant="caption"
                sx={{ fontSize: "14px", fontWeight: 400 }}
              >
                Download only{" "}
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
      {/* Roles Selection */}
      <Box>
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            fontSize: "1rem",
            fontWeight: 400,
            color: "text.black",
          }}
        >
          Roles <span style={{ color: "red" }}>*</span>
        </Typography>
        <MultipleSelectCheckmarks
          // darkMode={darkMode}
          placeholder="text"
          name="roles"
          options={rolesList}
          width={"100%"}
          value={formData?.roles}
          // onChange={(event, newValue) => setSelectedRoles(newValue)}
          onChange={(event, newValue) =>
            setFormData((prev) => ({
              ...prev,
              roles: newValue,
            }))
          }
        />
      </Box>
    </Box>
  );
};

export default ReferenceForm;
