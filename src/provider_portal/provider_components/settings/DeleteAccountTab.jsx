import React, { useState } from "react";
import CardCommon from "../../../components/CardCommon";
import {
  Typography,
  Alert,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DeleteConfirmModal } from "../../../components/handleConfirmDelete";
import API from "../../../API";
import { logoutHandler } from "../../../util";
import { useNavigate } from "react-router-dom";
import UnderConstruction from "../../../components/UnderConstruction";
import { useDispatch } from "react-redux";
import ROUTES from "../../../routes/Routes";
import { fetchUsers } from "../../../thunkOperation/userManagementModulethunk/getUsersThunk";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
const DeleteAccountTab = ({
  admin,
  deleteTitle,
  desc,
  confrimMsg,
  id,
  rolename,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false); // Track checkbox state
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* ========================= handleChangeConfirmCheckbox ========================= */
  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
  };
  const afterDel = () => {
    logoutHandler();
    navigate("/login");
  };
  /* ========================= handleDeleteAccount ========================= */
  const handleDeleteAccount = async () => {
    setShowModal(false); // Close modal
    try {
      let url = "/api/delete-user-account";
      url = id ? `${url}?id=${id}` : url;
      const response = await API.post(url, null);
      if (response?.data?.success) {
        if (id) {
          setShowModal(false);
          const fetchData = dispatch(fetchUsers(rolename));
          if (fetchData) navigate(ROUTES?.roleIndexPage);
        } else afterDel();
      }
    } catch (error) {
      setIsLoading(false);
      console.log("err", error);
    }
  };

  return (
    <>
      {!admin ? (
        <CardCommon
          cardTitle={deleteTitle ? deleteTitle : "Delete your account"}
          minHeight={230}
        >
          {showAlert &&
            apiResponseYes &&
            (apiResponse?.error ? (
              <Alert severity="error" onClose={() => setShowAlert(false)}>
                {apiResponse?.msg}
              </Alert>
            ) : (
              <Alert severity="success" onClose={() => setShowAlert(false)}>
                {apiResponse?.msg}
              </Alert>
            ))}
          <Box sx={{ mt: 3, mx: 4 }}>
            <Typography color={"text.secondary"} variant="body2">
              {desc
                ? desc
                : " When you delete your account, you lose access to SHG account services, and we permanently delete your personal data. You can cancel the deletion for 14 days."}
            </Typography>

            {/* ========================= Checkbox ========================= */}
            <FormControlLabel
              sx={{ color: "text.secondary" }}
              control={
                <BpCheckbox
                  checked={isConfirmed}
                  onChange={handleCheckboxChange}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  {confrimMsg
                    ? confrimMsg
                    : "  Confirm that I want to delete my account."}
                </Typography>
              }
            />

            {/* ========================= Submit Button with Tooltip ========================= */}
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Tooltip
                title="Please confirm if you are sure to delete your account by selecting checkbox."
                placement="top" // Tooltip will appear on top
                disableHoverListener={isConfirmed}
                disableFocusListener={isConfirmed}
                disableTouchListener={isConfirmed}
              >
                <span
                  style={{
                    cursor:
                      !isConfirmed || isLoading ? "not-allowed" : "pointer", // Apply cursor style on the span
                  }}
                >
                  {/* Wrap Button in a span to make tooltip work on a disabled button */}
                  <Button
                    onClick={() => setShowModal(true)}
                    variant="contained"
                    sx={{
                      // background: isConfirmed ? "#ED4C78" : "grey",
                      background: "#ED4C78",
                      marginTop: "1rem",
                      py: 1,
                      textTransform: "none",
                    }}
                    disabled={!isConfirmed || isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={23} sx={{ color: "white" }} />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>

          {/* ========================= Confirmation Modal ========================= */}
          <DeleteConfirmModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleDeleteAccount} // Call handleDeleteAccount on confirmation
            title="Confirm Account Deletion"
            bodyText="Are you sure to delete the account? This action cannot be undone."
            action={"Delete"}
          />
        </CardCommon>
      ) : (
        <UnderConstruction height={"100px"} />
      )}
    </>
  );
};

export default DeleteAccountTab;
