import React, { useState } from "react";
import { Box, Typography, Paper, Grid, Button, Divider } from "@mui/material";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../../../components/job-component/CommonSelect";
import API from "../../../../API";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const AddLicense = ({ closeAddHandler, userId }) => {
  const { user } = useSelector((state) => state.login);
  const [formData, setFormData] = useState({
    JurisdictionAbbreviation: "",
    LicenseNumber: "",
    LicenseType: "",
    NcsbnId: "",
    RecordId: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : "This field is required",
    }));
  };

  const resetForm = () => {
    if (closeAddHandler) {
      closeAddHandler();
    }
    setFormData({
      JurisdictionAbbreviation: "",
      LicenseNumber: "",
      LicenseType: "",
      NcsbnId: "",
      RecordId: "",
    });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Prepare the data for API call
        const apiData = {
          for_nurse_user_id: userId ? userId : user?.user?.id,
          JurisdictionAbbreviation: formData.JurisdictionAbbreviation,
          LicenseNumber: formData.LicenseNumber,
          LicenseType: formData.LicenseType,
          NcsbnId: formData.NcsbnId,
          RecordId: formData.RecordId,
        };

        const response = await API.post(
          `/api/nursys-submit-nurse-info`,
          apiData
        );
        closeAddHandler();
        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text:
            response.data.msg ||
            "Nurse license submitted successfully. Results will be fetched automatically within next hour.",
          confirmButtonText: "OK",
          confirmButtonColor: "#1976d2",
        });

        // Reset form after successful submission
        resetForm();
      } catch (error) {
        console.error("API Error:", error);

        // Extract error message
        let errorMessage =
          "An error occurred while submitting the license information.";

        if (error.response) {
          // Server responded with an error status
          errorMessage =
            error.response.data?.message ||
            error.response.data?.msg ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          // Something else happened
          errorMessage = error.message || errorMessage;
        }

        // Show error alert
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMessage,
          confirmButtonText: "OK",
          confirmButtonColor: "#d32f2f",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box sx={{ margin: "0 auto" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          color: "text.black",
          padding: 3,
        }}
      >
        Add License
      </Typography>
      <Divider />
      <Paper
        elevation={2}
        sx={{
          padding: 3,
          borderRadius: "none",
          border: "none",
          boxShadow: "none",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {[
              {
                label: "Jurisdiction",
                name: "JurisdictionAbbreviation",
                placeholder: "e.g., TX, CA, NY",
              },
              {
                label: "License number",
                name: "LicenseNumber",
                placeholder: "e.g, RN1232456",
              },
              {
                label: "NCSBN ID",
                name: "NcsbnId",
                placeholder: "National Council of State Boards of Nursing ID",
              },
              {
                label: "Record ID",
                name: "RecordId",
                placeholder: "l47ac10b-58cc-4372",
              },
            ].map(({ label, name, placeholder }) => (
              <Grid item xs={12} sm={6} key={name}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "1rem", fontWeight: 400, pb: 1 }}
                >
                  {label} <span style={{ color: "red" }}>*</span>
                </Typography>
                <CommonInputField
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  error={!!errors[name]}
                  helperText={errors[name]}
                  disabled={isSubmitting}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                sx={{ fontSize: "1rem", fontWeight: 400, pb: 1 }}
              >
                License type <span style={{ color: "red" }}>*</span>
              </Typography>
              <CommonSelect
                height="2.6rem"
                options={[
                  { value: "", label: "Select License Type" },
                  { value: "RN", label: "RN - Registered Nurse" },
                  { value: "LPN", label: "LPN - Licensed Practical Nurse" },
                  {
                    value: "CNP",
                    label: "CNP - Certified Nurse Practitioner,",
                  },
                  {
                    value: "APRN",
                    label: "APRN - Advanced Practice Registered Nurse",
                  },
                  { value: "CNA", label: "CNA - Certified Nursing Assistant" },
                ]}
                name="LicenseType"
                handleChange={handleChange}
                fullWidth
                margin="normal"
                value={formData.LicenseType}
                placeholder="License type *"
                type="text"
                required
                error={!!errors.LicenseType}
                helperText={errors.LicenseType}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              gap: 2,
              justifyContent: "right",
            }}
          >
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
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", py: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding license..." : "Add license"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddLicense;
