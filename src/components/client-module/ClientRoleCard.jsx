import { ArrowForwardIosSharp, Business } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const ClientRoleCard = ({ data, clickHandler }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  return (
    <Box
      onClick={clickHandler}
      sx={{
        bgcolor: darkMode === "light" ? "#fff" : "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: "1.5rem",
        px: "1rem",
        borderRadius: "0.75rem",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          bgcolor: darkMode === "light" ? "#fff" : "background.paper",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {data?.icon}
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "21px",
            color: "text.black",
          }}
        >
          {data?.label}
        </Typography>
      </Box>
      <Box>
        <ArrowForwardIosSharp sx={{ fontWeight: 400, fontSize: "0.8rem" }} />
      </Box>
    </Box>
  );
};

export default ClientRoleCard;
