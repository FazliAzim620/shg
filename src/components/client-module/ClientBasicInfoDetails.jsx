import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  ToggleButtonGroup,
  styled,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { CommonInputField } from "../job-component/CreateJobModal";
import CustomButton from "../CustomButton";
import API from "../../API";
import {
  addCurrentClient,
  updateClientInfo,
} from "../../feature/client-module/clientSlice";
import { useDispatch } from "react-redux";
import ROUTES from "../../routes/Routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Close } from "@mui/icons-material";

const ClientBasicInfoDetails = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  const StyledSelect = styled(Select)({
    bgcolor: mode === "dark" ? " #333" : "#F8F9FA",
    border: "none",
    outline: "none",
  });

  const ErrorMessage = styled(Typography)({
    color: "red",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  });

  const { currentClient, status, error } = useSelector(
    (state) => state.clientBasicInfo
  );
  const location = useLocation();

  // Check if the URL contains '?edit'
  const isEdit = location.search.includes("edit");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(currentClient);
  const [phones, setPhones] = useState(currentClient.phones || []);
  const [errors, setErrors] = useState({});
  const phoneTypes = ["Mobile", "Home", "Work", "Other"];
  const [roles, setRoles] = useState([
    "Credentialing Coordinator",
    "MSP Coordinator",
    "VMS Manager",
    "Accounting Manager",
    "Director of Recruitment",
    "Scheduling Director",
    "Recruiter Manager",
    "VP of Recruitment",
    "Human Resources Manager",
  ]);

  const [newRole, setNewRole] = useState("");
  const [newRoleMessage, setNewRoleMessage] = useState("");
  const [openRoleDialog, setOpenRoleDialog] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Client name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phones.length) {
      newErrors.phones = "At least one phone number is required";
    } else {
      const phoneErrors = phones.map((phone) => {
        if (!phone.phone?.trim()) {
          return "Phone number is required";
        }

        return null;
      });
      if (phoneErrors.some((error) => error !== null)) {
        newErrors.phones = phoneErrors;
      }
    }

    // Validate primary contact name
    if (!formData.primary_contact_firstname?.trim()) {
      newErrors.primary_contact_firstname = "First name is required";
    }
    if (!formData.primary_contact_lastname?.trim()) {
      newErrors.primary_contact_lastname = "Last name is required";
    }

    // Validate primary contact role
    if (!formData.primary_contact_role?.trim()) {
      newErrors.primary_contact_role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRole = () => {
    const trimmedRole = newRole.trim();
    if (!trimmedRole) {
      setNewRoleMessage("Please enter role name");
      return;
    }
    if (trimmedRole && !roles.includes(trimmedRole)) {
      setRoles((prev) => [...prev, trimmedRole]);
      setFormData((prevData) => ({
        ...prevData,
        primary_contact_role: trimmedRole,
      }));
      setOpenRoleDialog(false);
      setNewRole("");
    } else {
      setNewRoleMessage("Role already exists");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhoneChange = (index, field, value) => {
    const updatedPhones = phones.map((phone, i) => {
      if (i === index) {
        return { ...phone, [field]: value };
      }
      return phone;
    });
    setPhones(updatedPhones);
    setFormData((prev) => ({
      ...prev,
      phones: updatedPhones,
    }));
    // Clear phone errors when modified
    if (errors.phones) {
      setErrors((prev) => ({ ...prev, phones: undefined }));
    }
  };

  const addPhone = () => {
    const newPhone = {
      phone: "",
      type: "Mobile",
      client_id: formData.id,
    };
    setPhones([...phones, newPhone]);
  };

  const removePhone = (index) => {
    const updatedPhones = phones.filter((_, i) => i !== index);
    setPhones(updatedPhones);
    setFormData((prev) => ({
      ...prev,
      phones: updatedPhones,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };
  const handleSave = async () => {
    if (validateForm()) {
      try {
        let url = `/api/edit-client`;
        setIsLoading(true);
        // Create new FormData instance
        const form = new FormData();
        // Add basic info
        form.append("id", formData?.id);
        form.append("data_type", "basic_information");
        form.append("name", formData?.name);
        form.append("email", formData?.email);
        form.append("primary_contact_email", formData?.primary_contact_email);

        // Handle phones array
        formData?.phones?.forEach((phone, index) => {
          form.append(`phones[${index}][number]`, phone.phone);
          form.append(`phones[${index}][type]`, phone.type);
        });

        // Add contact info
        form.append(
          "primary_contact_firstname",
          formData?.primary_contact_firstname
        );
        form.append(
          "primary_contact_lastname",
          formData?.primary_contact_lastname
        );
        form.append("primary_contact_role", formData?.primary_contact_role);

        const response = await API.post(url, form);
        if (response?.data?.success) {
          dispatch(updateClientInfo(response?.data?.data));
          const url = response?.data?.data?.name
            ?.toLowerCase()
            ?.replace(/ /g, "-");
          // const clientUrl = `${ROUTES.clientHome}${url}/12`;
          const clientUrl = `/${url}/details/${param.id}`;
          navigate(clientUrl);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }

      setIsEditing(false);
    } else {
      console.log("Form validation failed");
    }
  };

  const handleCancel = () => {
    setPhones(currentClient.phones || []);
    setFormData(currentClient);
    setIsEditing(false);
    setErrors({});
    setNewRole("");
    setNewRoleMessage("");
  };
  useEffect(() => {
    if (isEdit) {
      setIsEditing(true);
    }
  }, []); 
  const renderPhones = () => {
    if (!isEditing) {
      return phones?.map((phone, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
            {phone.phone} ({phone.type})
          </Typography>
        </Box>
      ));
    }

    return phones?.length > 0 ? (
      phones?.map((phone, index) => (
        <Box key={index}>
          <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
            <ToggleButtonGroup
              color="primary"
              exclusive
              aria-label="Platform"
              sx={{ width: "100%" }}
            >
              <CommonInputField
                isPhoneNumber={true}
                value={phone.phone}
                width={"86%"}
                onChange={(phone) => handlePhoneChange(index, "phone", phone)}
                placeholder="Enter phone number"
                error={errors.phones?.[index]}
                sx={{
                  flex: 2,
                  borderRadius: "5px",
                  bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                  "& fieldset": { border: "none" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                    backgroundColor: isLightMode ? "white" : "#25282A",
                  },
                  input: {
                    color: isLightMode ? "black" : "white",
                    height: "0.8rem",
                  },
                }}
              />

              <FormControl sx={{ height: "3rem" }}>
                <Select
                  value={phone.type}
                  onChange={(e) =>
                    handlePhoneChange(index, "type", e.target.value)
                  }
                  sx={{
                    height: "3rem",
                    width: "100%",
                    bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                    color: isLightMode ? "black" : "white",
                    "& fieldset": { border: "none" },
                  }}
                >
                  {phoneTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ToggleButtonGroup>
            {phones.length > 1 && (
              <IconButton
                onClick={() => removePhone(index)}
                sx={{ color: "error.main" }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
          {phones.length > 1
            ? errors.phones?.[index] && (
                <ErrorMessage>{errors.phones[index]}</ErrorMessage>
              )
            : ""}
        </Box>
      ))
    ) : (
      <Box>
        {errors.phones ? <ErrorMessage>{errors.phones}</ErrorMessage> : ""}
      </Box>
    );
  };
  return (
    <Box sx={{ py: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, pb: isEditing ? 2 : 0.5 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "21px",
            color: "text.black",
          }}
        >
          Basic information
        </Typography>
        {!isEditing && permissions?.includes("update clients info") && (
          <Button
            onClick={handleEdit}
            variant="text"
            sx={{ px: 0, textTransform: "none", mx: 0, minWidth: "auto" }}
          >
            Edit
          </Button>
        )}
      </Box>
      <Divider sx={{ opacity: 0.6 }} />

      <Grid container spacing={3} sx={{ px: 3, pt: 2 }}>
        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Client name
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                variant="outlined"
                sx={{
                  borderRadius: "5px",
                  bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                  height: "2.6rem",
                  "& fieldset": { border: "none" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    height: "2.75rem",
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                    backgroundColor: isLightMode ? "white" : "#25282A",
                  },
                  input: {
                    color: isLightMode ? "black" : "white",
                  },
                }}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
              {formData.name || "--"}
            </Typography>
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Phone numbers
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {phones?.length > 0 ? renderPhones() : ""}
          {isEditing && (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addPhone}
              sx={{
                mt: 1,
                color: "primary.main",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Add phone number
            </Button>
          )}
          {phones?.length === 0 ? renderPhones() : ""}
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
           Client email
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                variant="outlined"
                sx={{
                  borderRadius: "5px",
                  bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                  height: "2.6rem",
                  "& fieldset": { border: "none" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    height: "2.75rem",
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                    backgroundColor: isLightMode ? "white" : "#25282A",
                  },
                  input: {
                    color: isLightMode ? "black" : "white",
                  },
                }}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
              {formData.email || "--"}
            </Typography>
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Primary contact name
          </Typography>
        </Grid>

        <Grid item xs={9}>
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  name="primary_contact_firstname"
                  value={formData.primary_contact_firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  sx={{
                    width: "100%",
                    borderRadius: "5px",
                    bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                    height: "2.6rem",
                    "& fieldset": { border: "none" },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      height: "2.75rem",
                      boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                      backgroundColor: isLightMode ? "white" : "#25282A",
                    },
                    input: {
                      color: isLightMode ? "black" : "white",
                    },
                  }}
                />
                {errors.primary_contact_firstname && (
                  <ErrorMessage>
                    {errors.primary_contact_firstname}
                  </ErrorMessage>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  name="primary_contact_lastname"
                  value={formData.primary_contact_lastname}
                  onChange={handleChange}
                  placeholder="Last name"
                  sx={{
                    width: "100%",
                    borderRadius: "5px",
                    bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                    height: "2.6rem",
                    "& fieldset": { border: "none" },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      height: "2.75rem",
                      boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                      backgroundColor: isLightMode ? "white" : "#25282A",
                    },
                    input: {
                      color: isLightMode ? "black" : "white",
                    },
                  }}
                />
                {errors.primary_contact_lastname && (
                  <ErrorMessage>{errors.primary_contact_lastname}</ErrorMessage>
                )}
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
              {`${formData.primary_contact_firstname || ""} ${
                formData.primary_contact_lastname || ""
              }`.trim() || "--"}
            </Typography>
          )}
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
           Primary contact email
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                name="primary_contact_email"
                value={formData.primary_contact_email}
                onChange={handleChange}
                error={!!errors.primary_contact_email}
                variant="outlined"
                sx={{
                  borderRadius: "5px",
                  bgcolor: isLightMode ? "#F6F7Fa" : "#333",
                  height: "2.6rem",
                  "& fieldset": { border: "none" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    height: "2.75rem",
                    boxShadow:
                      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                    backgroundColor: isLightMode ? "white" : "#25282A",
                  },
                  input: {
                    color: isLightMode ? "black" : "white",
                  },
                }}
              />
              {errors.primary_contact_email && <ErrorMessage>{errors.primary_contact_email}</ErrorMessage>}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
              {formData.primary_contact_email || "--"}
            </Typography>
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Primary contact role
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {isEditing ? (
            <StyledSelect
              displayEmpty
              size="small"
              name="primary_contact_role"
              value={formData.primary_contact_role}
              onChange={handleChange}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.or_color",
                        fontSize: "0.875rem",
                        fontWeight: 400,
                      }}
                    >
                      Select role
                    </Typography>
                  );
                }
                return selected;
              }}
              input={
                <OutlinedInput
                  sx={{
                    height: "2.6rem",
                    "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                      {
                        padding: 0,
                      },

                    fontSize: "0.875rem",

                    border: `none`,
                    "&.Mui-focused": {
                      backgroundColor: mode === "dark" ? "#333" : "#fff",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    },
                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: `1.5px solid rgba(231, 234, 243, .7)`,
                      },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none",
                      },
                  }}
                />
              }
              sx={{
                minWidth: "200px",
                width: "100%",
                backgroundColor: mode === "dark" ? "#333" : "#F6F7FA",
                color: mode === "dark" ? "#F6F7FA" : "text.black",
                border:
                  mode === "dark"
                    ? `1.5px solid rgba(231, 234, 243, .7)`
                    : "none",
              }}
            >
              <MenuItem disabled value="">
                Select role
              </MenuItem>
              {roles?.map((role, index) => (
                <MenuItem key={index} value={role}>
                  {role}
                </MenuItem>
              ))}
            </StyledSelect>
          ) : (
            <Typography variant="body1" sx={{ fontSize: "0.875rem" }}>
              {formData.primary_contact_role || "--"}
            </Typography>
          )}
          <ErrorMessage>{errors.primary_contact_role}</ErrorMessage>
          {isEditing && (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenRoleDialog(true)}
              sx={{
                mt: 1,
                color: "primary.main",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Add custom role/title
            </Button>
          )}
        </Grid>
      </Grid>

      {isEditing && (
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1} mr={3}>
          <Button
            onClick={handleCancel}
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
                color: "text.btn_blue",
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
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{
              minWidth: "120px",
              textTransform: "capitalize",
              bgcolor: "background.btn_blue",
            }}
          >
            {isLoading ? (
              <CircularProgress size={18} sx={{ color: "inherit" }} />
            ) : (
              " Save changes"
            )}
          </Button>
        </Box>
      )}
      <Dialog
        open={openRoleDialog}
        onClose={() => {
          setOpenRoleDialog(false);
          setNewRoleMessage("");
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "0.875rem",
            color: "text.black",
          }}
        >
          Add Custom Role
        </DialogTitle>
        <DialogContent
          sx={{
            py: 0,
            px: 2,
            minWidth: { xs: "100%", md: "450px" },
            overflow: "hidden",
            height: "80px",
          }}
        >
          <CommonInputField
            name="role"
            placeholder="e.g Manager"
            value={newRole}
            onChange={(e) => {
              setNewRole(e.target.value);
              setNewRoleMessage("");
            }}
            type="text"
          />
          {newRoleMessage && <ErrorMessage>{newRoleMessage}</ErrorMessage>}
        </DialogContent>
        <DialogActions sx={{ mt: 3, mb: 1, px: 2 }}>
          <CustomButton
            label="Cancel"
            onClick={() => {
              setNewRoleMessage("");
              setOpenRoleDialog(false);
            }}
          />
          <CustomButton
            label="Add"
            onClick={handleAddRole}
            variant="contained"
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientBasicInfoDetails;
