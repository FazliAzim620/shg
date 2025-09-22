import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Grid,
  Tooltip,
  IconButton,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
} from "@mui/material";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { CommonInputField } from "../../job-component/CreateJobModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CustomOutlineBtn from "../../button/CustomOutlineBtn";
import EastIcon from "@mui/icons-material/East";
import TakingUserPermissionsModal from "./TakingUserPermissionsModal";
import { ClearIcon } from "@mui/x-date-pickers";
import API from "../../../API";
import { getroles } from "../../../api_request";
import { useDispatch } from "react-redux";
import { fetchRoles } from "../../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import { logoutHandler, toSentenceCase } from "../../../util";
import { IosCommonSwitch } from "../../common/IosCommonSwitch";
import { useSelector } from "react-redux";
import { fetchUsersPermissions } from "../../../thunkOperation/userManagementModulethunk/getPermissionsThunk";
import ROUTES from "../../../routes/Routes";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "798px",
  width: "600px",
  minheight: "550px",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  pt: 1,
};

const AddRoleModal = ({ open, handleClose, darkMode, editRecord }) => {
  const [roleExist, setRoleExist] = useState(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [checkedRole, setCheckedRole] = useState([]);
  const { rolePermissions } = useSelector((state) => state?.users);
  const menuItems = rolePermissions?.permissions;
  useEffect(() => {
    dispatch(fetchUsersPermissions());
    if (editRecord) {
      setCheckedRole(editRecord?.permissions?.map((perm) => perm.id) || []);
    }
  }, [editRecord]);

  // Handle switch change
  const handlePermissionChange = (id) => {
    setCheckedRole((prev) =>
      prev.includes(id)
        ? prev.filter((moduleId) => moduleId !== id)
        : [...prev, id]
    );
    setError({});
  };

  const addRoleModalClose = () => {
    setRoleExist(null);
    setIsLoading(false);
    handleClose();
    setError({});
    setCheckedRole([]);
  };

  //========= initial states for handling form data
  const [formData, setFormData] = useState({
    name: "",
    id: "",
  });
  useEffect(() => {
    setFormData({
      name: toSentenceCase(editRecord?.description),
      id: editRecord?.id,
    });
  }, [open]);
  //=========handleChange for  form data fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error as the user types
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate the form fields explicitly
  const validateForm = () => {
    let hasError = false;
    let newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Role name is required!";
      hasError = true;
    }
    setError(newErrors);
    if (checkedRole?.length === 0) {
      newErrors.permissionError =
        "Define atleast one permission from following!";
      hasError = true;
    }
    setError(newErrors);
    return !hasError;
  };

  // Handle add role
  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails
    setIsLoading(true);
    setSuccess(false);

    try {
      const addRoleAndPermissionsData = new FormData();
      addRoleAndPermissionsData.append("name", formData?.name);
      addRoleAndPermissionsData.append("permissions", checkedRole?.join(",")),
        editRecord && addRoleAndPermissionsData.append("id", formData?.id);
      const response = await API.post(
        "/api/add-role",
        addRoleAndPermissionsData
      );
      if (response?.data?.success) {
        setSuccess(true);
        setFormData({ name: "", description: "", id: "" });
        setCheckedRole([]);
        const fetchedData = dispatch(fetchRoles(0));
        if (fetchedData) addRoleModalClose();
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        logoutHandler();
        navigate(ROUTES?.sessionExpired);
      } else setRoleExist(error?.response?.data?.msg);

      setIsLoading(false);
      console.log("err", error);
    }
  };

  const ModalTitleStyle = {
    fontSize: "0.875rem",
    mt: 2.5,
    fontWeight: 600,
    lineHeight: 1.2,
    color: "#1e2022",
  };
  return (
    <>
      <Modal open={open} onClose={addRoleModalClose}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              mx: 4,
            }}
          >
            {roleExist && (
              <Alert severity="error" onClose={() => setRoleExist(null)}>
                {roleExist}
              </Alert>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={ModalTitleStyle}>
                {editRecord ? "Edit Role" : "Create new Role"}
              </Typography>
              <ClearIcon
                sx={{ cursor: "pointer" }}
                onClick={addRoleModalClose}
              />
            </Box>
            {/* ========================= Role title ========================== */}
            <Grid
              sx={{
                my: 3,
              }}
              container
            >
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
                  sx={{
                    py: ".675rem",
                    color: "#1e2022",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Role Title{" "}
                  {/* <span style={{ fontWeight: 600, color: "red" }}>*</span> */}
                </Typography>
                <Tooltip
                  placement="right"
                  title="Enter the role title that will help identify this role in the system."
                >
                  <IconButton>
                    <HelpOutlineIcon
                      sx={{
                        fontSize: "18px",
                        color: "text.primary",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <span style={{ color: "red" }}>*</span>
              </Grid>
              <Grid item xs={12} md={9} height={12} sx={{ mb: 5 }}>
                <CommonInputField
                  placeholder="e.g., Recruiters, Client representatives"
                  error={!formData.name && error.name ? true : false}
                  name={"name"}
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                />
                <Typography variant="caption" color="error">
                  {error.name}
                </Typography>
              </Grid>
            </Grid>
            <Divider />

            {/* ========================= Taking Permissions ========================== */}
            <Box mt={0.8} display="flex" flexDirection="column">
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#1e2022",
                  fontWeight: 600,
                }}
              >
                Permissions <span style={{ color: "red" }}>*</span>
              </Typography>
              <Typography variant="caption" color="error">
                {error.permissionError}
              </Typography>
              <Box
                sx={{
                  maxHeight: { md: "230px", xl: "100%" },
                  overflowY: "auto",
                }}
              >
                {menuItems?.map((permission) => (
                  <Box
                    key={permission.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="9px 0"
                    pr={3}
                    // pb={4}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      {/* <img
                      src={permission.icon}
                      alt={`${permission.title} icon`}
                      style={{ width: "17px" }}
                    /> */}
                      <GppGoodOutlinedIcon
                        sx={{ color: "text.btn_blue", fontSize: "18px" }}
                      />
                      <Typography sx={{ color: "#1e2022", fontSize: "14px" }}>
                        {permission.name}
                      </Typography>
                    </Box>
                    <IosCommonSwitch
                      checked={checkedRole?.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ========================= invite users - yes or no ========================== */}
            {/* <Grid
              sx={{
                mb: 7,
              }}
              container
            >
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Would you like to invite users to this role right now?
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: { xs: 1, md: 0 } }}>
                <RadioGroup
                  row
                  value={selectedValue}
                  onChange={handleChange}
                  sx={{
                    display: "flex",
                    gap: 2,
                    px: 0,
                    mx: 0,
                  }}
                >
                  <FormControlLabel
                    sx={radioBtnBgStyling}
                    value="yes"
                    control={<Radio sx={radioStyling} />}
                    label="Yes"
                  />
                  <FormControlLabel
                    sx={{ ...radioBtnBgStyling, width: "48%" }}
                    value="no"
                    control={<Radio sx={radioStyling} />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
            </Grid> */}
          </Box>

          {/* <Divider /> */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", m: 3 }}>
            <CustomOutlineBtn
              text="Cancel"
              onClick={addRoleModalClose}
              hover={"text.btn_theme"}
              mr={1}
            />
            <Button
              disabled={isLoading}
              sx={{
                mt: 1.1,
                textTransform: "inherit",
                boxShadow: "none",
                height: "41.92px",
              }}
              backgroundcolor={"text.btn_blue"}
              // endIcon={<EastIcon />}
              // onClick={handleClickContinue}
              onClick={handleAddRole}
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
        </Box>
      </Modal>
    </>
  );
};

export default AddRoleModal;
