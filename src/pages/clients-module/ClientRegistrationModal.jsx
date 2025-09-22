import React, { useState } from "react";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClientRegistrationStepper from "./ClientRegistrationStepper";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: "98%", xl: "95%" },
  maxWidth: "1440px",
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 0,
  pb: 3,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "0.75rem",
};

export default function ClientRegistrationModal({ open, handleClose }) {
  const darkMode = useSelector((state) => state.theme.mode);

  return (
    <Modal
      open={!!open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={4}
          sx={{
            bgcolor: darkMode === "dark" ? "background.page_bg" : "#f2f3f5",
            pb: 3,
            pt: 3,
          }}
        >
          <CustomTypographyBold fontSize={"0.875rem"} color="text.black">
            Add New Client
          </CustomTypographyBold>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <ClientRegistrationStepper handleClose={handleClose} />
      </Box>
    </Modal>
  );
}
