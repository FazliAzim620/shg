import { Box, Divider, Tab, Tabs, Typography, Chip } from "@mui/material";
import React, { useState } from "react";
import ProviderPaymentTable from "../../provider_components/ProviderPaymentTable";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import { paymentData } from "../../../components/constants/data";

const Payments = () => {
  const [value, setValue] = useState(0);
  const providersDataLength = 72031; // Replace this with actual data if dynamic
  const tabLabels = ["All Invoices", "Paid", "Pending", "Archived"];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Box
            sx={{
              minHeight: "71px",
              p: "2rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <CustomTypographyBold
              color="text.black"
              weight={600}
              fontSize={" 1.41094rem"}
            >
              Payments
            </CustomTypographyBold>
            <Box
              sx={{
                borderRadius: "3px",
                color: "#132144",
                bgcolor: "#DEE1E8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: "6px",
                px: 2,
                fontSize: 2,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <Typography fontSize={15} fontWeight={700}>
                72,031
              </Typography>
            </Box>
          </Box>

          <Tabs value={value} onChange={handleChange} aria-label="payment tabs">
            {tabLabels.map((label, index) => (
              <Tab
                key={label}
                label={
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: value === index ? "text.main" : "inherit",
                      pt: "20px",
                    }}
                  >
                    {label}
                  </Typography>
                }
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          <Divider sx={{ opacity: "0.3" }} />
          <Box sx={{ mt: 7 }}>
            <ProviderPaymentTable paymentData={paymentData} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Payments;
