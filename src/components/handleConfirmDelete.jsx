import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";

export const DeleteConfirmModal = ({
  closeJob,
  jobCount,
  cantDelBodyText,
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title,
  bodyText,
  isLoading,
  action,
  bgcolor,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  return (
    <Modal
      open={isOpen || false}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgba(19, 33, 68, 0.25)",
      }}
    >
      <Box
        sx={{
          width: "500px",
          minHeight: "247px",
          borderRadius: "12px",
          bgcolor: "background.paper",
          boxShadow: 24,
          py: 2.5,
        }}
      >
        <Box
          sx={{
            px: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "24px",
              fontFamily: "Inter, sans-serif",
              color: mode === "dark" ? "#fff" : "rgba(30, 32, 34, 1)",
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: mode === "dark" ? "#fff" : "rgba(30, 32, 34, 1)" }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1.1 }} />
        <Box
          sx={{
            my: 3,
            px: 2.5,
          }}
        >
          <Typography
            sx={{
              color: mode === "dark" ? "#fff" : "rgba(73, 80, 87, 1)",
              fontSize: "14px",
              lineHeight: "21px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {jobCount ? cantDelBodyText : bodyText}
          </Typography>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            mt: 3,
            px: "24px",
          }}
        >
          {!jobCount && (
            <Button
              sx={{
                px: 1.5,
                textTransform: "none",
                bgcolor: "white",
                p: "8px 16px",
                borderRadius: "4px",
                lineHeight: "24px",
                color: "#6C757D",
                border: "1px solid #D3D6DA",
                "&:hover": {
                  bgcolor: "#DEE2E6",
                },
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          )}

          {jobCount ? (
            <Button
              variant="contained"
              onClick={onClose}
              color="error"
              autoFocus
            >
              OK
            </Button>
          ) : (
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              sx={{
                fonstSize: "16px",
                fontWeight: 400,
                borderRadius: "4px",
                lineHeight: "24px",
                textTransform: "none",
                p: "8px 16px",
                background: bgcolor || "rgba(220, 53, 69, 1)",
                color: "white",
                "&:hover": {
                  background: bgcolor || "rgba(220, 53, 69, 1)",
                },
              }}
              autoFocus
            >
              {isLoading ? <CircularProgress size={18} /> : action}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
