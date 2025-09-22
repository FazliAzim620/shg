import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTypographyBold from "../CustomTypographyBold";
// import pdfIcon from "../../assets/svg/brands/pdf-icon.svg";
import { FileUploadOutlined } from "@mui/icons-material";
import CustomOutlineBtn from "../button/CustomOutlineBtn";
import { useSelector } from "react-redux";
import ErrorAlert from "../ErrorAlert";
import { uploadFile } from "../../feature/clientConfirmationLetter";
import { useDispatch } from "react-redux";
const UploadProgressModal = ({
  icon,
  open,
  onClose,
  fileName,
  progress,
  startActualUpload,
  loading,
  providerError,
}) => {
  const { files, uploadProgress, error, status, job_id } = useSelector(
    (state) => state.clientConfirmation
  );
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(
    providerError?.message ? providerError?.message : error?.message
  );
  useEffect(() => {
    setShowAlert(providerError?.message || error?.message);
  }, [error?.message, providerError?.message, uploadProgress]);
  const uploadHandler = () => {
    startActualUpload();
    dispatch(uploadFile());
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 545,
          bgcolor: "background.paper",
          borderRadius: ".75rem",
          boxShadow: 24,
          height: "330px",
          p: 4,
        }}
      >
        {(providerError?.message || error?.message) && showAlert && (
          <ErrorAlert
            successMessage={null}
            error={
              providerError?.message ? providerError?.message : error?.message
            }
            onClose={() => {
              setShowAlert(false);
            }}
          />
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomTypographyBold color="text.black">
            Upload letter
          </CustomTypographyBold>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
              p: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: "1.5rem", mt: "2.5rem" }} />
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            component="img"
            src={icon}
            alt="PDF"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Tooltip
              arrow
              placement="top"
              title={
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#fff",
                    textTransform: "capitalize",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                >
                  {fileName}
                </Typography>
              }
            >
              <Typography
                textAlign={"left"}
                variant="button"
                sx={{
                  textTransform: "capitalize",
                  "&:hover": {
                    color: "text.link",
                    fontWeight: 600,
                    cursor: "pointer",
                  },
                  color: "text.black",
                  fontWeight: "600",
                }}
              >
                {fileName?.length < 40
                  ? fileName
                  : `${fileName?.slice(0, 40)}...`}
              </Typography>
            </Tooltip>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "12px", lineHeight: 1.5, fontWeight: 400 }}
            >
              {progress < 100 ? "Uploading..." : "Uploaded"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            height: 8,
            width: "100%",
            backgroundColor: "#e0e0e0",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "background.btn_blue",
              borderRadius: 1,
              transition: "width 0.3s ease-in-out",
            }}
          />
        </Box>

        <Divider sx={{ mb: "1.2rem", mt: "2rem" }} />
        <Box display="flex" justifyContent="flex-end">
          <CustomOutlineBtn
            text="Discard"
            onClick={onClose}
            hover={"text.btn_blue"}
          />

          <Button
            disabled={progress < 100 || status == "loading" || loading}
            onClick={uploadHandler}
            variant="contained"
            component="label"
            sx={{
              mt: 1.1,
              textTransform: "inherit",
              boxShadow: "none",
              p: ".5125rem 1.1rem",
              width: "91.67px",
              height: "41.92px",
            }}
            startIcon={<FileUploadOutlined />}
          >
            {status == "loading" || loading ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadProgressModal;
