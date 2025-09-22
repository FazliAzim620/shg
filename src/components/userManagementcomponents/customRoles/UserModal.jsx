import React, { useEffect, useState } from "react";
import CardCommon from "../../../components/CardCommon";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useDispatch } from "react-redux";
import API from "../../../API";
import { fetchUserInfo } from "../../../thunkOperation/auth/loginUserInfo";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import CloseIcon from "@mui/icons-material/Close";
import CustomOutlineBtn from "../../button/CustomOutlineBtn";
import { fetchUsers } from "../../../thunkOperation/userManagementModulethunk/getUsersThunk";
import { logoutHandler } from "../../../util";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes/Routes";
// ================================= component ==================================
const UserModal = ({
  handleClose,
  ModalTitleStyle,
  open,
  rolename,
  editRecord,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      first_name: editRecord?.first_name,
      last_name: editRecord?.last_name,
      email: editRecord?.email,
    });
  }, [editRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError((prevErr) => ({
      ...prevErr,
      [name]: "",
    }));
  };
  const closeModal = () => {
    handleClose();
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
    });
    setError({
      first_name: "",
      last_name: "",
      email: "",
    });
  };
  // =============================== api call ===============================
  const handleAddUser = async (e) => {
    let hasError = false;
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate first Name
    if (!formData.first_name) {
      setError((prevError) => ({
        ...prevError,
        first_name: "First name is required!",
      }));
      hasError = true;
    } else if (formData.first_name.length < 3) {
      setError((prevError) => ({
        ...prevError,
        first_name: "Name should be at least 3 characters!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, first_name: "" }));
    }
    // Validate last Name
    if (!formData.last_name) {
      setError((prevError) => ({
        ...prevError,
        last_name: "Last name is required!",
      }));
      hasError = true;
    } else if (formData.last_name.length < 3) {
      setError((prevError) => ({
        ...prevError,
        last_name: "Name should be at least 3 characters!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, last_name: "" }));
    }
    // Validate email
    if (!formData.email?.trim()) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required!",
      }));
      hasError = true;
    } else if (!emailRegex.test(formData.email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter valid Email!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, email: "" }));
    }
    if (!hasError) {
      const handleAddUserData = new FormData();
      handleAddUserData.append("first_name", formData?.first_name);
      handleAddUserData.append("last_name", formData?.last_name);
      handleAddUserData.append("email", formData?.email);
      handleAddUserData.append("role", rolename);
      editRecord && handleAddUserData.append("id", editRecord?.id);

      setIsLoading(true);
      try {
        const response = await API.post("/api/add-user", handleAddUserData);
        const data = response.data;
        const fetchedData = dispatch(fetchUsers({ role: rolename, status: 1 }));
        if (fetchedData) {
          closeModal();
          setIsLoading(false);
        }
        return data;
      } catch (error) {
        if (error?.response?.status == 401) {
          logoutHandler();
          navigate(ROUTES?.sessionExpired);
        } else
          setError((prevError) => ({
            ...prevError,
            email: error?.response?.data?.message,
          }));

        setIsLoading(false);
        console.log("err", error);
      }
    }
  };
  return (
    <Modal open={open} onClose={closeModal}>
      <Box
        sx={{
          // width: "798px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          px: 4,
          pb: 3,
          pt: 1.5,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            mb: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={ModalTitleStyle}>
            {editRecord ? "Edit User" : "Invite users"}
          </Typography>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={closeModal} />
        </Box>
        <form onSubmit={handleAddUser} style={{ marginRight: "9px" }}>
          <Grid container>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Full Name{" "}
                <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4.5} sx={{ mb: { xs: 1, md: 0 } }}>
              <CommonInputField
                error={!formData.first_name && error.first_name ? true : false}
                name={"first_name"}
                placeholder="e.g., John"
                value={formData.first_name}
                onChange={handleChange}
                type="text"
              />
              <Typography variant="caption" color="error">
                {error.first_name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4.5} sx={{}}>
              <CommonInputField
                error={!formData.last_name && error.last_name ? true : false}
                name={"last_name"}
                placeholder="e.g.,  Doe"
                value={formData.last_name}
                onChange={handleChange}
                type="text"
              />
              <Typography variant="caption" color="error">
                {error.last_name}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={3} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "14px",
                }}
              >
                Email <span style={{ fontWeight: 600, color: "red" }}>*</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={9} sx={{}}>
              <CommonInputField
                error={!formData.email && error.email ? true : false}
                name={"email"}
                placeholder="e.g., mark@site.com"
                value={formData.email}
                onChange={handleChange}
                type="text"
              />
              <Typography variant="caption" color="error">
                {error.email}
              </Typography>
            </Grid>
          </Grid>
          {/* ================================== form cancel save btn =================================== */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <CustomOutlineBtn
              text="Cancel"
              onClick={closeModal}
              hover={"text.btn_theme"}
              mr={1}
            />
            <Button
              disabled={isLoading}
              type="submit"
              sx={{
                mt: 1.1,
                textTransform: "inherit",
                boxShadow: "none",
                height: "41.92px",
              }}
              backgroundcolor={"text.btn_blue"}
              // endIcon={<EastIcon />}
              // onClick={handleClickContinue}
              // onClick={handleAddRole}
              variant="contained"
            >
              {/* Continue */}
              {isLoading ? (
                <CircularProgress
                  size={23}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UserModal;
