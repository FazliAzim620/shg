import { Box, Grid, Skeleton } from "@mui/material";
import React, { useEffect } from "react";
import {
  AccessTime,
  AirplanemodeActiveOutlined,
  AttachMoneyOutlined,
  Balcony,
  CallOutlined,
  DirectionsCarOutlined,
  FactCheckOutlined,
  ReceiptOutlined,
  WaterOutlined,
  WorkHistoryOutlined,
} from "@mui/icons-material";
import { Card, CardContent, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { PROVIDER_ROUTES } from "../../../routes/Routes";
import CustomTypographyBold from "../../../components/CustomTypographyBold";

import { useDispatch } from "react-redux";
import API from "../../../API";
import { downloadHandlerFile } from "../../../util";
import Hotel from "../jobs/Hotel";
import { getBookingItinerary } from "../../../feature/travelSlice";
import { getBookingHotels } from "../../../feature/hotelBookingSlice";
import { getBookingCars } from "../../../feature/carRentalBooking";
import Airline from "../jobs/Airline";
import Carrental from "../jobs/Carrental";
import UnderConstruction from "../../../components/UnderConstruction";
const ProviderItineraryContent = ({ selectedJob, selectedClient }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const clientId = parseInt(searchParams.get("client"));
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const getItineraryDataHandler = async () => {
    try {
      const resp = await API.get(
        selectedJob
          ? `/api/get-job-travel-itinerary/${selectedJob?.id}`
          : `api/get-provider-travel-itinerary/${selectedClient?.id}`
      );

      if (resp?.data?.success) {
        setLoading(false);
        setData(resp?.data?.data);
        dispatch(getBookingItinerary(resp?.data?.data?.[0]?.plane_ticket));
        dispatch(getBookingHotels([resp?.data?.data?.[0]?.hotel]));
        dispatch(getBookingCars([resp?.data?.data?.[0]?.car_rental]));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getItineraryDataHandler();
  }, [selectedClient]);
  const downloadHandler = (file) => {
    downloadHandlerFile(file);
  };
  const SkeltonLoader = () => {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "10px",
          px: 1,
          py: 1,
        }}
      >
        <Skeleton mb={1} height={"30px"} />
        <Skeleton mb={1} height={"30px"} />
        <Skeleton mb={1} height={"30px"} />
        <Skeleton mb={1} height={"30px"} />
        <Skeleton mb={1} height={"30px"} />
        <Skeleton mb={1} height={"30px"} />
      </Box>
    );
  };
  return (
    <Grid container spacing={2.5} sx={{ pr: 1.5 }}>
      <Grid item xs={12} md={2}>
        <StepsCard />
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {initialStep == 1 && (
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              px: 1,
              pt: 2,
            }}
          >
            {loading ? <SkeltonLoader /> : <Airline other={true} />}
          </Box>
        )}
        {initialStep == 2 && (
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              px: 1,
              py: 2,
            }}
          >
            <Hotel />
          </Box>
        )}
        {initialStep == 3 && (
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              px: 1,
              py: 2,
            }}
          >
            <Carrental />
          </Box>
        )}
        {initialStep == 4 && <UnderConstruction height={"30vh"} />}
      </Grid>
    </Grid>
  );
};

export default ProviderItineraryContent;

const StepsCard = () => {
  const user = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const initialClient = parseInt(searchParams.get("client"));
  const [activeStep, setActiveStep] = useState(initialStep);
  const navigate = useNavigate();
  const navigateHandler = (path) => {
    navigate(path);
  };
  const tabChangeHandler = ({ index, path }) => {
    // navigateHandler(path);
    setActiveStep(index);
    setSearchParams({ client: initialClient, step: index });
  };
  return (
    <Card
      sx={{
        // boxShadow: "0.375rem .75rem rgba(140, 152, 164, .075)",
        borderRadius: ".6875rem  ",
        pr: 1,
        width: "100%",
        minWidth: "10rem",
        minHeight: "15rem",
      }}
    >
      <CardContent sx={{ px: 0 }}>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 1,
              path: `${PROVIDER_ROUTES.timeSheet}/43534`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 1 &&
              `3px solid ${
                darkMode === "dark"
                  ? "white"
                  : user?.user?.role !== "provider"
                  ? "#007BFF"
                  : "#6d4a96"
              }`,
          }}
        >
          <AirplanemodeActiveOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 1 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 1
                  ? `${darkMode === "dark" ? "white" : "primary.main"}`
                  : "text.or_color",
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 1 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 1 &&
              `${darkMode === "dark" ? "white" : "primary.main"}`
            }
            lineHeight={1.5}
          >
            Airline
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 2,
              path: `${PROVIDER_ROUTES.timeSheet}/43534`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 2 &&
              `3px  solid ${
                darkMode === "dark"
                  ? "white"
                  : user?.user?.role !== "provider"
                  ? "#007BFF"
                  : "#6d4a96"
              }`,
          }}
        >
          <Balcony
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 2 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 2
                  ? `${darkMode === "dark" ? "white" : "primary.main"}`
                  : "text.or_color",
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 2 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 2 &&
              `${darkMode === "dark" ? "white" : "primary.main"}`
            }
            lineHeight={1.5}
          >
            Hotel and Stays
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 3,
              path: `${PROVIDER_ROUTES.jobScheduling}/43534`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 3 &&
              `3px  solid ${
                darkMode === "dark"
                  ? "white"
                  : user?.user?.role !== "provider"
                  ? "#007BFF"
                  : "#6d4a96"
              }`,
          }}
        >
          <DirectionsCarOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 3 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 3
                  ? `${darkMode === "dark" ? "white" : "primary.main"}`
                  : "text.or_color",
              mr: 1,
            }}
          />

          <CustomTypographyBold
            weight={activeStep === 3 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 3 &&
              `${darkMode === "dark" ? "white" : "primary.main"}`
            }
            lineHeight={1.5}
          >
            Car Rentals
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 4,
              path: `${PROVIDER_ROUTES.timeSheet}/43534`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 4 &&
              `3px  solid ${
                darkMode === "dark"
                  ? "white"
                  : user?.user?.role !== "provider"
                  ? "#007BFF"
                  : "#6d4a96"
              }`,
          }}
        >
          <WaterOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 4 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 4
                  ? `${darkMode === "dark" ? "white" : "primary.main"}`
                  : "text.or_color",
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 4 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 4 &&
              `${darkMode === "dark" ? "white" : "primary.main"}`
            }
            lineHeight={1.5}
          >
            Preferences
          </CustomTypographyBold>
        </MenuItem>
      </CardContent>
    </Card>
  );
};
