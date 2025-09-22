import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Menu,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { ExpandMore } from "@mui/icons-material";
import CustomChip from "../../../components/CustomChip";
import MultipleSelectCheckmarks from "../../../components/common/MultipleSelectCheckmarks";
import { useLocation } from "react-router-dom";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import { StyledTextarea } from "../../../components/StyleTextArea";
import {
  setRefFormData,
  setRefRoles,
  selectRefFormData,
} from "../../../feature/form-builder/referenceFormSlice";
import { selectOptions } from "../../../util";

const rolesList = [
  { value: 1, label: "Healthcare professionals" },
  { value: 2, label: "Doctors" },
  { value: 3, label: "Nurses" },
];

const ReferenceFormHeader = () => {
  const dispatch = useDispatch();
  const { providerRolesList } = useSelector((state) => state.job);
  const formData = useSelector(selectRefFormData);
  const darkMode = useSelector((state) => state.theme.mode);
  const { state } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(setRefFormData({ name, value }));
  };

  const handleRolesChange = (event, newValue) => {
    dispatch(setRefRoles(newValue));
  };
  //   useEffect(() => {
  //     dispatch(setRefFormData("type", "reference"));
  //   }, []);
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
        maxWidth: "98%",
        mx: "auto",
        mt: "12px",
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
            sx={{ color: "text.black", fontSize: "20px" }}
          >
            Create new{" "}
            {state?.active === "OrganizationDocuments"
              ? "organization document"
              : "reference form"}
          </Typography>

          <CustomChip
            dot={true}
            dotColor="#00c9a7"
            color={darkMode === "dark" ? "#fff" : "rgba(103, 119, 136, 1)"}
            bgcolor="rgba(0, 201, 167, 0.1)"
            chipText="Active"
            textTransform="capitalize"
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
        >
          <MenuItem onClick={handleMenuClose}>View</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </Box>

      {/* Form Name Input */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Form name <span style={{ color: "red" }}>*</span>
        </Typography>
        <CommonInputField
          fullWidth
          placeholder="Enter the reference form name"
          variant="outlined"
          value={formData.name}
          name="name"
          onChange={handleChange}
        />
      </Box>

      {/* Roles Selection */}
      <Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Roles <span style={{ color: "red" }}>*</span>
        </Typography>
        <MultipleSelectCheckmarks
          placeholder="Select roles"
          name="roles"
          width={"100%"}
          options={selectOptions(providerRolesList)}
          value={formData.roles}
          onChange={handleRolesChange}
        />
      </Box>
    </Box>
  );
};

export default ReferenceFormHeader;
