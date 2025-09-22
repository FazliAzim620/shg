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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Close,
  DeleteOutlineOutlined,
  Download,
  FileDownloadOutlined,
  PictureAsPdf,
} from "@mui/icons-material";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../../components/job-component/CommonSelect";
import { InputFilters } from "../../schedules/Filter";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../components/handleConfirmDelete";

import { DocumtnIcon } from "../Icons";
import { downloadHandlerFile } from "../../../util";
import { baseURLImage } from "../../../API";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PreviewContainer = styled(Box)(({ theme, darkmode }) => ({
  width: "100%",
  height: "100%",
  border: "1px solid rgba(231, 234, 243, .7)",
  borderRadius: "4px",

  backgroundColor: darkmode === "dark" ? "#333" : "#F6F7FA",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  // alignItems: "center",
  overflow: "hidden",
  // marginTop: "8px",
}));
// Custom PDF viewer to hide the header
const CustomPDFViewer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",

  "& object": {
    width: "100%",
    height: "calc(100% + 40px)",
  },
  "& iframe": {
    width: "100%",
    height: "calc(100% + 40px)",
    border: "none",
  },
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme, islightmode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px",
  padding: "8px",
  resize: "vertical",
  outline: "none",
  height: "100",
  transition: "box-shadow 0.2s",
  // backgroundColor: islightmode ? "#f8fafd" : "#25282A",
  color: islightmode ? "black" : "white",
  "&:focus": {
    boxShadow: " rgba(0, 0, 0, 0.09) 0px 3px 12px",
    // backgroundColor: islightmode ? "white" : "#25282A",
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

const UploadDocument = ({
  open,
  onClose,
  data,
  onSave,
  mode,
  rolesList,
  isLoading,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [viewDetails, setViewDetails] = useState(false);
  const [visibleIcons, setVisibleIcons] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    document_name: "",
    document_file: "",
    description: "",
    expires: "no",
    date: "",
    purpose: "download",
    roles: [],
  });
  const [errors, setErrors] = useState({
    document_name: false,
    document_file: false,
    description: false,
    expires: false,
    date: false,
    roles: false,
  });

  useEffect(() => {
    if (data && mode === "edit") {
      setPdfPreviewUrl(
        `${baseURLImage}api/preview-file/uploads/credentialing/organization/${data?.file_path}`
      );
      setFormData({
        id: data?.id,
        document_name: data?.name,
        document_file: data?.file_path || "",
        description: data?.description || "",
        date: "",
        purpose: data?.purpose || "download",
        roles:
          data?.provider_roles?.map((item) => item?.provider_role_id) || [],
      });
    } else if (mode === "add") {
      setFormData({
        document_name: "",
        document_file: "",
        description: "",
        expires: "no",
        date: "",
        purpose: "download",
        roles: [],
      });
    }
    setErrors({
      document_name: false,
      document_file: false,
      description: false,
      expires: false,
      roles: false,
    });
  }, [data, mode, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };
  const handleMultiSelectChange = (name, value) => {
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    let newErrors;
    newErrors = {
      roles: formData.roles?.length == 0,
      document_name: formData.document_name.trim() === "",
      document_file:
        !formData.document_file || formData.document_file == null
          ? true
          : data?.id
          ? false
          : formData.document_file === "" ||
            formData.document_file === undefined,
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      onSave(formData);
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
    setPdfPreviewUrl(null);
  };
  const editHandler = () => {
    setViewDetails(false);
    setFormData({
      document_name: data?.first_name,
      // roles: data.roles || [],
    });
  };

  const deleteDocumentHandler = () => {
    setFormData((prev) => ({
      ...prev,
      document_file: null,
    }));
    setPdfPreviewUrl(null);
    setDeleteDocument(false);
  };
  const closeModal = () => {
    setDeleteDocument(false);
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          minWidth: "400px",
        },
      }}
    >
      <ConfirmRoleModal
        isOpen={deleteDocument}
        onClose={closeModal}
        onConfirm={deleteDocumentHandler}
        // isLoading={isLoading}
        title={"Delete document file?"}
        action={"Delete "}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to delete this document file?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              This will remove the document file permanently. This action cannot
              be undone. Are you sure you want to proceed?
            </Typography>
          </Box>
        }
      />
      <Box sx={{ display: "flex" }}>
        {/* PDF Preview Panel */}
        <Box
          sx={{
            width: "50%",
            p: 4,
            borderRight: "1px solid rgba(231, 234, 243, .7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "text.black",
              mb: 2,
              alignSelf: "flex-start",
            }}
          >
            Document Preview
          </Typography>

          <PreviewContainer darkmode={darkMode}>
            {pdfPreviewUrl ? (
              <CustomPDFViewer>
                <iframe
                  src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="PDF Preview"
                />
              </CustomPDFViewer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  gap: 2,
                }}
              >
                <PictureAsPdf sx={{ fontSize: 60, color: "#d32f2f" }} />
                <Typography variant="body2" color="text.secondary">
                  Upload a PDF to see preview
                </Typography>
              </Box>
            )}
          </PreviewContainer>
        </Box>
        <Box>
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
              {mode === "add" ? "Upload document" : "Edit document"}
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
            <StyledTextarea
              minRows={3}
              name="description"
              value={formData?.description}
              onChange={handleChange}
              placeholder="Enter a brief note on why this document is required..."
              islightmode={darkMode}
              sx={{ mt: 1, height: "auto", fontFamily: "Inter, sans-serif" }}
            />
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
                  Purpose <span style={{ color: "red" }}>*</span>
                </Typography>
              </FormLabel>
              <RadioGroup
                onChange={handleChange}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="purpose"
                value={formData?.purpose}
              >
                <FormControlLabel
                  value="signature"
                  control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
                  label={
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "14px", fontWeight: 400 }}
                    >
                      Signature required
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="download"
                  control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
                  label={
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "14px", fontWeight: 400 }}
                    >
                      Download only{" "}
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
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
                options={rolesList}
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
                  Please select at least one role
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
              Upload document <span style={{ color: "red" }}>*</span>
            </Typography>
            {mode === "edit" && formData?.document_file ? (
              <Box
                onMouseEnter={() => setVisibleIcons(true)}
                onMouseLeave={() => setVisibleIcons(false)}
                sx={{
                  border: "1px dashed rgba(55, 125, 255, 1)",
                  borderRadius: "4px",
                  p: "1rem",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    border: "0.5px solid rgba(222, 226, 230, 1)",
                    bgcolor: "#f8f9fa",
                  },
                }}
              >
                <DocumtnIcon color={"#2196f3"} />
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: "calc(100% - 40px)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "capitalize",
                    color: "#2196f3",
                    paddingLeft: "0.3rem",
                  }}
                >
                  {formData?.document_file?.name
                    ? `${formData?.document_file?.name?.slice(0, 30)}...`
                    : `${formData?.document_file?.slice(0, 30)}...`}
                </span>

                {visibleIcons ? (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 5,
                      // display: "none",

                      alignItems: "center",
                      "&:hover": {
                        display: "flex",
                      },
                    }}
                  >
                    {formData?.document_file?.name ? (
                      ""
                    ) : (
                      <IconButton
                        onClick={() => {
                          downloadHandlerFile(formData?.document_file);
                          // const fileUrl = formData?.document_file;
                          // const link = document.createElement("a");
                          // link.href = URL.createObjectURL(fileUrl);
                          // link.download = fileUrl.name;
                          // link.click();
                        }}
                        sx={{ p: 0 }}
                      >
                        <FileDownloadOutlined sx={{ cursor: "pointer" }} />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => {
                        setDeleteDocument(true);
                      }}
                      sx={{ p: 0 }}
                    >
                      <DeleteOutlineOutlined
                        sx={{ cursor: "pointer", color: "text.error" }}
                      />
                    </IconButton>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            ) : (
              <ToggleButtonGroup
                // value={selectedValue}
                exclusive
                // onChange={onValueChange} // Use the function passed from the parent
                aria-label="toggle-button-group"
                fullWidth
                sx={{
                  width: "100%",
                  boxShadow: "none",
                  border: "1px solid rgba(206, 212, 218, 1)",
                }}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  sx={{
                    p: "8px 16px",
                    textTransform: "none",
                    color: "text.black",
                    border: "none",
                    borderRight: "1px solid rgba(206, 212, 218, 1)",
                    "&:hover": {
                      border: "none",
                      borderRight: "1px solid rgba(206, 212, 218, 1)",
                    },
                  }}
                >
                  Choose File
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files[0];

                      if (file) {
                        // if (file.type !== "application/pdf") {
                        //   // setFileError("Only PDF files are allowed");
                        //   alert("Only PDF files are allowed");

                        //   return;
                        // }
                        const fileUrl = URL.createObjectURL(file);
                        setPdfPreviewUrl(fileUrl);
                      }
                      setFormData((prev) => ({
                        ...prev,
                        ["document_file"]: event.target.files[0],
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        ["document_file"]: false,
                      }));
                    }}
                    multiple
                  />
                </Button>

                <ToggleButton
                  sx={{
                    border: "none",

                    //   flexGrow: 1,
                    width: "60%",
                    height: "2.6rem",
                    justifyContent: "flex-start",
                    textTransform: "capitalize",
                  }}
                >
                  {formData?.document_file
                    ? `${formData?.document_file?.name?.slice(0, 20)}...`
                    : " No file choosen"}
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            {errors.document_file && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                Please upload a document
              </Typography>
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
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;
