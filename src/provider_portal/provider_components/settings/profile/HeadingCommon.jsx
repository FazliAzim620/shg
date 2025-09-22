import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export const HeadingCommon = ({
  title,
  mb,
  fontSize,
  textAlign,
  color,
  transform,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const headingstyle = {
    textAlign: textAlign,
    fontSize: fontSize || "1.14844rem",
    marginTop: 0,
    marginBottom: mb || "1.5rem",
    fontWeight: 600,
    lineHeight: 1.2,
    color: mode === "dark" ? "lightgray" : color || "#1e2022",
    textTransform: transform || "inherit",
  };
  return <Typography sx={headingstyle}>{title}</Typography>;
};
