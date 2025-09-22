import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BudgetPreferenceDetails from "../job-component/providerInfo_steps/budgetPreferenceComponent/BudgetPreferenceDetails";
import CustomTypographyBold from "../CustomTypographyBold";
import { getCountries, getStates } from "../../api_request";
import SiteAddressCardForBilling from "./SiteAddressCardForBilling";

const PreviewDetails = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const {
    airfare,
    hotel,
    loggedMiles,
    carRental,
    overBudgetTravel,
    parking,
    tolls,
    gas,
  } = useSelector((state) => state.budgetPreferences);

  const { basicInfo, billingAddress, siteAddress } = useSelector(
    (state) => state.clientBasicInfo
  );
  const sections = [
    "Basic information",
    "Billing address",
    "Site address",
    "Airfare",
    "Hotel",
    "Car rental",
    "Logged miles",
    "Tolls",
    "Gas",
    "Parking",
    "Over Budget Travel",
  ];
  const { clientName, email, firstName, lastName, phones, clientEmail
,    role } = basicInfo;

  const { city, country, address_line_1, address_line_2, state, zip_code } =
    billingAddress; 
  const [countries, setCountries] = useState([]);
  const [siteStates, setSiteStates] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const getStatesHandler = async (id, type) => {
    try {
      const resp = await getStates(id);
      if (resp?.data?.success) {
        if (type === "site") {
          setSiteStates(resp?.data?.data);
        } else {
          setBillingStates(resp?.data?.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
      getStatesHandler(billingAddress?.country, "billing");
    }
    if (siteAddress?.country) {
      getStatesHandler(siteAddress?.country, "site");
    }
    getCountriesHandler();
  }, []);
  const renderContent = (section) => {
    switch (section) {
      case "Basic information":
        return (
          <Box sx={{ pb: "40px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Client name:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {clientName || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Client email:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {clientEmail
 || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                 Primary Email:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold
                  color={"text.black"}
                  textTransform={"none"}
                >
                  {email || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
               Primary contact name:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold
                  color={"text.black"}
                  textTransform={"capitalize"}
                >
                  {firstName + " " + lastName || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                {phones?.map((phone, index) => {
                  return (
                    <CustomTypographyBold
                      weight={400}
                      color={"text.primary"}
                      textTransform={"none"}
                      key={index}
                    >
                      {phone?.type}
                    </CustomTypographyBold>
                  );
                })}
              </Grid>
              <Grid item xs={12} md={8}>
                {phones?.map((phone, index) => {
                  return (
                    <CustomTypographyBold color={"text.black"} key={index}>
                      {phone?.number}
                    </CustomTypographyBold>
                  );
                })}
              </Grid>
            </Grid>
          </Box>
        );
      case "Billing address":
        return (
          <Box sx={{ pb: "40px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Country:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {countries?.length > 0 &&
                    countries?.find((item) => item?.id === country)?.name}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  State:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {billingStates?.length > 0 &&
                    billingStates?.find((item) => item?.id === state)?.name}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  City:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {city}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Address line 1:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {address_line_1}
                </CustomTypographyBold>
              </Grid>
              {address_line_2 && (
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold
                    weight={400}
                    color={"text.primary"}
                    textTransform={"none"}
                  >
                    Address line 2:
                  </CustomTypographyBold>
                </Grid>
              )}
              {address_line_2 && (
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {address_line_2}
                  </CustomTypographyBold>
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Zip code:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {zip_code}
                </CustomTypographyBold>
              </Grid>
            </Grid>
          </Box>
        );
      case "Site address":
        return siteAddress?.same_is_billing ? (
          <SiteAddressCardForBilling ml={0} />
        ) : (
          <Box sx={{ pb: "40px" }}>
            <Grid container spacing={2}>
              {/* Site Name */}
              {siteAddress?.site_name && (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomTypographyBold
                      weight={400}
                      color={"text.primary"}
                      textTransform={"none"}
                    >
                      Site Name:
                    </CustomTypographyBold>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold color={"text.black"}>
                      {siteAddress?.site_name}
                    </CustomTypographyBold>
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Country:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {countries?.length > 0 &&
                    countries?.find((item) => item?.id === siteAddress?.country)
                      ?.name}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  State:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {siteStates?.length > 0 &&
                    siteStates?.find((item) => item?.id === siteAddress?.state)
                      ?.name}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  City:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {siteAddress?.city}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Address line 1:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {siteAddress?.address_line_1}
                </CustomTypographyBold>
              </Grid>
              {siteAddress?.dress_line_2 && (
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold
                    weight={400}
                    color={"text.primary"}
                    textTransform={"none"}
                  >
                    Address line 2:
                  </CustomTypographyBold>
                </Grid>
              )}
              {siteAddress?.dress_line_2 && (
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {siteAddress?.dress_line_2}
                  </CustomTypographyBold>
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Zip code:
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {siteAddress?.zip_code}
                </CustomTypographyBold>
              </Grid>
            </Grid>
          </Box>
        );
    }
  }; 
  return (
    <Box>
      {sections.map((section, index) => {
        return (
          <Box key={index}>
            <Grid
              container
              sx={{ display: "flex", alignItems: "center", mb: "30px" }}
            >
              <Grid item xs={6} md={2.0}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "0.98rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    // color: "text.black",
                    // p: "1rem 1rem 0.75rem 1rem",
                    color: darkMode == "dark" ? "#6D747B" : "#71869D",
                  }}
                >
                  {section}
                </Typography>
              </Grid>
              <Grid item xs={6} md={10.0}>
                <Divider
                  sx={{
                    borderColor:
                      darkMode == "dark"
                        ? "rgba(255, 255, 255, .7"
                        : "rgba(231, 234, 243, 01)",
                  }}
                />
              </Grid>
            </Grid>
            {section === "Site address" ||
            section === "Billing address" ||
            section === "Basic information" ? (
              renderContent(section)
            ) : (
              <BudgetPreferenceDetails
                section={section}
                hidden={"yes"}
                formData={
                  section === "Airfare"
                    ? airfare
                    : section === "Hotel"
                    ? hotel
                    : section === "Car rental"
                    ? carRental
                    : section === "Logged miles"
                    ? loggedMiles
                    : section === "Gas"
                    ? gas
                    : section === "Tolls"
                    ? tolls
                    : section === "Over Budget Travel"
                    ? overBudgetTravel
                    : section === "Parking"
                    ? parking
                    : ""
                }
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default PreviewDetails;
