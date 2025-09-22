import React from "react";
import underConstructionImage from "../assets/svg/illustrations/oc-project-development.svg";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnderConstruction = ({ height }) => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          minHeight: height ? height : "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={underConstructionImage}
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
          <Typography variant="body2" gutterBottom>
            This module is under construction! Mean while you can checkout{" "}
            <br />
            our other features
          </Typography>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/`)}
          sx={{
            mt: 2,
            boxShadow: "none",
            py: 1.2,
          }}
        >
          Go to jobs
        </Button>
      </Box>
    </>
  );
};

export default UnderConstruction;
