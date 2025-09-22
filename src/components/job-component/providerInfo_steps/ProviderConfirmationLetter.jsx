import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import CustomBadge from "../../CustomBadge";
import boxIcon from "../../../assets/svg/illustrations/oc-browse.svg";
import CustomTypographyBold from "../../CustomTypographyBold";
import {
  Delete,
  FileUploadOutlined,
  RadioButtonCheckedOutlined,
  SaveAltOutlined,
} from "@mui/icons-material";

// import {
//   uploadConfirmationLetter,
// setUploadProgress,
// setUploadStatus,
// uploadFile,
// } from "../../../feature/clientConfirmationLetter";
import UploadProgressModal from "../UploadProgressModal";
import CustomOutlineBtn from "../../button/CustomOutlineBtn";
import {
  setUploadProgress,
  setUploadStatus,
  uploadFile,
  setJobId,
  deleteFile,
} from "../../../feature/providerConfirmationLetter";
import {
  deleteAttachment,
  getJobAttachment,
  updateAttachmentStatus,
  uploadConfirmationLetter,
} from "../../../thunkOperation/job_management/providerInfoStep";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
import { useParams } from "react-router-dom";
import { getFileIcon, isFileSizeValid } from "../../../util";
import { updateNewUserDataField } from "../../../feature/jobSlice";
import { baseURLImage } from "../../../API";

