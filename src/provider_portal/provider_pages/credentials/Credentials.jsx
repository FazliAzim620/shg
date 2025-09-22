import React from "react";
import Credentialing from "./Credentialing";
import { Box } from "@mui/material";
import UnderConstruction from "../../../components/UnderConstruction";

const Credentials = () => {
  return (
    <Box sx={{ bgcolor: "#F0F2F5" }}>
      <Box sx={{ width: { sm: "100%", xl: "78%" }, m: "0 auto" }}>
        <Credentialing />
      </Box>
    </Box>
  );
};

export default Credentials;
