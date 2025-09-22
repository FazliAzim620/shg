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

import React, { useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DocumentsTable from "./DocumentsTable";
// import AddEditDocument from "./AddEditDocument";

import { selectOptions } from "../../../../util";
import { useSelector } from "react-redux";

import UploadDocument from "./UploadDocument";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../routes/Routes";
import API from "../../../../API";
import Swal from "sweetalert2";
import SystemGeneratedDocuments from "./SystemGeneratedDocuments";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../../components/handleConfirmDelete";
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

const OrganizationDocuments = ({ id, userId }) => {
  const { user } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.mode);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [changeOccure, setChangeOccure] = useState(false);
  const [systemGeneratedDocDeleted, setSystemGeneratedDocDeleted] =
    useState(null);

  const [ipAddress, setIpAddress] = useState("");
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

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
      formData.append("for_provider_user_id", userId ? userId : user?.user?.id);
      formData.append("class", data?.class);
      formData.append("ip", ipAddress);
      formData.append("signature", data?.text_signature || data?.signature);

      const resp = await API.post(`/api/sign-prov-cred-org-doc`, formData);
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
    setUploadDrawerOpen(true);
    setSelectedDocument(data);
    setSelectedDocumentId(data?.id);
  };
  useEffect(() => {
    getIpAddress();
  }, []);
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
            Organization’s documents{" "}
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
      </Box>
      <Divider />

      <Box sx={{ p: "24px" }}>
        {/* <SystemGeneratedDocuments
          confirmDelete={confirmDelete}
          changeOccure={changeOccure}
          setSystemGeneratedDocDeleted={setSystemGeneratedDocDeleted}
        /> */}

        <DocumentsTable
          openEditHandler={openEditHandler}
          confirmStatus={confirmStatus}
          confirmDelete={confirmDelete}
          viewDetailsHandler={viewDetailsHandler}
          changeOccure={changeOccure}
          ipAddress={ipAddress}
          id={id}
          userId={userId}
        />
      </Box>
      <UploadDocument
        open={uploadDrawerOpen}
        mode={drawerMode}
        data={selectedDocument}
        isLoading={isLoading}
        onClose={() => {
          setUploadDrawerOpen(false);
          setIsLoading(false);
          setSelectedDocument(null);
        }}
        onSave={(data) => {
          uploadDocumentHandler(data);
        }}
        userId={userId}
      />
    </Box>
  );
};

export default OrganizationDocuments;
