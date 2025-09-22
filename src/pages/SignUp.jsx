import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Checkbox,
  Link,
  Grid,
  useTheme,
  Divider,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";

import { useGoogleLogin } from "@react-oauth/google";
import layar from "../assets/brands/layar-gray.svg";
import flow from "../assets/brands/flow-xo-gray.svg";
import fitbit from "../assets/brands/fitbit-gray.svg";
import gitlab from "../assets/brands/gitlab-gray.svg";
import { Google } from "@mui/icons-material";
import logo from "../assets/logos/logo.svg";
import backgroundImage from "../assets/components/card-6.svg";
import InputField from "../components/inputs/InputField";
import googleImage from "../assets/brands/google-icon.svg";
import { BpCheckbox } from "../components/common/CustomizeCHeckbox";
const SingUp = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeHandler = (value, name) => {
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: (error) => console.log(error),
  });

  return (
    <Box
      style={{
        // backgroundImage: `URL(${backgroundImage})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundAttachment: "fixed",
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
              pb: 4,
              borderRadius: "0.7rem",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 600, color: "text.black" }}
              gutterBottom
            >
              Create your account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                textAlign: "center",
                mb: "1.5rem",
              }}
            >
              Already have an account?
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.link" }}
              >
                Sign in here
              </Typography>{" "}
            </Typography>
            <Button
              onClick={() => login()}
              variant="outlined"
              fullWidth
              sx={{
                py: 1,
                borderColor: "gray",
                marginBottom: "1rem",
                border: "1px solid rgba(17, 12, 46, 0.05)",
                fontWeight: 400,
                color: "text.primary",
                textTransform: "capitalize",
                backgroundColor: "inherit",
                boxShadow:
                  "rgba(50, 50, 93, 0.2) 0px 1px 1px -1px, rgba(0, 0, 0, 0.3) 0px 1px 1px -1px",
                "&:hover": {
                  border: "0px solid rgba(17, 12, 46, 0.15)",
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 1px 1px -1px, rgba(0, 0, 0, 0.3) 0px 1px 2px -1px",
                },
              }}
            >
              <img
                src={googleImage}
                alt="google icon"
                style={{ width: "1.6rem", paddingRight: 4 }}
              />
              Sign in with Google
            </Button>
            <Divider sx={{ py: 2, color: "text.primary" }}>OR</Divider>

            <InputField
              value={email}
              title="Your email"
              name={"email"}
              type={"email"}
              placeholder={"example@address.com"}
              onChange={onChangeHandler}
              InputLabelProps={{
                sx: {
                  color: "text.black", // Custom label color
                },
              }}
            />

            <InputField
              value={password}
              link="Forgot Password"
              url="/#"
              title="Your password"
              name={"password"}
              type={"password"}
              placeholder={"*********"}
              onChange={onChangeHandler}
            />

            <BpCheckbox />
            <Typography variant="body2" display="inline">
              Remember me
            </Typography>
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
              Sign in
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: ".71094rem",
              fontWeight: 600,
              letterSpacing: ".03125rem",
              textTransform: "uppercase",
              mb: "1rem",
            }}
          >
            TRUSTED BY THE WORLD'S BEST LOCUMS
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: { md: 3 },
            }}
          >
            <img src={gitlab} alt="logo" style={{ width: "5.5rem" }} />
            <img src={fitbit} alt="logo" style={{ width: "5.5rem" }} />
            <img src={flow} alt="logo" style={{ width: "5rem" }} />
            <img src={layar} alt="logo" style={{ width: "5.5rem" }} />
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            bgcolor: "#F0F2F5",
            zIndex: -1,
            height: "50vh",
          }}
        ></Box>
      </Container>
      {/* <Box sx={{ position: " ", bottom: 0, left: 0 }}>
        <svg
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1921 273"
        >
          <polygon fill="#fff" points="0,273 1921,273 1921,0 " />
        </svg>
      </Box> */}
    </Box>
  );
};

export default SingUp;
