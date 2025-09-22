import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { flxCntrSx } from "../../constants/data";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import crossIcon from "../../../assets/XcircleIcon.svg";

const ClearFilterDesign = ({ clearFilters, mb }) => {
  return (
    <Button
      onClick={clearFilters}
      sx={{
        mb: mb,
        py: 0.5,
        ml: "1rem",
        px: "14px",
        border: "1px solid #377DFF80",
        bgcolor: "#EBF2FF",
        borderRadius: "4px",
        cursor: "pointer",
        textTransform: "none",
      }}
    >
      <Typography
        sx={{
          ...flxCntrSx,
          gap: 0.5,
          color: "#377DFF",
          fontWeight: 300,
          fontSize: "14px",
        }}
      >
        <img src={crossIcon} alt="crossIcon" />
        {/* <CancelOutlinedIcon /> */}
        Clear all
      </Typography>
    </Button>
  );
};

export default ClearFilterDesign;
