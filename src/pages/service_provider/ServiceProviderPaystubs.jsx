// ServiceProviderPaystubs.jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ProviderPaymentTable from "../../provider_portal/provider_components/ProviderPaymentTable";
import { paymentData } from "../../components/constants/data";

const ServiceProviderPaystubs = () => {
  return (
    <Box sx={{ p: 2 }}>
      <ProviderPaymentTable paymentData={paymentData} />
    </Box>
  );
};

export default ServiceProviderPaystubs;
