import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonSelect } from "../job-component/CommonSelect";
import { CommonInputField } from "../job-component/CreateJobModal";
import {
  fetchCountries,
  setSelectedCountry,
  setSelectedState,
  setClientField,
  fetchClientStates,
  fetchClients,
  setSelectedClient,
  resetClientField,
} from "../../feature/post-job/PostJobSlice";
import { Box, Grid, Typography, styled } from "@mui/material";
const ErrorMessage = styled(Typography)({
  color: "red",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
});

const SelectClientTab = ({ errors, setErrors }) => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme.mode);
  const {
    countries,
    states,
    id,
    selectedCountry,
    selectedState,
    client,
    clientsList,
    selectedClient,
  } = useSelector((state) => state.postJob);

  const data = useSelector((state) => state.postJob);
  const StyledTypography = styled(Typography)({
    color: darkMode === "dark" ? " #F8F9FA" : "black",
    marginTop: "0.5rem",
    fontWeight: 400,
    fontSize: "0.875rem",
  });
  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleCountryChange = (e) => {
    setErrors({ ...errors, ["selectedCountry"]: "" });
    const selectedCountry = countries.find(
      (country) => country.id === e.target.value
    );

    dispatch(setSelectedCountry(selectedCountry));
    dispatch(fetchClientStates(selectedCountry.id));
  };

  const handleStateChange = (e) => {
    setErrors({ ...errors, ["selectedState"]: "" });
    const selectedState = states.find((state) => state.id === e.target.value);
    dispatch(setSelectedState(selectedState?.id));
  };
  const handleClientChange = (e) => {
    const currentClient = clientsList?.filter(
      (client) => client?.id === e.target.value
    );
    handleSelect(currentClient?.[0]);
    const siteAddress = currentClient?.[0]?.addresses?.find(
      (address) => address.type === "billing"
    );

    const selectedCountry = countries.find(
      (country) => country.id === siteAddress?.country_id
    );
    // dispatch(fetchClientStates(selectedCountry?.id));
    // dispatch(setSelectedClient(currentClient?.[0]));
    // dispatch(setSelectedCountry(selectedCountry));
    // const selectedState = states.find(
    //   (state) => state.id === siteAddress?.state_id
    // );
    // dispatch(setSelectedState(selectedState));
    // dispatch(setClientField({ field: ["name"], value: selectedCountry }));
  };

  const handleClientFieldChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    dispatch(setClientField({ field: e.target.name, value: e.target.value }));
  };

  const clearHandler = () => {
    dispatch(resetClientField());
  };
  const handleSelect = (curr) => {
    setErrors({});
    const siteAddress = curr?.addresses?.find(
      (address) => address.type === "site"
    );
    dispatch(setClientField({ field: ["id"], value: curr?.id }));
    dispatch(setClientField({ field: ["name"], value: curr?.name }));
    // dispatch(setClientField({ field: ["email"], value: curr?.email }));
    // dispatch(
    //   setClientField({
    //     field: ["address1"],
    //     value: siteAddress?.address_line_1,
    //   })
    // );
    // dispatch(
    //   setClientField({
    //     field: ["address2"],
    //     value: siteAddress?.address_line_2,
    //   })
    // );
    // dispatch(setClientField({ field: ["city"], value: siteAddress?.city }));
    // dispatch(
    //   setClientField({ field: ["state"], value: curr?.siteAddress?.state })
    // );
    // dispatch(
    //   setClientField({ field: ["zipCode"], value: siteAddress?.zip_code })
    // );
  };
  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.abbrevation ? `${option.name} (${option.abbrevation})` : option.name,
  }));
  const filterClientsList = clientsList?.map((option) => ({
    value: option.id,
    label: option.name,
  })); 
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} sx={{}}>
            <StyledTypography>
              Select Client <span style={{ color: "red" }}>*</span>{" "}
            </StyledTypography>
          </Grid>
          <Grid item xs={12} md={9} sx={{}}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <CommonSelect
                width={"400px"}
                // value={selectedCurrentData.medical_speciality_id}
                // value={jobData.provider}
                handleClear={clearHandler}
                placeholder="Select from existing client  "
                name="client"
                options={filterClientsList}
                value={+client?.id}
                handleChange={handleClientChange}
              />

              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  py: "10px",
                  px: "40px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                or
              </Typography>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <CommonInputField
                  name={"name"}
                  placeholder="Add new"
                  value={client.name}
                  onChange={handleClientFieldChange}
                  type="text"
                  // error={
                  //   jobData.providerFullName && error.addNew ? true : false
                  // }
                />
                <Typography variant="caption" color="error">
                  {/* {error.addNew} */}
                </Typography>
              </Box>
            </Box>
          </Grid>
          {/*       
          <Grid item xs={3} sx={{}}>
            <StyledTypography>
              Email <span style={{ color: "red" }}>*</span>{" "}
            </StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              name={"email"}
              placeholder="example@gmail.com"
              value={client.email}
              onChange={handleClientFieldChange}
              type="email"
              disabled={id}
              // error={
              //   jobData.providerFullName && error.addNew ? true : false
              // }
            />
            {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </Grid> */}
          <Grid item xs={3} sx={{}}>
            <StyledTypography>Facility Name</StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              name="facilityName"
              placeholder="Enter facility name"
              value={client?.facilityName}
              onChange={handleClientFieldChange}
            />
            {errors?.facilityName && (
              <ErrorMessage>{errors.facilityName}</ErrorMessage>
            )}
          </Grid>
          <Grid item xs={3} sx={{}}>
            <StyledTypography>
              Facility Location <span style={{ color: "red" }}>*</span>{" "}
            </StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonSelect
              name="country"
              options={filterCountries}
              value={+selectedCountry?.id}
              handleChange={handleCountryChange}
              placeholder="Select country"
            />
            {errors?.selectedCountry && (
              <ErrorMessage>{errors.selectedCountry}</ErrorMessage>
            )}
          </Grid>
          <Grid item xs={3} sx={{}}></Grid>
          <Grid item xs={9} sx={{}}>
            <CommonSelect
              name="state"
              options={filterState}
              value={selectedState}
              handleChange={handleStateChange}
              placeholder="Select state"
            />
            {errors?.selectedState && (
              <ErrorMessage>{errors.selectedState}</ErrorMessage>
            )}
          </Grid>
          <Grid item xs={3} sx={{}}></Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              name="city"
              placeholder="Enter city name"
              value={client?.city}
              onChange={handleClientFieldChange}
            />
            {errors?.city && <ErrorMessage>{errors.city}</ErrorMessage>}
          </Grid>
          {/* <Grid item xs={3} sx={{}}>
            <StyledTypography>
              Address line 1 <span style={{ color: "red" }}>*</span>{" "}
            </StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              name="address1"
              placeholder="e.g 123 main street"
              value={client?.address1}
              onChange={handleClientFieldChange}
            />
            {errors?.address1 && (
              <ErrorMessage>{errors?.address1}</ErrorMessage>
            )}
          </Grid> */}
          <Grid item xs={3} sx={{}}>
            <StyledTypography>Facility Address</StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              name="address2"
              placeholder="e.g., Apartment, suite, unit, building, floor, etc."
              value={client?.address2}
              onChange={handleClientFieldChange}
            />
          </Grid>
          {/* <Grid item xs={3} sx={{}}>
            <StyledTypography>Zip code</StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              name="zipCode"
              placeholder="Enter zip code"
              value={client?.zipCode}
              onChange={handleClientFieldChange}
            />
          </Grid> */}
        </Grid>
      </Box>

      {/* Add more input fields for the client */}
    </div>
  );
};

export default SelectClientTab;
