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
import { downloadHandlerFile } from "../../../util";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import NodataFoundCard from "../../provider_components/NodataFoundCard";
import NoFileUploaded from "../../../components/common/NoFileUploaded";
const Hotel = () => {
  const { bookings, status } = useSelector((state) => state.hotel);
  const downloadHandler = (file) => {
    downloadHandlerFile(file);
  };
  return !bookings?.[0] ? (
    <NodataFoundCard />
  ) : (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3} sx={{ minHeight: "15rem" }}>
          {bookings?.[0]?.attachment ? (
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
                onClick={() => downloadHandler(bookings?.[0]?.attachment)}
              />
            </Box>
          ) : (
            <NoFileUploaded />
          )}
        </Grid>
        <Grid item xs={3}>
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
              {bookings?.[0]?.hotel_name}
            </Typography>
          </Box>
          <Box sx={{ pt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.black", fontWeight: 600, pb: 1 }}
            >
              Hotel address
            </Typography>
            <CustomTypographyBold
              fontSize={"0.75rem"}
              weight={400}
              color={"text.or_color"}
            >
              {bookings?.[0]?.address_line_2 &&
                `${bookings?.[0]?.address_line_2},`}
              {bookings?.[0]?.address_line_1}, {bookings?.[0]?.city},
            </CustomTypographyBold>

            <CustomTypographyBold
              fontSize={"0.75rem"}
              weight={400}
              color={"text.or_color"}
            >
              {bookings?.[0]?.state?.name}, {bookings?.[0]?.country?.name},
            </CustomTypographyBold>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            direction="column"
            // alignItems="flex-end"
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
                    Room type:
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {bookings?.[0]?.room_type}
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
                <Grid item xs={5} mt={-2.5} alignItems={"right"}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.or_color", textAlign: "right" }}
                  >
                    Bed type:
                  </Typography>
                </Grid>
                <Grid item xs={3} mt={-2.5} alignItems="start">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  >
                    {bookings?.[0]?.bed_type === "single_bed"
                      ? "Single bed"
                      : bookings?.[0]?.bed_type}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}></Grid>

        <Grid item xs={9} mt={-10}>
          <Divider />
          <Grid item xs={12} mt={2}>
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "end" }}
            >
              <Grid item xs={8} alignItems={"right"}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.or_color", textAlign: "right" }}
                >
                  Total amount:
                </Typography>
              </Grid>
              <Grid item xs={3} alignItems="start">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textTransform: "capitalize",
                    textAlign: "right",
                    pr: 5,
                  }}
                >
                  {Number(bookings?.[0]?.budget_per_night) *
                    Number(bookings?.[0]?.total_nights)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Hotel;
