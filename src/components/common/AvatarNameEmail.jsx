import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import Avatar_ from "./Avatar_";
import { useSelector } from "react-redux";

const AvatarNameEmail = ({
  username,
  email,
  photo,

  kanbanCard,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mr: kanbanCard ? 10 : "0px",
      }}
    >
      <Avatar_ name={username} photo={photo} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tooltip
          arrow
          placement="top"
          title={
            <Typography
              variant="body2"
              sx={{
                maxWidth: "200px",
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "#ffffff",
              }}
            >
              {username}
            </Typography>
          }
        >
          <Typography
            textAlign={"left"}
            variant="button"
            sx={{
              textTransform: "capitalize",
              "&:hover": {
                color: "text.link",
                fontWeight: 600,
                cursor: "pointer",
              },
              color: mode === "dark" ? "#FFFFFF" : "#1E2022",

              fontWeight: "600",
            }}
          >
            {username?.length < 11 ? username : `${username?.slice(0, 11)}...`}
          </Typography>
        </Tooltip>
        <Typography
          textAlign={"left"}
          variant="caption"
          mt={-0.7}
          sx={{
            textTransform: "lowercase",
          }}
        >
          {email}
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarNameEmail;
