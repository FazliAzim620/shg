import React, { useEffect, useState } from "react";
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
import PeerReferenceViewDrawer from "./PeerReferenceViewDrawer";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes/Routes";
import API from "../../../API";
import { formatOnlyDate } from "../../../util";
import { useDispatch } from "react-redux";
import { editRefFormData } from "../../../feature/form-builder/referenceFormSlice";
import { Skeleton } from "survey-react";
import SkeletonRow from "../../../components/SkeletonRow";
import Swal from "sweetalert2";

const PeerReferenceBox = ({ references = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Check if references exist
  const hasReferences = references.length > 0;

  // State for menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [referenceForm, setReferenceForm] = useState(null);
  const [deleteForm, setDeleteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const confirmDelete = (curr_form) => {
    setDeleteForm(true);
    setSelectedForm(curr_form);
  };
  const closeModal = () => {
    // setChangeStatus(false);
    setDeleteForm(false);
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
  const deleteFormHandler = async () => {
    setIsLoading(true);
    try {
      const response = await API.delete(
        `/api/delete-cred-peer-ref-form/${referenceForm?.id}`
      );

      if (response.data?.success) {
        Swal.fire({
          title: "Success!",
          text:
            response?.data?.msg || "User role has been changed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setReferenceForm(null);
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
  const viewFormDetails = (data) => {
    setIsViewOpen(!isViewOpen);
    setSelectedForm(data);
  };
  const onClose = () => {
    setIsViewOpen(!isViewOpen);
  };
  const handleAddForm = ({ btn }) => {
    navigate(ROUTES.referenceForm, {
      state: { from: "Reference Form", active: "ReferenceForms", btn: "peer" },
    });
  };
  const getPeerReference = async () => {
    setIsLoading(true);
    try {
      const resp = await API.get(`/api/get-cred-peer-ref-form`);
      if (resp?.data?.success) {
        setReferenceForm(resp?.data?.data?.[0]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPeerReference();
  }, []);
  const editHandler = () => {
    const formData = {
      id: referenceForm?.id,
      name: referenceForm?.name,
      roles: referenceForm?.provider_roles?.map(
        (item) => item?.provider_role_id
      ),
    };
    // handleActionsClose();
    dispatch(editRefFormData(formData));
    navigate(`${ROUTES.referenceForm}`, {
      state: {
        editData: referenceForm?.json_structure,
        from: "Reference Form",
        active: "ReferenceForms",
        btn: "peer",
      },
    });
  };
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: "0px 24px 0px 24px",
      }}
    >
      <PeerReferenceViewDrawer
        open={isViewOpen}
        onClose={onClose}
        viewData={selectedForm}
      />
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
        flexDirection={"column"}
        sx={{ p: "0px 0px 24px 0px" }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
        >
          Peer reference
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            fontSize: "12.3px",
            color: "rgba(103, 119, 136, 1)",
          }}
        >
          Third-party verification of the provider's clinical competence,
          professionalism, and work ethics, collected directly from previous
          employers or colleagues.
        </Typography>
      </Box>

      {isLoading ? (
        <SkeletonRow column={6} />
      ) : referenceForm ? (
        // Display references if they exist
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
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <svg
              width="32"
              height="33"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_5661_225783)">
                <path
                  d="M11 14.2266C10.7348 14.2266 10.4804 14.3319 10.2929 14.5195C10.1054 14.707 10 14.9613 10 15.2266C10 15.4918 10.1054 15.7461 10.2929 15.9337C10.4804 16.1212 10.7348 16.2266 11 16.2266H21C21.2652 16.2266 21.5196 16.1212 21.7071 15.9337C21.8946 15.7461 22 15.4918 22 15.2266C22 14.9613 21.8946 14.707 21.7071 14.5195C21.5196 14.3319 21.2652 14.2266 21 14.2266H11ZM10 19.2266C10 18.9613 10.1054 18.707 10.2929 18.5195C10.4804 18.3319 10.7348 18.2266 11 18.2266H21C21.2652 18.2266 21.5196 18.3319 21.7071 18.5195C21.8946 18.707 22 18.9613 22 19.2266C22 19.4918 21.8946 19.7461 21.7071 19.9337C21.5196 20.1212 21.2652 20.2266 21 20.2266H11C10.7348 20.2266 10.4804 20.1212 10.2929 19.9337C10.1054 19.7461 10 19.4918 10 19.2266ZM10 23.2266C10 22.9613 10.1054 22.707 10.2929 22.5195C10.4804 22.3319 10.7348 22.2266 11 22.2266H15C15.2652 22.2266 15.5196 22.3319 15.7071 22.5195C15.8946 22.707 16 22.9613 16 23.2266C16 23.4918 15.8946 23.7461 15.7071 23.9337C15.5196 24.1212 15.2652 24.2266 15 24.2266H11C10.7348 24.2266 10.4804 24.1212 10.2929 23.9337C10.1054 23.7461 10 23.4918 10 23.2266Z"
                  fill="#6C757D"
                />
                <path
                  d="M19 0.226562H8C6.93913 0.226563 5.92172 0.64799 5.17157 1.39814C4.42143 2.14828 4 3.1657 4 4.22656V28.2266C4 29.2874 4.42143 30.3048 5.17157 31.055C5.92172 31.8051 6.93913 32.2266 8 32.2266H24C25.0609 32.2266 26.0783 31.8051 26.8284 31.055C27.5786 30.3048 28 29.2874 28 28.2266V9.22656L19 0.226562ZM19 2.22656V6.22656C19 7.02221 19.3161 7.78527 19.8787 8.34788C20.4413 8.91049 21.2044 9.22656 22 9.22656H26V28.2266C26 28.757 25.7893 29.2657 25.4142 29.6408C25.0391 30.0158 24.5304 30.2266 24 30.2266H8C7.46957 30.2266 6.96086 30.0158 6.58579 29.6408C6.21071 29.2657 6 28.757 6 28.2266V4.22656C6 3.69613 6.21071 3.18742 6.58579 2.81235C6.96086 2.43728 7.46957 2.22656 8 2.22656H19Z"
                  fill="#6C757D"
                />
              </g>
              <defs>
                <clipPath id="clip0_5661_225783">
                  <rect
                    width="32"
                    height="32"
                    fill="white"
                    transform="translate(0 0.226562)"
                  />
                </clipPath>
              </defs>
            </svg>

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
                    color: "text.black",
                    textTransform: "capitalize",
                    mb: -1,
                  }}
                >
                  {referenceForm?.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 400,
                    fontSize: "12.3px",
                    color: "rgba(103, 119, 136, 1)",
                  }}
                >
                  {referenceForm?.updated_at
                    ? formatOnlyDate(referenceForm?.updated_at)
                    : ""}
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
                    viewFormDetails(referenceForm);
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
                    editHandler();
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
                    confirmDelete(referenceForm);
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
      ) : (
        // Empty state with add button
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ py: 4, px: 3 }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No peer references available
          </Typography>
          <Button
            onClick={() => handleAddForm("peer")}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ textTransform: "none" }}
          >
            Add Reference
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default PeerReferenceBox;
