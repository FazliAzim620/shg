import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import logo from "../../assets/logos/logo.svg";
import loginbackground from "../../../public/backgroundImage.png";
import InputField from "../../components/inputs/InputField";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../API";
import { flxCntrSx } from "../../components/constants/data";
import { AuthFooter } from "../Login";
import ROUTES from "../../routes/Routes";

const ResetPassword = () => {
  const navigate = useNavigate();
  const param = useParams();

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

  /* ========================= handleClickShowNewPassword ========================= */
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  /* ========================= handleClickShowConfirmPassword ========================= */
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

    if (!newPassword) {
      setNewPasswordError("New password is required!");
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
    } else {
      // If no errors, proceed with the API call
      setIsLoading(true);
      const formData = {
        password: newPassword,
        confirm_password: confirmPassword,
        reset_token: param?.token,
      };
      try {
        const response = await API.post("/api/reset-password", formData);
        const data = response.data;
        setApiResponseYes(true);
        setApiResponse(data);
        setIsLoading(false);
        setShowAlert(true);
        setNewPassword("");
        setConfirmPassword("");
        return data;
      } catch (error) {
        setIsLoading(false);
        console.log("Error:", error);
      }
    }
  };

  return (
    <Box
      style={{
        backgroundImage: `URL(${loginbackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "text.primary",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ mb: "2rem" }}>
          <img
            src={logo}
            alt="Image Description"
            style={{ width: "8rem", display: "flex", justifyContent: "center" }}
          />
        </Box>

        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              fontFamily: "Inter, sans-serif",
              bgcolor: "background.default",
              padding: "40px",
              pb: 6,
              borderRadius: "0.7rem",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          >
            {showAlert &&
              apiResponseYes &&
              (apiResponse?.error ? (
                <Alert
                  sx={{
                    mb: 1.1,
                  }}
                  severity="error"
                  onClose={() => setShowAlert(false)}
                >
                  <Box sx={flxCntrSx}>
                    <Typography>{apiResponse?.msg}</Typography>&nbsp;
                    <Link to={ROUTES.forgotPswd}>Enter email again</Link>
                  </Box>
                </Alert>
              ) : (
                <Alert
                  sx={{
                    mb: 1.1,
                  }}
                  severity="success"
                  onClose={() => setShowAlert(false)}
                >
                  <Box sx={flxCntrSx}>
                    <Typography>{apiResponse?.msg}</Typography>,&nbsp;
                    <Link to={"/login"}>Login now</Link>
                  </Box>
                </Alert>
              ))}

            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 600, color: "text.black" }}
              gutterBottom
            >
              Reset Password
            </Typography>

            <InputField
              title={"New Password"}
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

            <InputField
              title={"Confirm Password"}
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

            {isLoading ? (
              <Button
                variant="contained"
                fullWidth
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
                fullWidth
                sx={{
                  marginTop: "1rem",
                  py: 1.3,
                  bgcolor: "background.btn_blue",
                  "&:hover": { bgcolor: "#2c64cc", color: "white" },
                  textTransform: "none",
                }}
              >
                Reset Password
              </Button>
            )}
          </Grid>
        </Grid>
        <AuthFooter />
      </Container>
    </Box>
  );
};

export default ResetPassword;
