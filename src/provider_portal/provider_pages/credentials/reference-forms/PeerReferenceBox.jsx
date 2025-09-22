import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  TextField,
  Modal,
} from "@mui/material";
import { ExpandMore, FilterList } from "@mui/icons-material";
import SendPeerReference from "./SendPeerReference";
import { useSelector } from "react-redux";
import CustomChip from "../../../../components/CustomChip";
import axios from "axios"; // Import axios for API calls
import API from "../../../../API";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../../../components/handleConfirmDelete";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
import Swal from "sweetalert2";
import PeerReferenceViewEditDrawer from "./PeerReferenceViewEditDrawer";

const PeerReferenceBox = ({ userId }) => {
  const { user } = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [peerRefFormsAssigned, setPeerRefFormsAssigned] = useState(null); // State for peer_ref_forms_assigned
  const [pendingReferences, setPendingReferences] = useState([]); // State for pending references
  const [submittedReferences, setSubmittedReferences] = useState([]); // State for submitted references
  const [loading, setLoading] = useState(true); // State for loading status
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [actionsAnchorE2, setActionsAnchorE2] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // State to track modal action (delete/remind/sendToAnotherEmail)
  const [modalConfig, setModalConfig] = useState({}); // State to store modal configuration
  const [newEmail, setNewEmail] = useState("");
  const [status_notes, setStatus_notes] = useState("");
  const [mode, setMode] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
    setModalAction(null);
    setModalConfig({});
    setNewEmail(""); // Reset email input
  };

  const handleActionsClick = (event, doc) => {
    setActionsAnchorEl(event.currentTarget);
    setSelectedDocument(doc);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };
  const handleActions2Click = (event, doc) => {
    setActionsAnchorE2(event.currentTarget);
    setSelectedDocument(doc);
  };
  const handleActions2Close = () => {
    setActionsAnchorE2(null);
  };

  const editHandler = (data) => {
    setIsEdit(data);
    setOpenDrawer(true);
  };

  const openDrawerHandler = () => {
    setOpenDrawer(!openDrawer);
  };

  // Function to validate email
  const isValidEmail = (email) => {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Function to fetch peer references from the API
  const fetchPeerReferences = async () => {
    try {
      setLoading(true);
      const response = await API.get("api/get-prov-cred-peer-ref", {
        params: {
          for_provider_user_id: userId ? userId : user?.user?.id,
        },
      });

      const data = response.data;

      if (data.success) {
        setPeerRefFormsAssigned(
          userId
            ? data?.data?.peer_ref_forms_assigned
            : data?.data?.peer_ref_forms_assigned?.[0]
        );

        // Process with_submissions (Submitted References - assuming these have submissions)
        const withSubmissions = data?.data?.with_submissions || [];
        const submittedRefs = withSubmissions.map((item) => {
          const createdAt = item?.created_at ? new Date(item.created_at) : null;
          const updatedAt = item?.form_submissions?.[0]?.created_at
            ? new Date(item?.form_submissions?.[0]?.created_at)
            : null;

          return {
            id: item.id || "Unknown",
            name: item?.refree_name || "Unknown",
            email: item?.refree_email || "N/A",
            status: "Approval pending", // Adjusted for logic
            sentDate: createdAt
              ? createdAt.toLocaleDateString()
              : "Not available",
            sentTime: createdAt
              ? createdAt.toLocaleTimeString()
              : "Not available",
            submissionDate: updatedAt
              ? updatedAt.toLocaleDateString()
              : "Not available",
            submissionTime: updatedAt
              ? updatedAt.toLocaleTimeString()
              : "Not available",
            refree_contact: item?.refree_contact || null,
            refree_notes: item?.refree_notes || null,
            submissions: item.form_submissions || [],
          };
        });
        setSubmittedReferences(submittedRefs);

        // Process without_submissions (Pending References - assuming no submissions)
        const withoutSubmissions = data?.data?.without_submissions || [];
        const pendingRefs = withoutSubmissions.map((item) => {
          const createdAt = item?.created_at ? new Date(item.created_at) : null;
          const hasSubmission = item.form_submissions?.length > 0;
          return {
            id: item.id || "Unknown",
            name: item.refree_name || "Unknown",
            email: item.refree_email || "N/A",
            status: "Sent", // Adjusted for logic
            date: createdAt ? createdAt.toLocaleDateString() : "Not available",
            time: createdAt ? createdAt.toLocaleTimeString() : "Not available",
            refree_contact: item?.refree_contact || null,
            refree_notes: item?.refree_notes || null,
            email_sent_count: item?.email_sent_count,
          };
        });
        setPendingReferences(pendingRefs);
      }
    } catch (error) {
      console.error("Error fetching peer references:", error);
      // You could add a toast or sweetalert here to notify the user
    } finally {
      setLoading(false);
    }
  };
  // Function to handle delete API call
  const deletePeerReference = async (referenceId) => {
    try {
      setLoading(true);

      const endpoint =
        selectedReferee !== null
          ? `/api/admin/credentialing/delete-peer-ref-submission/${referenceId}`
          : `/api/admin/credentialing/delete-peer-ref-referee/${referenceId}`;

      const response = await API.delete(endpoint);

      if (response.data.success) {
        Swal.fire("Success!", response.data.msg, "success");
        await fetchPeerReferences();
        console.log("Peer reference deleted successfully");
      } else {
        Swal.fire("Error!", response.data.msg, "error");
        console.error("Failed to delete peer reference:", response.data.msg);
      }
    } catch (error) {
      console.error("Error deleting peer reference:", error);
      Swal.fire("Error!", error?.response.data.msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // const deletePeerReference = async (referenceId) => {
  //   try {
  //     setLoading(true);
  //     const response = await API.delete(
  //       `/api/admin/credentialing/delete-peer-ref-referee/${referenceId}`
  //     );
  //     if (response.data.success) {
  //       await fetchPeerReferences();
  //       console.log("Peer reference deleted successfully");
  //     } else {
  //       console.error(
  //         "Failed to delete peer reference:",
  //         response.data.message
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error deleting peer reference:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Function to handle remind API call
  const remindPeerReference = async (referenceId) => {
    try {
      setLoading(true);
      const response = await API.post(
        `/api/admin/credentialing/remind/prov-cred-peer-ref-refree?refree_detail_id=${referenceId}`
      );
      if (response.data.success) {
        await fetchPeerReferences();
        console.log("Reminder sent successfully");
      } else {
        console.error("Failed to send reminder:", response.data.message);
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle send to another email API call
  const sendToAnotherEmail = async (referenceId, email) => {
    try {
      setLoading(true);
      const response = await API.post(
        `/api/admin/credentialing/send-prov-cred-peer-ref-to-another-email`,
        {
          refree_detail_id: referenceId,
          email: email,
        }
      );
      if (response.data.success) {
        await fetchPeerReferences();
        console.log("Peer reference sent to new email successfully");
      } else {
        console.error(
          "Failed to send peer reference to new email:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error sending peer reference to new email:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle approve API call
  const approvePeerReference = async (referenceId, status = 0) => {
    try {
      setLoading(true);
      const obj = {
        submission_id: referenceId,
        admin_status: status === "approved" ? 1 : status === "reject" ? 2 : 0,
        admin_notes: status_notes,
      };
      const response = await API.post(
        `/api/admin/credentialing/update-peer-ref-submission-status`,
        obj
      );
      if (response.data.success) {
        await fetchPeerReferences();
        console.log("Peer reference approved successfully");
        setStatus_notes("");
        Swal.fire("Success", response.data.msg, "success");
      } else {
        console.error("Failed to approve peer reference:", response.data.msg);
        Swal.fire("Error!", response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error approving peer reference:", error);
      Swal.fire("Error!", error?.response.data.msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handler for viewing a reference
  const viewHandler = (doc) => {
    setSelectedReferee(doc);
    setViewModalOpen(true);
  };
  // Handler for confirming actions (delete, remind, or send to another email)
  const confirmHandler = async () => {
    if (modalAction === "delete" && selectedDocument?.id) {
      await deletePeerReference(
        selectedReferee
          ? selectedDocument?.submissions?.[0]?.id
          : selectedDocument.id
      );
    } else if (modalAction === "remind" && selectedDocument?.id) {
      await remindPeerReference(selectedDocument.id);
    } else if (modalAction === "sendToAnotherEmail" && selectedDocument?.id) {
      if (!isValidEmail(newEmail)) {
        console.error("Invalid email address");
        return; // Prevent API call if email is invalid
      }
      await sendToAnotherEmail(selectedDocument.id, newEmail);
    } else if (modalAction === "approve" && selectedDocument?.id) {
      await approvePeerReference(
        selectedReferee
          ? selectedDocument?.submissions?.[0]?.id
          : selectedDocument.id,
        "approved"
      );
    } else if (modalAction === "reject" && selectedDocument?.id) {
      await approvePeerReference(
        selectedReferee
          ? selectedDocument?.submissions?.[0]?.id
          : selectedDocument.id,
        "reject"
      );
    }
    closeModal();
  };

  // Handler for opening the delete confirmation modal
  const confirmDelete = (doc) => {
    setModalAction("delete");
    setModalConfig({
      title: "Delete Peer Reference",
      action: "Delete",
      bodyText: (
        <Typography variant="body2">
          Are you sure you want to delete the peer reference for{" "}
          <strong>{doc.name}</strong>? Note, once deleted referee with email
          received, still wouldn't be able to fill the shared form.
        </Typography>
      ),
    });
    setIsOpen(true);
  };

  // Handler for opening the remind confirmation modal
  const confirmRemind = (doc) => {
    setModalAction("remind");
    setModalConfig({
      title: "Send Reminder",
      action: "Send Reminder",
      bodyText: (
        <Typography variant="body2">
          Are you sure you want to send a reminder to{" "}
          <strong>{doc.name}</strong> at <strong>{doc.email}</strong> for the
          peer reference?
        </Typography>
      ),
    });
    setIsOpen(true);
  };

  // Handler for opening the send to another email modal
  const confirmSendToAnotherEmail = (doc) => {
    setModalAction("sendToAnotherEmail");
    setNewEmail("");
    setModalConfig({
      title: "Send to Another Email",
      action: "Send",
      bodyText: (
        <Typography variant="body2">
          Enter a new email address to send the peer reference for{" "}
          <strong>{doc.name}</strong>.
        </Typography>
      ),
    });
    setIsOpen(true);
  };

  // Handler for opening the approve confirmation modal
  const confirmApprove = (doc) => {
    setModalAction("approve");
    setModalConfig({
      title: "Approve Peer Reference",
      action: "Approve",
      bodyText: (
        <Typography variant="body2">
          Are you sure you want to approve the peer reference for{" "}
          <strong>{doc.name}</strong>?
        </Typography>
      ),
    });
    setIsOpen(true);
  };

  // Handler for opening the reject confirmation modal
  const confirmReject = (doc) => {
    setModalAction("reject");
    setModalConfig({
      title: "Reject Peer Reference",
      action: "Reject",
      bodyText: (
        <Typography variant="body2">
          Are you sure you want to reject the peer reference for{" "}
          <strong>{doc.name}</strong>?
        </Typography>
      ),
    });
    setIsOpen(true);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPeerReferences();
  }, []);
  return (
    <Box
      sx={{
        mx: "auto",
        bgcolor: "background.paper",
        borderRadius: "12px",
        mt: 3,
      }}
    >
      <SendPeerReference
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        peerRefFormsAssigned={peerRefFormsAssigned}
        fetchPeerReferences={fetchPeerReferences}
        userId={userId}
        isEdit={isEdit}
      />
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "20px" }}>
          Peer references
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={openDrawerHandler}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 1,
              textTransform: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 400,
              maxHeight: "42px",
            }}
          >
            Request new reference
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: ".8125rem",
              fontWeight: 400,
              borderColor: "rgba(231, 234, 243, .7)",
              "&:hover": {
                borderColor: "rgba(231, 234, 243, .7)",
              },
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>
      <Divider />
      {/* Pending Reference Section */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Pending referee submission
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontWeight: 400,
            fontSize: "12px",
            color: "rgba(103, 119, 136, 1)",
          }}
        >
          Verified work history and professional background provided by the
          provider, including references from past employers, supervisors, or
          colleagues.
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : pendingReferences.length === 0 ? (
          <Typography>No pending references available.</Typography>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Referee
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Sent
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Email send attempts
                  </TableCell>
                  {userId && (
                    <TableCell
                      sx={{
                        backgroundColor: "rgba(231, 234, 243, .4)",
                        fontSize: "11.9px",
                        fontWeight: 500,
                      }}
                    >
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingReferences?.map((referee, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      backgroundColor:
                        darkMode === "dark"
                          ? "background.paper"
                          : index % 2 === 0
                          ? "#FFFFFF"
                          : "rgba(248, 250, 253, 1)",
                      "&:hover": {
                        backgroundColor: "none",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        >
                          {referee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {referee.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <CustomChip
                        dot
                        width={40}
                        dotColor={
                          referee?.status?.toLocaleLowerCase() === "sent"
                            ? "rgba(255, 193, 7, 1)"
                            : "rgba(0, 201, 167, 1)"
                        }
                        chipText={
                          referee?.status?.toLocaleLowerCase() === "sent"
                            ? "  Sent"
                            : "Sent"
                        }
                        color="rgba(103, 119, 136, 1)"
                        bgcolor={
                          referee?.status?.toLocaleLowerCase() === "sent"
                            ? "rgba(255, 193, 7, 0.1)"
                            : "rgba(0, 201, 167, 0.1)"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">{referee.date}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {referee.time}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {referee.email_sent_count}
                        </Typography>
                      </Box>
                    </TableCell>
                    {userId && (
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            color: "text.secondary",
                            borderColor: "#EEF0F7",
                            "&:hover": {
                              color: "text.btn_blue",
                              borderColor: "#EEF0F7",
                              boxShadow:
                                "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            },
                          }}
                          onClick={(e) => handleActionsClick(e, referee)}
                        >
                          More
                          <ExpandMore sx={{ fontSize: "14px" }} />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Divider sx={{ mx: 3 }} />
      {/* Submitted Peer References Section */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Submitted peer references
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontWeight: 400,
            fontSize: "12px",
            color: "rgba(103, 119, 136, 1)",
          }}
        >
          Third-party verification of the provider's clinical competence,
          professionalism, and work ethics, collected directly from previous
          employers or colleagues.
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : submittedReferences.length === 0 ? (
          <Typography>No submitted references available.</Typography>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Referee
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Submission date
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Sent
                  </TableCell>
                  {userId && (
                    <TableCell
                      sx={{
                        backgroundColor: "rgba(231, 234, 243, .4)",
                        fontSize: "11.9px",
                        fontWeight: 500,
                      }}
                    >
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {submittedReferences.map((referee, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      backgroundColor:
                        darkMode === "dark"
                          ? "background.paper"
                          : index % 2 === 0
                          ? "#FFFFFF"
                          : "rgba(248, 250, 253, 1)",
                      "&:hover": {
                        backgroundColor: "none",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        >
                          {referee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {referee.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <CustomChip
                        dot
                        width={40}
                        dotColor={
                          referee?.submissions?.[0]?.admin_status
                            ? "rgba(0, 201, 167, 1)"
                            : "rgba(255, 193, 7, 1)"
                        }
                        chipText={
                          referee?.submissions?.[0]?.admin_status
                            ? "Approved"
                            : "Pending approved"
                        }
                        color="rgba(103, 119, 136, 1)"
                        bgcolor={
                          referee?.submissions?.[0]?.admin_status == 1
                            ? "rgba(0, 201, 167, 0.1)"
                            : "rgba(255, 193, 7, 0.1)"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          {referee.submissionDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {referee.submissionTime}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          {referee.sentDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {referee.sentTime}
                        </Typography>
                      </Box>
                    </TableCell>
                    {userId && (
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            color: "text.secondary",
                            borderColor: "#EEF0F7",
                            "&:hover": {
                              color: "text.btn_blue",
                              borderColor: "#EEF0F7",
                              boxShadow:
                                "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            },
                          }}
                          onClick={(e) => handleActions2Click(e, referee)}
                        >
                          More
                          <ExpandMore sx={{ fontSize: "14px" }} />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {userId && (
        <Menu
          anchorEl={actionsAnchorEl}
          open={Boolean(actionsAnchorEl)}
          onClose={handleActionsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              handleActionsClose();
              confirmRemind(selectedDocument);
            }}
          >
            Remind
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActionsClose();
              confirmSendToAnotherEmail(selectedDocument);
            }}
          >
            Send to another email
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActionsClose();
              editHandler(selectedDocument);
              setMode("edit");
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActionsClose();
              confirmDelete(selectedDocument);
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Menu>
      )}
      {userId && (
        <Menu
          anchorEl={actionsAnchorE2}
          open={Boolean(actionsAnchorE2)}
          onClose={handleActions2Close}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              handleActions2Close();
              viewHandler(selectedDocument);
            }}
          >
            View details
          </MenuItem>
          {selectedDocument?.submissions?.[0]?.admin_status == 0 && (
            <MenuItem
              onClick={() => {
                handleActions2Close();
                confirmApprove(selectedDocument);
              }}
            >
              Approve
            </MenuItem>
          )}
          {selectedDocument?.submissions?.[0]?.admin_status == 0 && (
            <MenuItem
              onClick={() => {
                handleActions2Close();
                confirmReject(selectedDocument);
                setSelectedReferee(selectedDocument);
              }}
            >
              Reject
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              handleActions2Close();
              setMode("edit");
              viewHandler(selectedDocument);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActions2Close();
              confirmDelete(selectedDocument);
              setSelectedReferee(selectedDocument);
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Menu>
      )}
      <ConfirmStatusModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={confirmHandler}
        isLoading={loading}
        title={modalConfig.title || "Confirm Action"}
        action={modalConfig.action || "Confirm"}
        bgcolor={modalConfig.action === "Approve" ? "rgba( 55, 125, 255)" : ""}
        bodyText={
          (
            <>
              {modalConfig.bodyText}

              {modalAction === "sendToAnotherEmail" && (
                <CommonInputField
                  name="newEmail"
                  placeholder="New Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  error={newEmail && !isValidEmail(newEmail)}
                  helperText={
                    newEmail && !isValidEmail(newEmail)
                      ? "Please enter a valid email address"
                      : ""
                  }
                />
              )}

              {(modalConfig.action === "Reject" ||
                modalConfig.action === "Approve") && (
                <CommonInputField
                  name="status_notes"
                  placeholder="Provide a brief note or reason for rejecting the document..."
                  value={status_notes}
                  onChange={(e) => setStatus_notes(e.target.value)}
                  error={!status_notes}
                />
              )}
            </>
          ) || (
            <Typography variant="body2">
              Are you sure you want to perform this action?
            </Typography>
          )
        }
        confirmDisabled={
          modalAction === "sendToAnotherEmail" && !isValidEmail(newEmail)
        }
      />
      <PeerReferenceViewEditDrawer
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        selectedReferee={selectedReferee}
        userId={userId}
        isEdit={mode}
      />
      {/* <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            View Peer Reference
          </Typography>
          <Typography variant="body2">Name: {selectedReferee?.name}</Typography>
          <Typography variant="body2">
            Email: {selectedReferee?.email}
          </Typography>
          <Typography variant="body2">
            Status: {selectedReferee?.status}
          </Typography>
          <Typography variant="body2">
            Submission Date: {selectedReferee?.submissionDate}{" "}
            {selectedReferee?.submissionTime}
          </Typography>
          <Typography variant="body2">
            Sent Date: {selectedReferee?.sentDate} {selectedReferee?.sentTime}
          </Typography>
          {selectedReferee?.refree_contact && (
            <Typography variant="body2">
              Contact: {selectedReferee?.refree_contact}
            </Typography>
          )}
          {selectedReferee?.refree_notes && (
            <Typography variant="body2">
              Notes: {selectedReferee?.refree_notes}
            </Typography>
          )}
          {selectedReferee?.submissions?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Submissions:</Typography>
              {selectedReferee.submissions.map((sub, i) => (
                <Typography key={i} variant="body2">
                  {JSON.stringify(sub, null, 2)}
                </Typography>
              ))}
            </Box>
          )}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setViewModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal> */}
    </Box>
  );
};

export default PeerReferenceBox;
