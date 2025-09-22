import { ExpandMore } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
import { chevronDown } from "./Images";

const CustomChip = ({
  color,
  bgcolor,
  chipText,
  weight,
  size,
  dot,
  py,
  px,
  mt,
  dotColor,
  handleClickExpandMore,
  dropdown,
  textTransform,
  id,
}) => {
  return (
    <>
      <Box
        sx={{
          mt: mt,
          width: "fit-content",
          borderRadius: "5px",
          color: color,
          bgcolor: bgcolor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: py || "2.5px",
          px: px || 1,
          fontWeight: weight || "bold",
          textAlign: "center",
          textTransform: textTransform || "none",
        }}
        onClick={(e) => handleClickExpandMore(e, id)}
      >
        {dot && (
          <div
            style={{
              backgroundColor: dotColor ? dotColor : color,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              marginRight: ".4375rem",
            }}
          />
        )}
        <Typography
          fontSize={size || 11}
          fontWeight={weight || 600}
          textTransform={textTransform || "inherit"}
        >
          {chipText}
        </Typography>
        {dropdown && (
          <img
            style={{ marginRight: 7, marginLeft: 7, cursor: "pointer" }}
            src={chevronDown}
            onClick={(e) => handleClickExpandMore(e, id)}
          />
        )}
      </Box>
    </>
  );
};

export default CustomChip;
