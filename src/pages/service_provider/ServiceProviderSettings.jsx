// ServiceProviderSettings.jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ProviderSettingsSideNavAndContent from "../../provider_portal/provider_components/settings/ProviderSettingsSideNavAndContent";

const ServiceProviderSettings = ({ provider_id }) => {
  return (
    <ProviderSettingsSideNavAndContent admin={true} provider_id={provider_id} />
  );
};

export default ServiceProviderSettings;
