import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import { RefreshOutlined } from "@mui/icons-material";
import announceImage from "../../assets/announce.svg";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import CustomChip from "../../components/CustomChip";
import { useSelector } from "react-redux";

const TimesheetActivity = ({ data, timesheet }) => {
  const currentTimesheet = useSelector(
    (state) => state.currentTimesheet.currentTimesheet
  );

  const darkMode = useSelector((state) => state.theme.mode);

  // Process data from API and group by dates (e.g., "Today", "Yesterday", etc.)
  const groupedActivities = data?.reduce((acc, activity) => {
    const date = new Date(activity.created_at).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  const getStatusMessage = () => {
    const { admin_status, client_status, status } = timesheet;

    if (admin_status === "pending_admin_review") {
      return "This timesheet is awaiting admin review.";
    } else if (admin_status === "approved_by_admin") {
      return "This timesheet has been approved by the admin.";
    } else if (admin_status === "rejected_by_admin") {
      return "This timesheet has been rejected by the admin.";
    } else if (client_status === "pending_client_review") {
      return "This timesheet is awaiting client review.";
    } else if (client_status === "approved_by_client") {
      return "This timesheet has been approved by the client.";
    } else if (client_status === "rejected_by_client") {
      return "This timesheet has been rejected by the client.";
    } else if (status === "resubmission_required") {
      return "This timesheet requires resubmission.";
    } else {
      return "Hi! This timesheet is due for an approval. ";
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(); // Default to regular date format
    }
  };

  return (
    <Box
      sx={{
        minHeight: "50vh",
        overflowX: "hidden",
        mb: 2,
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          bgcolor: "background.paper",
          mt: "5",
          pt: "1rem",
          pb: "1.5rem",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        }}
      >
        <Box
          sx={{ px: 2, pb: 3, display: "flex", alignItems: "center", gap: 2 }}
        >
          <CustomTypographyBold color="text.black" fontSize={"1.1rem"}>
            Timesheet activity
          </CustomTypographyBold>
          <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
            <CustomChip
              dot={true}
              width={
                currentTimesheet?.status === "send" ||
                currentTimesheet?.status === "submitted_by_provider"
                  ? 40
                  : 80
              }
              chipText={
                currentTimesheet?.timesheet_status === "approved_by_admin"
                  ? "Approved by admin"
                  : currentTimesheet?.timesheet_status === "approved_by_client"
                  ? "Approved by client"
                  : currentTimesheet?.timesheet_status === "rejected_by_admin"
                  ? "Rejected by admin"
                  : currentTimesheet?.timesheet_status === "rejected_by_client"
                  ? "Rejected by client"
                  : currentTimesheet?.status === "submitted_by_provider"
                  ? "Submitted by provider"
                  : "Not Submitted"
              }
              color={
                currentTimesheet?.status === "send" ||
                currentTimesheet?.status === "submitted_by_provider"
                  ? currentTimesheet?.timesheet_status === "approved_by_client"
                    ? "white"
                    : currentTimesheet?.timesheet_status ===
                      "submitted_by_provider"
                    ? "black"
                    : currentTimesheet?.timesheet_status ===
                        "rejected_by_client" ||
                      currentTimesheet?.timesheet_status === "rejected_by_admin"
                    ? "white"
                    : "rgba(0, 201, 167)"
                  : "rgba(237, 76, 120)"
              }
              bgcolor={
                currentTimesheet?.status === "send" ||
                currentTimesheet?.status === "submitted_by_provider"
                  ? currentTimesheet?.timesheet_status === "approved_by_client"
                    ? "rgba(0, 201, 167)"
                    : currentTimesheet?.timesheet_status ===
                      "submitted_by_provider"
                    ? "#DEE0E7"
                    : currentTimesheet?.timesheet_status ===
                        "rejected_by_client" ||
                      currentTimesheet?.timesheet_status === "rejected_by_admin"
                    ? "rgba(237, 76, 120)"
                    : "rgba(0, 201, 167, 0.1)"
                  : "rgba(237, 76, 120, 0.1)"
              }
            />
          </Box>
        </Box>
        <Divider sx={{ opacity: 0.5, mb: 2 }} />
        <Box
          sx={{
            bgcolor: "rgba(19, 33, 68, .15)",
            p: 2,
            mx: 2,
            mb: 2,
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            maxWidth: "70%",
          }}
        >
          <Box
            component={"img"}
            src={announceImage}
            alt="announce"
            sx={{ width: 78, height: 78 }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <CustomTypographyBold color="text.black" fontSize={"1.1rem"}>
              Attention!
            </CustomTypographyBold>
            <CustomTypographyBold
              color="text.black"
              fontSize={"0.85rem"}
              weight={400}
            >
              {getStatusMessage()}
            </CustomTypographyBold>
          </Box>
        </Box>

        {data?.length > 0 && (
          <Box sx={{ p: 2 }}>
            {Object?.keys(groupedActivities)?.map((date, index) => (
              <Box key={index} sx={{ mb: 2 }}>
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
                  {formatDate(date)}
                </Typography>

                {/* Render activities for each date */}
                {groupedActivities[date].map((activity, idx) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                      pt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "1rem",
                        top: "4rem",
                        bottom: "-0.3rem",
                        width: "2px",
                        bgcolor:
                          darkMode === "dark"
                            ? "text.or_color"
                            : "rgba(19, 33, 68, .1)",
                        zIndex: 1,
                      }}
                    />

                    <ListItemAvatar>
                      <Avatar src="/path-to-avatar-image.jpg" />
                    </ListItemAvatar>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 6 }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              darkMode === "dark"
                                ? "text.or_color"
                                : "text.black",
                            fontSize: ".875rem",
                            fontWeight: 600,
                          }}
                        >
                          {activity.username}
                        </Typography>

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
                          <p
                            dangerouslySetInnerHTML={{
                              __html: activity.description || "",
                            }}
                          ></p>

                          {/* {activity.note && (
                            <CustomChip
                              dot={true}
                              width={40}
                              chipText={activity.note}
                              color={
                                activity?.action !== "Rejected"
                                  ? "rgba(0, 201, 167)"
                                  : "rgba(237, 76, 120)"
                              }
                              bgcolor={
                                activity?.action !== "Rejected"
                                  ? "rgba(0, 201, 167, 0.1)"
                                  : "rgba(237, 76, 120, 0.1)"
                              }
                            />
                          )} */}
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
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
        {data?.length > 10 && (
          <Box sx={{ textAlign: "center", mt: 2, maxWidth: "500px", ml: 3 }}>
            <Button
              variant="outlined"
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(231, 234, 243, .7)",
                padding: ".6125rem 1rem",
                minWidth: 0,
                width: "100%",
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "background.paper",
                  border: "1px solid rgba(231, 234, 243, .7)",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  color: "text.main",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <RefreshOutlined sx={{ fontSize: "1rem", mr: 1 }} /> Load more
              activities
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TimesheetActivity;
