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
  styled,
  Tabs,
  Tab,
} from "@mui/material";

import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DocumentsTable from "./DocumentsTable";
// import AddEditDocument from "./AddEditDocument";

import { selectOptions } from "../../../util";
import { useSelector } from "react-redux";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../components/handleConfirmDelete";
import UploadDocument from "./UploadDocument";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes/Routes";
import API from "../../../API";
import Swal from "sweetalert2";
import SystemGeneratedDocuments from "./SystemGeneratedDocuments";
// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OrganizationDocuments = () => {
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.users);
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
  console.log("providerRolesList", providerRolesList);
  const darkMode = useSelector((state) => state.mode);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [changeOccure, setChangeOccure] = useState(false);
  const [systemGeneratedDocDeleted, setSystemGeneratedDocDeleted] =
    useState(null);

  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // For adding a new document
  const handleAddDocument = () => {
    navigate(ROUTES.organizationForm, {
      state: {
        from: "organization’s documents ",
        active: "OrganizationDocuments",
      },
    });
  };

  // For editing an existing user
  const handleEditDocument = (data) => {
    setDrawerMode("edit");
    setSelectedDocument(data);
    setDrawerOpen(true);
  };
  const confirmStatus = (curr_user) => {
    setChangeStatus(true);
    // setUser(curr_user);
  };
  const confirmDelete = (document, location = null) => {
    console.log(document);
    setDeleteDocument(true);
    setSelectedDocumentId(document?.id);
    setSystemGeneratedDocDeleted(location);
  };
  const closeModal = () => {
    // setChangeStatus(false);
    setDeleteDocument(false);
    setIsLoading(false);
    // setSelectedDocument(null);
  };
  const uploadDocumentHandler = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", data?.id || "");
      formData.append("provider_role_ids", data?.roles?.join(","));
      formData.append("name", data?.document_name);
      formData.append("description", data?.description);
      formData.append("purpose", data?.purpose);
      if (data?.document_file) {
        formData.append("file", data?.document_file || "");
      }
      const resp = await API.post(`/api/add-cred-org-upload-doc`, formData);
      if (resp?.data?.success) {
        setIsLoading(false);
        setUploadDrawerOpen(false);
        setChangeOccure(!changeOccure);
        Swal.fire({
          title: "Document Added!",
          text: resp?.data?.msg || "The document has been added successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.log(error);
    }
    console.log("uploaded data", data);
  };

  const deleteDocumentHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await API.delete(
        systemGeneratedDocDeleted
          ? `/api/delete-cred-org-generated-doc/${selectedDocumentId}`
          : `/api/delete-cred-org-upload-doc/${selectedDocumentId}`
      );

      if (response.data?.success) {
        Swal.fire({
          title: "Success!",
          text: response?.data?.msg || "Document deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        setChangeOccure(!changeOccure);
        closeModal();
      } else {
        closeModal();
        Swal.fire({
          title: "Error!",
          text: "There was an issue deleting the document. Please try again later.",
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
    setUploadDrawerOpen(true);
    setSelectedDocument(data);
    setSelectedDocumentId(data?.id);
  };
  const viewDetailsHandler = (data) => {
    setDrawerMode("view");
    setDrawerOpen(true);
    setSelectedDocument(data);
  };
  return (
    <Box>
      {/* <AddEditDocument
        open={drawerOpen}
        mode={drawerMode}
        data={selectedDocument}
        isLoading={isLoading}
        rolesList={selectOptions(
          roles?.roles?.filter(
            (item) => item?.name !== "provider" && item?.name !== "Super Admin"
          )
        )}
        onClose={() => setDrawerOpen(false)}
        onSave={(data) => {
          if (drawerMode === "role") {
            setSelectedRoles(data);
            setChangeRole(true);
          } else {
            addDocumentHandler(data);
          }
        }}
      /> */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            sx={{ p: "8px 16px", textTransform: "none" }}
          >
            Upload & define document{" "}
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button> */}
          <Button
            onClick={() => {
              setUploadDrawerOpen(true);
              setDrawerMode("add");
            }}
            variant="contained"
            sx={{
              bgcolor: "rgba(55, 125, 255, 0.1)",
              color: "text.btn_blue",
              textTransform: "none",
              outline: "none",
              p: "8px 16px",
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: "150%",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                bgcolor: "rgba(55, 125, 255, 0.1)",
              },
            }}
          >
            Upload & define document{" "}
          </Button>
          <Button
            onClick={handleAddDocument}
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
            Create new document
          </Button>
        </Box>
      </Box>
      <Divider />
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="documents tabs"
        sx={{ p: "24px" }}
      >
        <Tab
          label={
            <Typography
              variant="h6"
              sx={{
                textTransform: "capitalize",
                fontSize: "14px",
                fontWeight: 600,
                color:
                  value !== 1 && darkMode == "dark"
                    ? "rgba(255, 255, 255, .7)"
                    : "text.primary",
              }}
            >
              System generated documents{" "}
            </Typography>
          }
          {...a11yProps(0)}
          sx={{
            textTransform: "capitalize",
            fontSize: "14px",
            fontWeight: 400,
            color: darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#132144",
            pb: 2.25,
          }}
        />
        <Tab
          label={
            <Typography
              variant="h6"
              sx={{
                textTransform: "capitalize",
                fontSize: "14px",
                fontWeight: 600,
                color:
                  value !== 1 && darkMode == "dark"
                    ? "rgba(255, 255, 255, .7)"
                    : "text.primary",
              }}
            >
              Uploaded documents
            </Typography>
          }
          {...a11yProps(1)}
          sx={{
            textTransform: "capitalize",
            fontSize: "14px",
            fontWeight: 400,
            color: darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#132144",
            pb: 2.25,
          }}
        />
      </Tabs>
      <Divider />
      <Box sx={{ p: "24px" }}>
        {value === 0 ? (
          <SystemGeneratedDocuments
            confirmDelete={confirmDelete}
            changeOccure={changeOccure}
            setSystemGeneratedDocDeleted={setSystemGeneratedDocDeleted}
          />
        ) : (
          ""
        )}
        {value === 1 ? (
          <DocumentsTable
            openEditHandler={openEditHandler}
            confirmStatus={confirmStatus}
            confirmDelete={confirmDelete}
            viewDetailsHandler={viewDetailsHandler}
            changeOccure={changeOccure}
          />
        ) : (
          ""
        )}
      </Box>
      <UploadDocument
        open={uploadDrawerOpen}
        mode={drawerMode}
        data={selectedDocument}
        isLoading={isLoading}
        rolesList={selectOptions(providerRolesList)}
        onClose={() => {
          setUploadDrawerOpen(false);
          setIsLoading(false);
          setSelectedDocument(null);
        }}
        onSave={(data) => {
          uploadDocumentHandler(data);
        }}
      />
    </Box>
  );
};

export default OrganizationDocuments;
