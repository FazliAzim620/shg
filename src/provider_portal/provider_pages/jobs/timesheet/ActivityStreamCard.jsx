import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  useTheme,
  Skeleton,
} from "@mui/material";
// import CustomChip from "@/components/ui/CustomChip";

import { useSelector } from "react-redux";
import CustomChip from "../../../../components/CustomChip";

const ActivityStreamCard = ({ timesheetData, weekData, isLoading }) => {
  const theme = useTheme();
  const darkMode = useSelector((state) => state.theme.mode);

  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const grouped = {};
    activities.forEach((activity) => {
      const date = new Date(activity.created_at);
      const dateKey = date
        .toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
        .toUpperCase();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    return grouped;
  };

  // Format time from datetime string
  const formatTime = (datetime) => {
    return new Date(datetime)
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  // Remove HTML tags from description
  const stripHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, "");
  };

  const groupedActivities = groupActivitiesByDate(timesheetData || []);
  console.log("weekdata", weekData);
  return (
    <Paper
      elevation={3}
      sx={{
        ml: 1.5,
        borderRadius: "10px",
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
      }}
    >
      {/* Header Section */}
      {isLoading ? (
        <Skeleton height={40} sx={{ mx: 2 }} />
      ) : (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{ fontSize: ".875rem", fontWeight: 600 }}
          >
            Activity stream
          </Typography>
          {weekData?.client_status === "approved_by_client" ? (
            <CustomChip
              dot={true}
              width={0}
              chipText={"Approved by client"}
              color={
                weekData?.client_status === "approved_by_client"
                  ? "rgba(0, 201, 167)"
                  : "black"
              }
              bgcolor={
                weekData?.client_status === "approved_by_client"
                  ? "rgba(0, 201, 167,0.1)"
                  : "lightgray"
              }
            />
          ) : (
            <CustomChip
              dot={true}
              size={10}
              width={40}
              chipText="Submitted by provider"
              color="black"
              bgcolor="#e7e8ec"
            />
          )}
        </Box>
      )}

      <Divider sx={{ opacity: 0.3 }} />

      {/* Activity Stream */}
      <Box sx={{ p: 2 }}>
        {Object.entries(groupedActivities).map(
          ([date, activities], groupIndex) => (
            <Box key={date} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  pb: 3,
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                }}
              >
                {date}
              </Typography>

              {activities.map((activity, idx) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    position: "relative",
                    pt: 2,
                  }}
                >
                  {/* Vertical line */}
                  {idx !== activities.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: ".5rem",
                        top: "3rem",
                        bottom: "-0.3rem",
                        width: "2px",
                        bgcolor:
                          darkMode === "dark"
                            ? "text.or_color"
                            : "rgba(19, 33, 68, .1)",
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Dot */}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor:
                        darkMode === "dark"
                          ? "text.or_color"
                          : "rgba(19, 33, 68, .1)",
                      borderRadius: "50%",
                      zIndex: 2,
                      position: "relative",
                      mr: 2,
                      p: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 3,
                        height: 3,
                        bgcolor: "#132144",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          darkMode === "dark" ? "text.or_color" : "text.black",
                        fontSize: ".875rem",
                        fontWeight: 600,
                      }}
                    >
                      {stripHtmlTags(activity.description)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {formatTime(activity.created_at)}
                    </Typography>
                    {activity.note && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", display: "block" }}
                      >
                        {activity.note}
                      </Typography>
                    )}
                    <Box sx={{ height: "1rem" }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )
        )}
      </Box>

      {/* Footer Section */}
      <Divider sx={{ opacity: 0.3 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Times are shown in the local time zone.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ActivityStreamCard;
