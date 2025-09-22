import React from "react";
import { Avatar, Box, Typography, Button, IconButton } from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const TopNav_providerProfile = () => {
  const outlinedIconButton = {
    border: "1px solid #6d4a96",
    color: "text.main",
    borderRadius: ".3125rem",
    "&:hover": {
      color: "#fff",
      backgroundColor: "text.main",
      borderColor: "text.main",
    },
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
        paddingBottom: "2rem",
        marginBottom: "2.25rem",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Avatar
          src="/api/placeholder/100/100"
          alt="Jeanie Landes"
          sx={{ width: 78.75, height: 78.75, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
            Jeanie Landes
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <LocationOnIcon
              fontSize="small"
              sx={{ mr: 0.5, color: "text.main" }}
            />
            <Typography color="#677788" sx={{ mr: 2 }}>
              London, UK &nbsp;<span style={{ color: "#B9C1C9" }}>/</span>
            </Typography>
            <Typography color="#677788" sx={{ mr: 2 }}>
              Family Nurse Practitioner&nbsp;
              <span style={{ color: "#B9C1C9" }}>/</span>
            </Typography>
            <Typography color="#677788">Board Certified</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Button
          startIcon={<EmailIcon />}
          variant="contained"
          size="small"
          sx={{
            mr: 1.5,
            border: "1px solid #6d4a96",
            fontSize: "0.8125rem",
            backgroundColor: "#6d4a96",

            "&:hover": {
              color: "#fff",
              backgroundColor: "#6d4a96",
              fontSize: "0.8125rem",
              border: "1px solid #2c64cc",
              boxShadow: "0 4px 11px rgba(55, 125, 255, .35)",
              transition:
                "boxShadow 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
            },
          }}
        >
          Contact
        </Button>
        <IconButton sx={{ ...outlinedIconButton, mr: 1 }} size="small">
          <ModeEditOutlineOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton sx={outlinedIconButton} size="small">
          <ShareIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopNav_providerProfile;
