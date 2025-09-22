import { Box, Chip, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import { toSentenceCase } from "../../util";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import {
  AdminIcon,
  JobManagerIcon,
  ProviderManagerIcon,
  RecruiterIcon,
  SuperAdminIcon,
  UserIcon,
} from "../../components/userManagementcomponents/defaultRoles/Icons";
const SelectCard = ({ index, roleObj, handleCardClick, selectedRole }) => {
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.mode);
  const Icons = [
    SuperAdminIcon,
    AdminIcon,
    JobManagerIcon,
    UserIcon,
    ProviderManagerIcon,
    RecruiterIcon,
  ];

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        background:
          selectedRole?.id === roleObj?.id
            ? "#EBF2FF"
            : darkMode === "light"
            ? "white"
            : "background.paper",
        width: { xl: "100%", sm: "100%" },
        borderRadius: 3,
        minHeight: "107px",
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        py: 2,
        px: 2,
        ":hover": {
          cursor: "pointer",
          boxShadow: " 0 0 16px 0 rgba(0, 0, 0, 0.03)",
          //   boxShadow: "rgba(0, 0, 0, 0.03) 0px 0px 16px",
        },
        border: `0.5px solid ${
          selectedRole?.id === roleObj?.id
            ? "rgba(55, 125, 255, 1)"
            : " rgba(222, 226, 230, 1)"
        }`,
      }}
    >
      {Icons?.[index] ? (
        Icons?.map((Icon, ind) => {
          return index === ind && <Icon key={ind} />;
        })
      ) : (
        <ProviderManagerIcon />
      )}
      <Box
        sx={{
          flexGrow: 1,
          justifyContent: "start",
          alignItems: "start",
          // bgcolor: "gray",
        }}
      >
        <Box sx={{ padding: "0px 0.5rem", ml: 0.7 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.2,
              color:
                selectedRole?.id === roleObj?.id
                  ? "rgba(55, 125, 255, 1)"
                  : "#1e2022",
              padding: "0px 0.5rem",
              // ml: 0.7,
            }}
          >
            {roleObj?.name?.length > 30
              ? roleObj?.name?.slice(0, 30) + "..."
              : toSentenceCase(roleObj?.name)}
          </Typography>
          <Tooltip
            arrow
            placement="top"
            title={
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "400px",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: "#ffffff",
                }}
              >
                {toSentenceCase(roleObj?.description)}
              </Typography>
            }
          >
            <Typography
              variant="body2"
              sx={{
                padding: "0px 0.5rem",
                fontSize: "12px",
                fontWeight: 400,
                color:
                  selectedRole?.id === roleObj?.id
                    ? "rgba(55, 125, 255, 1)"
                    : "#1e2022",
              }}
            >
              {roleObj?.description?.length > 100
                ? `${roleObj.description.slice(0, 100)}...`
                : roleObj?.description}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectCard;
