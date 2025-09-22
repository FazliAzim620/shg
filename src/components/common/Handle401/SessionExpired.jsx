import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutHandler } from "../../../util";

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    logoutHandler();
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: 4, textAlign: "center", marginTop: 8 }}
      >
        <Typography variant="h4" gutterBottom>
          Session Expired
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          For security reasons, your session has expired. Please log in again to
          continue.
        </Typography>
        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Log In Again
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SessionExpired;
