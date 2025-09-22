import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import API from "../../API";
import DividerWithStartText from "../../components/common/DividerWithStartText";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";

const TravelPreferencesSummary = ({ provider_id, darkMode }) => {
  const [travelPreferences, setTravelPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  // API call to fetch travel preferences
  const getTravelPreferencesData = async () => {
    try {
      const resp = await API.get(
        `/api/get-user-preferences?provider_id=${provider_id}`
      );
      if (resp?.data?.success) {
        setTravelPreferences(resp.data.data);
      }
    } catch (error) {
      console.log("Error fetching travel preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getTravelPreferencesData();
  }, []);
  return (
    <Box>
      {travelPreferences?.length === 0 ? (
        <NodataFoundCard title={"No Travel Preferences found!"} />
      ) : (
        <Box>
          <Card sx={{ boxShadow: "none", mx: 3 }}>
            <CardContent>
              {/* Airline Section */}
              <DividerWithStartText
                text="Airline"
                darkMode={darkMode}
                textCol={1}
                dividerCol={11}
              />

              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 0px",
                      lineHeight: "1.2rem",
                      fontSize: "13px",
                    }}
                  >
                    Preferred Airline
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  {loading ? (
                    <Skeleton height={30} animation="wave" />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "13px",
                      }}
                    >
                      {travelPreferences?.airline_name || "Not specified"}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              {[
                { label: "Reward", key: "airline_reward" },
                { label: "Flight Time Preference", key: "flight_time" },
                {
                  label:
                    "Do you prefer flying in the day before or after your shifts?",
                  key: "flying_shift",
                },
                { label: "Class Preference", key: "class_preference" },
              ].map(({ label, key }, index) => (
                <Grid container spacing={2} mt={1} key={index}>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "13px",
                      }}
                    >
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    {loading ? (
                      <Skeleton height={30} animation="wave" />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.black",
                          p: "10px 0px",
                          lineHeight: "1.2rem",
                          fontSize: "13px",
                        }}
                      >
                        {travelPreferences?.[key] || "No preference"}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ))}

              {/* Car Rental Section */}
              <DividerWithStartText
                text="Car Rental"
                darkMode={darkMode}
                textCol={1.5}
                dividerCol={10.5}
              />

              {[
                { label: "Preferred Car Rental", key: "preferred_car_rental" },
                { label: "Car Reward", key: "car_reward" },
                {
                  label: "Will you have taxi, Uber, or Lyft receipts?",
                  key: "taxi_receipts",
                },
                {
                  label:
                    "Will you need toll reimbursement? (if approved by the client)",
                  key: "toll_reimbursement",
                },
                {
                  label:
                    "Will you need parking reimbursement? (if approved by the client)",
                  key: "parking_reimbursement",
                },
              ].map(({ label, key }, index) => (
                <Grid container spacing={2} mt={1} key={index}>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "13px",
                      }}
                    >
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    {loading ? (
                      <Skeleton height={30} animation="wave" />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.black",
                          p: "10px 0px",
                          lineHeight: "1.2rem",
                          fontSize: "13px",
                        }}
                      >
                        {travelPreferences?.[key] || "Not specified"}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ))}

              {/* Hotel Section */}
              <DividerWithStartText
                text="Hotel"
                darkMode={darkMode}
                textCol={1}
                dividerCol={11}
              />

              {[
                { label: "Preferred Hotel", key: "preferred_hotel" },
                { label: "Hotel Reward", key: "hotel_reward" },
              ].map(({ label, key }, index) => (
                <Grid container spacing={2} mt={1} key={index}>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "13px",
                      }}
                    >
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    {loading ? (
                      <Skeleton height={30} animation="wave" />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.black",
                          p: "10px 0px",
                          lineHeight: "1.2rem",
                          fontSize: "13px",
                        }}
                      >
                        {travelPreferences?.[key] || "Not specified"}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ))}

              {/* Emergency Contact Section */}
              <DividerWithStartText
                text="Emergency Contact"
                darkMode={darkMode}
                textCol={1.7}
                dividerCol={10.3}
              />

              {[
                {
                  label: "Full Name",
                  key: "first_name",
                  concatenate: "last_name",
                },
                { label: "Relationship", key: "relationship" },
                { label: "Contact", key: "phone" },
                { label: "Email", key: "email" },
              ].map(({ label, key, concatenate }, index) => (
                <Grid container spacing={2} mt={1} key={index}>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 0px",
                        lineHeight: "1.2rem",
                        fontSize: "13px",
                      }}
                    >
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    {loading ? (
                      <Skeleton height={30} animation="wave" />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.black",
                          p: "10px 0px",
                          lineHeight: "1.2rem",
                          fontSize: "13px",
                        }}
                      >
                        {concatenate
                          ? `${travelPreferences?.[key] || "Not specified"} ${
                              travelPreferences?.[concatenate] || ""
                            }`
                          : travelPreferences?.[key] || "Not specified"}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default TravelPreferencesSummary;
