import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { CommonSelect } from "../CommonSelect";
import { CommonInputField } from "../CreateJobModal";

const AddressForm = ({
  formData,
  handleChange,
  filterCountries,
  filterState,
  siteAddress,
  requiredFields,
}) => {
  return (
    <Box sx={{ pt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography
            variant="body2"
            sx={{
              color: "text.black",
              p: "10px 12px",
              lineHeight: "1.2rem",
              fontSize: "14px",
            }}
          >
            Location {requiredFields && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <CommonSelect
            height={"2.6rem"}
            error={requiredFields?.includes("billingAddress") ? true : false}
            options={filterCountries}
            name={siteAddress ? "siteAddress" : "billingAddress"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={
              siteAddress
                ? Number(formData.siteAddress)
                : Number(formData.billingAddress)
            }
            placeholder="e.g., USA"
            type="text"
          />
          {requiredFields?.includes("billingAddress") ? (
            <Typography variant="caption" color="error">
              Location is required!
            </Typography>
          ) : (
            " "
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={3}>
          <Typography
            variant="body2"
            sx={{
              color: "text.black",
              p: "10px 12px",
              lineHeight: "1.2rem",
              fontSize: "14px",
            }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <CommonSelect
            height={"2.6rem"}
            error={requiredFields?.includes("billingState") ? true : false}
            options={filterState}
            name={siteAddress ? "siteState" : "billingState"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={
              siteAddress
                ? Number(formData.siteState)
                : Number(formData.billingState)
            }
            placeholder="State"
            type="text"
          />
          {requiredFields?.includes("billingState") ? (
            <Typography variant="caption" color="error">
              State is required!
            </Typography>
          ) : (
            " "
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={3}>
          <Typography
            variant="body2"
            sx={{
              color: "text.black",
              p: "10px 12px",
              lineHeight: "1.2rem",
              fontSize: "14px",
            }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <CommonInputField
            height={"2.6rem"}
            error={requiredFields?.includes("billingCity") ? true : false}
            fullWidth
            placeholder="City"
            type="text"
            name={siteAddress ? "siteCity" : "billingCity"}
            onChange={handleChange}
            margin="normal"
            value={siteAddress ? formData.siteCity : formData.billingCity}
          />
          {requiredFields?.includes("billingCity") ? (
            <Typography variant="caption" color="error">
              City is required!
            </Typography>
          ) : (
            " "
          )}
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        mt={1}
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <Grid item xs={12} md={3}>
          <Typography
            variant="body2"
            sx={{
              color: "text.black",
              p: "10px 12px",
              lineHeight: "1.2rem",
              fontSize: "14px",
            }}
          >
            Address line 1{" "}
            {requiredFields && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <CommonInputField
            height={"2.6rem"}
            error={requiredFields?.includes("billingAddress1") ? true : false}
            name={siteAddress ? "siteAddress1" : "billingAddress1"}
            placeholder="e.g,123 Main Street"
            onChange={handleChange}
            type="text"
            fullWidth
            margin="normal"
            value={
              siteAddress ? formData.siteAddress1 : formData.billingAddress1
            }
          />
          {requiredFields?.includes("billingAddress1") ? (
            <Typography variant="caption" color="error">
              Address Line 1 is required!
            </Typography>
          ) : (
            " "
          )}
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        mt={1}
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <Grid item xs={12} md={3}>
          <Typography
            variant="body2"
            sx={{
              color: "text.black",
              pl: "12px",
              lineHeight: "1.2rem",
              fontSize: "14px",
            }}
          >
            Address line 2 <span style={{ color: "#8c98a4" }}>(Optional)</span>
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <CommonInputField
            height={"2.6rem"}
            name={siteAddress ? "siteAddress2" : "billingAddress2"}
            placeholder="e.g, Apartment suite, unit, building, floor, etc."
            onChange={handleChange}
            type="text"
            fullWidth
            margin="normal"
            value={
              siteAddress ? formData.siteAddress2 : formData.billingAddress2
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        mt={1}
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <Grid item xs={12} md={3}>
          <Typography
            variant="body2"
            sx={{
              color: "text.black",
              p: "10px 12px",
              lineHeight: "1.2rem",
              fontSize: "14px",
            }}
          >
            Zip Code {requiredFields && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <CommonInputField
            height={"2.6rem"}
            name={siteAddress ? "siteZipCode" : "billingZipCode"}
            placeholder="1254"
            onChange={handleChange}
            type="text"
            fullWidth
            margin="normal"
            error={requiredFields?.includes("billingZipCode")}
            value={siteAddress ? formData.siteZipCode : formData.billingZipCode}
          />
          {requiredFields?.includes("billingZipCode") ? (
            <Typography variant="caption" color="error">
              Zip code is required!
            </Typography>
          ) : (
            " "
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressForm;
