// ServiceProviderAvailiblityTab.jsx
import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import MyAvailiblity from "../../provider_portal/provider_components/schedular/availiblityTab2/MyAvailiblity";
import MyAvailiblityTab from "../../provider_portal/provider_components/schedular/availiblityTab2/MyAvailiblityTab";
const ServiceProviderAvailiblityTab = ({ provider_id }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  return (
    <>
      <Box sx={{ mx: 2 }}>
        <MyAvailiblityTab
          darkmode={darkMode}
          admin={true}
          provider_id={provider_id}
        />
      </Box>
    </>
  );
};

export default ServiceProviderAvailiblityTab;
