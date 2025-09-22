import React from "react";
import { Box, Typography, Avatar, ListItemAvatar } from "@mui/material";
import { useSelector } from "react-redux";

const ActivityLog = ({ logData }) => {
  const mode = useSelector((state) => state.theme.mode);
  const groupActivitiesByDate = (activities) => {
    const grouped = {};
    activities?.forEach((activity) => {
      const date = activity.created_at.split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    return grouped;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const compareDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Today
    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    }

    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (compareDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }

    // Within a week
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    // More than a week
    //   return new Date(dateString).toLocaleDateString(undefined, {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //   });
    // };
    return new Date(dateString).toLocaleDateString(undefined);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const groupedActivities = groupActivitiesByDate(logData);
  return (
    <Box
      sx={{
        p: "24px 24px 24px 12px ",
        bgcolor: mode === "dark" ? "#1e2022" : "rgba(240, 242, 245, 1)",
        borderRadius: "12px",
      }}
    >
      <Box
        className="thin_slider"
        sx={{
          p: { xs: 1, xl: 2 },
          // bgcolor: mode === "dark" ? "#1e2022" : "rgba(240, 242, 245, 1)",
          borderRadius: "12px",
          overflowY: "auto",
          maxHeight: "600px",
        }}
      >
        {logData?.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 1 }}
          >
            No activities performed.
          </Typography>
        ) : (
          Object.entries(groupedActivities).map(([date, activities]) => (
            <Box key={date} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  display: "block",
                  color: "text.black",
                  // mb: "24px",
                  // my: "1rem",
                }}
              >
                {formatDate(date)}
              </Typography>

              {activities.map((activity, index) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    position: "relative",
                    pt: 2,
                  }}
                >
                  {index !== activities.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: "1rem",
                        top: "4rem",
                        bottom: "0rem",
                        width: "2px",
                        bgcolor: "rgba(19, 33, 68, .1)",
                        zIndex: 1,
                      }}
                    />
                  )}
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(55, 125, 255, 0.1)",
                        color: "rgba(55, 125, 255, 1)",
                      }}
                    >
                      {activity?.causer?.name?.[0]?.toUpperCase()}
                      {/* {activity?.description?.[0].toUpperCase()} */}
                    </Avatar>
                  </ListItemAvatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        gap: 1,
                        // bgcolor: "gray",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: ".875rem",
                          fontWeight: { xs: 500, xl: 600 },
                          color: "text.black",
                          // flex: 1,
                        }}
                      >
                        {activity?.causer?.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {formatTime(activity.created_at)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      Previous Status: {activity.properties.previous_status} →
                      New Status: {activity.properties.updated_status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ActivityLog;
