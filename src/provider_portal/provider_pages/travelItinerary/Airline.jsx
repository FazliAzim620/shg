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
} from "@mui/material";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { getItineraryData } from "../../../thunkOperation/job_management/providerInfoStep";
import { getBookingHotels } from "../../../feature/hotelBookingSlice";
import { getBookingCars } from "../../../feature/carRentalBooking";
import { useSelector } from "react-redux";
import API, { baseURLImage } from "../../../API";
import { Download, SaveAltOutlined } from "@mui/icons-material";
import { getBookingItinerary } from "../../../feature/travelSlice";
import { downloadHandlerFile } from "../../../util";
import NoFileUploaded from "../../../components/common/NoFileUploaded";
const Airline = ({ downloadHandler, createdItinerary }) => {
  //   const params = useParams();
  //   const dispatch = useDispatch();
  //   const getItineraryDataHandler = async () => {
  //  try {
  //     const resp=await API.get(`get-provider-travel-itinerary/${client_id}`)
  //  } catch (error) {
  //     console.log(error)
  //  }
  //     // const result = await dispatch(getItineraryData(params.id)).unwrap();
  //     // dispatch(getBookingItinerary(result?.[0]?.plane_ticket));
  //     // dispatch(getBookingHotels([result?.[0]?.hotel]));
  //     // dispatch(getBookingCars([result?.[0]?.car_rental]));
  //   };
  //   useEffect(() => {
  //     getItineraryDataHandler();
  //   }, [params]);

  //   const { createdItinerary } = useSelector((state) => state.travel);

  //   const downloadHandler = (file) => {
  //     downloadHandlerFile(file);
  //   };
  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{ bgcolor: "background.paper", mt: 0, borderRadius: "10px" }}
      >
        <Grid item xs={3} sx={{ minHeight: "15rem" }}>
          {createdItinerary?.attachment ? (
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
                onClick={() => downloadHandler(createdItinerary?.attachment)}
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
              {createdItinerary?.airline}
            </Typography>
          </Box>
          {createdItinerary?.details?.map((item, index) => {
            return (
              <Typography variant="body2" sx={{ color: "text.or_color" }}>
                (From {item?.flight_from} - {item?.flight_to})
              </Typography>
            );
          })}
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
                    Ticket number:
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {createdItinerary?.ticket_number}
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
                <Grid item xs={5} mt={-3} alignItems={"right"}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.or_color", textAlign: "right" }}
                  >
                    Frequent flyer number:
                  </Typography>
                </Grid>
                <Grid item xs={3} mt={-3} alignItems="start">
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {createdItinerary?.flyer_number}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={-5.5}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Grid item xs={5} bgcolor={" "}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.or_color", textAlign: "right" }}
                  >
                    Total fare amount:
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="start">
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    ${createdItinerary?.total_fare_amount}
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

export default Airline;
