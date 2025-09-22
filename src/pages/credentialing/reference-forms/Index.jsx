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
// import AddEditDocument from "./AddEditDocument";

import { selectOptions } from "../../../util";
import { useSelector } from "react-redux";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../components/handleConfirmDelete";

import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes/Routes";
import FormsTable from "./FormsTable";
import PeerReferenceBox from "./PeerReferenceBox";
import Swal from "sweetalert2";
import API from "../../../API";
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
  const darkMode = useSelector((state) => state.mode);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("edit");
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [value, setValue] = React.useState(0);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [isTrigger, setIsTrigger] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // For adding a new document
  const handleAddForm = () => {
    navigate(ROUTES.referenceForm, {
      state: {
        from: "Reference Form",
        active: "ReferenceForms",
        btn: "reference",
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
  const confirmDelete = (data) => {
    setDeleteDocument(true);
    setSelectedDocumentId(data?.id);
  };
  const closeModal = () => {
    // setChangeStatus(false);
    setDeleteForm(false);
    setIsLoading(false);
    setDeleteDocument(false);
    // setSelectedDocument(null);
  };
  const uploadDocumentHandler = async (data) => {
    console.log("uploaded data", data);
  };
  const addDocumentHandler = async (data) => {
    setIsLoading(true);
    console.log("data", data);
    // try {
    //   const roleIds = data?.roles;

    //   const roleNames = roleIds
    //     .map((roleId) => {
    //       const role = roles?.roles.find((r) => r.id === roleId);
    //       return role ? role.name : null;
    //     })
    //     .filter((name) => name);

    //   const handleAddUserData = new FormData();
    //   handleAddUserData.append("first_name", data?.firstName);
    //   handleAddUserData.append("last_name", data?.lastName);
    //   handleAddUserData.append("email", data?.email);
    //   handleAddUserData.append("role", roleNames.join(","));

    //   const response = await API.post("/api/add-user", handleAddUserData);

    //   if (response?.data?.success) {
    //     setDrawerOpen(false);
    //     Swal.fire({
    //       title: "User Added!",
    //       text: "The user has been added successfully.",
    //       icon: "success",
    //       confirmButtonText: "Okay",
    //     });
    //     setIsLoading(false);
    //     dispatch(fetchUsers());
    //     setChangeOccure(!changeOccure);
    //   } else {
    //     setIsLoading(false);

    //     Swal.fire({
    //       title: "Oops!",
    //       text:
    //         response?.data?.msg ||
    //         "Something went wrong while adding the user.",
    //       icon: "error",
    //       confirmButtonText: "Try Again",
    //     });
    //   }
    // } catch (error) {
    //   setIsLoading(false);
    //   console.log(error);
    //   Swal.fire({
    //     title: "Error!",
    //     text:
    //       error?.response?.data?.msg ||
    //       "There was an error while adding the user.",
    //     icon: "error",
    //     confirmButtonText: "Try Again",
    //   });
    // }
  };

  const deleteDocumentHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await API.delete(
        `/api/delete-cred-profess-ref-form/${selectedDocumentId}`
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
  const myReferences = [];

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
              Are you sure you want to delete this form?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              This will remove the form permanently. This action cannot be
              undone. Are you sure you want to proceed?
            </Typography>
          </Box>
        }
      />
      {/* <ConfirmRoleModal
        isOpen={deleteForm}
        onClose={closeModal}
        onConfirm={deleteFormHandler}
        isLoading={isLoading}
        title={"Delete reference form?"}
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
              Are you sure you want to delete this form?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              This will remove the form permanently. This action cannot be
              undone. Are you sure you want to proceed?
            </Typography>
          </Box>
        }
      /> */}
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
            Reference forms{" "}
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
            onClick={handleAddForm}
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
            Create new reference form
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box
        display="flex"
        flexDirection={"column"}
        sx={{ p: "24px 24px 0px 24px " }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
        >
          Professional references
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            fontSize: "12.3px",
            color: "rgba(103, 119, 136, 1) ",
          }}
        >
          Verified work history and professional background provided by the
          provider, including references from past employers, supervisors, or
          colleagues.{" "}
        </Typography>
      </Box>
      <Box sx={{ p: "24px" }}>
        <FormsTable
          openEditHandler={openEditHandler}
          confirmStatus={confirmStatus}
          confirmDelete={confirmDelete}
          viewDetailsHandler={viewDetailsHandler}
          trigger={isTrigger}
        />
      </Box>

      <PeerReferenceBox references={myReferences} />
    </Box>
  );
};

export default OrganizationDocuments;
