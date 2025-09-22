import React from "react";
import CardCommon from "../../../components/CardCommon";
import { Box } from "@mui/material";

const EmailTab = () => {
  return (
    <Box>
      <CardCommon
        //  btnText={"Edit"}
        cardTitle={"Email"}
      >
        email
      </CardCommon>
    </Box>
  );
};

export default EmailTab;
