import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";

import API from "../../../../API";
import Swal from "sweetalert2";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../../../components/handleConfirmDelete";
const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px", // optional: adjust for styling
  padding: "8px",
  resize: "vertical", // prevent resizing if desired
  outline: "none",
  height: "100",
  transition: "box-shadow 0.2s",
  backgroundColor: isLightMode ? "#f8fafd" : "#25282A",
  color: isLightMode ? "black" : "white",
  "&:focus": {
    boxShadow: " rgba(0, 0, 0, 0.09) 0px 3px 12px",
    backgroundColor: isLightMode ? "white" : "#25282A",
  },
}));
const SendPeerReference = ({
  openDrawer,
  setOpenDrawer,
  peerRefFormsAssigned,
  fetchPeerReferences,
  userId,
  isEdit,
}) => {
  const { user } = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);

  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    refereeFullName: "",
    refereeEmail: "",
    refereePhone: "",
    note: "",
  });

  const [errors, setErrors] = useState({
    refereeFullName: "",
    refereeEmail: "",
    refereePhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Basic validation
    let error = "";
    if (
      name === "refereeFullName" ||
      name === "refereeEmail" ||
      name === "refereePhone"
    ) {
      if (!value.trim())
        error = `${name
          .replace("referee", "Referee ")
          .replace(/([A-Z])/g, " $1")
          .trim()} is required`;
      else if (name === "refereeEmail" && !/^\S+@\S+\.\S+$/.test(value))
        error = "Invalid email format";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setFormData({
      id: null,
      refereeFullName: "",
      refereeEmail: "",
      refereePhone: "",
      note: "",
    });
    setErrors({
      refereeFullName: "",
      refereeEmail: "",
      refereePhone: "",
    });
  };
  const getIpAddressHandler = async () => {
    try {
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          setIpAddress(data?.ip);
        })
        .catch((error) => {
          console.error("Error fetching IP address:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getIpAddressHandler();
  }, []);
  const referenceHandler = async () => {
    setIsLoading(true);
    const obj = {
      for_provider_user_id: userId ? userId : user?.user?.id,
      peer_ref_form_id: peerRefFormsAssigned,
      refree_name: formData.refereeFullName,
      refree_email: formData.refereeEmail,
      refree_contact: formData.refereePhone,
      refree_notes: formData.note,
      ip: ipAddress,
      credentialing_peer_ref_form_refree_details_id: formData?.id,
    };
    try {
      const resp = await API.post(`api/send-prov-cred-peer-ref-to-refree`, obj);
      if (resp?.data?.success) {
        setIsLoading(false);
        fetchPeerReferences();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: resp?.data?.msg || "Peer reference sent successfully!",
          confirmButtonColor: "#3085d6",
        });
        handleCloseDrawer();
      } else {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: resp?.data?.msg || "Something went wrong!",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };
  useEffect(() => {
    if (isEdit && openDrawer) {
      setFormData({
        id: isEdit.id || null,
        refereeFullName: isEdit.name || "",
        refereeEmail: isEdit.email || "",
        refereePhone: isEdit.refree_contact || "", // Assuming you might have a `phone` field in future
        note: isEdit.refree_notes || "", // Optional, only if you store notes
      });
    }
  }, [isEdit, openDrawer]);

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: 400, p: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, fontSize: "1rem", color: "text.black" }}
          >
            Request new peer reference
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          pt="24px"
          pb="8px"
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Referee full name <span style={{ color: "red" }}>*</span>
        </Typography>
        <CommonInputField
          label="Referee full name *"
          name="refereeFullName"
          placeholder="Enter referee full name"
          value={formData.refereeFullName}
          onChange={handleChange}
          error={errors.refereeFullName}
        />
        <Typography
          pt="24px"
          pb="8px"
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Referee email <span style={{ color: "red" }}>*</span>
        </Typography>
        <CommonInputField
          label="Referee email *"
          name="refereeEmail"
          placeholder="Enter referee email"
          value={formData.refereeEmail}
          onChange={handleChange}
          error={errors.refereeEmail}
          disabled={isEdit}
        />
        <Typography
          pt="24px"
          pb="8px"
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Referee phone number <span style={{ color: "red" }}>*</span>
        </Typography>
        <CommonInputField
          label="Referee phone number *"
          name="refereePhone"
          placeholder="Enter referee phone number"
          value={formData.refereePhone}
          onChange={handleChange}
          error={errors.refereePhone}
        />

        <Typography
          pt="24px"
          pb="8px"
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Note for referee
        </Typography>
        <StyledTextarea
          minRows={3}
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Note to referee..."
          isLightMode={darkMode}
          sx={{ mt: 1, height: "auto", fontFamily: "Inter, sans-serif" }}
        />

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "5px 16px",
              minWidth: 0,
              width: "87px",
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                color: "text.main",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
            fullWidth
            onClick={handleCloseDrawer}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={
              Object.values(errors).some((error) => error) ||
              !formData.refereeFullName ||
              !formData.refereeEmail ||
              !formData.refereePhone
            }
            sx={{ textTransform: "none" }}
            onClick={referenceHandler}
          >
            {isLoading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Request reference"
            )}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SendPeerReference;
