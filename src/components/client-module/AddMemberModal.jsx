import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  IconButton,
  Avatar,
  FormControl,
  ToggleButtonGroup,
  styled,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { CommonInputField } from "../job-component/CreateJobModal";
import { useSelector } from "react-redux";

const AddMemberModal = ({
  handleCloseModal,
  addTeamMemberHandler,
  editData,
  isLoading,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const StyledSelect = styled(Select)({
    bgcolor: darkMode === "dark" ? " #333" : "#F8F9FA",
    border: "none",
    outline: "none",
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    phone_type: "Mobile",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined, // Remove the error for the specific field
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addTeamMemberHandler({ ...formData, avatar: avatarPreview });
    }
  };
  useEffect(() => {
    if (editData?.id) {
      setFormData({
        id: editData?.id,
        first_name: editData?.first_name,
        last_name: editData?.last_name,
        email: editData?.email,
        phone: editData?.phone,
        job_title: editData?.job_title,
        phone_type: editData?.phone_type,
      });
    }
  }, [editData]);
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: "600px", md: "800px" },
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: "21px",
            color: "text.black",
          }}
        >
          Add a new member
        </Typography>
        <IconButton onClick={handleCloseModal} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Avatar Section */}
        <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body2"
            color="text.black"
            sx={{ width: "120px" }}
          >
            Avatar
          </Typography>
          <Box
            sx={{
              position: "relative",
              cursor: "pointer",
              "&:hover": {
                "& .MuiAvatar-root": {
                  opacity: 0.8,
                },
              },
            }}
          >
            <Avatar
              src={formData?.avatar}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#e7eaf3",
                color: "#1976d2",
                fontSize: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              {formData?.first_name?.charAt(0)}
              {formData?.last_name?.charAt(0)}
            </Avatar>
          </Box>
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Full Name Field */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "text.black" }}
            >
              Full name <span style={{ color: "red" }}>*</span>
            </Typography>
            <Box sx={{ display: "flex", flex: 1 }}>
              <CommonInputField
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
              />
              <CommonInputField
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
              />
            </Box>
          </Box>

          {/* Email Field */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "text.black" }}
            >
              Email <span style={{ color: "red" }}>*</span>
            </Typography>
            <Box sx={{ flex: 1 }}>
              <CommonInputField
                name="email"
                type="email"
                placeholder="clarice@site.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
              />
            </Box>
          </Box>

          {/* Phone Fields */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "text.black" }}
            >
              Phone <span style={{ color: "red" }}>*</span>
            </Typography>

            <ToggleButtonGroup
              color="primary"
              exclusive
              aria-label="Platform"
              sx={{ width: "100%" }}
            >
              <CommonInputField
                name="phone"
                isPhoneNumber={"phone"}
                placeholder="+x(xxx)xxx-xx-xx"
                value={formData.phone}
                width="100%"
                height="2.5rem"
                onChange={(number) => {
                  setFormData((prev) => ({
                    ...prev,
                    ["phone"]: number,
                  }));
                  if (errors["phone"]) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      ["phone"]: undefined,
                    }));
                  }
                }}
                // onChange={(e) => {
                //   const value = parseInt(e.target.value, 10);
                //   if (!isNaN(value)) handleChange(e);
                // }}
                error={!!errors.phone}
              />
              <StyledSelect
                displayEmpty
                size="small"
                name="phone_type"
                value={formData.phone_type}
                onChange={handleChange}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.or_color" }}
                      >
                        Select
                      </Typography>
                    );
                  }
                  return selected;
                }}
                input={
                  <OutlinedInput
                    sx={{
                      height: "2.6rem",
                      "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                        {
                          padding: 0,
                        },

                      fontSize: "0.875rem",

                      border: `none`,
                      "&.Mui-focused": {
                        backgroundColor: darkMode === "dark" ? "#333" : "#fff",
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
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: !!errors.phone_type
                            ? "1px solid red"
                            : "none",
                        },
                    }}
                  />
                }
                sx={{
                  minWidth: "120px",
                  backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                  color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                  border:
                    darkMode === "dark"
                      ? `1.5px solid rgba(231, 234, 243, .7)`
                      : "none",
                }}
              >
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Work">Work</MenuItem>
                <MenuItem value="Fax">Fax</MenuItem>
              </StyledSelect>
            </ToggleButtonGroup>
          </Box>
          {/* Job Title Field */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "text.black" }}
            >
              Job title <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <StyledSelect
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                displayEmpty
                size="small"
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.or_color" }}
                      >
                        Select
                      </Typography>
                    );
                  }
                  return selected;
                }}
                input={
                  <OutlinedInput
                    sx={{
                      height: "2.6rem",
                      "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                        {
                          padding: 0,
                        },

                      fontSize: "0.875rem",

                      border: `none`,
                      "&.Mui-focused": {
                        backgroundColor: darkMode === "dark" ? "#333" : "#fff",
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
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          border: !!errors.job_title ? "1px solid red" : "none",
                        },
                    }}
                  />
                }
                sx={{
                  minWidth: "120px",
                  backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                  color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                  border:
                    darkMode === "dark"
                      ? `1.5px solid rgba(231, 234, 243, .7)`
                      : "none",
                }}
              >
                <MenuItem value="Credentialing Coordinator">
                  Credentialing Coordinator
                </MenuItem>
                <MenuItem value="MSP Coordinator">MSP Coordinator</MenuItem>
                <MenuItem value="VMS Manager">VMS Manager</MenuItem>
                <MenuItem value="Accounting Manager">
                  Accounting Manager
                </MenuItem>
                <MenuItem value="Director of Recruitment">
                  Director of Recruitment
                </MenuItem>
                <MenuItem value="Scheduling Director">
                  Scheduling Director
                </MenuItem>
                <MenuItem value="Recruiter Manager">Recruiter Manager</MenuItem>
                <MenuItem value="VP of Recruitment">VP of Recruitment</MenuItem>
                <MenuItem value="Human Resources Manager  ">
                  Human Resources Manager{" "}
                </MenuItem>
              </StyledSelect>
            </FormControl>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "8px 1.8rem",
              minWidth: 0,
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                border: "1px solid rgba(99, 99, 99, 0.2)",
                transform: "scale(1.01)",
                color: "text.btn_blue",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              padding: "8px 1.8rem",
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={18} sx={{ color: "inherit" }} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddMemberModal;
