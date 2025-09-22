import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MoreVert } from "@mui/icons-material";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../components/handleConfirmDelete";
import { DeleteConfirmModal as ConfirmDuplicateModal } from "../../../components/handleConfirmDelete";
import { capitalizeFirstLetter } from "../../../util";
// import PeerReferenceViewDrawer from "./PeerReferenceViewDrawer";

const NotificationCard = ({ data, onDuplicate, onDelete, onView }) => {
  // State for menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [deleteNotification, setDeleteNotification] = useState(false);
  const [duplicateNotification, setDuplicateNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const confirmDelete = () => {
    setDeleteNotification(true);
  };
  const confirmDuplicate = () => {
    setDuplicateNotification(true);
  };
  const closeModal = () => {
    // setChangeStatus(false);
    setDuplicateNotification(false);
    setDeleteNotification(false);
    setIsLoading(false);
    // setSelectedDocument(null);
  };
  // Handle menu open
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const deleteNotificationHandler = () => {
    setIsLoading(true);
    onDelete(data);
  };
  const duplicateNotificationHandler = () => {
    setIsLoading(true);
    onDuplicate(data);
  };
  const viewFormDetails = (data) => {
    setIsViewOpen(!isViewOpen);
    onView(data);
  };
  const onClose = () => {
    setIsViewOpen(!isViewOpen);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        // p: "0px 24px 0px 24px",
      }}
    >
      <ConfirmDuplicateModal
        isOpen={duplicateNotification}
        onClose={closeModal}
        onConfirm={duplicateNotificationHandler}
        isLoading={isLoading}
        title={"Duplicate notification?"}
        action={"Duplicate "}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1.5rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to duplicate this form?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              This action will create a copy of the notification. Do you want to
              proceed with duplication?
            </Typography>
          </Box>
        }
      />
      <ConfirmRoleModal
        isOpen={deleteNotification}
        onClose={closeModal}
        onConfirm={deleteNotificationHandler}
        isLoading={isLoading}
        title={"Delete notification?"}
        action={"Delete "}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1.5rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to delete this notification?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              This will remove the notification permanently. This action cannot
              be undone. Are you sure you want to proceed?
            </Typography>
          </Box>
        }
      />

      <Box
        sx={{
          p: "16px 12px",
          border: "1px solid rgba(228, 231, 236, 1)",
          width: "100%",
          borderRadius: "8px",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            px: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "capitalize",
                  color: "text.black",
                }}
              >
                {capitalizeFirstLetter(data?.title)}{" "}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  fontSize: "12.3px",
                  color: "rgba(103, 119, 136, 1)",
                }}
              >
                {data?.desc}
              </Typography>
            </Box>
            <IconButton
              sx={{ p: 0, mr: -1 }}
              onClick={handleMenuClick}
              aria-controls={open ? "reference-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="reference-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "more-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  viewFormDetails(data);
                }}
                sx={{
                  gap: 1,
                  color: "text.black",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                }}
                sx={{
                  gap: 1,
                  color: "text.black",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  confirmDuplicate(data);
                }}
                sx={{
                  gap: 1,
                  color: "text.black",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Duplicate
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  confirmDelete(data);
                }}
                sx={{
                  gap: 1,
                  color: "text.error",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default NotificationCard;
