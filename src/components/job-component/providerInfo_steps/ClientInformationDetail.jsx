import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import CustomTypographyBold from "../../CustomTypographyBold";

const ClientInformationSectionDetail = ({ sectionId, countries, formData }) => {
  const billingAddress = formData?.addresses?.find(
    (address) => address?.type === "billing"
  );
  const siteAddress = formData?.addresses?.find(
    (address) => address.type === "site"
  );
  const countryName = (id) => {
    return countries.find((country) => country?.id === id)?.name;
  };

  switch (sectionId) {
    case "basicInfo":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Client name:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.client_name || "--"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Email:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold
                textTransform={"initial"}
                color={"text.black"}
              >
                {formData?.client_email || "--"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Phone:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.client_phone || "--"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "billingAddress":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Country:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {billingAddress?.country?.name || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                City:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {billingAddress?.city || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                State:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {billingAddress?.state?.name || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Address line 1:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {billingAddress?.address_line_1 || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Zip code:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {billingAddress?.zip_code || "N/A"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "siteAddress":
      return billingAddress?.site_same_as_billing ? (
        <Typography mb={5}>Same as billing address</Typography>
      ) : (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Country:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {siteAddress?.country?.name || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                City:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {siteAddress?.city || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                State:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {siteAddress?.state?.name || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Address line 1:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {siteAddress?.address_line_1 || "N/A"}
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Zip code:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {siteAddress?.zip_code || "N/A"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "hourlyRate":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            {/* ========================regular========================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Regular rate ({formData?.c_regular_rate_type === 'daily' ? 'per day' : 'per hour'}):
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                ${formData?.c_regular_hourly_rate || "--"}
              </CustomTypographyBold>
            </Grid>
            {/* ==========================holiday======================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Holiday rate ({formData?.c_holiday_rate_type === 'daily' ? 'per day' : 'per hour'}):
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                ${formData?.c_holiday_hourly_rate || "--"}
              </CustomTypographyBold>
            </Grid>
            {/* ========================overtime========================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Overtime rate ({formData?.c_overtime_rate_type === 'daily' ? 'per day' : 'per hour'}):
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                ${formData?.c_overtime_hourly_rate || "--"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "jobDuration":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            {/* ========================start========================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                From:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.project_start_date}
              </CustomTypographyBold>
            </Grid>
            {/* ==========================end======================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                To:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.project_end_date}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "privilegeDates":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            {/* ========================start========================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                From:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.privilege_start_date}
              </CustomTypographyBold>
            </Grid>
            {/* ==========================end======================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                To:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.privilege_end_date}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "contractDuration":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            {/* ========================start========================= */}
            <Grid item xs={12} md={3}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Duration
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={9}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.contract_duration}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    default:
      return null;
  }
};

export default ClientInformationSectionDetail;
