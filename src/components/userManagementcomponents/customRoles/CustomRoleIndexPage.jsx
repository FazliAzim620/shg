import { Box, Grid } from "@mui/material";
import React from "react";
import UserRoleCard from "../UserRoleCard";

const CustomRoleIndexPage = ({ roles }) => {
  return (
    <>
      <Grid container spacing={2} my={1}>
        {roles?.map((role, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <UserRoleCard roleObj={role} customRole={true} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CustomRoleIndexPage;
