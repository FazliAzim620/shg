import React from "react";
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";

const RoleAndSpecialities = ({ role, specialities }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Role */}
      <Typography
        variant="caption"
        sx={{
          textTransform: "capitalize",
          color: darkMode === "dark" ? "#FFFFFF" : "#1E2022",
          fontWeight: "600",
        }}
      >
        {role}
      </Typography>

      {/* Specialities */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mt: 1,
        }}
      >
        {specialities?.slice(0, 2).map((speciality, ind) => {
          const fullName = speciality?.speciality_name || "";
          const isTruncated = fullName.length > 15;
          const displayName = isTruncated
            ? `${fullName.substring(0, 15)}...`
            : fullName;

          return isTruncated ? (
            <Tooltip placement="top" key={ind} title={fullName}>
              <Chip
                label={displayName}
                size="small"
                sx={{
                  color: "#1e2022",
                  bgcolor: "rgba(19, 33, 68, .1)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          ) : (
            <Chip
              key={ind}
              label={displayName}
              size="small"
              sx={{
                color: "#1e2022",
                bgcolor: "rgba(19, 33, 68, .1)",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            />
          );
        })}

        {specialities?.length > 2 && (
          <Tooltip
            placement="top"
            title={specialities
              .slice(2)
              .map((speciality) => speciality?.speciality_name)
              .join(", ")}
          >
            <Box
              sx={{
                display: "inline-block",
                padding: "0.2rem 0.6rem",
                color: "#1e2022",
                bgcolor: "rgba(19, 33, 68, .1)",
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "14px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              +{specialities.length - 2}
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
export default RoleAndSpecialities;
