import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getItineraryData } from "../../../thunkOperation/job_management/providerInfoStep";
import { getBookingHotels } from "../../../feature/hotelBookingSlice";
import { getBookingCars } from "../../../feature/carRentalBooking";
import { SaveAltOutlined } from "@mui/icons-material";
import { getBookingItinerary } from "../../../feature/travelSlice";
import { downloadHandlerFile } from "../../../util";
import NodataFoundCard from "../../provider_components/NodataFoundCard";
import NoFileUploaded from "../../../components/common/NoFileUploaded";

const Airline = ({ other }) => {
  console.log("syfgewf", other);
  const params = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getItineraryDataHandler = async () => {
    try {
      const result = await dispatch(getItineraryData(params.id)).unwrap();
      dispatch(getBookingItinerary(result?.[0]?.plane_ticket));
      dispatch(getBookingHotels([result?.[0]?.hotel]));
      dispatch(getBookingCars([result?.[0]?.car_rental]));
    } catch (error) {
      console.error("Error fetching itinerary data:", error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

  useEffect(() => {
    if (!other) {
      getItineraryDataHandler();
    }
  }, [params]);

  const { createdItinerary } = useSelector((state) => state.travel);

  const downloadHandler = (file) => {
    downloadHandlerFile(file);
  };

  if (!other) {
    if (loading) {
      return <Skeleton />;
    }
  }
  return (
    <>
      {!createdItinerary ? (
        <NodataFoundCard />
      ) : (
        <Box>
          <Grid container spacing={2}>
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
                    onClick={() =>
                      downloadHandler(createdItinerary?.attachment)
                    }
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
              {createdItinerary?.details?.map((item, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: "text.or_color" }}
                >
                  (From {item?.flight_from} - {item?.flight_to})
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column" spacing={1}>
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: "flex", justifyContent: "end" }}
                  >
                    <Grid item xs={5}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.or_color", textAlign: "right" }}
                      >
                        Ticket number:
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
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
                    <Grid item xs={5}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.or_color", textAlign: "right" }}
                      >
                        Frequent flyer number:
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {createdItinerary?.flyer_number}
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
                    <Grid item xs={5}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.or_color", textAlign: "right" }}
                      >
                        Total fare amount:
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        ${createdItinerary?.total_fare_amount}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Airline;
