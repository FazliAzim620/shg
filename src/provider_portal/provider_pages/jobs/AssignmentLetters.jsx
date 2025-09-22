import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Skeleton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJobAttachment } from "../../../thunkOperation/job_management/providerInfoStep";
import CustomOutlineBtn from "../../../components/button/CustomOutlineBtn";
import NodataFoundCard from "../../provider_components/NodataFoundCard";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import { SaveAltOutlined } from "@mui/icons-material";
import { baseURLImage } from "../../../API";

const AssignmentLetters = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchAttachments = async () => {
      await dispatch(getJobAttachment({ jobId: params.id, type: "provider" }));
      setLoading(false); // Set loading to false after the response
    };
    fetchAttachments();
  }, [dispatch, params.id]);

  const { files } = useSelector((state) => state.providerConfirmation);

  const downloadHandler = async (fileName) => {
    const url = `${baseURLImage}api/download-file/${fileName}`;
    window.open(url, "_blank");
  };

  return (
    <Card
      sx={{
        mt: 2.7,

        mb: 2,
        borderRadius: ".75rem",
        backgroundColor: "text.paper",
        boxShadow: "none",
        minHeight: "240px",
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
            </Typography>
          </Box>
        }
      />
      <CardContent sx={{ p: 2, mt: 0.5 }}>
        {loading ? (
          // Skeleton loader while loading
          <Box>
            {[...Array(2)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  border: "1px solid rgba(231, 234, 243, .7)",
                  borderRadius: "0.58rem",
                  p: "1rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={40}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Skeleton
                      variant="text"
                      width={150}
                      height={20}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="text" width={100} height={16} />
                  </Box>
                </Box>
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={36}
                  sx={{ borderRadius: "4px" }}
                />
              </Box>
            ))}
          </Box>
        ) : files.length > 0 ? (
          // Render files once loading is complete
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
                  borderBottom: "1px solid  rgba(231, 234, 243, .7)",
                  p: "1rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="img"
                    src={pdfIcon}
                    alt="PDF"
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
                    startIcon={<SaveAltOutlined />}
                    text="Download"
                    onClick={() => downloadHandler(file?.file_name)}
                    fontWeight={400}
                    width="120px"
                    color={"text.main"}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          // Show no data message if no files
          <NodataFoundCard />
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentLetters;
