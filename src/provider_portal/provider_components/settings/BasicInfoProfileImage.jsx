import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Badge,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CameraAlt from "@mui/icons-material/CameraAlt";
import { styled } from "@mui/material/styles";
import { isFileSizeValid } from "../../../util";

// SmallAvatar styled component for the edit icon
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  background: "white",
}));

const BasicInfoProfileImage = ({ admin, onFileSelect, filePath, darkMode }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const file = event?.target?.files[0];
    if (file && isFileSizeValid(file, 1)) {
      setSelectedImage(URL.createObjectURL(file));
      onFileSelect(file); // Trigger the onFileSelect prop to pass the file
    } else {
      setError("File size exceeds the allowed limit of 1MB.");
      event.target.value = null;
    }
  };

  return (
    <Card
      sx={{
        minWidth: 275,
        boxShadow: "none",
        height: "236px",
        border: ".0625rem solid rgba(231, 234, 243, .7)",
        borderRadius: ".75rem",
      }}
    >
      <CardContent
        sx={{
          bgcolor: "#E7EAF3",
          height: "10rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Badge
          sx={{
            border: `4.5px solid ${darkMode === "light" ? "white" : "black"}`,
            borderRadius: "50%",
            width: "7.875rem",
            height: "7.875rem",
            textAlign: "center",
            mb: -10,
            bgcolor: "#E7EAF3",
          }}
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton
              aria-label="edit"
              component="span"
              sx={{
                padding: 0,
                backgroundColor: darkMode === "dark" ? "#25282a" : "white",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "#007BFF" },
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              {!admin && (
                <SmallAvatar
                  sx={{
                    width: 24.5,
                    height: 24.5,
                    backgroundColor: darkMode === "dark" ? "#25282a" : "white",
                    fontSize: 13,
                    color: "text.primary",
                    cursor: "pointer",
                    transition: "backgroundColor 0.3s",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  <ModeEditOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                </SmallAvatar>
              )}
            </IconButton>
          }
        >
          <Avatar
            sx={{
              width: "7.4rem",
              height: "7.4rem",
              bgcolor: "#E7EAF3",
            }}
            src={selectedImage || filePath} // Show selected image or fallback to filePath
          >
            {!selectedImage && !filePath && (
              <PersonIcon sx={{ fontSize: "100px", color: "#BDC5D0" }} />
            )}
          </Avatar>
        </Badge>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}></CardActions>

      {/* Hidden input field for file upload */}
      <Box
        component="input"
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        sx={{ display: "none" }}
      />

      {/* Snackbar to show error message */}
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
    </Card>
  );
};

export default BasicInfoProfileImage;
