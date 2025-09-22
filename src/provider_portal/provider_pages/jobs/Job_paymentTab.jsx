import { FileUploadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux";
import { formatTime } from "../../../util";
import ProviderPaymentTable from "../../provider_components/ProviderPaymentTable";
import { paymentData } from "../../../components/constants/data";

const Job_paymentTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const darkMode = useSelector((state) => state.theme.mode);
  const { schedules, jobId, status } = useSelector(
    (state) => state.shiftSchedules
  );
  //   =========================handleDateChange==========================
  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  //   =========================handleRenderContent=============================
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const day = localDate.toISOString().split("T")[0];

      // Find all events for this day
      const eventsForDay = Object.values(schedules).filter(
        (event) =>
          event.date === day || (day >= event.startDate && day <= event.endDate)
      );

      return (
        <Box
          className="thin_slider"
          sx={{
            maxHeight: "4rem",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {eventsForDay.map((event, index) => (
            <Button
              onClick={() => viewHandler(event)}
              key={index}
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                lineHeight: 1.5,
                bgcolor: "#b1f1fb",
                color: "text.black",
                borderRadius: "8px",
                p: "0.2rem 0rem",
              }}
            >
              {formatTime(event.start_time || event.startTime)} -{" "}
              {formatTime(event.end_time || event.endTime)}
            </Button>
          ))}
        </Box>
      );
    }
  };
  return (
    <>
      <Card
        sx={{
          minHeight: "240px",
          mb: 2,
          mt: 2.7,

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
                Payments
              </Typography>
            </Box>
          }
        />
        <CardContent sx={{ p: 2, pb: 3, overflowY: "auto", minHeight: "30vh" }}>
          {/* ===================contact content================== */}
          <ProviderPaymentTable paymentData={paymentData} />
        </CardContent>
      </Card>
    </>
  );
};

export default Job_paymentTab;
