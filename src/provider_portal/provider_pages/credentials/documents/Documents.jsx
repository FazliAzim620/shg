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
  Tabs,
  Tab,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DocumentsTable from "./DocumentsTable";
import AddEditDocument from "./AddEditDocument";

import Swal from "sweetalert2";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../../components/handleConfirmDelete";
import API from "../../../../API";
import { useSelector } from "react-redux";
import PreviewDocuments from "./PreviewDocuments";

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
const Documents = ({ userId }) => {
  // const { roles } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("edit");
  const [documentTypes, setDocumentTypes] = useState(null);
  const [isTrigger, setIsTrigger] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [versionId, setVersionId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [ipAddress, setIpAddress] = useState("");
  const [deletedFileId, setDeletedFileId] = useState("");
  const getIpAddress = async () => {
    // Fetch the IP address from the API
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data?.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  };
  const confirmStatus = (data) => {
    setChangeStatus(true);
    setSelectedDocumentId(data);
  };
  const confirmDelete = (id) => {
    setDeleteDocument(true);
    setDeletedFileId(id);
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
      if (versionId) {
        handleAddDocumentData.append("id", versionId || "");
      }
      if (data?.document_file) {
        handleAddDocumentData.append("file", data?.document_file || "");
      }
      handleAddDocumentData.append("credentialing_doc_id", selectedDocumentId);
      handleAddDocumentData.append("expiry", data?.expiry_date);
      handleAddDocumentData.append("issue_date", data?.issue_date);
      handleAddDocumentData.append("ip", ipAddress);
      handleAddDocumentData.append(
        "for_provider_user_id",
        userId ? userId : user?.user?.id
      );

      const response = await API.post(
        "/api/upload-prov-cred-doc",
        handleAddDocumentData
      );

      if (response?.data?.success) {
        setIsTrigger(!isTrigger);
        setDrawerOpen(false);
        Swal.fire({
          title: versionId ? "Document updated" : "Document Added!",
          text:
            response?.data?.msg || "The document has been added successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setIsLoading(false);
        setVersionId(null);
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
        `/api/delete-prov-cred-doc/${deletedFileId}`
      );

      if (response.data?.success) {
        Swal.fire({
          title: "Deleted!",
          text:
            response?.data?.msg ||
            "The document has been successfully deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setIsTrigger(!isTrigger);
        closeModal();
      } else {
        closeModal();
        Swal.fire({
          title: "Error!",
          text:
            response?.data?.msg ||
            "There was an issue deleting the document. Please try again later.",
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
          error.response?.data?.msg ||
          "An unexpected error occurred while deleting the document. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
      setDrawerOpen(false);
    }
  };

  const openAddHandler = (data) => {
    setDrawerMode("add");
    setDrawerOpen(true);
    setSelectedDocument();
    setSelectedDocumentId(data?.id);
    setSelectedDocument(data);
  };
  const openEditHandler = (data) => {
    setDrawerMode("edit");
    setDrawerOpen(true);
    setSelectedDocument(data);
    setSelectedDocumentId(data?.id);
    setVersionId(data?.versionId);
  };
  const viewDetailsHandler = (data) => {
    setDrawerMode("view");
    setDrawerOpen(true);
    setSelectedDocument(data);
  };
  const getDocumentTypesHandler = async () => {
    try {
      const resp = await API.get(
        // `/api/get-prov-cred-docs?for_provider_user_id=${
        `/api/get-cred-docs?provider_user_id=${
          userId ? userId : user?.user?.id
        }&is_required=${tabValue == 0 ? 1 : "0"}`
      );
      if (resp?.data?.success) {
        setDocumentTypes(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDocumentTypesHandler();
    getIpAddress();
  }, [tabValue]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box>
      <AddEditDocument
        open={drawerMode !== "view" && drawerOpen}
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
      <PreviewDocuments
        open={drawerMode == "view" && drawerOpen}
        mode={"drawerMode"}
        data={selectedDocument}
        isLoading={isLoading}
        documentTypes={documentTypes}
        openAddHandler={openAddHandler}
        onClose={() => setDrawerOpen(false)}
        openEditHandler={openEditHandler}
        userId={userId}
        setIsTrigger={setIsTrigger}
        confirmDelete={confirmDelete}
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
            {tabValue == 0 ? "Mandatory documents" : "Optional documents"}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mt: "24px", mx: 3 }}
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textTransform: "capitalize",
                  fontSize: "14px",
                  fontWeight: 600,
                  color:
                    tabValue !== 0 && darkMode == "dark"
                      ? "rgba(255, 255, 255, .7)"
                      : " rgba(109, 74, 150, 1)",
                }}
              >
                Mandatory documents
              </Typography>
            </Box>
          }
          {...a11yProps(0)}
          sx={{ pb: 2.25 }}
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textTransform: "capitalize",
                  fontSize: "14px",
                  fontWeight: 600,
                  color:
                    tabValue !== 0 && darkMode == "dark"
                      ? "rgba(255, 255, 255, .7)"
                      : "rgba(109, 74, 150, 1)",
                }}
              >
                Optional documents
              </Typography>
            </Box>
          }
          {...a11yProps(0)}
          sx={{ pb: 2.25 }}
        />
      </Tabs>
      <Divider sx={{ mx: 3 }} />
      <Box sx={{ p: "24px" }}>
        <DocumentsTable
          openEditHandler={openEditHandler}
          openAddHandler={openAddHandler}
          confirmStatus={confirmStatus}
          confirmDelete={confirmDelete}
          viewDetailsHandler={viewDetailsHandler}
          trigger={isTrigger}
          tabValue={tabValue}
          userId={userId}
          // changeOccure={changeOccure}
        />
      </Box>
    </Box>
  );
};

export default Documents;
