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
import OnboardingTable from "./OnboardingTable";
import API from "../../../API";
import Swal from "sweetalert2";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OnBoardingSection = () => {
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.mode);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("edit");
  const [isTrigger, setIsTrigger] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // For adding a new document
  const createNewPackage = () => {
    navigate(ROUTES.createnewpackage, {
      state: {
        from: "onboarding",
        active: "Onboarding",
        btn: "onboarding",
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
  const confirmDelete = (doc) => {
    setDeleteForm(true);
    setSelectedDocumentId(doc?.id);
  };
  const closeModal = () => {
    // setChangeStatus(false);
    setDeleteForm(false);
    setIsLoading(false);
    // setSelectedDocument(null);
  };

  const deleteFormHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await API.delete(
        `/api/delete-cred-onb-pkg/${selectedDocumentId}`
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
  const myReferences = [
    {
      name: "Dr. Jane Smith",
      time: "Updated 1 hour ago",
    },
  ];

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
            Onboarding
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
                Manage and configure the onboarding process for providers in one
                place. This tab allows you to create, edit, and track onboarding
                packages, ensuring all necessary tasks are completed for
                compliance and readiness. Use the tools provided to customize
                steps, assign roles, and monitor progress efficiently.
              </Typography>
            }
          >
            <IconButton size="small">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={createNewPackage}
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
            Create new package
          </Button>
        </Box>
      </Box>
      <Divider sx={{ opacity: 0.5 }} />
      <Box sx={{ p: "24px" }}>
        <OnboardingTable
          openEditHandler={openEditHandler}
          confirmStatus={confirmStatus}
          confirmDelete={confirmDelete}
          viewDetailsHandler={viewDetailsHandler}
          trigger={isTrigger}
        />
      </Box>

      {/* <PeerReferenceBox references={myReferences} /> */}
    </Box>
  );
};

export default OnBoardingSection;
