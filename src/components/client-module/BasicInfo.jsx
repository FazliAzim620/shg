import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  styled,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  OutlinedInput,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Close, DeleteOutline } from "@mui/icons-material";
import { CommonInputField } from "../job-component/CreateJobModal";
import CustomButton from "../CustomButton";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addPhone,
  removePhone,
  updatePhone,
  updateSection,
} from "../../feature/client-module/clientSlice";

const ErrorMessage = styled(Typography)({
  color: "red",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
});

export default function BasicInfo({ errors }) {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);

  const { basicInfo } = useSelector((state) => state.clientBasicInfo);

  const StyledSelect = styled(Select)({
    // backgroundColor: "#F8F9FA",
    bgcolor: darkMode === "dark" ? " #333" : "#F8F9FA",
    border: "none",
    outline: "none",
  });
  const StyledTypography = styled(Typography)({
    color: darkMode === "dark" ? " #F8F9FA" : "black",
    marginTop: "0.5rem",
    fontWeight: 400,
    fontSize: "0.875rem",
  });
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

  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newRoleMessage, setNewRoleMessage] = useState("");

  const handleAddRole = () => {
    const trimmedRole = newRole.trim(); // Remove whitespace from start and end
    if (!trimmedRole) {
      setNewRoleMessage("Please enter role name");
      return;
    }
    if (trimmedRole && !roles.includes(trimmedRole)) {
      setRoles([...roles, trimmedRole]);

      dispatch(
        updateSection({
          section: "basicInfo",
          field: "role",
          value: trimmedRole,
        })
      );
      setOpenRoleDialog(false);
      setNewRole("");
    } else {
      setNewRoleMessage("Role already exist");
    }
  };

  const handleAddPhone = () => {
    // setPhones([...phones, { number: "", type: "Mobile" }]);
    dispatch(addPhone());
  };

  const handlePhoneChange = (index, field, value) => {
    if (field === "number") {
      errors["phone"] = "";
    }
    // if (field === "number" && !/^\d*$/.test(value)) {
    //   errors["phone"] = "";
    //   // Optionally, you can add a notification or error handling here
    //   console.warn("Only numeric values are allowed for phone number.");
    //   return; // Exit the function early
    // }
    dispatch(
      updatePhone({
        index,
        field,
        value,
      })
    );
  };
  const handleRemovePhone = (index) => {
    dispatch(removePhone({ index }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    errors[name] = "";
    dispatch(updateSection({ section: "basicInfo", field: name, value }));
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3.5}>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Client name <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonInputField
            name="clientName"
            placeholder="e.g., ABC Hospital"
            value={basicInfo?.clientName}
            // onChange={(e) => setClientName(e.target.value)}
            onChange={handleChange}
          />

          {errors?.clientName && (
            <ErrorMessage>{errors.clientName}</ErrorMessage>
          )}
        </Grid>
        {/* Client email field */}
        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Client email <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonInputField
            name="clientEmail"
            placeholder="client@company.com"
            value={basicInfo?.clientEmail || ""}
            onChange={handleChange}
          />
          {errors?.clientEmail && (
            <ErrorMessage>{errors.clientEmail}</ErrorMessage>
          )}
        </Grid>
        {/* ---------------------------------------------------------------------------- contact name */}
        <Grid item xs={3} sx={{}}>
          <StyledTypography variant="body1">
            Primary contact name <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <Grid container>
            <Grid item xs={6}>
              <CommonInputField
                name="firstName"
                placeholder="First name e.g., John"
                value={basicInfo?.firstName}
                onChange={handleChange}
              />
              {errors?.firstName && (
                <ErrorMessage>{errors.firstName}</ErrorMessage>
              )}
            </Grid>
            <Grid item xs={6}>
              <CommonInputField
                name="lastName"
                placeholder="Last name e.g., Doe"
                value={basicInfo?.lastName}
                onChange={handleChange}
              />
              {errors?.lastName && (
                <ErrorMessage>{errors.lastName}</ErrorMessage>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* ---------------------------------------------------------------------------- contact role */}
        <Grid item xs={3} sx={{}}>
          <StyledTypography variant="body1">
            {" "}
            Primary contact role/title <span style={{ color: "red" }}>
              *
            </span>{" "}
          </StyledTypography>
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: 2,
          }}
        >
          <StyledSelect
            displayEmpty
            size="small"
            value={basicInfo?.role}
            name="role"
            // onChange={(e) => setRole(e.target.value)}

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
                    backgroundColor: darkMode === "dark" ? "#333" : "#fff",
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
                  "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
            }
            sx={{
              minWidth: "200px",
              backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
              color: darkMode === "dark" ? "#F6F7FA" : "text.black",
              border:
                darkMode === "dark"
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
          {errors?.role && <ErrorMessage>{errors.role}</ErrorMessage>}
          <Button
            startIcon={<Add sx={{ width: 16 }} />}
            onClick={() => setOpenRoleDialog(true)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Add custom role/title
          </Button>
        </Grid>

        <Grid item xs={12}>
          {basicInfo?.phones?.map((phone, index) => (
            <Grid container sx={{ mt: index !== 0 && 3 }} key={index}>
              <Grid item xs={3} sx={{}}>
                <StyledTypography variant="body1">
                  Phone {index === 0 ? "(Primary Contact)" : index + 1}
                  <span style={{ color: "red" }}>*</span>{" "}
                </StyledTypography>
              </Grid>
              <Grid item xs={9} sx={{}}>
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  aria-label="Platform"
                  sx={{ width: "100%" }}
                >
                  <CommonInputField
                    isPhoneNumber={true}
                    width={"100%"}
                    name={`phone-${index}`}
                    placeholder="(xxx)xxx-xx-xx"
                    value={phone?.number}
                    onChange={(e) => handlePhoneChange(index, "number", e)}
                  />
                  <StyledSelect
                    displayEmpty
                    size="small"
                    name="role"
                    value={phone?.type}
                    onChange={(e) =>
                      handlePhoneChange(index, "type", e.target.value)
                    }
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.or_color" }}
                          >
                            Select
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
                            backgroundColor:
                              darkMode === "dark" ? "#333" : "#fff",
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
                      minWidth: "120px",
                      backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                      color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                      border:
                        darkMode === "dark"
                          ? `1.5px solid rgba(231, 234, 243, .7)`
                          : "none",
                    }}
                  >
                    <MenuItem value="Mobile">Mobile</MenuItem>
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Work">Work</MenuItem>
                    <MenuItem value="Fax">Fax</MenuItem>
                  </StyledSelect>

                  {basicInfo?.phones?.length > 1 && (
                    <IconButton
                      onClick={() => handleRemovePhone(index)}
                      sx={{ color: "error.main" }}
                    >
                      <Close />
                    </IconButton>
                  )}
                </ToggleButtonGroup>
                {errors?.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} mt={-2}>
          <Grid container>
            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
              <Button
                startIcon={<Add sx={{ width: 16 }} />}
                onClick={handleAddPhone}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add another phone number
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography variant="body1">
            Email (Primary Contact) 
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonInputField
            name="email"
            placeholder="clarice@site.com"
            value={basicInfo?.email}
            onChange={handleChange}
          />
          {errors?.email && <ErrorMessage>{errors?.email}</ErrorMessage>}
        </Grid>
      </Grid>

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
              setOpenRoleDialog(false);
              setNewRoleMessage("");
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
}
