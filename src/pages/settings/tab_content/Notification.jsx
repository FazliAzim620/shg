import React from "react";
import CardCommon from "../../../components/CardCommon";
import { Box, Typography } from "@mui/material";
import underConstrucationImage from "../../../assets/svg/illustrations/oc-project-development.svg";

const Notification = () => {
  return (
    <CardCommon cardTitle={"Notification"}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: "300px",
        }}
      >
        <Box sx={{ textAlign: "center", mt: 4.5, py: 5 }}>
          <img
            src={underConstrucationImage}
            alt="Under construction"
            style={{
              maxWidth: "15rem",
              marginBottom: "20px",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: "text.black",
              fontSize: "1.41094rem",
              fontWeight: 600,
            }}
            gutterBottom
          >
            Under construction.
          </Typography>
          <Typography variant="body2" gutterBottom>
            This module is under construction!
          </Typography>
        </Box>
      </Box>
    </CardCommon>
  );
};

export default Notification;
