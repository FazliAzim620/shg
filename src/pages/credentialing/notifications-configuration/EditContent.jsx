import { Box, Typography } from "@mui/material";
import React from "react";

const EditContent = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 3,
          pt: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontSize: "14px", fontWeight: 400, flex: 1 }}
        >
          Form name:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontSize: "14px",
            fontWeight: 500,
            flex: 1,
            color: "text.black",
          }}
        >
          Doctor reference form
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontSize: "14px", fontWeight: 400, flex: 1 }}
        >
          Description:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontSize: "14px",
            fontWeight: 500,
            flex: 1,
            color: "text.black",
          }}
        >
          Doctor reference form
        </Typography>
      </Box>
    </>
  );
};

export default EditContent;
