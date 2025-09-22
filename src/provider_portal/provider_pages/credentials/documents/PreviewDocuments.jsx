import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  styled,
  Card,
  Divider,
  Skeleton,
  Tooltip,
  Tab,
  Tabs,
} from "@mui/material";
import { Close, Delete, Edit, PictureAsPdf } from "@mui/icons-material";
import { useSelector } from "react-redux";
import API, { baseURLImage } from "../../../../API";
import CustomChip from "../../../../components/CustomChip";
import {
  EditCustomIcon,
  UploadCustomIcon,
} from "../../../../pages/users/Icons";

import { DeleteConfirmModal as ConfirmRoleModal } from "../../../../components/handleConfirmDelete";
import Swal from "sweetalert2";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
import CommentSection from "./CommentSection";
const VersionsPanel = styled(Box)(({ theme }) => ({
  width: "30%",
  minWidth: "200px",
  borderRight: "1px solid rgba(222, 226, 230, 1)",
  padding: "0px 24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const VersionItem = styled(Box)(({ theme, active, expired }) => ({
  padding: "8px 12px",
  backgroundColor: active ? "#E0F7FA" : expired ? "#FFEBEE" : "#FFFFFF",
  borderRadius: "4px",
  color: active ? "#00796B" : expired ? "#D32F2F" : "#424242",
  fontWeight: active || expired ? 500 : 400,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: active ? "#B2DFDB" : expired ? "#FFCDD2" : "#F5F5F5",
  },
}));

