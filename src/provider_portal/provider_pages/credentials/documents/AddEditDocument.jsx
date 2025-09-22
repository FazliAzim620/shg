import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  styled,
} from "@mui/material";
import { Close, PictureAsPdf } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
import { baseURLImage } from "../../../../API";

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
  overflow: "hidden",
}));

const CustomPDFViewer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  "& iframe": {
    width: "100%",
    height: "calc(100% + 40px)",
    border: "none",
  },
}));

const AddEditDocument = ({ open, onClose, data, onSave, mode, isLoading }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [isFileUploaded, setisFileUploaded] = useState(false);
  const [formData, setFormData] = useState({
    document_name: "",
    document_file: null,
    issue_date: "",
    expiry_date: "",
  });
  const [filters, setFilters] = useState({
    status: [],
    approval: [],
    expiry_start: "",
    expiry_end: "",
  });
  const [errors, setErrors] = useState({
    document_name: false,
    document_file: false,
    issue_date: false,
    expiry_date: false,
  });

  useEffect(() => {
    if (mode === "Filter") {
      setFilters({
        status: [],
        approval: [],
        expiry_start: "",
        expiry_end: "",
      });
    }
    if (data && mode === "edit") {
      const expiry = data?.expiry_date;
      const issueDate = data?.issue_date;
      setisFileUploaded(false);
      setFormData({
        document_name: data?.document_name || "",
        document_file: data?.document_file || null,
        issue_date: issueDate || "",
        expiry_date: expiry || "",
      });
    } else if (mode === "add") {
      setFormData({
        document_name: "",
        document_file: null,
        issue_date: "",
        expiry_date: "",
      });
    }
    setErrors({
      document_name: false,
      document_file: false,
      issue_date: false,
      expiry_date: false,
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

  const handleSave = () => {
    const newErrors = {
      // document_name: formData.document_name.trim() === "",
      document_file: isFileUploaded ? !formData.document_file : false,
      issue_date: false,
      expiry_date: false,
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      // onSave(formData);
      const dataToSave = { ...formData };

      if (!isFileUploaded) {
        delete dataToSave.document_file; // Remove document_file if no new file uploaded
      }

      onSave(dataToSave);
    }
  };

  const closeHandler = () => {
    onClose();
  };

  const pdfPreviewUrl = formData.document_file
    ? typeof formData.document_file === "string"
      ? `${baseURLImage}api/preview-file/uploads/credentialing/documents/${formData.document_file}`
      : URL.createObjectURL(formData.document_file)
    : null;
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
      <Box sx={{ display: "flex", width: "100%" }}>
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
            minWidth: { md: "400px" },
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
        <Box sx={{ minWidth: { md: "400px" } }}>
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
            {data?.has_issue_date || mode == "edit" ? (
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
                  Issue date
                </Typography>
                <CommonInputField
                  name="issue_date"
                  placeholder="Select issue date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  error={errors.issue_date}
                  type="date"
                />
              </>
            ) : (
              ""
            )}
            {data?.has_expiry || mode == "edit" ? (
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
                  Expiry date
                </Typography>
                <CommonInputField
                  name="expiry_date"
                  placeholder="Select expiry date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  error={errors.expiry_date}
                  type="date"
                />
              </>
            ) : (
              ""
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
              Upload document <span style={{ color: "red" }}>*</span>
            </Typography>
            <ToggleButtonGroup
              exclusive
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
                      setisFileUploaded(true);
                      setFormData((prev) => ({
                        ...prev,
                        document_file: file,
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        document_file: false,
                      }));
                    }
                  }}
                  accept="application/pdf"
                />
              </Button>
              <ToggleButton
                sx={{
                  border: "none",
                  width: "60%",
                  height: "2.6rem",
                  justifyContent: "flex-start",
                  textTransform: "capitalize",
                }}
              >
                {formData?.document_file?.name
                  ? `${formData?.document_file?.name?.slice(0, 20)}...`
                  : "No file chosen"}
              </ToggleButton>
            </ToggleButtonGroup>
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
                disabled={isLoading}
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

export default AddEditDocument;
