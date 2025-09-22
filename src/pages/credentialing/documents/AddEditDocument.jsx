import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  OutlinedInput,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  CircularProgress,
  styled,
  TextareaAutosize,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../../components/job-component/CommonSelect";
import { InputFilters } from "../../schedules/Filter";
import { selectOptions } from "../../../util";
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

const MultipleSelectCheckmarks = ({
  darkMode,
  options = [],
  name,
  value = [],
  onChange,
  error = false,
  countAppliedFilters,
}) => {
  const borderColor = error ? "#d32f2f" : `rgba(231, 234, 243, .7)`;
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Box>
      <FormControl sx={{ width: "100%" }}>
        <Select
          multiple
          value={value}
          onChange={(event) => {
            const { value } = event.target;
            onChange(
              name,
              typeof value === "string" ? value.split(",") : value
            );
          }}
          input={
            <OutlinedInput
              sx={{
                height: "2.6rem",
                color: "text.black",
                fontSize: "0.875rem",
                backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                border: `1px solid ${borderColor}`,
                "&.Mui-focused": {
                  backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                  color: darkMode === "dark" ? "#fff" : "text.black",
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
          renderValue={() => selectedLabels}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <BpCheckbox checked={value.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const AddEditDocument = ({
  open,
  onClose,
  data,
  onSave,
  mode,
  countAppliedFilters,
  clearFilter,
  documentTypes,
  isLoading,
  location,
}) => {
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const [viewDetails, setViewDetails] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    document_name: "",
    document_type: "",
    description: "",
    has_expire: "no",
    is_required: "no",
    status: 1,
    roles: [],
  });
  const [errors, setErrors] = useState({
    document_name: false,
    document_type: false,
    description: false,
    has_expire: false,
    is_required: false,
    roles: false,
  });

  useEffect(() => {
    if (mode === "view") {
      setViewDetails(true);
    } else {
      setViewDetails(false);
    }
    if (mode === "role") {
      setFormData({
        roles: data?.length > 0 ? data?.map((item) => item?.id) : [],
      });
    }
    if (mode === "Filter") {
      setFormData({
        roles: data?.roles || [],
        document_name: data?.document_name || "",
        document_type: data?.document_type || "",
        description: data?.description || "",
        has_expire: data?.has_expire || "no",
        is_required: data?.is_required || "no",
      });
    }
    if (data && mode === "edit") {
      setFormData({
        id: data?.id,
        roles:
          data?.provider_roles?.map((item) => item?.provider_role_id) || [],
        document_name: data?.name || "",
        document_type: data?.doc_type_id || "",
        description: data?.description || "",
        has_expire: data?.has_expiry ? "yes" : "no" || "no",
        is_required: data?.is_required ? "yes" : "no" || "no",
        status: data?.is_active ? 1 : 0 || 0,
        // roles: data.roles || [],
      });
    } else if (mode === "add") {
      setFormData({
        document_name: "",
        document_type: "",
        description: "",
        has_expire: "no",
        is_required: "no",
        roles: [],
      });
    }
    setErrors({
      document_name: false,
      document_type: false,
      description: false,
      has_expire: false,
      roles: false,
    });
  }, [data, mode, open]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "document_type") {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    } else {
      if (errors[name] && value.trim() !== "") {
        setErrors((prev) => ({
          ...prev,
          [name]: false,
        }));
      }
    }
  };
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "roles" && errors.roles && value.length > 0) {
      setErrors((prev) => ({
        ...prev,
        roles: false,
      }));
    }
  };

  const handleSave = () => {
    let newErrors;
    if (mode == "role") {
      newErrors = {
        roles: formData.roles.length === 0,
      };
    } else {
      newErrors = {
        roles: formData.roles?.length == 0,
        document_name: formData?.document_name?.trim() === "",
        document_type: formData?.document_type === "",
      };
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      if (mode === "role") {
        onSave(formData?.roles);
      } else {
        onSave(formData);
      }
    }
  };

  const handleFilter = () => {
    onSave(formData);
    if (!isLoading) {
      onClose();
    }
  };

  const handleClearFilter = () => {
    onClose();
    clearFilter();
  };
  const closeHandler = () => {
    onClose();
    setViewDetails(false);
  };
  const editHandler = () => {
    setViewDetails(false);
    setFormData({
      document_name: data?.first_name,
      // roles: data.roles || [],
    });
  };
  if (viewDetails) {
    return (
      <Drawer
        anchor="right"
        open={open}
        sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
      >
        <Box
          sx={{
            pt: "24px",
            px: 4,
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
            Defined document
          </Typography>
          <IconButton sx={{ mr: -2 }} onClick={closeHandler}>
            <Close />
          </IconButton>
        </Box>
        {/* Details section with grid layout */}
        <Box sx={{ p: 3, pb: 10, overflow: "auto" }}>
          <Grid container spacing={2}>
            {/* Selected roles */}
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(52, 58, 64, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Selected roles:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 600, color: "text.black" }}
              >
                Healthcare professionals, Doctors, Nurses
              </Typography>
            </Grid>

            {/* Document name */}
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(52, 58, 64, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Document name:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 600, color: "text.black" }}
              >
                SHG provider agreement
              </Typography>
            </Grid>

            {/* Document type */}
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(52, 58, 64, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Document type:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 600, color: "text.black" }}
              >
                Certificate
              </Typography>
            </Grid>

            {/* Description */}
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(52, 58, 64, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Description:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 600, color: "text.black" }}
              >
                Lorem ipsum dolor sit amet consectetur. Amet pharetra
                consectetur ac sit velit neque felis senectus. Dui mauris
                bibendum feugiat etiam.
              </Typography>
            </Grid>

            {/* has_Expire */}
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "rgba(52, 58, 64, 1)",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Expire:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "text.black",
                }}
              >
                Yes
              </Typography>
            </Grid>
          </Grid>
        </Box>
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
              fullWidth
              onClick={closeHandler}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={editHandler}
              sx={{ textTransform: "none", py: 1, width: "71px" }}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Drawer>
    );
  } else {
    return (
      <Drawer
        anchor="right"
        open={open}
        sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
      >
        <Box
          sx={{
            pt: "24px",
            px: 4,
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
            {mode === "add"
              ? "Define new document"
              : mode === "Filter"
              ? "Filter documents type"
              : "Edit document type"}
          </Typography>
          <IconButton sx={{ mr: -2 }} onClick={closeHandler}>
            <Close />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 4,
            pb: 11,
            flexGrow: 1,
            overflowY: "auto",
            height: "calc(100vh - 150px)",
            bgcolor: "background.paper",
          }}
        >
          {" "}
          <>
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
              darkMode={darkMode}
              name="roles"
              options={selectOptions(providerRolesList)}
              value={formData.roles}
              onChange={handleMultiSelectChange}
              error={errors.roles}
            />
            {errors.roles && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                At least one role is required
              </Typography>
            )}
          </>
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Document name <span style={{ color: "red" }}>*</span>
          </Typography>
          <CommonInputField
            name="document_name"
            placeholder="Enter the document name"
            value={formData.document_name}
            onChange={handleChange}
            error={errors.document_name}
          />
          {errors.document_name && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mt: 1 }}
            >
              Document name is required
            </Typography>
          )}
          {/* {mode === "edit" ? (
            <>
              <Typography
                pt={"24px"}
                pb={"8px"}
                sx={{
                  color: darkMode === "dark" ? "white" : "#1E2022",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Status
              </Typography>
              <CommonSelect
                height={"38px"}
                name="status"
                value={formData?.status}
                handleChange={handleChange}
                placeholder="Select document type"
                options={[
                  { label: "Active", value: 1 },
                  { label: "In active", value: 0 },
                ]}
              />
            </>
          ) : (
            ""
          )} */}
          {location == "reference" ? (
            ""
          ) : (
            <>
              <Typography
                pt={"24px"}
                pb={"8px"}
                sx={{
                  color: darkMode === "dark" ? "white" : "#1E2022",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Document type <span style={{ color: "red" }}>*</span>
              </Typography>
              <CommonSelect
                height={"38px"}
                name="document_type"
                value={formData?.document_type}
                handleChange={handleChange}
                placeholder="Select document type"
                options={selectOptions(documentTypes)}
              />

              {errors?.document_type && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 1 }}
                >
                  Select document type
                </Typography>
              )}
            </>
          )}
          {mode === "add" || mode === "edit" ? (
            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Description
            </Typography>
          ) : (
            ""
          )}
          {mode === "add" || mode === "edit" ? (
            <StyledTextarea
              minRows={3}
              name="description"
              value={formData?.description}
              onChange={handleChange}
              placeholder="Enter a brief note on why this document is required..."
              isLightMode={darkMode}
              sx={{ mt: 1, height: "auto", fontFamily: "Inter, sans-serif" }}
            />
          ) : (
            ""
          )}
          {location === "reference" ? (
            ""
          ) : (
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                <Typography
                  pt={"24px"}
                  pb={"8px"}
                  sx={{
                    color: darkMode === "dark" ? "white" : "#1E2022",
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                >
                  Expire
                </Typography>
              </FormLabel>
              <RadioGroup
                onChange={handleChange}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="has_expire"
                value={formData?.has_expire}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          )}
          <br />
          {location === "reference" ? (
            ""
          ) : (
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                <Typography
                  pt={"24px"}
                  pb={"8px"}
                  sx={{
                    color: darkMode === "dark" ? "white" : "#1E2022",
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                >
                  Required
                </Typography>
              </FormLabel>
              <RadioGroup
                onChange={handleChange}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="is_required"
                value={formData?.is_required}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          )}
        </Box>

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
          {mode === "Filter" ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: 1,
                px: 2,
                bgcolor: "background.paper",
              }}
            >
              {countAppliedFilters(data) ? (
                <Button
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
                  fullWidth
                  onClick={handleClearFilter}
                >
                  Clear all filters
                </Button>
              ) : (
                ""
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleFilter}
                sx={{ textTransform: "none", py: 1 }}
              >
                Show results
              </Button>
            </Box>
          ) : (
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
                fullWidth
                onClick={closeHandler}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                sx={{ textTransform: "none", py: 1, width: "71px" }}
              >
                {isLoading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : mode === "add" ? (
                  "Add"
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    );
  }
};

export default AddEditDocument;