const ProviderConfirmationLetter = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const { files, uploadProgress, error, status, job_id } = useSelector(
    (state) => state.providerConfirmation
  );

  const { newUserData } = useSelector((state) => state.job);
  const [dragActive, setDragActive] = useState(false);
  const [text, setText] = useState("Drag and drop your file here");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [deleteId, setDelteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setText("Drop here");
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
      setText("Drag and drop your file here");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileType = file.type;
      const allowedFileTypes = [
        "application/pdf",
        "application/msword", // for .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // for .docx
      ];

      if (!allowedFileTypes.includes(fileType)) {
        setText("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      handleFileUpload(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  const downloadHandler = async (fileName) => {
    const url = `${baseURLImage}api/download-file/${fileName}`;
    window.open(url, "_blank");
  };
  const handleFileUpload = (file) => {
    setErrorMessage("");
    if (file && isFileSizeValid(file, 2)) {
      setUploadingFile(file);
      setIsUploadModalOpen(true);
      dispatch(setUploadStatus("uploading"));
      dispatch(setUploadProgress(0));

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 15;
        if (progress > 90) {
          clearInterval(interval);
          // startActualUpload(file);

          dispatch(setUploadProgress(100));
        } else {
          dispatch(setUploadProgress(progress));
        }
      }, 200);
    } else {
      setErrorMessage("File size exceeds the allowed limit of 2MB.");
    }
  };
  const updateItineraryCount = () => {
    dispatch(
      updateNewUserDataField({ field: "provider_attachments_count", value: 1 })
    );
  };
  const startActualUpload = async () => {
    dispatch(uploadFile());
    const resp = await dispatch(
      uploadConfirmationLetter({
        file: uploadingFile,
        job_id: job_id,
        type: "provider",
      })
    );
    if (resp?.payload?.data?.success) {
      setIsUploadModalOpen(false);
      setUploadingFile(null);
      dispatch(setUploadStatus("idle"));
      dispatch(setUploadProgress(0));
      updateItineraryCount();
    }
  };
  const deleteHandler = async () => {
    const result = await dispatch(
      deleteAttachment({ id: deleteId, type: "provider" })
    );
    if (deleteAttachment.fulfilled.match(result)) {
      dispatch(deleteFile(deleteId));
      dispatch(
        updateNewUserDataField({
          field: "provider_attachments_count",
          value: 0,
        })
      );
      setDelteId(null);
      setShowModal(false);
    }
  };
  // const updateAttachemtStatus = async (id) => {
  //   dispatch(updateAttachmentStatus({ id: id, type: "provider" }));
  // };
  // -----------------------------------------------------------------------
  const updateAttachemtStatus = (id) => {
    setUpdateId(id);
    setShowModal(true);
  };
  const updateAttachmentStatusHandler = async () => {
    const result = await dispatch(
      updateAttachmentStatus({ id: updateId, type: "provider" })
    );
    if (updateAttachmentStatus.fulfilled.match(result)) {
      setUpdateId(null);
      setShowModal(false);
    }
  };
  // -----------------------------------------------------------------------
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadingFile(null);
    dispatch(setUploadStatus("idle"));
    dispatch(setUploadProgress(0));

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const showModalHandler = (id) => {
    setDelteId(id);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setDelteId(null);
    setUpdateId(null);
  };
  useEffect(() => {
    dispatch(getJobAttachment({ jobId: params.id, type: "provider" }));
    dispatch(setJobId(params?.id));
  }, []);
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: ".75rem",
        backgroundColor: "text.paper",
        boxShadow: "none",
      }}
    >
      <CardHeader
        sx={{
          pb: 0.5,
          borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
        }}
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 1.2,
                color: "text.black",
              }}
            >
              Provider assignment letters
              <CustomBadge
                color={
                  files?.[0]?.id ? "rgba(0, 201, 167)" : "rgba(55, 125, 255)"
                }
                bgcolor={
                  files?.[0]?.id
                    ? "rgba(0, 201, 167, .1)"
                    : "rgba(55, 125, 255, .1)"
                }
                text={files?.[0]?.id ? "Completed" : "In progress"}
                width="90px"
                ml={6}
              />
            </Typography>
            {files.length > 0 &&
              permissions?.includes(
                "delete job management provider confirmation letter"
              ) && (
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    textTransform: "inherit",
                    boxShadow: "none",
                    // p: ".0 1rem",
                    mb: 1,
                  }}
                  startIcon={<FileUploadOutlined />}
                >
                  Upload letter
                  <input
                    type="file"
                    hidden
                    onChange={handleChange}
                    accept=".doc,.docx,.pdf"
                    ref={fileInputRef}
                  />
                </Button>
              )}
          </Box>
        }
      />
      {files.length > 0 && (
        <Typography variant="caption" color="error" sx={{ pl: 2 }}>
          {errorMessage}
        </Typography>
      )}
      {status === "loading" ? (
        <CardContent sx={{ p: 2, mt: 0.5 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ borderRadius: 2 }}
          />
        </CardContent>
      ) : (
        <CardContent sx={{ p: 2, mt: 0.5 }}>
          {!files.length > 0 &&
          permissions?.includes(
            "delete job management provider confirmation letter"
          ) ? (
            <Box
              sx={{
                border: "2px dashed rgba(231, 234, 243, .7)",
                borderRadius: 2,
                p: "3rem",
                textAlign: "center",
                bgcolor: dragActive
                  ? "rgba(55, 125, 255, 0.1)"
                  : darkMode === "dark"
                  ? "background.paper"
                  : "#f8fafd",
                transition: "background-color 0.3s",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <img src={boxIcon} alt="box" style={{ width: "6.5625rem" }} />

              <CustomTypographyBold fontSize={"14px"} color="text.black">
                {text}
              </CustomTypographyBold>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{
                  mt: 1,
                  textTransform: "inherit",
                  boxShadow: "none",
                  p: ".6125rem 1rem",
                }}
                startIcon={<FileUploadOutlined />}
              >
                Upload letter
                <input
                  type="file"
                  hidden
                  onChange={handleChange}
                  accept=".doc,.docx,.pdf"
                  ref={fileInputRef}
                />
              </Button>
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                DOC, DOCX, PDF (2 MB)
              </Typography>
              <Typography variant="caption" color="error" sx={{ pl: 2 }}>
                {errorMessage}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                border: "1px solid  rgba(231, 234, 243, .7)",
                borderRadius: "0.58rem",
              }}
            >
              {files.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(231, 234, 243, .7)",
                    p: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src={getFileIcon(file.file_name)} // Ensure you're passing the correct property
                      alt="PDF or DOC"
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "text.black",
                          textTransform: "capitalize",
                          fontSize: "14px",
                          lineHeight: 1.5,
                          fontWeight: 400,
                        }}
                      >
                        {file.file_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "12px",
                          lineHeight: 1.5,
                          fontWeight: 400,
                        }}
                      >
                        Uploaded &nbsp;
                        {file?.updated_at?.replace(/\.\d{6}Z$/, "")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <CustomOutlineBtn
                      onClick={() =>
                        file?.is_active !== 1 && updateAttachemtStatus(file?.id)
                      }
                      startIcon={
                        <RadioButtonCheckedOutlined
                          sx={{
                            color:
                              file?.is_active === 1
                                ? "text.link"
                                : "text.primary",
                          }}
                        />
                      }
                      text={file?.is_active === 1 ? "Active" : "In active"}
                      fontWeight={400}
                      width="120px"
                    />
                    <CustomOutlineBtn
                      onClick={() => downloadHandler(file?.file_name)}
                      startIcon={<SaveAltOutlined />}
                      text="Download"
                      fontWeight={400}
                      width="120px"
                    />
                    {permissions?.includes(
                      "delete job management provider confirmation letter"
                    ) ? (
                      <CustomOutlineBtn
                        onClick={() => showModalHandler(file?.id)}
                        startIcon={<Delete />}
                        text="Delete"
                        fontWeight={400}
                        mr={"0px"}
                        hover={"red"}
                      />
                    ) : (
                      ""
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      )}
      <UploadProgressModal
        icon={getFileIcon(uploadingFile?.name)}
        open={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        fileName={uploadingFile?.name}
        progress={uploadProgress}
        startActualUpload={startActualUpload}
        loading={status === "loading"}
        providerError={error}
      />

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={updateId ? updateAttachmentStatusHandler : deleteHandler}
        isLoading={status === "loading"}
        itemName={"File"}
        title={updateId ? "Update Status" : "Delete"}
        action={updateId ? "Update" : "Delete"}
        bodyText={
          updateId ? (
            <Typography variant="body2">
              Are you sure you want to update status of this File?
            </Typography>
          ) : (
            <Typography variant="body2">
              Are you sure you want to delete this File?
              <br /> This action cannot be undone.
            </Typography>
          )
        }
      />
    </Card>
  );
};

export default ProviderConfirmationLetter;
