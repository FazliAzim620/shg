import { Box, Button } from "@mui/material";
import React from "react";
import not_found from "../assets/not_found.svg";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const NodataFoundCard = ({
  title,
  button,
  userManagement,
  maxHeight,
  action,
  actionText,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.login);
  if (user?.user) {
    return (
      <Box
        sx={{
          width: "100%",
          maxHeight,
          minHeight: !userManagement && "13rem",
          margin: "auto",
          bgcolor: userManagement ? "" : "background.paper",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
          // mx: 2,
        }}
      >
        <Box
          sx={{
            mb: userManagement ? "0rem" : 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box
            component={"img"}
            src={not_found}
            sx={{ width: "7rem" }}
            alt="not found "
          />
          <CustomTypographyBold weight={400} color={"text.or_color"}>
            {title ? title : "  No data to show"}
          </CustomTypographyBold>
          {button && (
            <Box>
              <Button
                onClick={() => navigate(-1)}
                sx={{ textTransform: "none" }}
              >
                Back to home
              </Button>
            </Box>
          )}
          {action && (
            <Box>
              <Button onClick={action} sx={{ textTransform: "none" }}>
                {actionText}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default NodataFoundCard;
