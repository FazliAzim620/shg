import React, { useState } from "react";
import CardCommon from "../../../components/CardCommon";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useSelector } from "react-redux";
import API from "../../../API";
import InputField from "../../../components/inputs/InputField";

const PasswordTab = () => {
  const [passwords, setPasswords] = useState({
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currPasswordError: "",
    newPasswordError: "",
    confirmPasswordError: "",
    passwordNotMatched: "",
  });

  const [showPassword, setShowPassword] = useState({
    showCurrPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const darkMode = useSelector((state) => state.theme.mode);

  const handleClickShowPassword = (type) => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleChangePassword = (value, name) => {
    setPasswords((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    setErrors((prev) => ({
      ...prev,
      [`${name}Error`]: "",
      passwordNotMatched: "",
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    const { currPassword, newPassword, confirmPassword } = passwords;

    // Regular expression for password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Check if current password is provided
    if (!currPassword) {
      setErrors((prev) => ({
        ...prev,
        currPasswordError: "Old password is required!",
      }));
      hasError = true;
    }

    // Check if new password meets the pattern
    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPasswordError: "New password is required!",
      }));
      hasError = true;
    } else if (!passwordPattern.test(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPasswordError: "Password does not meet requirements",
      }));
      hasError = true;
    }

    // Check if confirm password is provided
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPasswordError: "Confirm password is required!",
      }));
      hasError = true;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        passwordNotMatched: "New and confirm passwords do not match.",
      }));
      hasError = true;
    }

    // Stop the process if there are validation errors
    if (hasError) return;

    setIsLoading(true);
    const formData = {
      current_password: currPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    try {
      const response = await API.post("/api/change-password", formData);
      const data = response.data;
      setApiResponseYes(true);
      setApiResponse(data);
      setShowAlert(true);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let hasError = false;

  //   const { currPassword, newPassword, confirmPassword } = passwords;

  //   if (!currPassword) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       currPasswordError: "Old password is required!",
  //     }));
  //     hasError = true;
  //   }

  //   if (!newPassword) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       newPasswordError: "New password is required!",
  //     }));
  //     hasError = true;
  //   }

  //   if (!confirmPassword) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       confirmPasswordError: "Confirm password is required!",
  //     }));
  //     hasError = true;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       passwordNotMatched: "New and confirm passwords do not match.",
  //     }));
  //     hasError = true;
  //   }

  //   if (hasError) return;

  //   setIsLoading(true);
  //   const formData = {
  //     current_password: currPassword,
  //     new_password: newPassword,
  //     new_password_confirmation: confirmPassword,
  //   };

  //   try {
  //     const response = await API.post("/api/change-password", formData);
  //     const data = response.data;
  //     setApiResponseYes(true);
  //     setApiResponse(data);
  //     setShowAlert(true);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <CardCommon cardTitle={"Change Password"}>
      {showAlert && apiResponseYes && (
        <Alert
          severity={apiResponse?.error ? "error" : "success"}
          onClose={() => setShowAlert(false)}
        >
          {apiResponse?.msg}
        </Alert>
      )}

      <Box sx={{ mx: 4 }}>
        {/* Current Password */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="body2" color="text.black">
              Current Password
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <InputField
              name="currPassword"
              type={showPassword.showCurrPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={passwords.currPassword}
              onChange={handleChangePassword}
              error={errors.currPasswordError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => handleClickShowPassword("showCurrPassword")}
                    edge="end"
                  >
                    {showPassword.showCurrPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{
                          color: "text.or_color",
                          fontSize: "0.875rem",
                          "&:hover": { color: "text.btn_blue" },
                        }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{
                          color: "text.or_color",
                          fontSize: "0.875rem",
                          "&:hover": { color: "text.btn_blue" },
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        {/* New Password */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="body2" color="text.black">
              New Password
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <InputField
              name="newPassword"
              type={showPassword.showNewPassword ? "text" : "password"}
              placeholder="Enter your new password here"
              value={passwords.newPassword}
              onChange={handleChangePassword}
              error={errors.newPasswordError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => handleClickShowPassword("showNewPassword")}
                    edge="end"
                  >
                    {showPassword.showNewPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{
                          color: "text.or_color",
                          fontSize: "0.875rem",
                          "&:hover": { color: "text.btn_blue" },
                        }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{
                          color: "text.or_color",
                          fontSize: "0.875rem",
                          "&:hover": { color: "text.btn_blue" },
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        {/* Confirm Password */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="body2" color="text.black">
              Confirm Password
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <InputField
              name="confirmPassword"
              type={showPassword.showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password here"
              value={passwords.confirmPassword}
              onChange={handleChangePassword}
              error={errors.passwordNotMatched || errors.confirmPasswordError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() =>
                      handleClickShowPassword("showConfirmPassword")
                    }
                    edge="end"
                  >
                    {showPassword.showConfirmPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{
                          color: "text.or_color",
                          fontSize: "0.875rem",
                          "&:hover": { color: "text.btn_blue" },
                        }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{
                          color: "text.or_color",
                          fontSize: "0.875rem",
                          "&:hover": { color: "text.btn_blue" },
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        {/* Password requirements */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", alignItems: "center" }}
          ></Grid>
          <Grid item xs={9}>
            <Box mt={1}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: "black" }}
                variant="body2"
              >
                Password requirements:
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ensure that these requirements are met:
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                component="ul"
                sx={{ paddingLeft: 2, marginTop: 1.3 }}
              >
                <li>Minimum 8 characters long - the more, the better.</li>
                <li>Must include at least one uppercase letter.</li>
                <li>Must include at least one lower letter.</li>
                <li>Must include at least one number.</li>
                <li>
                  Must include at least one special character (e.g., !@#$%^&*)
                </li>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          {isLoading ? (
            <Button
              variant="contained"
              sx={{
                marginTop: "1rem",
                py: 1.3,
                bgcolor: "background.btn_blue",
                "&:hover": { bgcolor: "background.btn_blue" },
              }}
            >
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                marginTop: "1rem",
                py: 1.3,
                "&:hover": { bgcolor: "background.btn_blue" },
              }}
            >
              Save
            </Button>
          )}
        </Box>
      </Box>
    </CardCommon>
  );
};

export default PasswordTab;
