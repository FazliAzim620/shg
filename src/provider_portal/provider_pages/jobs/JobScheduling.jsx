import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchShiftSchedules } from "../../../thunkOperation/job_management/providerInfoStep";
import { useParams } from "react-router-dom";
import MyCalendar from "../../provider_components/schedular/schedularTab1/MyCalendar";
import { setCurrentJobNull } from "../../../feature/providerPortal/currentJobSlice";

// Assuming you've already set up the localizer

const JobScheduling = () => {
  const { schedules } = useSelector((state) => state.shiftSchedules);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(fetchShiftSchedules(params?.id));
  }, [dispatch]);
  return (
    <>
      <Card
        sx={{
          mt: 2.7,
          mb: 2,
          borderRadius: ".75rem",
          backgroundColor: "text.paper",
          boxShadow: "none",
        }}
      >
        <CardHeader
          sx={{
            pb: 0.5,
            borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
          }}
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  lineHeight: 2,
                  color: "text.black",
                }}
              >
                Scheduling
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <MyCalendar schedularData={schedules || []} myJobs={true} />
        </CardContent>
      </Card>
    </>
  );
};

export default JobScheduling;
