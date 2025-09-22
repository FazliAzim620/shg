import React, { useState, useEffect, Component } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  AlertTitle,
  Stack,
  Collapse,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

// React Error Boundaries must use class components
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by error boundary:", error, errorInfo);
    this.setState({ errorInfo });

    // Optional: send to error logging service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRefresh = () => {
    // Reset the error state
    this.setState({ hasError: false, error: null, errorInfo: null });

    // Optional: try to recover the app state
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { fallback, title, message } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === "function"
          ? fallback(this.state.error, this.handleRefresh)
          : fallback;
      }

      // Otherwise use default MUI fallback
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          title={title}
          message={message}
          onRefresh={this.handleRefresh}
          showDetails={this.state.showDetails}
          onToggleDetails={this.toggleDetails}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({
  error,
  errorInfo,
  title = "Something went wrong",
  message = "We're sorry, but we encountered an unexpected error. Please try refreshing the page.",
  onRefresh,
  showDetails,
  onToggleDetails,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      p: 3,
      bgcolor: "background.default",
    }}
  >
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        width: "100%",
        p: 4,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "error.light",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />

        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          color="error.main"
        >
          {title}
        </Typography>

        <Typography variant="body1" textAlign="center" color="text.secondary">
          {message}
        </Typography>

        <Alert severity="error" sx={{ width: "100%" }}>
          <AlertTitle>Error</AlertTitle>
          {error?.message || String(error)}
        </Alert>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
          >
            Refresh Page
          </Button>

          <Button variant="outlined" color="primary" onClick={onToggleDetails}>
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </Stack>

        <Collapse in={showDetails} sx={{ width: "100%" }}>
          {errorInfo && (
            <Paper
              sx={{
                p: 2,
                bgcolor: "grey.100",
                maxHeight: 300,
                overflow: "auto",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                fontSize: 12,
                mt: 2,
              }}
            >
              <Typography variant="body2" component="div">
                {errorInfo.componentStack}
              </Typography>
            </Paper>
          )}
        </Collapse>
      </Stack>
    </Paper>
  </Box>
);

export default ErrorBoundary;
