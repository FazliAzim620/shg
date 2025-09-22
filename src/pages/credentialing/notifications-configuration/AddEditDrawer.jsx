import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import MultipleSelectCheckmarks from "../../../components/common/MultipleSelectCheckmarks";
import { useSelector } from "react-redux";
import RichTextEditor from "../../../components/RichTextEditor";
import EditContent from "./EditContent";

const AddEditDrawer = ({
  open,
  onClose,
  onSave,
  initialData = null,
  isEdit = false,
  mode,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    triggerEvent: [],
    emailSubject: "",
    emailBody: "",
    roles: [],
  });
  const [errors, setErrors] = useState({});
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // if ( errors.roles && value.length > 0) {
    setErrors((prev) => ({
      ...prev,
      roles: false,
    }));
    // }
  };
  useEffect(() => {
    // If in edit mode and initialData is provided, populate the form
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        triggerEvent: initialData.triggerEvent || [],
        emailSubject: initialData.emailSubject || "",
        emailBody: initialData.emailBody || "",
        roles: initialData.roles || [],
      });
    }
  }, [initialData, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Notification name is required";
    if (formData.triggerEvent?.length < 1)
      newErrors.triggerEvent = "Trigger event is required";
    if (!formData.emailSubject.trim())
      newErrors.emailSubject = "Email subject is required";
    if (!formData.emailBody.trim())
      newErrors.emailBody = "Email body is required";
    if (formData.roles.length === 0)
      newErrors.roles = "At least one role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;

    setFormData({
      ...formData,
      roles: typeof value === "string" ? value.split(",") : value,
    });

    if (errors.roles) {
      setErrors({
        ...errors,
        roles: undefined,
      });
    }
  };

  const handleDelete = (roleToDelete) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((role) => role !== roleToDelete),
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  const onCloseHandler = () => {
    onClose();
    setErrors({});
    setFormData({
      name: "",
      description: "",
      triggerEvent: [],
      emailSubject: "",
      emailBody: "",
      roles: [],
    });
  };
  const ROLES = [
    { value: "Healthcare professionals", label: "Healthcare professionals" },
    { value: "Doctors  ", label: "  Doctors" },
    { value: "Nurses  ", label: "  Nurses" },
  ];
  const options = [{ label: "Document created", value: "Document created" }];
  return (
    <Drawer
      anchor="right"
      open={open}
      onCloseHandler={onCloseHandler}
      sx={{ "& .MuiDrawer-paper": { width: "450px", maxWidth: "100%" } }}
    >
      <Box
        sx={{
          pt: "24px",
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "text.black",
          }}
        >
          {isEdit
            ? "Edit notification"
            : mode === "view"
            ? "Preview"
            : "Add new notification"}
        </Typography>
        <IconButton sx={{ mr: -2 }} onClick={onCloseHandler}>
          <Close />
        </IconButton>
      </Box>

      {/* Form content */}
      {mode === "view" ? (
        <EditContent />
      ) : (
        <Box sx={{ p: 3, pb: 10, overflow: "auto" }}>
          <Typography
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Notification name <span style={{ color: "red" }}>*</span>
          </Typography>
          <CommonInputField
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter the document name"
            error={errors.document_name}
          />{" "}
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Description <span style={{ color: "red" }}>*</span>
          </Typography>
          <CommonInputField
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write description for notification..."
            multiline
          />
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Trigger event<span style={{ color: "red" }}>*</span>
          </Typography>
          <MultipleSelectCheckmarks
            // darkMode={darkMode}

            options={options}
            name="triggerEvent"
            value={formData.triggerEvent}
            onChange={handleMultiSelectChange}
          />
          {/* <FormControl fullWidth margin="normal" error={!!errors.triggerEvent}>
          <InputLabel required>Trigger event</InputLabel>
          <Select
            name="triggerEvent"
            value={formData.triggerEvent}
            onChange={handleInputChange}
            label="Trigger event"
            displayEmpty
            renderValue={(selected) => selected || "Select trigger event"}
          >
            <MenuItem value="document_created">Document created</MenuItem>
            <MenuItem value="document_updated">Document updated</MenuItem>
            <MenuItem value="document_deleted">Document deleted</MenuItem>
            <MenuItem value="document_shared">Document shared</MenuItem>
          </Select>
          {errors.triggerEvent && (
            <FormHelperText>{errors.triggerEvent}</FormHelperText>
          )}
        </FormControl> */}
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Email subject <span style={{ color: "red" }}>*</span>
          </Typography>
          <CommonInputField
            name="emailSubject"
            value={formData.emailSubject}
            onChange={handleInputChange}
            placeholder="Enter the document name"
            required
            error={!!errors.emailSubject}
            helperText={errors.emailSubject}
          />
          <RichTextEditor
            name="emailBody"
            value={formData.emailBody}
            onChange={(content) =>
              setFormData({
                ...formData,
                ["emailBody"]: content,
              })
            }
          />
          {/* <FormControl fullWidth margin="normal" error={!!errors.emailBody}>
          <InputLabel htmlFor="email-body" shrink>
            Email body
          </InputLabel>
          <TextField
            name="emailBody"
            value={formData.emailBody}
            onChange={handleInputChange}
            placeholder="Write the email content..."
            multiline
            rows={4}
            required
            error={!!errors.emailBody}
          />
          {errors.emailBody && (
            <FormHelperText>{errors.emailBody}</FormHelperText>
          )}
        </FormControl> */}
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Roles <span style={{ color: "red" }}>*</span>
          </Typography>
          <MultipleSelectCheckmarks
            // darkMode={darkMode}

            options={ROLES}
            name="roles"
            value={formData.roles}
            onChange={handleMultiSelectChange}
          />
        </Box>
      )}

      {/* Footer with action buttons */}
      <Box
        sx={{
          p: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: 1,
            px: 2,
          }}
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
            onClick={onCloseHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ textTransform: "none", py: 1, width: "71px" }}
          >
            {isEdit ? "Save" : "Add"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddEditDrawer;
