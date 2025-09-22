import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  OutlinedInput,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { CommonInputField } from "../../components/job-component/CreateJobModal";
import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";
import { useSelector } from "react-redux";

const MultipleSelectCheckmarks = ({
  darkMode,
  options = [],
  name,
  value = [],
  onChange,
  error = false,
  countAppliedFilters,
}) => {
  const borderColor = error ? "#d32f2f" : `rgba(231, 234, 243, .7)`;
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(", ");

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

  return (
    <Box>
      <FormControl sx={{ width: "100%" }}>
        <Select
          multiple
          value={value}
          onChange={(event) => {
            const { value } = event.target;
            onChange(
              name,
              typeof value === "string" ? value.split(",") : value
            );
          }}
          input={
            <OutlinedInput
              sx={{
                height: "2.6rem",
                color: "text.black",
                fontSize: "0.875rem",
                backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                border: `1px solid ${borderColor}`,
                "&.Mui-focused": {
                  backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                  color: darkMode === "dark" ? "#fff" : "text.black",
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

const AddUser = ({
  open,
  onClose,
  user,
  onSave,
  mode,
  countAppliedFilters,
  clearFilter,
  rolesList,
  isLoading,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
    status: "active",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    roles: false,
  });

  useEffect(() => {
    if (mode === "role") {
      setFormData({
        roles: user?.length > 0 ? user?.map((item) => item?.id) : [],
      });
    }
    if (mode === "Filter") {
      setFormData({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        roles: user?.roles || [],
        status: user?.status || "active",
      });
    }
    if (user && mode === "edit") {
      const [firstName = "", lastName = ""] = (user.name || "").split(" ");
      setFormData({
        firstName,
        lastName,
        email: user.email || "",
        roles: user.roles || [],
        status: user.status || "active",
      });
    } else if (mode === "add") {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        roles: [],
        status: "active",
      });
    }
    setErrors({
      firstName: false,
      lastName: false,
      email: false,
      roles: false,
    });
  }, [user, mode, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "roles" && errors.roles && value.length > 0) {
      setErrors((prev) => ({
        ...prev,
        roles: false,
      }));
    }
  };

  const handleSave = () => {
    let newErrors;
    if (mode == "role") {
      newErrors = {
        roles: formData.roles.length === 0,
      };
    } else {
      newErrors = {
        firstName: formData.firstName.trim() === "",
        lastName: formData.lastName.trim() === "",
        email: formData.email.trim() === "",
        roles: formData.roles.length === 0,
      };
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      if (mode === "role") {
        onSave(formData?.roles);
      } else {
        const dataToSave = {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        };
        onSave(dataToSave);
      }
    }
  };

  const handleFilter = () => {
    onSave(formData);
    if (!isLoading) {
      onClose();
    }
  };

  const handleClearFilter = () => {
    onClose();
    clearFilter();
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
    >
      <Box
        sx={{
          pt: "24px",
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "text.black",
          }}
        >
          {mode === "add"
            ? "Create new user"
            : mode === "Filter"
            ? "Filter users"
            : mode === "role"
            ? "Select Role"
            : "Edit user"}
        </Typography>
        <IconButton sx={{ mr: -2 }} onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 4,
          pb: 11,
          flexGrow: 1,
          overflowY: "auto",
          height: "calc(100vh - 150px)",
          bgcolor: "background.paper",
        }}
      >
        {mode !== "role" && (
          <>
            {mode === "Filter" ? (
              ""
            ) : (
              <>
                <Typography
                  pt={"24px"}
                  pb={"8px"}
                  sx={{
                    color: darkMode === "dark" ? "white" : "#1E2022",
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                >
                  First Name
                </Typography>
                <CommonInputField
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 1 }}
                  >
                    First name is required
                  </Typography>
                )}

                <Typography
                  pt={"24px"}
                  pb={"8px"}
                  sx={{
                    color: darkMode === "dark" ? "white" : "#1E2022",
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                >
                  Last Name
                </Typography>
                <CommonInputField
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </>
            )}
            {errors.lastName && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                Last name is required
              </Typography>
            )}

            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Email
            </Typography>
            <CommonInputField
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            {errors.email && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                Email is required
              </Typography>
            )}
          </>
        )}

        {(mode === "add" || mode === "Filter") && (
          <>
            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Roles
            </Typography>
            <MultipleSelectCheckmarks
              darkMode={darkMode}
              name="roles"
              options={rolesList}
              value={formData.roles}
              onChange={handleMultiSelectChange}
              error={errors.roles}
            />
            {errors.roles && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                At least one role is required
              </Typography>
            )}
          </>
        )}
        {mode === "role" && (
          <>
            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Select Role
            </Typography>
            <MultipleSelectCheckmarks
              darkMode={darkMode}
              name="roles"
              options={rolesList}
              value={formData.roles}
              onChange={handleMultiSelectChange}
              error={errors.roles}
            />
          </>
        )}
        {mode === "Filter" && (
          <>
            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: darkMode === "dark" ? "#fff" : "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Status
            </Typography>
            <Select
              fullWidth
              name="status"
              value={formData.status}
              onChange={handleChange}
              input={
                <OutlinedInput
                  sx={{
                    height: "2.6rem",
                    color: "text.black",
                    fontSize: "0.875rem",
                    backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                    border: "1px solid rgba(231, 234, 243, .7)",
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    },
                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1.5px solid rgba(231, 234, 243, .7)",
                      },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none",
                      },
                  }}
                />
              }
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        {mode === "Filter" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1,
              px: 2,
              bgcolor: "background.paper",
            }}
          >
            {countAppliedFilters(user) ? (
              <Button
                sx={{
                  mr: 2,
                  textTransform: "capitalize",
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  border: "1px solid rgba(99, 99, 99, 0.2)",
                  padding: "5px 16px",
                  minWidth: 0,
                  bgcolor: "background.paper",
                  "&:hover": {
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    color: "text.main",
                    transform: "scale(1.01)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
                fullWidth
                onClick={handleClearFilter}
              >
                Clear all filters
              </Button>
            ) : (
              ""
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFilter}
              sx={{ textTransform: "none", py: 1 }}
            >
              Show results
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1,
              px: 2,
            }}
          >
            <Button
              sx={{
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.2)",
                padding: "5px 16px",
                minWidth: 0,
                width: "87px",
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  color: "text.main",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
              sx={{ textTransform: "none", py: 1, width: "71px" }}
            >
              {isLoading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : mode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AddUser;
