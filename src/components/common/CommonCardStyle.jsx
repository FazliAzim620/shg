import { Card, CardContent } from "@mui/material";
import React from "react";

const CommonCardStyle = ({ children }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        border: ".0625rem solid rgba(231, 234, 243, .7)",
        padding: "8px",
        borderRadius: ".75rem",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CommonCardStyle;
