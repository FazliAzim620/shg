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

import { useSelector } from "react-redux";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../../components/handleConfirmDelete";

import { useNavigate } from "react-router-dom";

import FormsTable from "./FormsTable";
import PeerReferenceBox from "./PeerReferenceBox";
import Swal from "sweetalert2";

import ROUTES from "../../../../routes/Routes";
import API from "../../../../API";
import AddEditDocument from "./AddEditDocument";
import Loading from "../../../../components/common/Loading";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
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

const ReferenceForm = ({ id, peer, proffesional, userId }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
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
  const [statusConfirm, setStatusConfirm] = useState(false);
  const [againstDocument, setAgainstDocument] = useState(null);
  const [isTrigger, setIsTrigger] = useState(false);
  const [ipAddress, setIpAddress] = useState("");

  const [currentStatus, setCurrentStatus] = useState(0);
  const [status_notes, setStatus_notes] = useState("");
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
  const addDocumentHandler = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("for_provider_user_id", userId ? userId : user?.user?.id);
      if (drawerMode !== "add") {
        formData.append("form_submitted_id", selectedDocument?.id);
      }
      if (drawerMode !== "add") {
        formData.append("profess_ref_form_id", againstDocument?.id);
      } else {
        formData.append("profess_ref_form_id", selectedDocument?.id);
      }

      formData.append("ip", ipAddress);
      formData.append("form_submit_json", JSON.stringify(data));

      const response = await API.post(
        "/api/submit-prov-cred-prof-ref",
        formData
      );
      if (response?.data?.success) {
        setDrawerOpen(false);
        setIsTrigger(!isTrigger);
        Swal.fire({
          title: selectedDocument?.submitted_forms?.[0]?.id
            ? "Reference updated"
            : "Reference  Added!",
          text:
            response?.data?.msg || "The reference has been added successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setIsLoading(false);
      } else {
        setIsLoading(false);

        Swal.fire({
          title: "Oops!",
          text:
            response?.data?.msg ||
            "Something went wrong while adding the reference.",
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
          "There was an error while adding the reference.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteDocumentHandler = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await API.delete(
        userId
          ? `/api/admin/credentialing/delete-profess-ref-submission/${selectedDocumentId}`
          : `/api/delete-cred-profess-ref-form/${selectedDocumentId}`
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
  const updateStatus = (data, status = 0) => {
    setStatusConfirm(true);
    setSelectedDocument(data);
    setCurrentStatus(status);
  };

  const statusActionHandler = async () => {
    try {
      const obj = {
        submission_id: selectedDocument?.id,
        admin_notes: status_notes,
        admin_status: currentStatus,
      };
      setIsLoading(true);
      const resp = await API.post(
        `/api/admin/credentialing/update-profess-ref-submission-status`,
        obj
      );
      if (resp?.data?.success) {
        setCurrentStatus(0);
        setIsTrigger(!isTrigger);
        setStatusConfirm(false);
        setStatus_notes("");
        Swal.fire({
          title: "Document updated",
          text:
            resp?.data?.msg ||
            "The document status has been updated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while updating the status.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsLoading(false);
      setStatusConfirm(false);
    }
  };
  const openEditHandler = (data, againstDoc) => {
    // setDrawerMode("edit");
    // setDrawerOpen(true);
    // setSelectedDocument(data);
    // setSelectedDocumentId(data?.id);
    setDrawerMode("edit");
    setDrawerOpen(true);
    setSelectedDocument(data);
    setAgainstDocument(againstDoc);
  };
  const viewDetailsHandler = (data, againstDoc) => {
    setDrawerMode("view");
    setDrawerOpen(true);
    setSelectedDocument(data);
    setAgainstDocument(againstDoc);
  };
  const addHandler = (data) => {
    setDrawerMode("add");
    setDrawerOpen(true);
    setSelectedDocument(data);
  };
  const myReferences = [];
  const getIpAddress = async () => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data?.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  };
  useEffect(() => {
    getIpAddress();
  }, []);
  return (
    <Box sx={{ bgcolor: "#f0f2f5" }}>
      <Loading open={isLoading} />

      <AddEditDocument
        open={drawerOpen}
        mode={drawerMode}
        data={selectedDocument}
        isLoading={isLoading}
        onClose={() => setDrawerOpen(false)}
        againstDocument={againstDocument}
        onSave={(data) => {
          addDocumentHandler(data);
        }}
      />
      <ConfirmRoleModal
        isOpen={statusConfirm}
        onClose={() => setStatusConfirm(false)}
        onConfirm={statusActionHandler}
        isLoading={isLoading}
        bgcolor={currentStatus == 1 ? "rgba( 55, 125, 255)" : ""}
        title={
          <strong>
            {currentStatus == 1
              ? "Approve"
              : currentStatus == "2"
              ? "Reject"
              : "Pending"}{" "}
            Document
          </strong>
        }
        action={
          currentStatus == 1
            ? "Approved"
            : currentStatus == 2
            ? "Reject"
            : "Pending"
        }
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Add comment <span style={{ color: "red" }}>*</span>{" "}
            </Typography>
            <CommonInputField
              name="status_notes"
              placeholder="Provide a brief note or reason for rejecting the document..."
              value={status_notes}
              onChange={(e) => setStatus_notes(e.target.value)}
              error={!status_notes}
            />
          </Box>
        }
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
        sx={{
          p: "24px",
          bgcolor: "background.paper",
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
          >
            References{" "}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}></Box>
      </Box>
      <Divider />
      {userId ? (
        ""
      ) : (
        <Box
          display="flex"
          flexDirection={"column"}
          sx={{ p: "24px 24px 0px 24px ", bgcolor: "background.paper" }}
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
      )}
      {id ? (
        peer ? (
          <PeerReferenceBox userId={userId} />
        ) : proffesional ? (
          <Box
            sx={{
              p: "24px",
              bgcolor: "background.paper",
              borderBottomRightRadius: "12px",
              borderBottomLeftRadius: "12px",
            }}
          >
            <FormsTable
              openEditHandler={openEditHandler}
              confirmStatus={confirmStatus}
              confirmDelete={confirmDelete}
              viewDetailsHandler={viewDetailsHandler}
              addHandler={addHandler}
              trigger={isTrigger}
              id={id}
              userId={userId}
              updateStatus={updateStatus}
            />
          </Box>
        ) : (
          ""
        )
      ) : (
        <>
          <Box
            sx={{
              p: "24px",
              bgcolor: "background.paper",
              borderBottomRightRadius: "12px",
              borderBottomLeftRadius: "12px",
            }}
          >
            <PeerReferenceBox userId={userId} />
            {userId ? (
              <Box
                display="flex"
                flexDirection={"column"}
                sx={{ p: "24px 24px 0px 24px ", bgcolor: "background.paper" }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    fontSize: "20px",
                    color: "text.black",
                  }}
                >
                  Professional references
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 400,
                    fontSize: "12.3px",
                    color: "rgba(103, 119, 136, 1) ",
                    pb: 2,
                  }}
                >
                  Verified work history and professional background provided by
                  the provider, including references from past employers,
                  supervisors, or colleagues.{" "}
                </Typography>
              </Box>
            ) : (
              ""
            )}
            <FormsTable
              openEditHandler={openEditHandler}
              confirmStatus={confirmStatus}
              confirmDelete={confirmDelete}
              viewDetailsHandler={viewDetailsHandler}
              addHandler={addHandler}
              trigger={isTrigger}
              userId={userId}
              updateStatus={updateStatus}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ReferenceForm;