const PreviewContainer = styled(Box)(({ theme, darkmode }) => ({
  width: "100%",
  height: "100%",
  border: "1px solid #E7EAF3",
  borderRadius: "4px",
  backgroundColor: darkmode === "dark" ? "#333" : "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
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
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
const DetailsPanel = styled(Box)(({ theme }) => ({
  width: "30%",
  minWidth: "250px",

  borderLeft: "1px solid #E7EAF3",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 0",
}));
const ControlsOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "50px",
  right: "20px",
  display: "flex",
  gap: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  padding: "4px",
  borderRadius: "4px",
  zIndex: 10,
}));
const PreviewDocuments = ({
  open,
  onClose,
  data,
  openAddHandler,
  openEditHandler,
  userId,
  setIsTrigger,
  confirmDelete,
}) => {
  const { user } = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);
  const [formData, setFormData] = useState({
    id: "",
    approval_status: 0,
    document_name: "",
    document_file: null,
    issue_date: "",
    expiry_date: "",
    doc_uploaded_id: "",
  });
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusConfirm, setStatusConfirm] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [status_notes, setStatus_notes] = useState("");
  const [value, setValue] = useState(0);
  const [comments, setComments] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getDocumentTypesHandler = async () => {
    try {
      const resp = await API.get(
        `/api/get-prov-cred-docs?for_provider_user_id=${
          userId ? userId : user?.user?.id
        }&id=${data?.id}`
      );
      if (resp?.data?.success) {
        setDocumentData(resp.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const DownloadFileHandler = async () => {
    const url = `${baseURLImage}api/download-any/uploads/credentialing/documents/${formData.document_file}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (open) {
      getDocumentTypesHandler();
    }
  }, [open]);
  useEffect(() => {
    if (documentData) {
      const activeDoc =
        documentData.uploaded_doc.find((doc) => doc.id === documentData.id) ||
        documentData.uploaded_doc[0];
      if (activeDoc) {
        const dateObj = new Date(activeDoc.expiry);
        const dateObjI = new Date(activeDoc.issue_date);
        const expiry = activeDoc.expiry
          ? dateObj.toISOString().split("T")[0]
          : "";
        const issueDate = activeDoc.issue_date
          ? dateObjI.toISOString().split("T")[0]
          : "";
        setComments(documentData?.uploaded_doc?.[0]?.comments || []);

        setFormData({
          id: documentData?.id || "",
          approval_status: activeDoc?.approval_status || 0,
          document_name: activeDoc.name || documentData.name || "",
          document_file: activeDoc.file_path || null,
          issue_date: issueDate || "",
          expiry_date: expiry || "",
          doc_uploaded_id: documentData?.uploaded_doc?.[0]?.id,
        });
        setSelectedVersionId(activeDoc.id);
      }
    }
  }, [documentData]);

  const closeHandler = () => {
    onClose();
  };
  const statusActionHandler = async () => {
    try {
      const obj = {
        cred_doc_uploaded_id: formData?.id,
        approval_status_comment: status_notes,
        status: currentStatus,
      };
      setLoading(true);
      const resp = await API.post(
        `/api/admin/credentialing/update-status-uploaded-doc`,
        obj
      );
      if (resp?.data?.success) {
        setCurrentStatus(0);
        setIsTrigger(true);
        setStatusConfirm(false);
        setStatus_notes("");
        Swal.fire({
          title: "Document updated",
          text:
            resp?.data?.msg ||
            "The document status has been updated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while updating the status.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const pdfPreviewUrl = formData.document_file
    ? `${baseURLImage}api/preview-file/uploads/credentialing/documents/${formData.document_file}`
    : null;

  const handleVersionClick = (doc) => {
    const dateObj = new Date(doc.expiry);
    const dateObjI = new Date(doc.issue_date);
    const expiry = doc.expiry ? dateObj.toISOString().split("T")[0] : "";
    const issueDate = doc.issue_date
      ? dateObjI.toISOString().split("T")[0]
      : "";
    const isActive = documentData?.uploaded_doc?.find(
      (item) => item?.id === doc?.id
    );

    setFormData({
      id: doc?.id || "",
      approval_status: doc?.approval_status || 0,
      document_name: doc.name || documentData.name || "",
      document_file: doc.file_path || null,
      issue_date: issueDate || "",
      expiry_date: expiry || "",
      doc_uploaded_id: isActive?.id || "",
    });
    setSelectedVersionId(doc.id);
    setComments(doc?.comments || []);
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          height: "100vh",
        },
      }}
    >
      <Box
        sx={{
          height: "82px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "24px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="rounded" width={60} height={24} />
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{ fontSize: "20px", fontWeight: 600, color: "text.black" }}
              >
                {documentData?.name}
              </Typography>
              <CustomChip
                dot
                id={documentData?.id}
                width={60}
                dotColor={
                  formData?.approval_status
                    ? "rgba(0, 201, 167, 1)"
                    : formData?.approval_status == 2
                    ? "rgba(237, 76, 120, 1)"
                    : "rgba(255, 193, 7, 1)"
                }
                chipText={
                  formData?.approval_status == 1
                    ? "Approved"
                    : formData?.approval_status == 2
                    ? "Rejected"
                    : "Pending"
                }
                color="rgba(103, 119, 136, 1)"
                bgcolor={
                  formData?.approval_status
                    ? "rgba(0, 201, 167, 0.1)"
                    : formData?.approval_status == 2
                    ? "rgba(237, 76, 120, 0.1)"
                    : "rgba(255, 193, 7, 0.1)"
                }
              />
            </>
          )}
        </Box>
        <IconButton onClick={closeHandler}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", width: "100%", height: "100%", pt: 3 }}>
        {/* Versions Panel */}
        <VersionsPanel>
          {loading ? (
            <Card
              sx={{
                boxShadow: "0px 1px 20px 0px rgba(0,0,0,0.1)",
                border: "1px solid rgba(231, 234, 243, 0.7)",
                borderRadius: "12px",
                p: "12px",
              }}
            >
              <Skeleton variant="text" width={100} height={30} />
              <Skeleton variant="rounded" width="100%" height={30} />
              <Skeleton variant="rounded" width="100%" height={30} />
              <Skeleton variant="rounded" width="100%" height={30} />
            </Card>
          ) : (
            <Card
              sx={{
                boxShadow: "0px 1px 20px 0px rgba(0,0,0,0.1)",
                border: "1px solid rgba(231, 234, 243, 0.7)",
                borderRadius: "12px",
                p: "12px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#424242",
                  mb: 2,
                }}
              >
                Versions
              </Typography>
              {documentData?.uploaded_doc?.map((doc) => {
                const isExpired = new Date(doc.expiry) < new Date();
                const isActive =
                  doc.id === selectedVersionId && documentData?.is_active;

                return (
                  <VersionItem
                    key={doc.id}
                    active={isActive}
                    expired={isExpired}
                    onClick={() => handleVersionClick(doc)}
                  >
                    V
                    {documentData?.uploaded_doc.length -
                      documentData?.uploaded_doc.indexOf(doc)}
                    <CustomChip
                      dot
                      id={documentData?.id}
                      width={60}
                      dotColor={
                        isExpired || doc?.approval_status == 2
                          ? "rgba(237, 76, 120, 1)" // Red color for expired
                          : doc?.approval_status == 1
                          ? "rgba(0, 201, 167, 1)"
                          : "rgba(255, 193, 7, 1)"
                      }
                      chipText={
                        isExpired
                          ? "Expired"
                          : doc?.approval_status == 1
                          ? "Approved"
                          : doc?.approval_status == 2
                          ? "Rejected"
                          : "Pending"
                      }
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        isExpired || doc?.approval_status == 2
                          ? "rgba(237, 76, 120, 0.1)" // Light red for expired
                          : doc?.approval_status == 1
                          ? "rgba(0, 201, 167, 0.1)" // Light yellow for active
                          : "rgba(255, 193, 7, 0.1)" // Default for pending
                      }
                    />
                    {!doc?.approval_status ? (
                      <IconButton
                        onClick={() => {
                          confirmDelete(doc?.id);
                        }}
                      >
                        <Tooltip title="Delete attachment">
                          <Delete
                            sx={{
                              fontSize: "18px",
                              color: "rgba(237, 76, 120, 1)",
                            }}
                          />
                        </Tooltip>
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </VersionItem>
                );
              })}
            </Card>
          )}
        </VersionsPanel>

        {/* Document Preview Panel */}
        <Box
          sx={{
            width: "50%",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="rectangular" width="100%" height={400} />
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  color: "#424242",
                  mb: 2,
                  alignSelf: "flex-start",
                }}
              >
                Document preview
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
                      No document available
                    </Typography>
                  </Box>
                )}
                <ControlsOverlay>
                  <Tooltip title="Download file">
                    <IconButton
                      onClick={DownloadFileHandler}
                      sx={{
                        bgcolor: "primary.main",
                        borderRadius: "2px",
                        "&:hover": {
                          bgcolor: "primary.main",
                          borderRadius: "2px",
                        },
                      }}
                    >
                      <UploadCustomIcon color="#fff" />
                    </IconButton>
                  </Tooltip>
                </ControlsOverlay>
              </PreviewContainer>
            </>
          )}
        </Box>

        {/* Details Panel */}
        <DetailsPanel>
          {loading ? (
            <>
              <Skeleton variant="text" width={120} height={30} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
            </>
          ) : (
            <>
              <Tabs value={value} onChange={handleChange}>
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          textTransform: "capitalize",
                          fontSize: "14px",
                          fontWeight: 600,
                          color:
                            value !== 0 && darkMode == "dark"
                              ? "rgba(255, 255, 255, .7)"
                              : "text.primary",
                        }}
                      >
                        Document
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(0)}
                  sx={{ pb: 2.25 }}
                />
                <Tab
                  label={
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "14px",
                        fontWeight: 600,
                        color:
                          value !== 1 && darkMode == "dark"
                            ? "rgba(255, 255, 255, .7)"
                            : "text.primary",
                      }}
                    >
                      Comment
                    </Typography>
                  }
                  {...a11yProps(1)}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: 400,
                    color:
                      darkMode == "dark"
                        ? "rgba(255, 255, 255, .7)"
                        : "#132144",
                    pb: 2.25,
                  }}
                />
              </Tabs>
              {value === 0 ? (
                <>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "text.black",
                    }}
                  >
                    Document details
                    <IconButton
                      onClick={() =>
                        openEditHandler({
                          ...formData,
                          versionId: selectedVersionId,
                          id: documentData?.id,
                        })
                      }
                      sx={{
                        bgcolor: "rgba(109, 74, 150, 0.1)",
                        borderRadius: "4px",
                        ml: 1,
                      }}
                    >
                      <EditCustomIcon
                        color={
                          userId
                            ? "rgba( 55, 125, 255)"
                            : "rgba(109, 74, 150, 1)"
                        }
                      />
                    </IconButton>
                  </Typography>
                  <DetailItem>
                    <Typography
                      sx={{
                        color: "text.black",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      Document type:
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.black",
                        fontSize: "14px",
                        fontWeight: 600,
                        width: "50%",
                      }}
                    >
                      {formData.document_name || "N/A"}
                    </Typography>
                  </DetailItem>
                  {documentData?.has_issue_date && (
                    <DetailItem>
                      <Typography
                        sx={{
                          color: "text.black",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        Issue date:
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.black",
                          fontSize: "14px",
                          fontWeight: 600,
                          width: "50%",
                        }}
                      >
                        {formData.issue_date || "N/A"}
                      </Typography>
                    </DetailItem>
                  )}
                  {documentData?.has_expiry && (
                    <DetailItem>
                      <Typography
                        sx={{
                          color: "text.black",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        Expiry date:
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.black",
                          fontSize: "14px",
                          fontWeight: 600,
                          width: "50%",
                        }}
                      >
                        {formData.expiry_date || "N/A"}
                      </Typography>
                    </DetailItem>
                  )}

                  <DetailItem>
                    <Typography
                      sx={{
                        color: "text.black",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                    >
                      Approval status
                    </Typography>
                    <CustomChip
                      dot
                      id={documentData?.id}
                      width={60}
                      dotColor={
                        formData?.approval_status == 1
                          ? "rgba(0, 201, 167, 1)"
                          : formData?.approval_status === 0 ||
                            !formData?.approval_status
                          ? "rgba(255, 193, 7, 1)"
                          : "rgba(237, 76, 120, 1)" // Red color for expired
                      }
                      chipText={
                        formData?.approval_status == 1
                          ? "Approved"
                          : formData?.approval_status == 2
                          ? "Rejected"
                          : "Pending"
                      }
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        formData?.approval_status == 1
                          ? "rgba(0, 201, 167, 0.1)"
                          : formData?.approval_status === 0 ||
                            !formData?.approval_status
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(237, 76, 120, 0.1)" // Light red for expired
                      }
                    />
                  </DetailItem>
                </>
              ) : (
                ""
              )}
              {value === 1 ? (
                <CommentSection
                  id={formData?.doc_uploaded_id}
                  postedComments={comments}
                  setComments={setComments}
                  getDocumentTypesHandler={getDocumentTypesHandler}
                />
              ) : (
                ""
              )}
            </>
          )}
        </DetailsPanel>
      </Box>

      {/* Bottom Navigation */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-82px",
          left: 0,
          // top: "83px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 24px",
          backgroundColor: "#F5F7FA",
          borderTop: "1px solid #E7EAF3",
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="text" width={100} height={20} />
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Skeleton variant="rounded" width={80} height={36} />
              <Skeleton variant="rounded" width={120} height={36} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: "82px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              width: "100%",
            }}
          >
            <Typography sx={{ color: "#757575", fontSize: "12px" }}>
              Document 1 of 10
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  color: "#424242",
                  borderColor: "#E0E0E0",
                  "&:hover": { borderColor: "#B0BEC5" },
                }}
                onClick={closeHandler}
              >
                Cancel
              </Button>
              {userId ? (
                <>
                  <Button
                    onClick={() => {
                      setCurrentStatus("2");
                      setStatusConfirm(true);
                    }}
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "rgba(237, 76, 120, 1)",
                      color: "#FFFFFF",
                      "&:hover": { backgroundColor: "rgba(237, 76, 120, 1)" },
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStatus("1");
                      setStatusConfirm(true);
                    }}
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#6B46C1",
                      color: "#FFFFFF",
                      "&:hover": { backgroundColor: "#553C9A" },
                    }}
                  >
                    Approved
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    openAddHandler(documentData);
                  }}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#6B46C1",
                    color: "#FFFFFF",
                    "&:hover": { backgroundColor: "#553C9A" },
                  }}
                >
                  Upload new version
                </Button>
              )}
            </Box>
          </Box>
        )}
        <ConfirmRoleModal
          isOpen={statusConfirm}
          onClose={() => setStatusConfirm(false)}
          onConfirm={statusActionHandler}
          isLoading={loading}
          title={
            <strong>
              {currentStatus == 1
                ? "Approve"
                : currentStatus == "2"
                ? "Reject"
                : "Pending"}{" "}
              Document
            </strong>
          }
          action={
            currentStatus == 1
              ? "Approved"
              : currentStatus == 2
              ? "Reject"
              : "Pending"
          }
          bodyText={
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  pb: "1rem",
                  color: "rgba(52, 58, 64, 1)",
                }}
              >
                Add comment <span style={{ color: "red" }}>*</span>{" "}
              </Typography>
              <CommonInputField
                name="status_notes"
                placeholder="Provide a brief note or reason for rejecting the document..."
                value={status_notes}
                onChange={(e) => setStatus_notes(e.target.value)}
                error={!status_notes}
              />
            </Box>
          }
        />
      </Box>
    </Drawer>
  );
};

export default PreviewDocuments;
