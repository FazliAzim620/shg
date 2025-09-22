import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  Grid,
  Divider,
} from "@mui/material";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { getItineraryData } from "../../../thunkOperation/job_management/providerInfoStep";
import { getBookingHotels } from "../../../feature/hotelBookingSlice";
import { getBookingCars } from "../../../feature/carRentalBooking";
import { useSelector } from "react-redux";
import { baseURLImage } from "../../../API";
import { Download, SaveAltOutlined } from "@mui/icons-material";
import { getBookingItinerary } from "../../../feature/travelSlice";
import { downloadHandlerFile, formatTime } from "../../../util";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import NodataFoundCard from "../../provider_components/NodataFoundCard";
import NoFileUploaded from "../../../components/common/NoFileUploaded";

const Carrental = () => {
  const { carBookings } = useSelector((state) => state.carRental);
  const downloadHandler = (file) => {
    downloadHandlerFile(file);
  };
  return !carBookings?.[0] ? (
    <NodataFoundCard />
  ) : (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3} sx={{ minHeight: "15rem" }}>
          {carBookings?.[0]?.attachment ? (
            <Box sx={{ position: "relative", width: "100%" }}>
              <Box
                component="img"
                src={pdfIcon}
                alt="PDF"
                sx={{ width: "70%" }}
              />
              <SaveAltOutlined
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  fontSize: 30,
                  color: "white",
                  backgroundColor: "primary.main",
                  borderRadius: ".3125rem",
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => downloadHandler(carBookings?.[0]?.attachment)}
              />
            </Box>
          ) : (
            <NoFileUploaded />
          )}
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ textAlign: "right", color: "text.or_color" }}
            >
              Name :
            </Typography>
            <Typography
              variant="h6"
              sx={{ textTransform: "capitalize", pl: 1 }}
            >
              {carBookings?.[0]?.car_rental_company}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTypographyBold
              fontSize={"0.875rem"}
              weight={400}
              color={"text.or_color"}
            >
              Car type:
            </CustomTypographyBold>
            <CustomTypographyBold fontSize={"0.875rem"} color={"text.black"}>
              {carBookings?.[0]?.car_type}
            </CustomTypographyBold>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Grid
            container
            direction="column"
            // bgcolor={"green"}

            spacing={1}
          >
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Grid item xs={5} alignItems={"right"}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.or_color",
                      textAlign: "right",
                    }}
                  >
                    Pickup date :
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {carBookings?.[0]?.pickup_date}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={-2}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Grid item xs={5} alignItems={"right"}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.or_color", textAlign: "right" }}
                  >
                    Pickup time :
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {formatTime(carBookings?.[0]?.pickup_time)}
                    {/* {format(carBookings?.[0]?.pickup_time, "hh:mm a")} */}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Grid item xs={5} alignItems={"right"}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.or_color",
                      textAlign: "right",
                    }}
                  >
                    Dropoff date :
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {carBookings?.[0]?.dropoff_date}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={-2}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Grid item xs={5} alignItems={"right"}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.or_color", textAlign: "right" }}
                  >
                    Dropoff time :
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {formatTime(carBookings?.[0]?.dropoff_time)}
                    {/* {format(carBookings?.[0]?.pickup_time, "hh:mm a")} */}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Carrental;
