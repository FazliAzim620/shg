import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Divider, Grid, Skeleton, Typography } from "@mui/material";
import CustomTypographyBold from "../CustomTypographyBold";
import { getCountries, getStates } from "../../api_request";
import SkeletonRow from "../SkeletonRow";
const SiteAddressCardForBilling = ({ ml }) => {
  const { basicInfo, billingAddress, siteAddress } = useSelector(
    (state) => state.clientBasicInfo
  );
  const { city, country, address_line_1, address_line_2, state, zip_code } =
    billingAddress;
  const [isCountriesLoading, setCountriesIsLoading] = useState(true);
  const [isStatesLoading, setStatesIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [siteStates, setSiteStates] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const getStatesHandler = async (id, type) => {
    try {
      const resp = await getStates(id);
      if (resp?.data?.success) {
        setStatesIsLoading(false);
        if (type === "site") {
          setSiteStates(resp?.data?.data);
        } else {
          setBillingStates(resp?.data?.data);
        }
      }
    } catch (error) {
      setStatesIsLoading(false);
      console.log(error);
    }
  };
  const getCountriesHandler = async () => {
    try {
      const resp = await getCountries();
      if (resp?.data?.success) {
        setCountriesIsLoading(false);
        setCountries(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
      setCountriesIsLoading(false);
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
  return (
    <Box sx={{ pb: "40px", ml }}>
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
          {isCountriesLoading ? (
            <Skeleton width={150} height={30} />
          ) : (
            <CustomTypographyBold color={"text.black"}>
              {countries?.length > 0 &&
                countries?.find((item) => item?.id === country)?.name}
            </CustomTypographyBold>
          )}
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
          {isStatesLoading ? (
            <Skeleton width={150} height={30} />
          ) : (
            <CustomTypographyBold color={"text.black"}>
              {billingStates?.length > 0 &&
                billingStates?.find((item) => item?.id === state)?.name}
            </CustomTypographyBold>
          )}
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
};

export default SiteAddressCardForBilling;
