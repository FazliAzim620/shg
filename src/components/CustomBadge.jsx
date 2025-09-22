import { Badge, Box, IconButton, Typography } from "@mui/material";
import React from "react";

const CustomBadge = ({ color, bgcolor, text, width, ml }) => {
  return (
    <IconButton sx={{ ml: ml || 5, mt: 0.3 }}>
      <Badge
        badgeContent={
          <Typography
            variant="caption"
            sx={{
              width: width,
              fontSize: "0.75rem",
              fontWeight: 700,
              textAlign: "center",
              p: "0.25rem ",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: color,
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                marginRight: ".4375rem",
              }}
            />
            {text}
          </Typography>
        }
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: bgcolor,
            color: color,
            // width: "97px",
          },
          marginTop: "-5px",
        }}
      ></Badge>
    </IconButton>
  );
};

export default CustomBadge;
