import { Avatar, Typography } from "@mui/material";
import React from "react";
import { getInitial } from "../../util";

const Avatar_ = ({ photo, name }) => {
  const colorPairs = [
    { bgcolor: "#E5FAF6", color: "#17A2B8" }, // Teal
    { bgcolor: "#EBF2FF", color: "#377DFF" }, // Blue
    { bgcolor: "#EEDFE4", color: "#DC3545" }, // Red
    { bgcolor: "#FFEDE0", color: "#FF7043" }, // Orange
    { bgcolor: "#EFEBE9", color: "#795548" }, // Brown
    { bgcolor: "#E1F5FE", color: "#039BE5" }, // Light Blue
    { bgcolor: "#FBE9E7", color: "#FF5722" }, // Coral
    { bgcolor: "#FFF3E0", color: "#FF9800" }, // Amber
    { bgcolor: "#E8F5E9", color: "#4CAF50" }, // Green
    { bgcolor: "#EDE7F6", color: "#673AB7" }, // Purple
    { bgcolor: "#E3F2FD", color: "#2196F3" }, // Sky Blue
    { bgcolor: "#FCE4EC", color: "#F06292" }, // Pink
  ];
  // Select a color pair based on the username hash
  const getColorPair = (name) => {
    const hash =
      Array.from(name || "")?.reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
      ) % colorPairs.length;
    return colorPairs[hash];
  };
  const { bgcolor, color } = getColorPair(name);
  return (
    <Avatar
      sx={{
        width: 47,
        height: 47,
        backgroundColor: bgcolor,
        color: color,
        fontSize: "1.2rem",
        fontWeight: 500,
        mr: 1.5,
      }}
      alt={name}
      src={photo}
    >
      {!photo && getInitial(name)} {/* Render initials if no photo */}
    </Avatar>
  );
};

export default Avatar_;
