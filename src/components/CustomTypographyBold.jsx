import { Typography } from "@mui/material";
import React from "react";

const CustomTypographyBold = ({
  width,
  textAlign,
  weight,
  fontSize,
  color,
  lineHeight,
  textTransform,
  wordBreak,
  children,
  ml,
  mt,
  mb,
}) => {
  return (
    <Typography
      variant="body2"
      sx={{
        width,
        textAlign,
        ml,
        mt,
        mb,
        wordBreak: wordBreak || "inherit",
        lineHeight: lineHeight || "1.2rem",
        fontSize: fontSize || "0.875rem",
        fontWeight: weight || 600,
        textTransform: textTransform ? textTransform : "capitalize",
        color: color,
      }}
    >
      {children}
    </Typography>
  );
};

export default CustomTypographyBold;
