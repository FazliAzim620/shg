import React from "react";
import { Grid, Typography, Divider } from "@mui/material";

const DividerWithStartText = ({
  text,
  darkMode,
  textCol,
  dividerCol,
  my,
  fontSize,
  color,
}) => {
  return (
    <Grid
      container
      sx={{ display: "flex", alignItems: "center", my: my || 1.5 }}
    >
      <Grid item xs={6} md={textCol}>
        <Typography
          variant="h6"
          sx={{
            fontSize: fontSize || "0.98rem",
            fontWeight: 600,
            lineHeight: 1.2,
            color: color || "#71869D",
          }}
        >
          {text}
        </Typography>
      </Grid>
      <Grid item xs={6} md={dividerCol}>
        <Divider
          sx={{
            borderColor:
              darkMode === "dark"
                ? "rgba(255, 255, 255, .7)"
                : "rgba(231, 234, 243, 1)",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DividerWithStartText;
