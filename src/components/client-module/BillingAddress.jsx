import {
  Grid,
  IconButton,
  Tooltip,
  Typography,
  styled,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CommonInputField } from "../job-component/CreateJobModal";
import AddressForm from "../job-component/providerInfo_steps/AddressForm";

import { CommonSelect } from "../job-component/CommonSelect";
import { updateSection } from "../../feature/client-module/clientSlice";
import { getCountries, getStates } from "../../api_request";
import { HelpOutline } from "@mui/icons-material";
const ErrorMessage = styled(Typography)({
  color: "red",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
});

const BillingAddress = ({ errors }) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const StyledTypography = styled(Typography)({
    color: darkMode === "dark" ? " #F8F9FA" : "black",
    marginTop: "0.5rem",
    fontWeight: 400,
    fontSize: "0.875rem",
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const dispatch = useDispatch();
  const { billingAddress } = useSelector((state) => state.clientBasicInfo);
  const getStatesHandler = async (id) => {
    try {
      const resp = await getStates(id);
      if (resp?.data?.success) {
        setStates(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    errors[name] = "";
    if (name == "country") {
      getStatesHandler(value);
    }
    dispatch(updateSection({ section: "billingAddress", field: name, value }));
  };
  const getCountriesHandler = async () => {
    try {
      const resp = await getCountries();
      if (resp?.data?.success) {
        setCountries(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // dispatch(clearHotelBooking());
    if (billingAddress?.country) {
      getStatesHandler(billingAddress?.country);
    }
    getCountriesHandler();
  }, []);
  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const filterState = states?.map((option) => ({
    value: option.id,
    label:option?.abbrevation?`${option.name} (${option.abbrevation})`:option.name ,
  }));

  return (
    <Grid container spacing={3.5} sx={{ minHeight: "50vh", pb: 1 }}>
      <Grid item xs={3}>
        <StyledTypography variant="body2">
          Location <span style={{ color: "red" }}>*</span>{" "}
        </StyledTypography>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}
      >
        <Box>
          <CommonSelect
            height={"2.6rem"}
            // error={requiredFields?.includes("billingAddress") ? true : false}
            options={filterCountries}
            name={"country"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={billingAddress?.country}
            placeholder="United State"
            type="text"
          />
          {errors?.country && <ErrorMessage>{errors.country}</ErrorMessage>}
        </Box>
        <Box>
          <CommonSelect
            height={"2.6rem"}
            // error={requiredFields?.includes("billingAddress") ? true : false}
            options={filterState}
            name={"state"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={billingAddress?.state}
            placeholder="State "
            type="text"
          />{" "}
          {errors?.state && <ErrorMessage>{errors.state}</ErrorMessage>}
        </Box>
        <Box>
          <CommonInputField
            name="city"
            placeholder="City"
            value={billingAddress?.city}
            onChange={handleChange}
            // onChange={(e) => setFirstName(e.target.value)}
          />
          {errors?.city && <ErrorMessage>{errors.city}</ErrorMessage>}
        </Box>
      </Grid>
      <Grid item xs={3}>
        <StyledTypography variant="body2">
          Address line 1 <span style={{ color: "red" }}>*</span>{" "}
        </StyledTypography>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box>
          <CommonInputField
            name="address_line_1"
            placeholder="e.g., 123 Main Street"
            value={billingAddress?.address_line_1}
            onChange={handleChange}
            // onChange={(e) => setFirstName(e.target.value)}
          />
          {errors?.address_line_1 && (
            <ErrorMessage>{errors.address_line_1}</ErrorMessage>
          )}
        </Box>
      </Grid>
      <Grid item xs={3}>
        <StyledTypography variant="body2" sx={{}}>
          Address line 2{" "}
          <StyledTypography variant="caption" sx={{ color: "text.or_color" }}>
            (Optional)
          </StyledTypography>
        </StyledTypography>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <CommonInputField
          name="address_line_2"
          placeholder="e.g., Apartment,suite,unit,building,floor,etc."
          value={billingAddress?.address_line_2}
          onChange={handleChange}
          // onChange={(e) => setFirstName(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <StyledTypography variant="body2">
          Zip code <span style={{ color: "red" }}>*</span>{" "}
          <Tooltip
            arrow
            placement="top"
            title={
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "200px",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: "#ffffff",
                }}
              >
                You can find your code in a postal address.
              </Typography>
            }
          >
            <IconButton>
              <HelpOutline sx={{ fontSize: "15px", color: "gray" }} />
            </IconButton>
          </Tooltip>
        </StyledTypography>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box>
          <CommonInputField
            name="zip_code"
            placeholder="e.g,12365"
            value={billingAddress?.zip_code}
            onChange={handleChange}
            // onChange={(e) => setFirstName(e.target.value)}
          />
          {errors?.zip_code && <ErrorMessage>{errors.zip_code}</ErrorMessage>}
        </Box>
      </Grid>
      {/* Add other billing address fields similarly */}
    </Grid>
  );
};

export default BillingAddress;
