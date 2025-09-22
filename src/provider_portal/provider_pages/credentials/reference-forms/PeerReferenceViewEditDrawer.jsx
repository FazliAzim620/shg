import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import PreviewForm from "./PreviewForm";
import API from "../../../../API";
import Swal from "sweetalert2";

const PeerReferenceViewEditDrawer = ({
  open,
  onClose,
  userId,
  selectedReferee,
  isEdit,
}) => {
  const [formStructure, setFormStructure] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch the form structure when drawer opens
  const getFormStructure = async () => {
    try {
      const resp = await API.get(
        `/api/get-prov-cred-peer-ref?for_provider_user_id=${userId}`
      );
      if (resp?.data?.success) {
        setFormStructure(resp?.data?.data?.peer_ref_form);
      }
    } catch (error) {
      console.error("Error fetching form structure:", error);
    }
  };

  useEffect(() => {
    if (open) {
      getFormStructure();

      const submissionJson =
        selectedReferee?.submissions?.[0]?.json_structure || null;

      setFormData(submissionJson ? JSON.parse(submissionJson) : null);
    }
  }, [open]);

  // Handle update
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const submissionId = selectedReferee?.submissions?.[0]?.id;

      const payload = {
        submission_id: submissionId,
        form_submit_json: JSON.stringify(formData),
      };

      const resp = await API.post(
        "/api/admin/credentialing/edit-peer-ref-submission",
        payload
      );

      if (resp?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: resp?.data?.message || "Something went wrong!",
        });
        onClose();
      } else {
        onClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resp?.data?.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error during update:", error);
      onClose();
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.msg ||
          "An error occurred while processing the request. Please try again later.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          minWidth: { xs: "400px", md: "600px" },
          maxWidth: "700px",
          bgcolor: "background.default",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header and Referee Info */}
        <Box sx={{ p: 3, flexShrink: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "text.black",
              mb: 2,
              alignSelf: "flex-start",
            }}
          >
            Peer Reference Details
          </Typography>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body1" fontWeight={500}>
                    Referee name:
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedReferee?.name}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">
                    {selectedReferee?.email}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Status:
                    {selectedReferee?.submissions?.[0]?.admin_status === 1
                      ? " Approved"
                      : selectedReferee?.submissions?.[0]?.admin_status === 2
                      ? " Rejected"
                      : " Pending"}
                  </Typography>
                </Stack>

                {selectedReferee?.submissionDate && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Submitted:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReferee.submissionDate}{" "}
                      {selectedReferee.submissionTime}
                    </Typography>
                  </Stack>
                )}

                {selectedReferee?.sentDate && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Sent:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReferee.sentDate} {selectedReferee.sentTime}
                    </Typography>
                  </Stack>
                )}

                {selectedReferee?.refree_contact && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Phone:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReferee.refree_contact}
                    </Typography>
                  </Stack>
                )}

                {selectedReferee?.refree_notes && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Referee notes:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReferee.refree_notes}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "text.black",
              mb: 2,
              alignSelf: "flex-start",
            }}
          >
            Submitted Form Preview
          </Typography>
        </Box>

        {/* Scrollable Form Section */}
        <Box>
          <PreviewForm
            data={formStructure && JSON.parse(formStructure?.json_structure)}
            editData={formData}
            setEditData={isEdit ? setFormData : undefined}
            readonly={!isEdit}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: "1px solid #e0e0e0",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "background.default",
            position: "fixed",
            bottom: 0,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          {isEdit && (
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PeerReferenceViewEditDrawer;
