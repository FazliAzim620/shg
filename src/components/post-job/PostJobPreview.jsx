import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStates } from "../../api_request";
import CustomTypographyBold from "../CustomTypographyBold";
import {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
} from "../Images";
import BudgetPreferences_postJob from "./postJobDetailpage/BudgetPreferences_postJob";
import { selectOptions } from "../../util";
import parse from "html-react-parser";
const PostJobPreview = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const { airfare, hotel, car, mileage, gas, parking, overbudget, tolls } =
    useSelector((state) => state.postJob);
  // import BudgetPreferenceDetails from "../job-component/providerInfo_steps/budgetPreferenceComponent/BudgetPreferenceDetails";
  // import { getCountries, getStates } from "../../api_request";
  // import SiteAddressCardForBilling from "../client-module/SiteAddressCardForBilling";
  const {
    jobTitle,
    jobDescription,
    providerRoleIds,
    allied_health_clinician_type,
    specialty,
    boardCertification,
    stateLicense,
    regularHourlyRate,
    holidayHourlyRate,
    experienceRequired,
    lastDateToApply,
    statesList,
    openPositions,
    payRateType,
    holidayRateType,
    //----------------------
    startDate,
    endDate,
    shiftDays,
    startTime,
    endTime,
    //--------------------------
    countries,
    states,
    selectedCountry,
    selectedState,
    client,
    clientsList,
    medicalSpecialities,
    providerRolesList,
    //-------------------------
  } = useSelector((state) => state.postJob);
  const sections = [
    "Job basics",
    "Shift details",
    "Client details",
    "Budget preference",
  ];

  //   const [countries, setCountries] = useState([]);
  const [siteStates, setSiteStates] = useState([]);

  const budgetData = [
    {
      icon: icon8,
      title: "Airfare",
      message: "Is airfare covered by this client?",
      value: airfare === "yes",
    },
    {
      icon: icon1,
      title: "Hotel",
      message: "Does this client offer hotel accommodation?",
      value: hotel === "yes",
    },

    {
      icon: icon2,
      title: "Car",
      message: "Does this client provide car rental?",
      value: car === "yes",
    },
    {
      icon: icon7,
      title: "Tolls",
      message: "Does this client cover toll expenses?",
      value: tolls === "yes",
    },
    {
      icon: icon3,
      title: "Logged miles",
      message: "Does the client cover mileage reimbursement?",
      value: mileage === "yes",
    },
    {
      icon: icon4,
      title: "Gas",
      message: "Does this client cover gas or fuel expenses?",
      value: gas === "yes",
    },
    {
      icon: icon5,
      title: "Parking fee",
      message: "Does this client cover parking fee expenses?",
      value: parking === "yes",
    },
    {
      icon: icon6,
      title: "Over Budget Travel",
      message: "Will clients approve overbudget travel costs?",
      value: overbudget === "yes",
    },
  ];
  const getStatesHandler = async (id) => {
    try {
      const resp = await getStates(id);
      if (resp?.data?.success) {
        setSiteStates(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedCountry) {
      getStatesHandler(selectedCountry?.id);
    }
  }, []); 
  const renderContent = (section) => {
    switch (section) {
      case "Job basics":
        return (
          <Box sx={{ pb: "40px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Job title
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {jobTitle || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Provider Roles
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold
                  color={"text.black"}
                  textTransform={"none"}
                >
                  {providerRoleIds && providerRoleIds.length > 0
                    ? providerRoleIds
                        .map(
                          (id) =>
                            providerRolesList?.find((item) => item?.id === id)?.name
                        )
                        .filter(Boolean)
                        .join(", ")
                    : "--"}
                </CustomTypographyBold>
              </Grid>
              {/* Provider Sub Role: show if Allied Health Clinician is selected */}
              {(() => {
                const alliedRole = providerRolesList?.find(
                  (role) => role.name === 'Allied Health Clinician'
                );
                return alliedRole && Array.isArray(providerRoleIds) && providerRoleIds.includes(alliedRole.id);
              })() && (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomTypographyBold
                      weight={400}
                      color={"text.primary"}
                      textTransform={"none"}
                    >
                      Provider Sub Role
                    </CustomTypographyBold>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold
                      color={"text.black"}
                      textTransform={"none"}
                    >
                      {allied_health_clinician_type || "--"}
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
                  Speciality
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {(medicalSpecialities?.length > 0 &&
                    medicalSpecialities?.find((item) => item?.id === specialty)
                      ?.name) ||
                    "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Board certification/eligibility
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {boardCertification?.BE && "Board Eligible (BE)"}
                  {boardCertification?.BC && boardCertification?.BE && " , "}
                  {boardCertification?.BC && "Board Certified (BC)"}
                  {boardCertification?.NA && "N/A"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  State licenses
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {statesList?.find((state) => state?.id === stateLicense)
                    ?.name || " --"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Pay Rate
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  $ {regularHourlyRate || " --"} {payRateType ? payRateType : ""}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Holiday Rate
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  $ {holidayHourlyRate || "--"} {holidayRateType ? holidayRateType : ""}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Experience required
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {experienceRequired || " --"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Open positions
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {openPositions || " --"}
                </CustomTypographyBold>
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Last date to apply
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {lastDateToApply || " --"}
                </CustomTypographyBold>
              </Grid> */}
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Description
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {jobDescription ? parse(jobDescription) : "--"}
                </CustomTypographyBold>
              </Grid>
            </Grid>
          </Box>
        );
      case "Shift details":
        const eHours = parseInt(endTime?.split(":")[0], 10);
        const eMinutes = endTime?.split(":")[1];
        const ePeriod = eHours >= 12 ? "PM" : "AM";
        const eFormattedHours = eHours % 12 || 12;

        const sHours = parseInt(startTime?.split(":")[0], 10);
        const sMinutes = startTime?.split(":")[1];
        const sPeriod = sHours >= 12 ? "PM" : "AM";
        const sFormattedHours = sHours % 12 || 12;
        return (
          <Box sx={{ pb: "40px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Start date
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {startDate || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  End date
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {endDate || "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Shift days
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {shiftDays?.length > 0 ? shiftDays.join(", ") : "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Start time
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {startTime
                    ? `${sFormattedHours}:${sMinutes} ${sPeriod} `
                    : "--"}
                </CustomTypographyBold>
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  End time
                </CustomTypographyBold>
              </Grid>

              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {endTime
                    ? `${eFormattedHours}:${eMinutes} ${ePeriod} `
                    : "--"}
                </CustomTypographyBold>
              </Grid>
            </Grid>
          </Box>
        );
      case "Client details":
        return (
          <Box sx={{ pb: "40px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Client
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {client?.name?.name || client?.name}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Facility name
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {client?.facilityName?.facilityName || client?.facilityName}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Country
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {(countries?.length > 0 &&
                    countries?.find((item) => item?.id === selectedCountry?.id)
                      ?.name) ||
                    "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  State
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {(siteStates?.length > 0 &&
                    siteStates?.find((item) => item?.id === selectedState?.id|| selectedState)
                      ?.name) ||
                    "--"}
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  City
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {client?.city}
                </CustomTypographyBold>
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Address line 1
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {client?.address1 || "--"}
                </CustomTypographyBold>
              </Grid> */}
              {client?.address2 && (
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold
                    weight={400}
                    color={"text.primary"}
                    textTransform={"none"}
                  >
                    Facility Address
                  </CustomTypographyBold>
                </Grid>
              )}
              {client?.address2 && (
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {client?.address2 || "--"}
                  </CustomTypographyBold>
                </Grid>
              )}
              {/* <Grid item xs={12} md={4}>
                <CustomTypographyBold
                  weight={400}
                  color={"text.primary"}
                  textTransform={"none"}
                >
                  Zip code
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={12} md={8}>
                <CustomTypographyBold color={"text.black"}>
                  {client?.zipCode || "--"}
                </CustomTypographyBold>
              </Grid> */}
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Box>
      {sections.map((section, index) => {
        return (
          <Box key={index} mt={2}>
            <Grid
              container
              sx={{ display: "flex", alignItems: "center", mb: "30px" }}
            >
              <Grid item xs={6} md={2.0}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "text.black",
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
            {section === "Job basics" ||
            section === "Client details" ||
            section === "Shift details" ||
            section === "Basic information" ? (
              renderContent(section)
            ) : (
              <BudgetPreferences_postJob budgetData={budgetData} />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default PostJobPreview;
