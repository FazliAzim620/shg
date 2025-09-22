import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Card,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
} from "@mui/material";
import { Close, PictureAsPdf, ExpandMore, Person, Computer, Schedule } from "@mui/icons-material";
import { useSelector } from "react-redux";
import ReactSignatureCanvas from "react-signature-canvas";
import { baseURLImage } from "../../../../API";
import PreviewForm from "../../../../pages/form-builder/PreviewForm";
import CustomChip from "../../../../components/CustomChip";
import { capitalizeFirstLetter } from "../../../../util";

// Helper function to format date
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const UploadDocument = ({
  open,
  onClose,
  data,
  onSave,
  mode,
  isLoading,
  userId,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isError, setIsError] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    document_name: "",
    document_file: "",
    signature: "",
    text_signature: "",
    purpose: "download",
    class: "",
  });
  const [activeTab, setActiveTab] = useState("draw");
  const sigCanvasRef = useRef(null);

  useEffect(() => {
    if (open) {
      const doc = data?.submitted_docs?.[data?.submitted_docs?.length - 1];
      setPdfPreviewUrl(
        `${baseURLImage}api/preview-file/uploads/credentialing/organization/${data?.file_path}`
      );

      setFormData({
        id: data?.id,
        document_name: data?.name || "",
        document_file: data?.file_path || "",
        signature: doc?.sig_text_file_path?.startsWith("data:image/")
          ? doc?.sig_text_file_path
          : "" || "",
        text_signature: doc?.sig_text_file_path?.startsWith("data:image/")
          ? ""
          : doc?.sig_text_file_path,
        purpose: data?.purpose || " ",
        class: data?.class || "",
      });

      // Render signature after slight delay to ensure canvas is ready
      setTimeout(() => {
        if (doc?.sig_text_file_path && activeTab === "draw") {
          try {
            sigCanvasRef.current.fromDataURL(doc.sig_text_file_path);
          } catch (error) {
            console.error("Failed to load signature on canvas", error);
          }
        }
      }, 200); // Short delay to ensure canvas has mounted
    }
  }, [data, mode, open]);

  const handleSave = () => {
    if (formData.signature || formData.text_signature) {
      onSave(formData);
    } else {
      setIsError(true);
    }
  };

  const closeHandler = () => {
    onClose();
    setPdfPreviewUrl(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClearSignature = () => {
    sigCanvasRef.current.clear();
    setFormData({ ...formData, signature: "" });
  };
  console.log("openEditHandler", data);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeHandler}
      sx={{
        "& .MuiDrawer-paper": {
          width: isMobile ? "100%" : "90vw",
          maxWidth: "1200px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            px: 4,
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {capitalizeFirstLetter(formData.document_name || "Document")}
            </Typography>
            <CustomChip
              dot
              dotColor={
                formData.purpose === "signature"
                  ? "rgba(255, 193, 7, 1)"
                  : "rgba(0, 201, 167, 1)"
              }
              chipText={
                formData.purpose === "signature"
                  ? "Signature required"
                  : "Download only"
              }
              color="rgba(103, 119, 136, 1)"
              bgcolor={
                formData.purpose === "signature"
                  ? "rgba(255, 193, 7, 0.1)"
                  : "rgba(0, 201, 167, 0.1)"
              }
            />
          </Box>
          <IconButton onClick={closeHandler}>
            <Close />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left - Preview */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRight: { md: "1px solid rgba(0,0,0,0.1)" },
              minHeight: 400,
              overflow: "auto",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Document Preview
            </Typography>
            <Box sx={{ width: "100%", height: 400, mb: 2 }}>
              {data?.json_structure ? (
                <PreviewForm data={JSON.parse(data?.json_structure)} readonly />
              ) : pdfPreviewUrl ? (
                <iframe
                  src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="PDF Preview"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <PictureAsPdf sx={{ fontSize: 60, color: "#d32f2f" }} />
                  <Typography variant="body2">
                    Upload a PDF to see preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right - Signature Input */}
          {formData.purpose === "download" ? (
            ""
          ) : (
            <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Signature <span style={{ color: "red" }}>*</span>
              </Typography>
              <Card
                sx={{
                  p: 2,
                  minHeight: "50px",

                  maxHeight: "350px",
                  boxShadow: "5px 0px 44px -4px rgba(0,0,0,0.1)",
                }}
              >
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab
                    label="Draw"
                    value="draw"
                    sx={{ textTransform: "none" }}
                  />
                  <Tab
                    label="Write"
                    value="write"
                    sx={{ textTransform: "none" }}
                  />
                </Tabs>
                {activeTab === "draw" && (
                  <Box sx={{ mt: 2 }}>
                    <ReactSignatureCanvas
                      ref={sigCanvasRef}
                      penColor="black"
                      backgroundColor="white"
                      onEnd={() => {
                        if (sigCanvasRef.current) {
                          setIsError(false);
                          const signatureData =
                            sigCanvasRef.current.toDataURL();
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            signature: signatureData,
                          }));
                        }
                      }}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "signature-canvas",
                      }}
                      // canvasProps={{
                      //   width: 500,

                      //   className: "signature-canvas",
                      //   style: {
                      //     boxShadow: "none",
                      //     border: "none",
                      //     borderRadius: 4,
                      //   },
                      // }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Button variant="outlined" onClick={handleClearSignature}>
                        Clear
                      </Button>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    minHeight: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeTab === "write" && (
                    <TextField
                      placeholder="Type your signature here"
                      fullWidth
                      variant="standard"
                      value={formData.text_signature}
                      onChange={(e) => {
                        setIsError(false);
                        setFormData({
                          ...formData,
                          text_signature: e.target.value,
                        });
                      }}
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          width: "80%",
                          fontSize: "24px",
                          fontWeight: 400,
                          mx: "auto",
                          paddingLeft: "8px",
                          "& input": {
                            outline: "none",
                            border: "none",
                          },
                          "& input::placeholder": {
                            fontSize: "24px",
                            fontWeight: 400,

                            color: "text.black",
                            opacity: 1,
                          },
                        },
                      }}
                      sx={{
                        mt: 2,
                        "& .MuiInputBase-root": {
                          border: "none",
                          borderLeft: "2px solid #000",
                          outline: "none",
                          boxShadow: "none",
                        },
                      }}
                    />
                  )}
                </Box>
              </Card>
              {isError ? (
                <Typography variant="caption" sx={{ color: "red" }}>
                  Signature required
                </Typography>
              ) : (
                ""
              )}
            </Box>
          )}
        </Box>

        {/* Submission Details Section - Always visible when userId is true and there are submitted_docs */}
        {userId && data?.submitted_docs && data.submitted_docs.length > 0 && (
          <Box sx={{ 
            p: 3, 
            borderTop: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "rgba(0,0,0,0.01)"
          }}>
            {/* Header */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              mb: 3,
              p: 2,
              backgroundColor: "rgba(25, 118, 210, 0.04)",
              borderRadius: 2,
              border: "1px solid rgba(25, 118, 210, 0.12)"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "50%", 
                  backgroundColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                    {data.submitted_docs.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Submission History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.submitted_docs.length} {data.submitted_docs.length === 1 ? 'submission' : 'submissions'} found
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={data.purpose === "signature" ? "Signature Required" : "Download Only"}
                color={data.purpose === "signature" ? "success" : "info"}
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {/* Submissions List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {data.submitted_docs.map((submission, index) => (
                <Card
                  key={submission.id || index}
                  sx={{
                    borderRadius: 1.5,
                    border: "1px solid rgba(0,0,0,0.08)",
                    backgroundColor: "background.paper",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)",
                    },
                  }}
                >
                  {/* Card Header */}
                  <Box sx={{ 
                    p: 2.5, 
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderBottom: "1px solid rgba(0,0,0,0.06)"
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: "50%", 
                          backgroundColor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                            {index + 1}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Submission #{index + 1}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(submission.dl_signed_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={data.purpose === "signature" ? "Signed" : "Downloaded"}
                        size="small"
                        color={data.purpose === "signature" ? "success" : "primary"}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <Box sx={{ p: 2.5 }}>
                    {/* Details Row */}
                    <Box sx={{ 
                      display: "grid", 
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
                      gap: 2,
                      mb: submission.sig_text_file_path ? 2 : 0
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Person sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Submitted by
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {submission.submitted_by?.name }
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Computer sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            IP Address
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ fontFamily: "monospace" }}>
                            {submission.device_ip || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Signature Section */}
                    {submission.sig_text_file_path && (
                      <Box sx={{ 
                        mt: 2, 
                        pt: 2, 
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        backgroundColor: "rgba(0,0,0,0.01)",
                        borderRadius: 1,
                        p: 2
                      }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: "text.primary" }}>
                          Signature
                        </Typography>
                        <Box sx={{ 
                          display: "flex", 
                          justifyContent: "center", 
                          alignItems: "center",
                          minHeight: "60px",
                          backgroundColor: "white",
                          borderRadius: 1,
                          border: "1px solid rgba(0,0,0,0.1)",
                          p: 2
                        }}>
                          {submission.sig_text_file_path.startsWith("data:image/") ? (
                            <Box
                              component="img"
                              src={submission.sig_text_file_path}
                              alt="Signature"
                              sx={{
                                maxWidth: "200px",
                                maxHeight: "80px",
                                borderRadius: 0.5,
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body1"
                              sx={{
                                fontStyle: "italic",
                                fontFamily: "cursive",
                                color: "text.primary",
                                textAlign: "center",
                                fontWeight: 500,
                                fontSize: "18px"
                              }}
                            >
                              {submission.sig_text_file_path}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "background.paper",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={closeHandler}>
              Cancel
            </Button>
            {formData?.purpose === "download" ? (
              ""
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : mode === "add" ? (
                  "Add"
                ) : (
                  "Save"
                )}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;