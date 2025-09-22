import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  Divider,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../components/job-component/CreateJobModal";
const EditUserDetails = ({ setFormData, formData, errors, setErrors }) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        borderRadius: "12px",
        boxShadow: "none",
        width: "98%",
        mx: "auto",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: "text.black",
              fontWeight: 600,
              fontSize: "20px",
              mb: 3,
            }}
          >
            Edit User Details
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    fontSize: "16px",
                    fontWeight: 400,
                    mb: "8px",
                  }}
                >
                  First name
                </Typography>
                <CommonInputField
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter user first name"
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    fontSize: "16px",
                    fontWeight: 400,
                    mb: "8px",
                  }}
                >
                  Last name
                </Typography>
                <CommonInputField
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter user last name"
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    fontSize: "16px",
                    fontWeight: 400,
                    mb: "8px",
                  }}
                >
                  Email address
                </Typography>
                <CommonInputField
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
              <Box>
                <FormControl fullWidth>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      fontSize: "16px",
                      fontWeight: 400,
                      mb: "8px",
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
                          backgroundColor: "#F6F7FA",
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
                </FormControl>
              </Box>
            </Box>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditUserDetails;
