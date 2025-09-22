import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CommonInputField } from "../job-component/CreateJobModal";

import { CommonSelect } from "../job-component/CommonSelect";
import { updateSection } from "../../feature/client-module/clientSlice";
import { getCountries, getStates } from "../../api_request";
import { HelpOutline } from "@mui/icons-material";
import SiteAddressCardForBilling from "./SiteAddressCardForBilling";
import { BpCheckbox } from "../common/CustomizeCHeckbox";
const ErrorMessage = styled(Typography)({
  color: "red",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
});

const SiteAddress = ({ errors }) => {
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
  const { siteAddress } = useSelector((state) => state.clientBasicInfo);
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
    dispatch(updateSection({ section: "siteAddress", field: name, value }));
  };
  const handleCheckboxChange = (e) => {
    dispatch(
      updateSection({
        section: "siteAddress",
        field: "same_is_billing",
        value: e.target.checked,
      })
    );
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
    if (siteAddress?.country) {
      getStatesHandler(siteAddress?.country);
    }
    getCountriesHandler();
  }, []);
  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  if (siteAddress.same_is_billing) {
    return (
      <Grid container spacing={3.5} sx={{ pb: 1 }}>
        <Grid item xs={12}>
          <FormControlLabel
            sx={{}}
            control={
              <BpCheckbox
                // className={`${!siteAddress.same_is_billing && "checkbox"}`}
                size="small"
                checked={siteAddress.same_is_billing}
                onChange={handleCheckboxChange}
                name="sameAsBilling"
              />
            }
            label={
              <Typography
                variant="caption"
                sx={{ fontSize: "0.875rem", fontWeight: 400 }}
              >
                Same as billing address
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <SiteAddressCardForBilling ml={4} />
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container spacing={3} sx={{ minHeight: "50vh", py: 1 }}>
      <Grid item xs={12}>
        <FormControlLabel
          sx={{}}
          control={
            <BpCheckbox
              // className={`${!siteAddress.same_is_billing && "checkbox"}`}
              size="small"
              checked={siteAddress.same_is_billing}
              onChange={handleCheckboxChange}
              name="sameAsBilling"
            />
          }
          label={
            <Typography
              variant="caption"
              sx={{ fontSize: "0.875rem", fontWeight: 400 }}
            >
              Same as billing address
            </Typography>
          }
        />
      </Grid>
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
            // error={requiredFields?.includes("siteAddress") ? true : false}
            options={filterCountries}
            name={"country"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={siteAddress?.country}
            placeholder="United State"
            type="text"
          />{" "}
          {errors?.country && <ErrorMessage>{errors.country}</ErrorMessage>}
        </Box>
        <Box>
          <CommonSelect
            height={"2.6rem"}
            // error={requiredFields?.includes("siteAddress") ? true : false}
            options={filterState}
            name={"state"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={siteAddress?.state}
            placeholder="State "
            type="text"
          />{" "}
          {errors?.state && <ErrorMessage>{errors.state}</ErrorMessage>}
        </Box>
        <Box>
          <CommonInputField
            name="city"
            placeholder="City"
            value={siteAddress?.city}
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
            value={siteAddress?.address_line_1}
            onChange={handleChange}
            // onChange={(e) => setFirstName(e.target.value)}
          />
          {errors?.address_line_1 && (
            <ErrorMessage>{errors.address_line_1}</ErrorMessage>
          )}{" "}
        </Box>
      </Grid>
      <Grid item xs={3}>
        <StyledTypography variant="body2" sx={{}}>
          Address line 2
          <Typography variant="caption" sx={{ color: "text.or_color" }}>
            (Optional)
          </Typography>
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
          value={siteAddress?.address_line_2}
          onChange={handleChange}
          // onChange={(e) => setFirstName(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <StyledTypography variant="body2">
          Site Name
          <Typography variant="caption" sx={{ color: "text.or_color" }}>
            (Optional)
          </Typography>
        </StyledTypography>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <CommonInputField
          name="site_name"
          placeholder="e.g., Main Campus, North Wing"
          value={siteAddress?.site_name || ""}
          onChange={handleChange}
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
            value={siteAddress?.zip_code}
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

export default SiteAddress;
