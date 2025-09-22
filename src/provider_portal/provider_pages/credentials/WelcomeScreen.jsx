import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleIcon from "@mui/icons-material/Article";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { styled } from "@mui/material/styles";

// Styled components
const BackgroundCircle = styled(Box)(({ theme }) => ({
  width: 320,
  height: 320,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.light,
  opacity: 0.1,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

const IconContainer = styled(Box)(({ bgcolor, theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: bgcolor,
  borderRadius: theme.shape.borderRadius,
  color: "#fff",
  position: "absolute",
  zIndex: 2,
  boxShadow: theme.shadows[2],
}));

const Person = styled(Box)(({ bgcolor }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const PersonHead = styled(Box)(({ bgcolor }) => ({
  width: 32,
  height: 56,
  backgroundColor: bgcolor,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
}));

const PersonBody = styled(Box)(({ bgcolor }) => ({
  width: 64,
  height: 100,
  backgroundColor: bgcolor,
}));

const WelcomeScreen = ({ actionHandler }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "none",
          minWidth: { md: "696px" },
        }}
      >
        <Box component={"img"} src="/welcome.png" />
        {/* Content */}
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            mt: "50px",
            textAlign: "center",
          }}
        >
          Welcome to your credentialing journey
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            fontWeight: 400,
            fontSize: "14px",
            textAlign: "center",
            pt: "12px",
          }}
        >
          To get started with your credentialing, we've prepared a step-by-step
          onboarding flow that guides you through required documents, forms, and
          compliance tasks.
        </Typography>

        {/* Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => actionHandler("skip")}
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: "none",
              color: "rgba(108, 117, 125, 1)",
              fontSize: "16px",
              fontWeight: 400,
              border: "1px solid rgba(222, 226, 230, 1)",
            }}
          >
            Skip for now
          </Button>
          <Button
            onClick={() => actionHandler("onboarding")}
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              bgcolor: "background.main",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "150%",
            }}
          >
            Start onboarding
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default WelcomeScreen;
