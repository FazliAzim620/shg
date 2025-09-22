import { Add, InfoOutlined, PlusOne } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import NotificationCard from "./NotificationCard";
import AddEditDrawer from "./AddEditDrawer";
import ActivityLog from "./ActivityLog";

const NotificationsConfiguration = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleAddNotification = () => {
    setDrawerMode("add");
    setSelectedDocument(null);
    // setSelectedDocumentId(null);
    setDrawerOpen(true);
  };
  const data = [
    {
      title: "  Approved staff members notification",
      desc: "  The system will send this email to a provider when staff have passed the approval step of the onboarding.",
    },
    {
      title: "   members notification",
      desc: "  The system will send this email to a provider when staff have passed the approval step of the onboarding.",
    },
    {
      title: " admin  notification",
      desc: "  The system will send this email to a provider when staff have passed the approval step of the onboarding.",
    },
  ];
  const handleDeleteNotification = (notificationData) => {
    // Handle the delete logic here
    console.log("Delete notification:", notificationData);
  };

  const handleDuplicateNotification = (notificationData) => {
    // Handle the duplicate logic here
    console.log("Duplicate notification:", notificationData);
  };
  const addEditHandler = (data) => {
    console.log("data", data);
  };
  const viewHandler = (data) => {
    setDrawerOpen(!drawerOpen);
    setDrawerMode("view");
    console.log("data", data);
  };
  const closeDrawerHandler = () => {
    setDrawerOpen(!drawerOpen);
  };
  const dummyData = [
    {
      id: 5,
      created_at: "2025-02-14T10:00:00Z",
      username: "John Doe",
      description: "Created a new timesheet entry.",
      note: "Pending approval",
      action: "Created",
    },
    {
      id: 1,
      created_at: "2025-02-13T10:00:00Z",
      username: "John Doe",
      description: "Created a new timesheet entry.",
      note: "Pending approval",
      action: "Created",
    },
    {
      id: 2,
      created_at: "2025-02-13T14:30:00Z",
      username: "Jane Smith",
      description: "Submitted the timesheet.",
      note: "Awaiting client review",
      action: "Submitted",
    },
    {
      id: 3,
      created_at: "2025-02-12T09:00:00Z",
      username: "Tommy Lee",
      description: "Approved by admin.",
      note: "Approved by admin",
      action: "Approved",
    },
    {
      id: 4,
      created_at: "2025-02-11T15:00:00Z",
      username: "Alice Brown",
      description: "Rejected by client.",
      note: "Rejected by client",
      action: "Rejected",
    },
    {
      id: 6,
      created_at: "2025-02-12T15:00:00Z",
      username: "Alice Brown",
      description: "Rejected by client.",
      note: "Rejected by client",
      action: "Rejected",
    },
  ];
  return (
    <Box sx={{}}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: "24px" }}
      >
        <AddEditDrawer
          open={drawerOpen}
          onClose={closeDrawerHandler}
          onSave={addEditHandler}
          initialData={null}
          mode={drawerMode}
          isEdit={drawerMode === "edit"}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
          >
            Notifications configuration{" "}
          </Typography>
          <Tooltip
            arrow
            placement="top"
            title={
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "300px",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: "#ffffff",
                }}
              >
                Here you can configure email text for providers.Provider will
                receive an update email only when you save it.
              </Typography>
            }
          >
            <IconButton size="small">
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          onClick={handleAddNotification}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            outline: "none",
            p: "8px 16px",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "150%",
          }}
        >
          <Add sx={{ fontSize: "1rem" }} /> Add new{" "}
        </Button>
      </Box>
      <Divider />
      <Box sx={{ p: "24px" }}>
        {data?.map((item, index) => {
          return (
            <NotificationCard
              key={index}
              data={item}
              onView={viewHandler}
              onDelete={handleDeleteNotification}
              onDuplicate={handleDuplicateNotification}
            />
          );
        })}
      </Box>

      <ActivityLog data={dummyData} />
    </Box>
  );
};

export default NotificationsConfiguration;
