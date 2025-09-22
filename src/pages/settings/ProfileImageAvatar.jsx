import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/material/styles";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { isFileSizeValid } from "../../util";

// SmallAvatar styled component
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  background: "white",
}));

const ProfileImageAvatar = ({ onFileSelect, filePath, serviceProvider }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";
  const [error, setError] = useState("");
  // Function to handle file selection
  const handleFileSelect = (event) => {
    if (isFileSizeValid(event?.target?.files[0], 1)) {
      if (event?.target?.files && event?.target?.files[0]) {
        onFileSelect(event.target.files[0]);
        setSelectedImage(URL.createObjectURL(event.target.files[0]));
      }
    } else {
      setError("File size exceeds the allowed limit of 1MB.");
      event.target.value = null;
    }
  };

  return (
    <Box>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <IconButton
            aria-label="edit"
            component="span"
            sx={{
              padding: 0,
              backgroundColor: isDark ? "#25282a" : "white",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#007BFF" },
            }}
            onClick={() => document.getElementById("file-upload").click()}
          >
            <SmallAvatar
              sx={{
                width: 24.5,
                height: 24.5,
                backgroundColor: isDark ? "#25282a" : "white",
                fontSize: 13,
                color: "text.primary",
                cursor: "pointer",
                transition: "backgroundColor 0.3s",
                "&:hover": { color: "white", backgroundColor: "#007BFF" },
              }}
            >
              <ModeEditOutlineOutlinedIcon sx={{ fontSize: 13 }} />
            </SmallAvatar>
          </IconButton>
        }
      >
        <Avatar
          sx={{
            height: 78.75,
            width: 78.75,
            background: "#677788",
          }}
          src={selectedImage ? selectedImage : filePath}
        >
          {!filePath && <PersonIcon fontSize="large" />}
          {/* {!filePath && "DK"} */}
        </Avatar>
      </Badge>
      {!serviceProvider && (
        <Button
          size="sm"
          sx={{
            mt: { xs: 2, md: 0 },
            marginLeft: 2,
            fontSize: "0.8125rem",
            color: "text.primary",
            "&:hover": {
              color: "text.link",
              border: "1px solid rgba(231, 234, 243, .7)",
              backgroundColor: "white",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              // transition:
              //   "color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out",
            },
            border: "1px solid rgba(231, 234, 243, .7)",
            textTransform: "none",
          }}
          variant="outlined"
          component="span"
          startIcon={<CameraAlt sx={{ fontSize: "0.8125rem" }} />}
          onClick={() => document.getElementById("file-upload").click()}
        >
          Upload photo
        </Button>
      )}

      <Box
        component="input"
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        sx={{ display: "none" }}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileImageAvatar;
