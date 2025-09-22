import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const FormPreviewContent = ({ formData }) => {
  const darkMode = useSelector((state) => state.theme.mode);

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "1rem",
          color: "text.black",
          mb: 2,
          alignSelf: "flex-start",
        }}
      >
        Form details
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            width: "30%",
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Form name:
        </Typography>
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {formData?.name}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            width: "30%",
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Roles :
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: "24px" }}>
          {formData?.provider_roles?.map((item, index) => {
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.black",
                  flexWrap: "wrap",
                  wordBreak: "break-word",
                }}
              >
                {item?.provider_role?.name}
                {index < formData?.provider_roles.length - 1 && ","}{" "}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default FormPreviewContent;
