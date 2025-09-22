import React, { useState, useEffect } from "react";
import CardCommon from "../../../components/CardCommon";
import {
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import InputField from "../../../components/inputs/InputField";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useSelector } from "react-redux";
import API from "../../../API";

const Security = () => {
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [currPassword, setCurrPassword] = useState("");
  const [currPasswordError, setCurrPasswordError] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordNotMatched, setPasswordNotMatched] = useState("");

  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility

  const darkMode = useSelector((state) => state.theme.mode);

  /* ========================= handleClickShowCurrPassword ========================= */
  const handleClickShowCurrPassword = () => {
    setShowCurrPassword(!showCurrPassword);
  };

  /* ========================= handleClickShowNewPassword ========================= */
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  /* ========================= handleClickShowConfirmPassword ========================= */
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /* ========================= handleChangeCurrPassword ========================= */
  const handleChangeCurrPassword = (e) => {
    setCurrPassword(e);
    setCurrPasswordError("");
  };

  /* ========================= handleChangeNewPassword ========================= */
  const handleChangeNewPassword = (e) => {
    setNewPassword(e);
    setNewPasswordError("");
    setPasswordNotMatched("");
  };

  /* ========================= handleChangeConfirmPassword ========================= */
  const handleChangeConfirmPassword = (e) => {
    const value = e || "";
    setConfirmPassword(value);
    setConfirmPasswordError("");
    setPasswordNotMatched("");
  };

  /* ========================= handleSubmit ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!currPassword) {
      setCurrPasswordError("Old password is required!");
      hasError = true;
    }

    if (!newPassword) {
      setNewPasswordError("New password is required!");
      hasError = true;
    } else if (!passwordPattern?.test(newPassword)) {
      setNewPasswordError("Password does not meet requirements");
      hasError = true;
    }
    if (!currPassword) {
      setCurrPasswordError("Old password is required!");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required!");
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotMatched("New and confirm passwords do not match.");
      hasError = true;
    }
    // If there are errors, do not proceed with the API call
    if (hasError) {
      return;
    }
    // If no errors, proceed with the API call
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
      setIsLoading(false);
      setShowAlert(true); // Show alert on success

      return data;
    } catch (error) {
      setIsLoading(false);
      console.log("Error:", error);
    }
  };

  return (
    <CardCommon cardTitle={"Change Password"}>
      {showAlert &&
        apiResponseYes &&
        (apiResponse?.error ? (
          <Alert severity="error" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ) : (
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ))}

      <Box
        sx={{
          mx: 4,
        }}
      >
        {/* ========================= Current Password ========================= */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.black">
              Current Password <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <InputField
              name="currentPassword"
              type={showCurrPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={currPassword}
              onChange={handleChangeCurrPassword}
              error={currPasswordError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={handleClickShowCurrPassword}
                    edge="end"
                  >
                    {showCurrPassword ? (
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
        {/* ========================= New Password ========================= */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.black">
              New Password <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <InputField
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password here"
              value={newPassword}
              onChange={handleChangeNewPassword}
              error={newPasswordError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? (
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
        {/* ========================= Confirm Password ========================= */}
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.black">
              Confirm Password <span style={{ color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <InputField
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password here"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              error={passwordNotMatched || confirmPasswordError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? (
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
        {/* ========================= Submit Button ========================= */}
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          {isLoading ? (
            <Button
              variant="contained"
              // fullWidth
              sx={{
                marginTop: "1rem",
                py: 1.3,
                bgcolor: "background.btn_blue",
                "&:hover": { bgcolor: "background.btn_blue" },
              }}
            >
              <CircularProgress size={23} sx={{ color: "white" }} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              // fullWidth
              sx={{
                marginTop: "1rem",
                py: 1.3,
                bgcolor: "background.btn_blue",
                "&:hover": { bgcolor: "background.btn_blue" },
                textTransform: "none",
              }}
            >
              Change Password
            </Button>
          )}
        </Box>
      </Box>
    </CardCommon>
  );
};

export default Security;
