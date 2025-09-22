import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

import logo from "../../assets/logos/logo.svg";
import loginbackground from "../../../public/backgroundImage.png";
import InputField from "../../components/inputs/InputField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import API from "../../API";
import { AuthFooter } from "../Login";
const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required!");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address!");
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      try {
        const response = await API.post(
          "/api/send-password-reset-link",
          formData
        );
        const data = response.data;
        setEmail("");
        setApiResponseYes(true);
        setApiResponse(data);
        setIsLoading(false);
        setShowAlert(true); // Show alert on success
        return data;
      } catch (error) {
        setIsLoading(false);
        console.log("err", error);
      }
    }
  };

  return (
    <Box
      style={{
        // backgroundImage: `URL(${backgroundImage})`,
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
          pt: 6,
          pb: 2,
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
              // pb: 6,
              borderRadius: "0.7rem",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              // minHeight: "570px",
            }}
          >
            {showAlert &&
              apiResponseYes &&
              (apiResponse?.error ? (
                <Alert
                  sx={{
                    mb: 1,
                  }}
                  severity="error"
                  onClose={() => setShowAlert(false)}
                >
                  {apiResponse?.msg}
                </Alert>
              ) : (
                <Alert
                  sx={{
                    mb: 1,
                    fontSize: 12,
                  }}
                  severity="success"
                  onClose={() => setShowAlert(false)}
                >
                  Password reset link is sent successfully to the email you
                  entered, please visit your email.
                </Alert>
              ))}
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 600, color: "text.black" }}
              gutterBottom
            >
              Forgot Password
            </Typography>

            <InputField
              value={email}
              title="Your email"
              name={"email"}
              type={"email"}
              placeholder={"example@address.com"}
              error={emailError}
              onChange={(e) => {
                setEmail(e);
                setEmailError("");
              }}
              errBorder={emailError}
              className="login-input"
              sx={{
                border: "2px solid red",
              }}
              InputLabelProps={{
                sx: {
                  color: "text.black",
                  minHeight: "48px",
                  border: "2px solid red",
                  // border: emailError ? "2px solid red" : "2px solid #000000",
                },
              }}
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
                Send reset link
              </Button>
            )}
            <Button
              startIcon={<KeyboardArrowLeftIcon />}
              onClick={() => navigate("/login")}
              fullWidth
              sx={{
                marginTop: "0.5rem",
                textTransform: "none",
              }}
            >
              Back to login
            </Button>
          </Grid>
        </Grid>
        <AuthFooter />
      </Container>
    </Box>
  );
};

export default ForgetPassword;
