import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DocumentsTable from "./DocumentsTable";
import AddEditDocument from "./AddEditDocument";

import { selectOptions } from "../../../util";
import { useSelector } from "react-redux";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../components/handleConfirmDelete";
import API from "../../../API";
import Swal from "sweetalert2";
const Documents = () => {
  // const { roles } = useSelector((state) => state.users);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("edit");
  const [documentTypes, setDocumentTypes] = useState(null);
  const [isTrigger, setIsTrigger] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  // For adding a new user
  const handleAddUser = () => {
    setDrawerMode("add");
    setSelectedDocument(null);
    // setSelectedDocumentId(null);
    setDrawerOpen(true);
  };

  // For editing an existing user
  const handleEditDocument = (data) => {
    setDrawerMode("edit");
    setSelectedDocument(data);
    setDrawerOpen(true);
  };
  const confirmStatus = (data) => {
    setChangeStatus(true);
    setSelectedDocumentId(data);
  };
  const confirmDelete = (data) => {
    setDeleteDocument(true);
    setSelectedDocumentId(data?.id);
  };
  const closeModal = () => {
    // setChangeStatus(false);
    setDeleteDocument(false);
    setIsLoading(false);
    // setSelectedDocument(null);
  };
  const addDocumentHandler = async (data) => {
    setIsLoading(true);
    try {
      const handleAddDocumentData = new FormData();
      handleAddDocumentData.append("id", data?.id || "");
      handleAddDocumentData.append("name", data?.document_name);
      handleAddDocumentData.append("doc_type_id", data?.document_type);
      handleAddDocumentData.append("description", data?.description);
      // handleAddDocumentData.append("is_active", data?.status);
      handleAddDocumentData.append("provider_role_ids", data?.roles.join(","));
      handleAddDocumentData.append(
        "has_expiry",
        data?.has_expire === "no" ? 0 : 1
      );
      handleAddDocumentData.append(
        "is_required",
        data?.is_required === "no" ? 0 : 1 || 0
      );

      const response = await API.post(
        "/api/add-cred-doc",
        handleAddDocumentData
      );

      if (response?.data?.success) {
        setIsTrigger(!isTrigger);
        setDrawerOpen(false);
        Swal.fire({
          title: "Document Added!",
          text:
            response?.data?.msg || "The document has been added successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setIsLoading(false);
        // dispatch(fetchUsers());
        // setChangeOccure(!changeOccure);
      } else {
        setIsLoading(false);

        Swal.fire({
          title: "Oops!",
          text:
            response?.data?.msg ||
            "Something went wrong while adding the document.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while adding the document.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const deleteDocumentHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await API.delete(
        `/api/delete-cred-doc/${selectedDocumentId}`
      );

      if (response.data?.success) {
        Swal.fire({
          title: "Success!",
          text:
            response?.data?.msg || "User role has been changed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setIsTrigger(!isTrigger);
        closeModal();
      } else {
        closeModal();
        Swal.fire({
          title: "Error!",
          text: "There was an issue changing the user's status. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      closeModal();
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const openEditHandler = (data) => {
    setDrawerMode("edit");
    setDrawerOpen(true);
    setSelectedDocument(data);
    setSelectedDocumentId(data?.id);
  };
  const viewDetailsHandler = (data) => {
    setDrawerMode("view");
    setDrawerOpen(true);
    setSelectedDocument(data);
  };
  const getDocumentTypesHandler = async () => {
    try {
      const resp = await API.get(`/api/get-cred-doctypes`);
      if (resp?.data?.success) {
        setDocumentTypes(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDocumentTypesHandler();
  }, []);
  return (
    <Box>
      <AddEditDocument
        open={drawerOpen}
        mode={drawerMode}
        data={selectedDocument}
        isLoading={isLoading}
        documentTypes={documentTypes}
        onClose={() => setDrawerOpen(false)}
        onSave={(data) => {
          if (drawerMode === "role") {
            setSelectedRoles(data);
            setChangeRole(true);
          } else {
            addDocumentHandler(data);
          }
        }}
      />
      <ConfirmRoleModal
        isOpen={deleteDocument}
        onClose={closeModal}
        onConfirm={deleteDocumentHandler}
        isLoading={isLoading}
        title={"Delete document type?"}
        action={"Delete "}
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
              Are you sure you want to delete this document type?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              This will remove the document type permanently. This action cannot
              be undone. Are you sure you want to proceed?
            </Typography>
          </Box>
        }
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: "24px" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
          >
            Documents{" "}
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
                Manage and configure all document types used in the system.
                Ensure documents are properly categorized, mapped, and have
                expiration settings defined.
              </Typography>
            }
          >
            <IconButton size="small">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          onClick={handleAddUser}
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
          Define new document
        </Button>
      </Box>
      <Divider />
      <Box sx={{ p: "24px" }}>
        <DocumentsTable
          openEditHandler={openEditHandler}
          confirmStatus={confirmStatus}
          confirmDelete={confirmDelete}
          viewDetailsHandler={viewDetailsHandler}
          trigger={isTrigger}
          // changeOccure={changeOccure}
        />
      </Box>
    </Box>
  );
};

export default Documents;
