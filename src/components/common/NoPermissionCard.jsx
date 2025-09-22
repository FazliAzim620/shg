import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  IconButton,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../Header";
import { DoNotTouch } from "@mui/icons-material";

const NoPermissionCard = ({
  message = "You don't have permission to view this content",
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
        px: 2,
      }}
    >
      <Header />
      <Container maxWidth="md">
        <Card
          elevation={3}
          sx={{
            mt: 8,
            textAlign: "center",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "error.light",
            bgcolor: "background.paper",
          }}
        >
          <CardContent
            sx={{
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: "#fca8a6",
                borderRadius: "50%",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DoNotTouch
                sx={{
                  fontSize: 40,
                  color: "error.main",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              component="h2"
              color="error"
              fontWeight="bold"
              gutterBottom
            >
              Access Denied
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>

            <Button
              variant="contained"
              color="error"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default NoPermissionCard;
