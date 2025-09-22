import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Checkbox,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import layar from "../assets/brands/layar-gray.svg";
import flow from "../assets/brands/flow-xo-gray.svg";
import fitbit from "../assets/brands/fitbit-gray.svg";
import gitlab from "../assets/brands/gitlab-gray.svg";
import logo from "../assets/logos/logo.svg";
import loginbackground from "../../public/backgroundImage.png";
import InputField from "../components/inputs/InputField";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../thunkOperation/auth/loginUser";
import { validateEmail } from "../components/validattion/validation";
import { useNavigate } from "react-router-dom";
import {
  addUserRolesPermissions,
  clearLoading,
  updateUserRole,
} from "../feature/loginSlice";
import { logoutHandler } from "../util";
import CustomTypographyBold from "../components/CustomTypographyBold";
import ROUTES from "../routes/Routes";
import { BpCheckbox } from "../components/common/CustomizeCHeckbox";

export const AuthFooter = () => (
  <Box sx={{ mt: 2, textAlign: "center" }}>
    <Typography
      variant="body2"
      sx={{
        fontSize: ".71094rem",
        fontWeight: 600,
        letterSpacing: ".03125rem",
        textTransform: "uppercase",
        mb: "1rem",
        color: "text.secondary",
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
);
const SingUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [successEmail, setSuccessEmail] = useState(false);
  const [isError, setIsError] = useState(null);

  const onChangeHandler = (value, name) => {
    localStorage.removeItem("error");
    setIsError(null);
    dispatch(clearLoading());
    if (validateEmail(email)) {
      setSuccessEmail(true);
    }
    if (!validateEmail(email)) {
      setSuccessEmail(false);
    }
    if (name === "email") {
      setEmail(value);
      setEmailError("");
    } else {
      setPassword(value);
      setPasswordError("");
    }
    if (password.length >= 8) {
      setSuccessPassword(true);
    } else {
      setSuccessPassword(false);
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setPasswordError("Please enter a valid password.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));

    if (!resultAction?.payload?.success) {
      await logoutHandler(); // Await logoutHandler
      localStorage.setItem("error", resultAction?.payload?.msg);
      setIsError(resultAction?.payload?.msg);
    } else {
      if (resultAction?.payload?.role) {
        dispatch(updateUserRole(resultAction?.payload?.role));
        const data = {
          user_roles_modules: resultAction?.payload?.user_roles_modules,
          user_roles_permissions: resultAction?.payload?.user_roles_permissions,
          user_roles_permissions_module_wise:
            resultAction?.payload?.user_roles_permissions_module_wise,
        };
        dispatch(addUserRolesPermissions(data));
      }
      navigate("/");
    }
  };

  useEffect(() => {
    if (loading) {
      dispatch(clearLoading());
    }
    setIsError(localStorage.getItem("error"));
    logoutHandler().then(() => {});
  }, []);
  const mode = useSelector((state) => state.theme.mode);

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
              pb: 6,
              borderRadius: "0.7rem",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              // minHeight: "570px",
            }}
          >
            {isError && (
              <Box
                sx={{
                  width: "100%",
                  // display: "flex",
                  // justifyContent: "end",
                  // p: 3,
                }}
              >
                <Alert
                  severity="error"
                  sx={{ width: "100%" }}
                  onClose={() => {
                    localStorage.removeItem("error");
                    setIsError(null);
                  }}
                >
                  {isError}
                </Alert>
              </Box>
            )}
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 600, color: "text.black" }}
              gutterBottom
            >
              Sign in
            </Typography>

            <InputField
              value={email}
              validField={successEmail}
              title="Your email"
              name={"email"}
              type={"email"}
              placeholder={"example@address.com"}
              onChange={onChangeHandler}
              error={emailError}
              submitHandler={handleSubmit}
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

            <Box
              sx={{
                mb: -2,
                mt: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomTypographyBold color="text.black" weight={500}>
                Password{" "}
              </CustomTypographyBold>
              <Button
                type="button"
                onClick={() => {
                  navigate(ROUTES?.forgotPswd);
                }}
                variant="text"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Forgot Password
              </Button>
            </Box>
            <InputField
              validField={successPassword}
              errBorder={passwordError}
              value={password}
              // link="Forgot Password"
              // url="/#"
              // title="Password"
              // name={"password"}

              type={showPassword ? "text" : "password"}
              placeholder={"*********"}
              onChange={onChangeHandler}
              error={passwordError}
              // className="login-input"
              submitHandler={handleSubmit}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
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

            <BpCheckbox />
            <Typography variant="body2" display="inline">
              Remember me
            </Typography>
            <Box>
              <Typography variant="caption" sx={{ color: "text.error" }}>
                {error?.msg}
              </Typography>
            </Box>
            {loading ? (
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
                Sign in
              </Button>
            )}
          </Grid>
        </Grid>
        <AuthFooter />
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
