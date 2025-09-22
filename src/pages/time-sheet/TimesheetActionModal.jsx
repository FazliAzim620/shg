import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import API from "../../API";
import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";
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

const TimesheetActionModal = ({
  open,
  onClose,
  onConfirm,
  action,
  timesheetId,
}) => {
  const { loadingData, userData } = useSelector((state) => state?.userInfo);

  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [signature, setSignature] = useState(null);

  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  const handleConfirm = () => {
    onConfirm(action, notes, signature);
    setNotes("");
  };
  const fetchSignature = async (userId) => {
    try {
      const response = await API.get(`/api/get-user-signature/${userId}`);
      if (response?.data?.data?.signature) {
        const savedSignature = response?.data?.data?.signature;
        setSignature(savedSignature);
      }
    } catch (error) {
      console.log("Error fetching signature:", error);
    } finally {
    }
  };
  useEffect(() => {
    if (userData?.id) {
      fetchSignature(userData.id); // Call the fetchSignature function with the user ID
    }
  }, [open, userData]);
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", md: 550 },
          maxWidth: "550px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,

          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <CustomTypographyBold color={"text.black"} fontSize={".98438rem"}>
            {["admin_approve", "admin_client_approve"].includes(action)
              ? "Approve  "
              : "Reject  "}
            Timesheet #{timesheetId}
          </CustomTypographyBold>
          <IconButton onClick={onClose} sx={{ mr: -1, color: "text.or_color" }}>
            <Close />
          </IconButton>
        </Box>

        <CustomTypographyBold
          color={"text.black"}
          fontSize={".875rem"}
          weight={400}
        >
          {["admin_approve", "admin_client_approve"].includes(action)
            ? "Approve  "
            : "Rejection  "}{" "}
          Notes
        </CustomTypographyBold>

        <Box sx={{ maxHeight: "180px", overflowY: "auto", mb: 1 }}>
          <StyledTextarea
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explain..."
            isLightMode={isLightMode}
            sx={{ mt: 1, height: "auto", fontFamily: "Inter, sans-serif" }}
          />
        </Box>
        <CustomTypographyBold
          color={"text.black"}
          fontSize={".875rem"}
          weight={400}
        >
          Signature
        </CustomTypographyBold>
        <Box component={"img"} src={signature} sx={{ width: "10rem" }} />
        <FormControlLabel
          control={
            <BpCheckbox
              className={confirmed ? "" : `${"checkbox"}`}
              checked={confirmed}
              size="small"
              onChange={(e) => setConfirmed(e.target.checked)}
              sx={{ "&.Mui-checked": { color: "#377dff" }, mt: -2 }}
            />
          }
          label={
            <CustomTypographyBold
              color={isLightMode ? "#71869d" : "#25282A"}
              fontSize={".82rem"}
              weight={400}
              textTransform={"none"}
            >
              By clicking on{" "}
              {["admin_approve", "admin_client_approve"].includes(action)
                ? "Approve"
                : "Reject"}
              , you confirm that this timesheet is{" "}
              {["admin_approve", "admin_client_approve"].includes(action)
                ? "correct and accurate."
                : "not correct and needs to be reviewed."}
            </CustomTypographyBold>
          }
          sx={{ pt: 3 }}
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            sx={{
              mr: 2,
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "5px 16px",
              minWidth: 0,
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
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!confirmed}
            sx={{
              bgcolor: "#377dff",
              textTransform: "none",
              "&:hover": { bgcolor: "#2f6fed" },
              "&:disabled": { bgcolor: "#d9d9d9", color: "#999" },
            }}
          >
            {["admin_approve", "admin_client_approve"].includes(action)
              ? "Approve"
              : "Reject"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TimesheetActionModal;
