import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Close, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../../util";
import FormPreview from "./FormPreview";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../../components/handleConfirmDelete";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
import Swal from "sweetalert2";
import API from "../../../../API";
import CustomChip from "../../../../components/CustomChip";
import FormDrawer from "./FormDrawer";

const UploadDocument = ({
  open,
  onClose,
  mode,
  data,
  reloadData,
  ipAddress,
  userId,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const closeHandler = () => onClose();

  // State for selected version index
  const [selectedVersion, setSelectedVersion] = useState(
    data?.submitted_forms?.length - 1 || 0
  );

  const selectedForm =
    data?.submitted_forms?.[selectedVersion]?.json_structure || "{}";

  // State for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuVersionIndex, setMenuVersionIndex] = useState(null);

  // State for modals and actions
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuVersionIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuVersionIndex(null);
  };

  const handleAction = (action) => {
    const selectedFormData = data?.submitted_forms?.[menuVersionIndex];

    switch (action) {
      case "edit":
        setIsEdit(true);
        handleMenuClose();
        break;
      case "approve":
        setApproveModalOpen(true);
        handleMenuClose();
        break;
      case "reject":
        setRejectModalOpen(true);
        handleMenuClose();
        break;
      case "delete":
        setDeleteModalOpen(true);
        handleMenuClose();
        break;
      default:
        handleMenuClose();
    }
  };

  const handleDeleteDocument = async () => {
    setIsLoading(true);
    try {
      const selectedFormData = data?.submitted_forms?.[menuVersionIndex];
      const response = await API.delete(
        `/api/admin/credentialing/delete-form-submission/${data?.submitted_forms?.[selectedVersion]?.id}`
      );
      if (response.data.success) {
        if (reloadData) {
          await reloadData();
        }
        Swal.fire({
          icon: "success",
          title: "Document Deleted",
          text: "The document has been successfully deleted.",
        });
        onClose(); // Close the drawer after successful deletion
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete document.",
      });
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      closeHandler();
    }
  };

  const handleApproveDocument = async () => {
    setIsLoading(true);
    try {
      const selectedFormData = data?.submitted_forms?.[menuVersionIndex];
      const response = await API.post(
        `api/admin/credentialing/update-form-submission-status`,
        {
          submission_id: data?.submitted_forms?.[selectedVersion]?.id,
          admin_status: 1,
          admin_notes: notes,
        }
      );

      if (response.data.success) {
        if (reloadData) {
          await reloadData();
        }
        Swal.fire({
          icon: "success",
          title: "Document Approved",
          text:
            response?.data?.msg ||
            "The document has been successfully approved.",
        });
        setNotes(""); // Reset notes
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.msg || "Failed to approve document.",
      });
    } finally {
      setIsLoading(false);
      setApproveModalOpen(false);
      closeHandler();
    }
  };

  const handleRejectDocument = async () => {
    setIsLoading(true);
    try {
      const selectedFormData = data?.submitted_forms?.[menuVersionIndex];
      const response = await API.post(
        `api/admin/credentialing/update-form-submission-status`,
        {
          submission_id: data?.submitted_forms?.[selectedVersion]?.id,
          admin_status: 2,
          admin_notes: notes,
        }
      );
      if (response.data.success) {
        if (reloadData) {
          await reloadData();
        }
        Swal.fire({
          icon: "success",
          title: "Document Rejected",
          text: "The document has been successfully rejected.",
        });
        setNotes(""); // Reset notes
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.msg || "Failed to reject document.",
      });
    } finally {
      setIsLoading(false);
      setRejectModalOpen(false);
      closeHandler();
    }
  };
  const handleCloseEditDrawer = () => {
    setIsEdit(false);
    closeHandler();
  };
  if (isEdit) {
    return (
      <FormDrawer
        open={isEdit}
        onClose={handleCloseEditDrawer}
        jsonStructure={JSON.parse(data?.json_structure)}
        documentName={data?.name}
        selectedId={data?.id}
        name={data?.name}
        formId={data?.submitted_forms?.[data?.submitted_forms?.length - 1]?.id}
        reloadData={reloadData}
        ipAddress={ipAddress}
        userId={userId}
        selectedForm={
          data?.submitted_forms?.[selectedVersion]
            ? JSON.parse(
                data?.submitted_forms?.[selectedVersion]?.json_structure
              )
            : ""
        }
      />
    );
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeHandler}
      sx={{
        "& .MuiDrawer-paper": {
          width: isMobile ? "100%" : "90vw",
          maxWidth: "1200px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            px: 4,
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {capitalizeFirstLetter(data?.name || "Document Preview")}
          </Typography>
          <IconButton onClick={closeHandler}>
            <Close />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* Left: Version List */}
          {data?.submitted_forms?.length > 0 &&
            data?.has_multiple_submissions && (
              <Box
                sx={{
                  width: "240px",
                  borderRight: "1px solid rgba(0,0,0,0.1)",
                  overflowY: "auto",
                  backgroundColor: "background.default",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    p: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  Versions
                </Typography>
                <List dense>
                  {data.submitted_forms.map((form, index) => (
                    <ListItem
                      key={form.id}
                      disablePadding
                      secondaryAction={
                        data?.has_multiple_submissions ? (
                          <IconButton
                            edge="end"
                            onClick={(e) => handleMenuOpen(e, index)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        ) : (
                          ""
                        )
                      }
                    >
                      <ListItemButton
                        selected={index === selectedVersion}
                        onClick={() => setSelectedVersion(index)}
                      >
                        <ListItemText
                          primary={`Version ${index + 1}`}
                          secondary={
                            form.created_at
                              ? new Date(form.created_at).toLocaleString()
                              : ""
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                {/* Action Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => handleAction("edit")}>Edit</MenuItem>
                  <MenuItem onClick={() => handleAction("approve")}>
                    Approve
                  </MenuItem>
                  <MenuItem onClick={() => handleAction("reject")}>
                    Reject
                  </MenuItem>
                  <MenuItem onClick={() => handleAction("delete")}>
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            )}

          {/* Right: Form Preview */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Form Preview
              </Typography>
              <CustomChip
                dot
                width={40}
                dotColor={
                  data?.submitted_forms?.[selectedVersion]?.admin_status === 1
                    ? "rgba(0, 201, 167, 1)"
                    : data?.submitted_forms?.[selectedVersion]?.admin_status ===
                      2
                    ? "#DC3545"
                    : "rgba(255, 193, 7, 1)"
                }
                chipText={
                  data?.submitted_forms?.[selectedVersion]?.admin_status === 1
                    ? "Approved"
                    : data?.submitted_forms?.[selectedVersion]?.admin_status ===
                      2
                    ? "Rejected"
                    : "Pending"
                }
                color="rgba(103, 119, 136, 1)"
                bgcolor={
                  data?.submitted_forms?.[selectedVersion]?.admin_status === 1
                    ? "rgba(0, 201, 167, 0.1)"
                    : data?.submitted_forms?.[selectedVersion]?.admin_status ===
                      0
                    ? "rgba(237, 76, 120, 0.1)"
                    : "rgba(255, 193, 7, 0.1)"
                }
              />
            </Box>
            <Box sx={{ width: "100%", minHeight: 400 }}>
              {data?.json_structure ? (
                <FormPreview
                  data={JSON.parse(data.json_structure)}
                  editData={JSON.parse(selectedForm)}
                  readonly={mode === "view"}
                  name={data?.name}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2">
                    No form data available to preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "background.paper",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={closeHandler}>
              Close
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Confirmation Modals */}
      <ConfirmRoleModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteDocument}
        isLoading={isLoading}
        title={"Delete Document"}
        action={"Delete"}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to delete this document version?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              Deleting this document version will permanently remove it and all
              associated data. This action cannot be undone. Are you sure you
              want to proceed?
            </Typography>
          </Box>
        }
      />

      <ConfirmRoleModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveDocument}
        isLoading={isLoading}
        title={"Approve Document"}
        action={"Approve"}
        bgcolor={"rgba(55, 125, 255)"}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to approve this document version?
            </Typography>

            <CommonInputField
              name="status_notes"
              placeholder={`Provide a brief note or reason for approving the document...`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              error={!notes}
            />
          </Box>
        }
      />

      <ConfirmRoleModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectDocument}
        isLoading={isLoading}
        title={"Reject Document"}
        action={"Reject"}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to reject this document version?
            </Typography>

            <CommonInputField
              name="status_notes"
              placeholder={`Provide a brief note or reason for rejecting the document...`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              error={!notes}
            />
          </Box>
        }
      />
    </Drawer>
  );
};

export default UploadDocument;
