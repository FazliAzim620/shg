import React from "react";
import {
  Drawer,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
import { useSelector } from "react-redux";

const BackgroundCheckDrawer = ({
  open,
  onClose,
  checkType,
  formData,
  errors,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "400px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#fff",
          paddingBottom: 2,
        }}
      >
        <Typography
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 500,
            mb: 2,
          }}
        >
          {" "}
          Submit {checkType} Details
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box
        component="form"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
        >
          {" "}
          First Name
        </Typography>
        <CommonInputField
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={onChange}
          error={!!errors.first_name}
        />
        <Typography
          variant="body2"
          sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
        >
          {" "}
          Last Name
        </Typography>
        <CommonInputField
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={onChange}
          error={!!errors.last_name}
        />
        <Typography
          variant="body2"
          sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
        >
          {" "}
          Date of Birth
        </Typography>
        <CommonInputField
          name="dob"
          placeholder="Date of Birth"
          type="date"
          value={formData.dob}
          onChange={onChange}
          error={!!errors.dob}
        />
        {checkType === "OIG" && (
          <>
            <Typography
              variant="body2"
              sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
            >
              {" "}
              UPIN
            </Typography>
            <CommonInputField
              name="upin"
              placeholder="UPIN"
              value={formData.upin}
              onChange={onChange}
              error={!!errors.upin}
            />
            <Typography
              variant="body2"
              sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
            >
              {" "}
              NPI
            </Typography>
            <CommonInputField
              name="npi"
              placeholder="NPI"
              value={formData.npi}
              onChange={onChange}
              error={!!errors.npi}
            />
            <Typography
              variant="body2"
              sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
            >
              {" "}
              Address
            </Typography>
            <CommonInputField
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={onChange}
              error={!!errors.address}
            />
          </>
        )}
        {checkType === "SAM" && (
          <>
            <Typography
              variant="body2"
              sx={{ fontSize: "1rem", fontWeight: 400, p: "12px 0px 8px 0px" }}
            >
              {" "}
              State ID
            </Typography>
            <CommonInputField
              name="state_id"
              placeholder="State ID"
              value={formData.state_id}
              onChange={onChange}
              error={!!errors.state_id}
            />
          </>
        )}
        {errors.submitError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errors.submitError}
          </Typography>
        )}
      </Box>

      {/* Fixed Footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fff",
          padding: "10px 0",
          display: "flex",
          gap: 1,
          justifyContent: "right",
        }}
      >
        <Button
          sx={{
            textTransform: "capitalize",
            color: "text.primary",
            fontSize: "0.8125rem",
            fontWeight: 400,
            border: "1px solid rgba(99, 99, 99, 0.2)",
            padding: "8px 16px",
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
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ textTransform: "none", py: 1 }}
        >
          {isLoading ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Drawer>
  );
};

export default BackgroundCheckDrawer;
