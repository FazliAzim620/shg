import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Grid,
  IconButton,
  CircularProgress,
  Divider,
  Paper,
  Tooltip,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { DeleteConfirmModal } from "../../components/handleConfirmDelete";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { fetchExistingFiles, sendFilesToAPI } from "../../api_request";
import API from "../../API";
import { Download } from "@mui/icons-material";
import AttachmentItem, {
  renderFileSection,
  renderSkeleton,
} from "./AttachmentItem";
import { isFileSizeValid } from "../../util";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 700, xl: 800 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

// Placeholder for API call to save files

export const TimesheetTableAttachmentModal = ({
  isOpen,
  setIsOpen,
  shiftId,
}) => {
  const [receipts, setReceipts] = useState({ existing: [], new: [] });
  const [uploadKey, setUploadKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchExistingFiles(shiftId).then((resp) => {
        if (resp?.data?.success) {
          setReceipts({ existing: resp?.data?.data, new: [] });
        }
        setSnackbarOpen(false);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!isSaving) {
      setIsOpen(false);
      setReceipts({ existing: [], new: [] });
    }
  }, [isSaving, setIsOpen]);

  const handleFileUpload = (event) => {
    setErrorMessage("");
    const newFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      file: file,
      isNew: true,
    }));
    if (newFiles && isFileSizeValid(event?.target?.files[0], 2)) {
      setReceipts((prev) => ({ ...prev, new: [...prev.new, ...newFiles] }));
    } else {
      setErrorMessage("File size exceeds the allowed limit of 2MB.");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadKey((prevKey) => prevKey + 1);
  };

  const confirmDeleteAttachment = (fileToRemove) => {
    setFileToDelete(fileToRemove);
    setIsConfirmOpen(true);
  };

  const handleRemoveAttachment = async () => {
    setIsDeleting(true);
    if (!fileToDelete?.id) {
      setReceipts((prev) => ({
        existing: prev.existing.filter((file) => file !== fileToDelete),
        new: prev.new.filter((file) => file !== fileToDelete),
      }));
      setIsConfirmOpen(false);
      setIsDeleting(false);
      return;
    }
    const resp = await API.delete(
      `/api/delete-job-timesheet-detail-attachments/${fileToDelete?.id}`
    );

    try {
      if (resp?.data?.success) {
        setReceipts((prev) => ({
          existing: prev.existing.filter((file) => file !== fileToDelete),
          new: prev.new.filter((file) => file !== fileToDelete),
        }));
        setIsConfirmOpen(false);
        setIsDeleting(false);
      }
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const filesToSend = receipts.new.map((item) => item.file);
      await sendFilesToAPI(filesToSend, shiftId);
      //   handleClose();
      setIsLoading(true);
      fetchExistingFiles(shiftId).then((resp) => {
        if (resp?.data?.success) {
          setReceipts({ existing: resp?.data?.data, new: [] });
        }
        setIsLoading(false);
        setSnackbarOpen(false);
      });
      setSnackbarMessage("Files saved successfully!");

      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving receipts:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-attachment-title"
      >
        <Box sx={style}>
          {snackbarOpen && (
            <Alert
              onClose={handleSnackbarClose}
              severity={"success"}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <CustomTypographyBold>Receipts</CustomTypographyBold>

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              size="small"
              sx={{ textTransform: "none" }}
              disabled={isSaving || isLoading}
            >
              Upload Receipt
              <input
                key={uploadKey}
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              {/* <CircularProgress />
               */}
              {renderSkeleton()}
            </Box>
          ) : (
            <>
              {renderFileSection(
                "New Receipts",
                receipts.new,
                confirmDeleteAttachment
              )}
              <Divider sx={{ my: 3 }} />
              {renderFileSection(
                "Existing Receipts",
                receipts.existing,
                confirmDeleteAttachment
              )}
            </>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.2)",
                padding: "5px 16px",
                minWidth: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  color: "text.main",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isSaving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSaveChanges}
              disabled={receipts.new.length === 0 || isSaving || isLoading}
              size="small"
              sx={{ textTransform: "none" }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleRemoveAttachment}
        isLoading={isDeleting}
        itemName={"Receipt"}
        title={"Delete"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to delete this Receipt?
            <br /> This action cannot be undone.
          </Typography>
        }
      />
    </>
  );
};
